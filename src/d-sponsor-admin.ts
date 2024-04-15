import { Bytes } from '@graphprotocol/graph-ts'
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
  AdOffer,
  AdProposal,
  CurrentProposal,
  NftContract,
  Token,
  UpdateAdProposal,
  UpdateAdValidation,
  UpdateOffer,
  UpdateOfferAdParameter,
  UpdateOfferAdmin,
  UpdateOfferValidator
} from '../generated/schema'

import {
  handleCallWithProtocolFee,
  handleFeeUpdate,
  handleOwnershipTransferred
} from './common'

export function handleCallWithProtocolFeeDSponsorAdmin(
  event: CallWithProtocolFeeEvent
): void {
  handleCallWithProtocolFee(event)
}

export function handleFeeUpdateDSponsorAdmin(event: FeeUpdateEvent): void {
  handleFeeUpdate(event)
}

export function handleOwnershipTransferredDSponsorAdmin(
  event: OwnershipTransferredEvent
): void {
  handleOwnershipTransferred(event)
}

export function handleUpdateAdProposal(event: UpdateAdProposalEvent): void {
  /**************************************************************************
   * AdProposal entity
   ************************************************************************** */

  let proposalId = event.params.proposalId
  let offerId = event.params.offerId
  let tokenId = event.params.tokenId

  let adProposal = new AdProposal(proposalId.toString())

  let offer = AdOffer.load(offerId.toString())
  if (offer == null) {
    offer = AdOffer.loadInBlock(offerId.toString())
  }

  if (offer != null) {
    let nftContractAddress = offer.nftContract
    let nftContract = NftContract.load(nftContractAddress)
    if (nftContract == null) {
      nftContract = NftContract.loadInBlock(nftContractAddress)
      if (nftContract == null) {
        nftContract = new NftContract(nftContractAddress)
        nftContract.allowList = false
        nftContract.save()
      }
    }

    let tokenEntityId = nftContractAddress.concatI32(tokenId.toI32())
    let token = Token.load(tokenEntityId)
    if (token == null) {
      token = Token.loadInBlock(tokenEntityId)
      if (token == null) {
        token = new Token(tokenEntityId)
        token.nftContract = nftContractAddress
        token.tokenId = tokenId
        token.setInAllowList = false
        token.save()
      }
    }

    adProposal.offer = offerId.toString()
    adProposal.token = tokenEntityId
    adProposal.adParameter = event.params.adParameter
    adProposal.status = 'CURRENT_PENDING'
    adProposal.data = event.params.data
    adProposal.save()

    /**************************************************************************
     * CurrentProposal entity
     ************************************************************************** */

    let currentProposalId = offerId
      .toString()
      .concat('-')
      .concat(tokenId.toString())
      .concat('-')
      .concat(adProposal.adParameter.toString())

    let currentProposal = CurrentProposal.load(currentProposalId)
    if (currentProposal == null) {
      currentProposal = CurrentProposal.loadInBlock(currentProposalId)
      if (currentProposal == null) {
        currentProposal = new CurrentProposal(currentProposalId)
        currentProposal.offer = offerId.toString()
        currentProposal.token = tokenEntityId
        currentProposal.adParameter = adProposal.adParameter
      }
    }

    if (currentProposal.pendingProposal != null) {
      let currentPendingId = currentProposal.pendingProposal as string
      let oldProposal = AdProposal.load(currentPendingId)
      if (oldProposal != null) {
        oldProposal.status = 'PREV_PENDING'
        oldProposal.save()
      }
    }

    currentProposal.pendingProposal = proposalId.toString()
    currentProposal.save()
  }

  /**************************************************************************
   * UpdateAdProposal entity
   ************************************************************************** */

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
  /**************************************************************************
   * AdOffer entity
   ************************************************************************** */

  let offerId = event.params.offerId

  let offer = AdOffer.load(offerId.toString())
  if (offer == null) {
    offer = AdOffer.loadInBlock(offerId.toString())
    if (offer == null) {
      offer = new AdOffer(offerId.toString())
    }
  }

  let nftContractAddress = event.params.nftContract

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
    nftContract.allowList = false
    nftContract.save()
  }

  offer.disable = event.params.disable
  offer.name =
    event.params.name.length > 0
      ? event.params.name
      : offer.name.length > 0
      ? offer.name
      : ''
  offer.metadataURL =
    event.params.offerMetadata.length > 0
      ? event.params.offerMetadata
      : offer.metadataURL.length > 0
      ? offer.metadataURL
      : ''
  offer.nftContract = nftContractAddress

  offer.save()

  /**************************************************************************
   * UpdateOffer entity
   ************************************************************************** */

  let entity = new UpdateOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.disable = event.params.disable
  entity.name = event.params.name
  entity.offerMetadata = event.params.offerMetadata
  entity.nftContract = event.params.nftContract

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateOfferAdParameter(
  event: UpdateOfferAdParameterEvent
): void {
  /**************************************************************************
   * AdOffer entity
   ************************************************************************** */

  let offerId = event.params.offerId

  let offer = AdOffer.load(offerId.toString())
  if (offer == null) {
    offer = AdOffer.loadInBlock(offerId.toString())
  }

  if (offer != null) {
    let adParameters: Array<string> = offer.adParameters
      ? (offer.adParameters as Array<string>)
      : []
    let enable = event.params.enable
    let adParameter = event.params.adParameter.toString()

    if (enable && adParameters.includes(adParameter) == false) {
      adParameters.push(adParameter)
    } else if (enable == false && adParameters.includes(adParameter)) {
      let newAdParameters: string[] = []
      for (let i = 0; i < adParameters.length; i++) {
        if (adParameters[i] != adParameter) {
          newAdParameters.push(adParameters[i])
        }
      }
      adParameters = newAdParameters
    }

    offer.adParameters = adParameters
    offer.save()
  }

  /**************************************************************************
   * UpdateOfferAdParameter entity
   ************************************************************************** */

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
  /**************************************************************************
   * AdOffer entity
   ************************************************************************** */

  let offerId = event.params.offerId

  let offer = AdOffer.load(offerId.toString())
  if (offer == null) {
    offer = AdOffer.loadInBlock(offerId.toString())
  }

  if (offer != null) {
    let admins: Array<Bytes> = offer.admins
      ? (offer.admins as Array<Bytes>)
      : []
    let enable = event.params.enable
    let admin = event.params.admin

    if (enable && admins.includes(admin) == false) {
      admins.push(admin)
    } else if (enable == false && admins.includes(admin)) {
      let newAdmins: Array<Bytes> = []
      for (let i = 0; i < admins.length; i++) {
        if (admins[i] != admin) {
          newAdmins.push(admins[i])
        }
      }
      admins = newAdmins
    }

    offer.admins = admins
    offer.save()
  }

  /**************************************************************************
   * UpdateOfferAdmin entity
   ************************************************************************** */

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
  /**************************************************************************
   * AdOffer entity
   ************************************************************************** */

  let offerId = event.params.offerId

  let offer = AdOffer.load(offerId.toString())
  if (offer == null) {
    offer = AdOffer.loadInBlock(offerId.toString())
  }

  if (offer != null) {
    let validators: Array<Bytes> = offer.validators
      ? (offer.validators as Array<Bytes>)
      : []
    let enable = event.params.enable
    let validator = event.params.validator

    if (enable && validators.includes(validator) == false) {
      validators.push(validator)
    } else if (enable == false && validators.includes(validator)) {
      let newValidators: Array<Bytes> = []
      for (let i = 0; i < validators.length; i++) {
        if (validators[i] != validator) {
          newValidators.push(validators[i])
        }
      }
      validators = newValidators
    }

    offer.validators = validators
    offer.save()
  }

  /**************************************************************************
   * UpdateOfferAdmin entity
   ************************************************************************** */

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
