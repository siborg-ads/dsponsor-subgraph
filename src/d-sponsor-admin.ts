import {
  CallWithProtocolFee as CallWithProtocolFeeEvent,
  FeeUpdate as FeeUpdateEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  UpdateAdProposal as UpdateAdProposalEvent,
  UpdateAdValidation as UpdateAdValidationEvent,
  UpdateOffer as UpdateOfferEvent,
  UpdateOfferAdParameter as UpdateOfferAdParameterEvent,
  UpdateOfferAdmin as UpdateOfferAdminEvent,
  UpdateOfferValidator as UpdateOfferValidatorEvent
} from '../generated/DSponsorAdmin/DSponsorAdmin'
import {
  CallWithProtocolFee,
  FeeUpdate,
  OwnershipTransferred,
  UpdateAdProposal,
  UpdateAdValidation,
  UpdateOffer,
  UpdateOfferAdParameter,
  UpdateOfferAdmin,
  UpdateOfferValidator
} from '../generated/schema'

export function handleCallWithProtocolFee(
  event: CallWithProtocolFeeEvent
): void {
  let entity = new CallWithProtocolFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.target = event.params.target
  entity.currency = event.params.currency
  entity.fee = event.params.fee
  entity.enabler = event.params.enabler
  entity.spender = event.params.spender
  entity.additionalInformation = event.params.additionalInformation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeeUpdate(event: FeeUpdateEvent): void {
  let entity = new FeeUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.recipient = event.params.recipient
  entity.bps = event.params.bps

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

export function handleUpdateAdProposal(event: UpdateAdProposalEvent): void {
  let entity = new UpdateAdProposal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.tokenId = event.params.tokenId
  entity.proposalId = event.params.proposalId
  entity.adParameter = event.params.adParameter
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateAdValidation(event: UpdateAdValidationEvent): void {
  let entity = new UpdateAdValidation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.tokenId = event.params.tokenId
  entity.proposalId = event.params.proposalId
  entity.adParameter = event.params.adParameter
  entity.validated = event.params.validated
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateOffer(event: UpdateOfferEvent): void {
  let entity = new UpdateOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.disable = event.params.disable
  entity.name = event.params.name
  entity.rulesURI = event.params.rulesURI
  entity.nftContract = event.params.nftContract

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateOfferAdParameter(
  event: UpdateOfferAdParameterEvent
): void {
  let entity = new UpdateOfferAdParameter(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.adParameter = event.params.adParameter.toString()
  entity.enable = event.params.enable

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateOfferAdmin(event: UpdateOfferAdminEvent): void {
  let entity = new UpdateOfferAdmin(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.admin = event.params.admin
  entity.enable = event.params.enable

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateOfferValidator(
  event: UpdateOfferValidatorEvent
): void {
  let entity = new UpdateOfferValidator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.validator = event.params.validator
  entity.enable = event.params.enable

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
