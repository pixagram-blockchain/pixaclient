[**@pixagram/dpixa**](../README.md)

***

[@pixagram/dpixa](../globals.md) / VirtualOperationName

# Type Alias: VirtualOperationName

> **VirtualOperationName** = `"fill_convert_request"` \| `"author_reward"` \| `"curation_reward"` \| `"comment_reward"` \| `"liquidity_reward"` \| `"interest"` \| `"fill_vesting_withdraw"` \| `"fill_order"` \| `"shutdown_witness"` \| `"fill_transfer_from_savings"` \| `"hardfork"` \| `"comment_payout_update"` \| `"return_vesting_delegation"` \| `"comment_benefactor_reward"` \| `"producer_reward"` \| `"clear_null_account_balance"` \| `"proposal_pay"` \| `"dhf_funding"` \| `"sps_fund"` \| `"hardfork_hive"` \| `"hardfork_pixa"` \| `"hardfork_hive_restore"` \| `"hardfork_pixa_restore"` \| `"delayed_voting"` \| `"consolidate_treasury_balance"` \| `"effective_comment_vote"` \| `"ineffective_delete_comment"` \| `"dhf_conversion"` \| `"sps_convert"` \| `"expired_account_notification"` \| `"changed_recovery_account"` \| `"transfer_to_vesting_completed"` \| `"pow_reward"` \| `"vesting_shares_split"` \| `"account_created"` \| `"fill_collateralized_convert_request"` \| `"system_warning"` \| `"fill_recurrent_transfer"` \| `"failed_recurrent_transfer"` \| `"limit_order_cancelled"` \| `"producer_missed"` \| `"proposal_fee"` \| `"collateralized_convert_immediate_conversion"` \| `"escrow_approved"` \| `"escrow_rejected"` \| `"proxy_cleared"` \| `"declined_voting_rights"` \| `"nft_sold"` \| `"nft_royalty"`

Defined in: [chain/operation.ts:109](https://github.com/pixagram-blockchain/pixaclient/blob/main/src/chain/operation.ts#L109)

Virtual operation name. The last regular operation is recurrent_transfer (49), so
`last_regular + 1` is 50; [utils.operationOrders](../@pixagram/namespaces/utils/variables/operationOrders.md) has every number.

Four operations have two names here: the node writes `dhf_funding`, `hardfork_hive`,
`hardfork_hive_restore` and `dhf_conversion`; `sps_fund`, `hardfork_pixa`,
`hardfork_pixa_restore` and `sps_convert` are the names earlier dpixa versions used.
