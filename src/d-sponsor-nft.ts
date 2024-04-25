import { log } from 'matchstick-as'
import {
  // Approval as ApprovalEvent,
  // ApprovalForAll as ApprovalForAllEvent,
  ContractURIUpdated as ContractURIUpdatedEvent,
  DSponsorNFT,
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
  NftContract,
  NftPrice,
  OwnershipTransferred,
  RevenueTransaction,
  Token,
  TokenPrice,
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
  /**************************************************************************
   * NftContract entity
   ************************************************************************** */

  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract != null) {
    nftContract.contractURI = event.params.contractURI
    nftContract.save()
  }

  /**************************************************************************
   * ContractURIUpdated entity
   ************************************************************************** */

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
  /**************************************************************************
   * Mint entity
   ************************************************************************** */

  let entity = new Mint(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddress = event.address
  entity.tokenId = event.params.tokenId
  entity.from = event.params.from
  entity.to = event.params.to
  entity.currency = event.params.currency
  entity.amount = event.params.amount
  entity.tokenData = event.params.tokenData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // entity.save() --> need to add token

  /**************************************************************************
   * Token entity
   ************************************************************************** */
  let tokenId = event.params.tokenId
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
    nftContract.allowList = false
    nftContract.save()
  }

  let tokenEntityId = nftContractAddress
    .toHexString()
    .concat('-')
    .concat(tokenId.toString())
  let token = Token.load(tokenEntityId)
  if (token == null) {
    token = Token.loadInBlock(tokenEntityId)
    if (token == null) {
      token = new Token(tokenEntityId)
      token.nftContract = nftContractAddress
      token.tokenId = tokenId
      token.setInAllowList = false
    }
  }

  token.mint = entity.id
  token.save()

  ////////

  let transactionHash = event.transaction.hash
  let revenueTransaction = RevenueTransaction.load(transactionHash)
  if (revenueTransaction == null) {
    revenueTransaction = RevenueTransaction.loadInBlock(transactionHash)
  }
  if (revenueTransaction == null) {
    revenueTransaction = new RevenueTransaction(transactionHash)
    revenueTransaction.blockTimestamp = event.block.timestamp
    revenueTransaction.save()
  }
  entity.revenueTransaction = revenueTransaction.id

  entity.token = token.id

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  /**************************************************************************
   * OwnershipTransferred entity
   ************************************************************************** */

  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  /**************************************************************************
   * NftContract entity
   ************************************************************************** */

  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract != null) {
    nftContract.owner = entity.id
    nftContract.save()
  }
}

export function handleTokensAllowlist(event: TokensAllowlistEvent): void {
  /**************************************************************************
   * NftContract entity
   ************************************************************************** */

  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract != null) {
    nftContract.allowList = event.params.allowed
    nftContract.save()
  }

  /**************************************************************************
   * TokensAllowlist entity
   ************************************************************************** */

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
  /**************************************************************************
   * Token entity
   ************************************************************************** */
  let tokenId = event.params.tokenId
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
    nftContract.allowList = false
    nftContract.save()
  }

  let tokenEntityId = nftContractAddress
    .toHexString()
    .concat('-')
    .concat(tokenId.toString())
  let allowed = event.params.allowed

  let token = Token.load(tokenEntityId)
  if (token == null) {
    token = Token.loadInBlock(tokenEntityId)
    if (token == null) {
      token = new Token(tokenEntityId)
      token.nftContract = nftContractAddress
      token.tokenId = tokenId
    }
  }

  token.setInAllowList = allowed
  token.save()

  /**************************************************************************
   * TokensAllowlistUpdated entity
   ************************************************************************** */

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
  /**************************************************************************
   * Price entity
   ************************************************************************** */

  let currency = event.params.currency
  let enabled = event.params.enabled
  let amount = event.params.amount
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  // if (nftContract != null) {
  let priceId = nftContractAddress
    .toHexString()
    .concat('-')
    .concat(currency.toHexString())
    .concat('-all')

  let price = NftPrice.load(priceId)

  if (price == null) {
    price = NftPrice.loadInBlock(priceId)
  }

  if (price == null) {
    price = new NftPrice(priceId)
    price.nftContract = nftContractAddress
    price.currency = currency
  }

  price.amount = amount
  price.enabled = enabled
  price.save()
  // }

  /**************************************************************************
   * UpdateDefaultMintPrice entities
   ************************************************************************** */

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
  /**************************************************************************
   * Price entity
   ************************************************************************** */

  let currency = event.params.currency
  let enabled = event.params.enabled
  let amount = event.params.amount
  let nftContractAddress = event.address
  let tokenId = event.params.tokenId

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
    nftContract.allowList = false
    nftContract.save()
  }

  let token = Token.load(
    nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
  )

  if (token == null) {
    token = Token.loadInBlock(
      nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
    )
  }

  if (token == null) {
    token = new Token(
      nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
    )
    token.nftContract = nftContractAddress
    token.tokenId = tokenId
    token.setInAllowList = false
    token.save()
  }

  let priceId = nftContractAddress
    .toHexString()
    .concat('-')
    .concat(currency.toHexString())
    .concat('-')
    .concat(tokenId.toString())

  let price = TokenPrice.load(priceId)

  if (price == null) {
    price = TokenPrice.loadInBlock(priceId)
  }

  if (price == null) {
    price = new TokenPrice(priceId)
    price.token = token.id // nftAddress-tokenId
    price.currency = currency
  }

  price.amount = amount
  price.enabled = enabled
  price.save()

  /**************************************************************************
   * UpdateDefaultMintPrice entities
   ************************************************************************** */

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
  /**************************************************************************
   * UpdateDefaultMintPrice entities
   ************************************************************************** */

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

  /**************************************************************************
   * Token entity
   ************************************************************************** */

  let nftContractAddress = event.address
  let tokenId = event.params.tokenId

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
    nftContract.allowList = false
    nftContract.save()
  }

  let token = Token.load(
    nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
  )

  if (token == null) {
    token = Token.loadInBlock(
      nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
    )
  }

  if (token == null) {
    token = new Token(
      nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
    )
    token.nftContract = nftContractAddress
    token.tokenId = tokenId
    token.setInAllowList = false
  }

  token.user = entity.id

  token.save()
}
