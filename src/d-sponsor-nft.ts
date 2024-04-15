import {
  // Approval as ApprovalEvent,
  // ApprovalForAll as ApprovalForAllEvent,
  ContractURIUpdated as ContractURIUpdatedEvent,
  // Initialized as InitializedEvent,
  Mint as MintEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TokensAllowlist as TokensAllowlistEvent,
  TokensAllowlistUpdated as TokensAllowlistUpdatedEvent,
  // Transfer as TransferEvent,
  UpdateDefaultMintPrice as UpdateDefaultMintPriceEvent,
  UpdateMintPrice as UpdateMintPriceEvent,
  UpdateUser as UpdateUserEvent
} from '../generated/DSponsorNFT/DSponsorNFT'
import {
  // Approval,
  // ApprovalForAll,
  ContractURIUpdated,
  // Initialized,
  Mint,
  OwnershipTransferred,
  TokensAllowlist,
  TokensAllowlistUpdated,
  // Transfer,
  UpdateDefaultMintPrice,
  UpdateMintPrice,
  UpdateUser
} from '../generated/schema'

/*
export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
*/

export function handleContractURIUpdated(event: ContractURIUpdatedEvent): void {
  let entity = new ContractURIUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

/*
export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
*/

export function handleMint(event: MintEvent): void {
  let entity = new Mint(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.from = event.params.from
  entity.to = event.params.to
  entity.currency = event.params.currency
  entity.amount = event.params.amount
  entity.tokenData = event.params.tokenData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensAllowlist(event: TokensAllowlistEvent): void {
  let entity = new TokensAllowlist(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.allowed = event.params.allowed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensAllowlistUpdated(
  event: TokensAllowlistUpdatedEvent
): void {
  let entity = new TokensAllowlistUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.allowed = event.params.allowed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

/*
export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
*/

export function handleUpdateDefaultMintPrice(
  event: UpdateDefaultMintPriceEvent
): void {
  let entity = new UpdateDefaultMintPrice(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.currency = event.params.currency
  entity.enabled = event.params.enabled
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateMintPrice(event: UpdateMintPriceEvent): void {
  let entity = new UpdateMintPrice(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.currency = event.params.currency
  entity.enabled = event.params.enabled
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateUser(event: UpdateUserEvent): void {
  let entity = new UpdateUser(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.user = event.params.user
  entity.expires = event.params.expires

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
