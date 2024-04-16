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
  AdParameter,
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
import { log } from 'matchstick-as'

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
    }
    if (token == null) {
      token = new Token(tokenEntityId)
      token.nftContract = nftContractAddress
      token.tokenId = tokenId
      token.setInAllowList = false
      token.save()
    }

    let adParameter = AdParameter.load(event.params.adParameter)
    if (adParameter == null) {
      adParameter = AdParameter.loadInBlock(event.params.adParameter)
    }
    if (adParameter == null) {
      adParameter = new AdParameter(event.params.adParameter)
      adParameter.save()
    }

    adProposal.offer = offerId.toString()
    adProposal.token = tokenEntityId
    adProposal.adParameter = event.params.adParameter
    adProposal.status = 'CURRENT_PENDING'
    adProposal.data = event.params.data
    adProposal.creationTimestamp = event.block.timestamp
    adProposal.lastUpdateTimestamp = event.block.timestamp

    adProposal.save()

    /**************************************************************************
     * CurrentProposal entity
     ************************************************************************** */

    let currentProposalId = offerId
      .toString()
      .concat('-')
      .concat(tokenId.toString())
      .concat('-')
      .concat(adProposal.adParameter)

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
      if (oldProposal == null) {
        oldProposal = AdProposal.loadInBlock(currentPendingId)
      }
      if (oldProposal != null) {
        oldProposal.status = 'PREV_PENDING'
        oldProposal.lastUpdateTimestamp = event.block.timestamp
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
  /**************************************************************************
   * AdProposal entity
   ************************************************************************** */

  let proposalId = event.params.proposalId
  let offerId = event.params.offerId
  let tokenId = event.params.tokenId

  let adProposal = AdProposal.load(proposalId.toString())

  if (adProposal == null) {
    adProposal = AdProposal.loadInBlock(proposalId.toString())
  }

  if (adProposal != null) {
    let validated = event.params.validated

    adProposal.lastUpdateTimestamp = event.block.timestamp
    if (validated) {
      adProposal.status = 'CURRENT_ACCEPTED'
    } else {
      adProposal.status = 'CURRENT_REJECTED'
      adProposal.rejectReason = event.params.reason
    }

    adProposal.save()

    /**************************************************************************
     * CurrentProposal entity
     ************************************************************************** */

    let currentProposalId = offerId
      .toString()
      .concat('-')
      .concat(tokenId.toString())
      .concat('-')
      .concat(adProposal.adParameter)

    let currentProposal = CurrentProposal.load(currentProposalId)

    if (currentProposal == null) {
      currentProposal = CurrentProposal.loadInBlock(currentProposalId)
    }

    if (currentProposal != null) {
      currentProposal.pendingProposal = null // currentProposal.pendingProposal was = proposalId.toString()

      if (validated) {
        if (currentProposal.acceptedProposal != null) {
          let currentAcceptedId = currentProposal.acceptedProposal as string
          let oldProposal = AdProposal.load(currentAcceptedId)
          if (oldProposal == null) {
            oldProposal = AdProposal.loadInBlock(currentAcceptedId)
          }
          if (oldProposal != null) {
            oldProposal.status = 'PREV_ACCEPTED'
            oldProposal.lastUpdateTimestamp = event.block.timestamp
            oldProposal.save()
          }
        }
        currentProposal.acceptedProposal = proposalId.toString()
      } else {
        if (currentProposal.rejectedProposal != null) {
          let currentRejectedId = currentProposal.rejectedProposal as string
          let oldProposal = AdProposal.load(currentRejectedId)
          if (oldProposal == null) {
            oldProposal = AdProposal.loadInBlock(currentRejectedId)
          }
          if (oldProposal != null) {
            oldProposal.status = 'PREV_REJECTED'
            oldProposal.lastUpdateTimestamp = event.block.timestamp
            oldProposal.save()
          }
        }
        currentProposal.rejectedProposal = proposalId.toString()
      }

      currentProposal.save()
    }
  }

  /**************************************************************************
   * UpdateAdValidation entity
   ************************************************************************** */

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
  }
  if (offer == null) {
    offer = new AdOffer(offerId.toString())

    let nftContractAddress = event.params.nftContract

    let nftContract = NftContract.load(nftContractAddress)

    if (nftContract == null) {
      nftContract = new NftContract(nftContractAddress)
      nftContract.allowList = false
      nftContract.save()
    }
    offer.nftContract = nftContractAddress
    offer.initialCreator = event.transaction.from // @todo update with _msgSender() in params
    offer.creationTimestamp = event.block.timestamp
  }

  offer.disable = event.params.disable
  offer.name = event.params.name.length > 0 ? event.params.name : offer.name

  offer.metadataURL =
    event.params.offerMetadata.length > 0
      ? event.params.offerMetadata
      : offer.metadataURL

  offer.adParameters = []
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

  let adParameter = event.params.adParameter

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

    let adParameter = AdParameter.load(event.params.adParameter.toHexString())
    if (adParameter == null) {
      adParameter = AdParameter.loadInBlock(
        event.params.adParameter.toHexString()
      )
      if (adParameter == null) {
        adParameter = new AdParameter(event.params.adParameter.toHexString())
        adParameter.save()
      }
    }

    if (enable && adParameters.includes(adParameter.id) == false) {
      adParameters.push(adParameter.id)
    } else if (enable == false && adParameters.includes(adParameter.id)) {
      let newAdParameters: string[] = []
      for (let i = 0; i < adParameters.length; i++) {
        if (adParameters[i] != adParameter.id) {
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
  entity.adParameter = event.params.adParameter.toHexString()
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
   * UpdateOfferValidator entity
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
