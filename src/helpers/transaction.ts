/**
 * @file Transaction status API helpers.
 * @author Bartłomiej (@engrave) Górnicki
 */

import {Client} from '../client'

export type TransactionStatus =
    'unknown'
    | 'within_mempool'
    | 'within_reversible_block'
    | 'within_irreversible_block'
    | 'expired_reversible'
    | 'expired_irreversible'
    | 'too_old'

interface FindTransactionParams {
    transaction_id: string
    expiration?: string
}
export class TransactionStatusAPI {
    constructor(readonly client: Client) {}

    /**
     * Convenience for calling `transaction_status_api`.
     */
    public call(method: string, params?: any) {
        return this.client.call('transaction_status_api', method, params)
    }

    /**
     * Returns the status of a given transaction id, with the number of its block once it is in one.
     * Pass the transaction's `expiration` to tell an expired transaction from an unknown one.
     */
    public async findTransaction(
        transaction_id: string,
        expiration?: string
    ): Promise<{ status: TransactionStatus, block_num?: number }> {
        const params: FindTransactionParams = {
            transaction_id
        }
        if (expiration) {
            params.expiration = expiration
        }
        return this.call('find_transaction', params)
    }
}
