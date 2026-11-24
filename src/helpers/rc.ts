/* tslint:disable:no-string-literal */

import { Account } from '../chain/account'
import { Asset } from '../chain/asset'
import { DynamicGlobalProperties, getVests, getVotingManaRegenerationSeconds } from '../chain/misc'
import { Manabar, RCAccount, RCParams, RCPool, VoteCost } from '../chain/rc'
import { Client } from '../client'

/** Millionths of VESTS (the unit of the voting bars) in an amount such as `"1234.567890 VESTS"`. */
const vestsUnits = (value: any): bigint => {
    const text = typeof value === 'string' ? value.split(' ')[0] : Asset.from(value).amount.toFixed(6)
    const negative = text.startsWith('-')
    const [whole, fraction = ''] = text.replace('-', '').split('.')
    const units = BigInt(whole || '0') * 1000000n + BigInt((fraction + '000000').slice(0, 6))
    return negative ? -units : units
}

/** A share_type field (`to_withdraw`, `withdrawn`), which the API writes as a number or a string. */
const shareUnits = (value: any): bigint =>
    BigInt(String(value === undefined || value === null ? 0 : value).split('.')[0])

/**
 * Effective vesting shares of an account in millionths of VESTS, as the node computes them for
 * the voting bars: own, minus delegated, plus received, minus the next weekly power-down.
 */
const effectiveVestsUnits = (account: Account): bigint => {
    const rate = vestsUnits(account.vesting_withdraw_rate)
    const remaining = shareUnits(account.to_withdraw) - shareUnits(account.withdrawn)
    const nextWithdrawal = rate < remaining ? rate : remaining
    const effective = vestsUnits(account.vesting_shares) - vestsUnits(account.delegated_vesting_shares)
        + vestsUnits(account.received_vesting_shares) - (nextWithdrawal > 0n ? nextWithdrawal : 0n)
    return effective > 0n ? effective : 0n
}

export class RCAPI {
    constructor(readonly client: Client) {}

    /**
     * Convenience for calling `rc_api`.
     */
    public call(method: string, params?: any) {
        return this.client.call('rc_api', method, params)
    }

    /**
     * Returns RC data for array of usernames
     */
    public async findRCAccounts(usernames: string[]): Promise<RCAccount[]> {
        return (await this.call('find_rc_accounts', { accounts: usernames })).rc_accounts
    }

    /**
     * Returns the global resource params
     */
    public async getResourceParams(): Promise<RCParams> {
        return (await this.call('get_resource_params', {})).resource_params
    }

    /**
     * Returns the global resource pool
     */
    public async getResourcePool(): Promise<RCPool> {
        return (await this.call('get_resource_pool', {})).resource_pool
    }

    /**
     * Makes a API call and returns the RC mana-data for a specified username
     */
    public async getRCMana(username: string): Promise<Manabar> {
        const rc_account: RCAccount = (await this.findRCAccounts([username]))[0]
        return this.calculateRCMana(rc_account)
    }

    /**
     * Makes API calls and returns the voting mana-data for a specified username, refilled with
     * the refill time the chain has now.
     */
    public async getVPMana(username: string): Promise<Manabar> {
        const [account, props] = await this.accountAndProps(username)
        return this.calculateVPMana(account, props)
    }

    /**
     * Makes API calls and returns the downvote mana-data for a specified username.
     */
    public async getDownvoteMana(username: string): Promise<Manabar> {
        const [account, props] = await this.accountAndProps(username)
        return this.calculateDownvoteMana(account, props)
    }

    /**
     * Makes API calls and returns what a vote of `weight` would cost `username` now.
     */
    public async getVoteCost(username: string, weight: number): Promise<VoteCost> {
        const [account, props] = await this.accountAndProps(username)
        return this.calculateVoteCost(account, weight, props)
    }

    /**
     * Calculates the RC mana-data based on an RCAccount - findRCAccounts()
     */
    public calculateRCMana(rc_account: RCAccount): Manabar {
        return this._calculateManabar(
            Number(rc_account.max_rc),
            rc_account.rc_manabar
        )
    }

