import { newMockEvent } from 'matchstick-as'
import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts'
import {
  // Approval,
  // ApprovalForAll,
  ContractURIUpdated,
  // Initialized,
  Mint,
  OwnershipTransferred,
  RoyaltySet,
  TokensAllowlist,
  TokensAllowlistUpdated,
  // Transfer,
  UpdateDefaultMintPrice,
  UpdateMintPrice,
  UpdateUser
} from '../generated/DSponsorNFT/DSponsorNFT'

/*
export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}
*/

export function createContractURIUpdatedEvent(
  contractURI: string
): ContractURIUpdated {
  let contractUriUpdatedEvent = changetype<ContractURIUpdated>(newMockEvent())

  contractUriUpdatedEvent.parameters = new Array()

  contractUriUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'contractURI',
      ethereum.Value.fromString(contractURI)
    )
  )

  return contractUriUpdatedEvent
}

/*
export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}
*/

export function createMintEvent(
  tokenId: BigInt,
  from: Address,
  to: Address,
  currency: Address,
  amount: BigInt,
  tokenData: string
): Mint {
  let mintEvent = changetype<Mint>(newMockEvent())

  mintEvent.parameters = new Array()

  mintEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  mintEvent.parameters.push(
    new ethereum.EventParam('from', ethereum.Value.fromAddress(from))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam('to', ethereum.Value.fromAddress(to))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam('currency', ethereum.Value.fromAddress(currency))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam('tokenData', ethereum.Value.fromString(tokenData))
  )

  return mintEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      'previousOwner',
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam('newOwner', ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRoyaltiesSetEvent(
  receiver: Address,
  bps: BigInt
): RoyaltySet {
  let royaltiesSetEvent = changetype<RoyaltySet>(newMockEvent())

  royaltiesSetEvent.parameters = new Array()

  royaltiesSetEvent.parameters.push(
    new ethereum.EventParam('receiver', ethereum.Value.fromAddress(receiver))
  )
  royaltiesSetEvent.parameters.push(
    new ethereum.EventParam('bps', ethereum.Value.fromUnsignedBigInt(bps))
  )

  return royaltiesSetEvent
}

export function createTokensAllowlistEvent(allowed: boolean): TokensAllowlist {
  let tokensAllowlistEvent = changetype<TokensAllowlist>(newMockEvent())

  tokensAllowlistEvent.parameters = new Array()

  tokensAllowlistEvent.parameters.push(
    new ethereum.EventParam('allowed', ethereum.Value.fromBoolean(allowed))
  )

  return tokensAllowlistEvent
}

export function createTokensAllowlistUpdatedEvent(
  tokenId: BigInt,
  allowed: boolean
): TokensAllowlistUpdated {
  let tokensAllowlistUpdatedEvent = changetype<TokensAllowlistUpdated>(
    newMockEvent()
  )

  tokensAllowlistUpdatedEvent.parameters = new Array()

  tokensAllowlistUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokensAllowlistUpdatedEvent.parameters.push(
    new ethereum.EventParam('allowed', ethereum.Value.fromBoolean(allowed))
  )

  return tokensAllowlistUpdatedEvent
}

/*
export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
*/

export function createUpdateDefaultMintPriceEvent(
  currency: Address,
  enabled: boolean,
  amount: BigInt
): UpdateDefaultMintPrice {
  let updateDefaultMintPriceEvent = changetype<UpdateDefaultMintPrice>(
    newMockEvent()
  )

  updateDefaultMintPriceEvent.parameters = new Array()

  updateDefaultMintPriceEvent.parameters.push(
    new ethereum.EventParam('currency', ethereum.Value.fromAddress(currency))
  )
  updateDefaultMintPriceEvent.parameters.push(
    new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(enabled))
  )
  updateDefaultMintPriceEvent.parameters.push(
    new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount))
  )

  return updateDefaultMintPriceEvent
}

export function createUpdateMintPriceEvent(
  tokenId: BigInt,
  currency: Address,
  enabled: boolean,
  amount: BigInt
): UpdateMintPrice {
  let updateMintPriceEvent = changetype<UpdateMintPrice>(newMockEvent())

  updateMintPriceEvent.parameters = new Array()

  updateMintPriceEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  updateMintPriceEvent.parameters.push(
    new ethereum.EventParam('currency', ethereum.Value.fromAddress(currency))
  )
  updateMintPriceEvent.parameters.push(
    new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(enabled))
  )
  updateMintPriceEvent.parameters.push(
    new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount))
  )

  return updateMintPriceEvent
}

export function createUpdateUserEvent(
  tokenId: BigInt,
  user: Address,
  expires: BigInt
): UpdateUser {
  let updateUserEvent = changetype<UpdateUser>(newMockEvent())

  updateUserEvent.parameters = new Array()

  updateUserEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  updateUserEvent.parameters.push(
    new ethereum.EventParam('user', ethereum.Value.fromAddress(user))
  )
  updateUserEvent.parameters.push(
    new ethereum.EventParam(
      'expires',
      ethereum.Value.fromUnsignedBigInt(expires)
    )
  )

  return updateUserEvent
}
