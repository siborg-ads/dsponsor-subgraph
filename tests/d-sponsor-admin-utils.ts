import { newMockEvent } from 'matchstick-as'
import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts'
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
} from '../generated/DSponsorAdmin/DSponsorAdmin'

export function createCallWithProtocolFeeEvent(
  target: Address,
  currency: Address,
  fee: BigInt,
  enabler: Address,
  spender: Address,
  additionalInformation: string
): CallWithProtocolFee {
  let callWithProtocolFeeEvent = changetype<CallWithProtocolFee>(newMockEvent())

  callWithProtocolFeeEvent.parameters = new Array()

  callWithProtocolFeeEvent.parameters.push(
    new ethereum.EventParam('target', ethereum.Value.fromAddress(target))
  )
  callWithProtocolFeeEvent.parameters.push(
    new ethereum.EventParam('currency', ethereum.Value.fromAddress(currency))
  )
  callWithProtocolFeeEvent.parameters.push(
    new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(fee))
  )
  callWithProtocolFeeEvent.parameters.push(
    new ethereum.EventParam('enabler', ethereum.Value.fromAddress(enabler))
  )
  callWithProtocolFeeEvent.parameters.push(
    new ethereum.EventParam('spender', ethereum.Value.fromAddress(spender))
  )
  callWithProtocolFeeEvent.parameters.push(
    new ethereum.EventParam(
      'additionalInformation',
      ethereum.Value.fromString(additionalInformation)
    )
  )

  return callWithProtocolFeeEvent
}

export function createFeeUpdateEvent(
  feeRecipient: Address,
  feeBps: BigInt
): FeeUpdate {
  let feeUpdateEvent = changetype<FeeUpdate>(newMockEvent())

  feeUpdateEvent.parameters = new Array()

  feeUpdateEvent.parameters.push(
    new ethereum.EventParam(
      'feeRecipient',
      ethereum.Value.fromAddress(feeRecipient)
    )
  )
  feeUpdateEvent.parameters.push(
    new ethereum.EventParam('feeBps', ethereum.Value.fromUnsignedBigInt(feeBps))
  )

  return feeUpdateEvent
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

export function createUpdateAdProposalEvent(
  offerId: BigInt,
  tokenId: BigInt,
  proposalId: BigInt,
  adParameter: string,
  data: string
): UpdateAdProposal {
  let updateAdProposalEvent = changetype<UpdateAdProposal>(newMockEvent())

  updateAdProposalEvent.parameters = new Array()

  updateAdProposalEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  updateAdProposalEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  updateAdProposalEvent.parameters.push(
    new ethereum.EventParam(
      'proposalId',
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  updateAdProposalEvent.parameters.push(
    new ethereum.EventParam(
      'adParameter',
      ethereum.Value.fromString(adParameter)
    )
  )
  updateAdProposalEvent.parameters.push(
    new ethereum.EventParam('data', ethereum.Value.fromString(data))
  )

  return updateAdProposalEvent
}

export function createUpdateAdValidationEvent(
  offerId: BigInt,
  tokenId: BigInt,
  proposalId: BigInt,
  adParameter: string,
  validated: boolean,
  reason: string
): UpdateAdValidation {
  let updateAdValidationEvent = changetype<UpdateAdValidation>(newMockEvent())

  updateAdValidationEvent.parameters = new Array()

  updateAdValidationEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  updateAdValidationEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  updateAdValidationEvent.parameters.push(
    new ethereum.EventParam(
      'proposalId',
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  updateAdValidationEvent.parameters.push(
    new ethereum.EventParam(
      'adParameter',
      ethereum.Value.fromString(adParameter)
    )
  )
  updateAdValidationEvent.parameters.push(
    new ethereum.EventParam('validated', ethereum.Value.fromBoolean(validated))
  )
  updateAdValidationEvent.parameters.push(
    new ethereum.EventParam('reason', ethereum.Value.fromString(reason))
  )

  return updateAdValidationEvent
}

export function createUpdateOfferEvent(
  offerId: BigInt,
  disable: boolean,
  name: string,
  offerMetadata: string,
  nftContract: Address
): UpdateOffer {
  let updateOfferEvent = changetype<UpdateOffer>(newMockEvent())

  updateOfferEvent.parameters = new Array()

  updateOfferEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  updateOfferEvent.parameters.push(
    new ethereum.EventParam('disable', ethereum.Value.fromBoolean(disable))
  )
  updateOfferEvent.parameters.push(
    new ethereum.EventParam('name', ethereum.Value.fromString(name))
  )
  updateOfferEvent.parameters.push(
    new ethereum.EventParam(
      'offerMetadata',
      ethereum.Value.fromString(offerMetadata)
    )
  )
  updateOfferEvent.parameters.push(
    new ethereum.EventParam(
      'nftContract',
      ethereum.Value.fromAddress(nftContract)
    )
  )

  return updateOfferEvent
}

export function createUpdateOfferAdParameterEvent(
  offerId: BigInt,
  adParameter: string,
  enable: boolean
): UpdateOfferAdParameter {
  let updateOfferAdParameterEvent = changetype<UpdateOfferAdParameter>(
    newMockEvent()
  )

  updateOfferAdParameterEvent.parameters = new Array()

  updateOfferAdParameterEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  updateOfferAdParameterEvent.parameters.push(
    new ethereum.EventParam(
      'adParameter',
      ethereum.Value.fromString(adParameter)
    )
  )
  updateOfferAdParameterEvent.parameters.push(
    new ethereum.EventParam('enable', ethereum.Value.fromBoolean(enable))
  )

  return updateOfferAdParameterEvent
}

export function createUpdateOfferAdminEvent(
  offerId: BigInt,
  admin: Address,
  enable: boolean
): UpdateOfferAdmin {
  let updateOfferAdminEvent = changetype<UpdateOfferAdmin>(newMockEvent())

  updateOfferAdminEvent.parameters = new Array()

  updateOfferAdminEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  updateOfferAdminEvent.parameters.push(
    new ethereum.EventParam('admin', ethereum.Value.fromAddress(admin))
  )
  updateOfferAdminEvent.parameters.push(
    new ethereum.EventParam('enable', ethereum.Value.fromBoolean(enable))
  )

  return updateOfferAdminEvent
}

export function createUpdateOfferValidatorEvent(
  offerId: BigInt,
  validator: Address,
  enable: boolean
): UpdateOfferValidator {
  let updateOfferValidatorEvent = changetype<UpdateOfferValidator>(
    newMockEvent()
  )

  updateOfferValidatorEvent.parameters = new Array()

  updateOfferValidatorEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  updateOfferValidatorEvent.parameters.push(
    new ethereum.EventParam('validator', ethereum.Value.fromAddress(validator))
  )
  updateOfferValidatorEvent.parameters.push(
    new ethereum.EventParam('enable', ethereum.Value.fromBoolean(enable))
  )

  return updateOfferValidatorEvent
}