    /**
     * Calculates the voting mana-data based on an Account - getAccounts()
     * @param props The dynamic global properties (`getDynamicGlobalProperties()`), whose
     *              `voting_mana_regeneration_seconds` is the refill time of the bar: 576,000 s
     *              (15% a day) from hardfork 32. Without them, the 432,000 s (20% a day) of
     *              earlier hardforks is used.
     */
    public calculateVPMana(account: Account, props?: Partial<DynamicGlobalProperties>): Manabar {
        const max_mana: number = getVests(account) * Math.pow(10, 6)
        return this._calculateManabar(max_mana, account.voting_manabar, getVotingManaRegenerationSeconds(props))
    }

    /**
     * Calculates the downvote mana-data based on an Account - getAccounts(). The downvote bar holds
     * `downvote_pool_percent` of the voting bar and refills in the same time.
     */
    public calculateDownvoteMana(account: Account, props: Partial<DynamicGlobalProperties>): Manabar {
        const percent = Number(props.downvote_pool_percent || 0)
        const max_mana: number = (getVests(account) * Math.pow(10, 6) * percent) / 10000
        if (!account.downvote_manabar || percent <= 0) {
            return { current_mana: 0, max_mana: 0, percentage: 0 }
        }
        return this._calculateManabar(max_mana, account.downvote_manabar, getVotingManaRegenerationSeconds(props))
    }

    /**
     * What a vote of `weight` (-10000 to 10000) costs the voter, exactly as the node computes it
     * since hardfork 28: `ceil(floor(effective vests * |weight| * 86400 / 10000) /
     * (vote_power_reserve_rate * voting_mana_regeneration_seconds))`. From hardfork 32 a 100% vote
     * costs 3% of a full bar (2% before). A downvote is paid from the downvote bar first.
     */
    public calculateVoteCost(account: Account, weight: number, props: Partial<DynamicGlobalProperties>): VoteCost {
        if (!Number.isInteger(weight) || weight < -10000 || weight > 10000) {
            throw new Error(`A vote weight is an integer from -10000 to 10000, got ${weight}`)
        }
        const rate = Number(props.vote_power_reserve_rate)
        if (!Number.isInteger(rate) || rate <= 0) {
            throw new Error('calculateVoteCost needs vote_power_reserve_rate from getDynamicGlobalProperties()')
        }
        const effective = effectiveVestsUnits(account)
        const denominator = BigInt(rate) * BigInt(getVotingManaRegenerationSeconds(props))
        const used = (effective * BigInt(Math.abs(weight)) * 86400n) / 10000n
        const mana = used === 0n ? 0n : (used + denominator - 1n) / denominator
        const fullVote = (effective * 10000n * 86400n) / 10000n
        const fullVoteMana = fullVote === 0n ? 0n : (fullVote + denominator - 1n) / denominator
        // a share of the bar in hundredths of a percent, rounded down, then as a percentage
        const percent = (value: bigint) => (effective === 0n ? 0 : Number((value * 10000n) / effective) / 100)
        return {
            full_vote_percentage: percent(fullVoteMana),
            mana: Number(mana),
            percentage: percent(mana)
        }
    }

    /**
     * Internal convenience method to reduce redundant code
     */
    private _calculateManabar(
        max_mana: number,
        { current_mana, last_update_time },
        regenerationSeconds = 432000
    ): Manabar {
        const delta: number = Date.now() / 1000 - last_update_time
        current_mana = Number(current_mana) + (delta * max_mana) / regenerationSeconds
        let percentage: number = Math.round((current_mana / max_mana) * 10000)

        if (!isFinite(percentage) || percentage < 0) {
            percentage = 0
        } else if (percentage > 10000) {
            percentage = 10000
        }

        return { current_mana, max_mana, percentage }
    }

    private async accountAndProps(username: string): Promise<[Account, DynamicGlobalProperties]> {
        const [accounts, props] = await Promise.all([
            this.client.call('condenser_api', 'get_accounts', [[username]]),
            this.client.database.getDynamicGlobalProperties()
        ])
        if (!accounts[0]) {
            throw new Error(`Account ${username} not found`)
        }
        return [accounts[0], props]
    }
}
