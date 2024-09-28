import {
  BigInt,
  Bytes,
  dataSource,
  json,
  JSONValue,
  JSONValueKind
} from '@graphprotocol/graph-ts'
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
  AdOfferParameterLink,
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
import { AdOfferMetadata as AdOfferMetadataTemplate } from '../generated/templates'

import {
  JSONStringifyValue,
  handleCallWithProtocolFee,
  handleFeeUpdate,
  handleNewNftContract,
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
    if (nftContract != null) {
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
        const split = event.params.adParameter.split('-')
        adParameter = new AdParameter(event.params.adParameter)
        adParameter.base = split[0]
        adParameter.variants = split.slice(1)
        adParameter.save()
      }

      adProposal.adOffer = offerId.toString()
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
          currentProposal.adOffer = offerId.toString()
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
  let isNewOffer = false

  let offer = AdOffer.load(offerId.toString())
  if (offer == null) {
    offer = AdOffer.loadInBlock(offerId.toString())
  }
  if (offer == null) {
    offer = new AdOffer(offerId.toString())
    isNewOffer = true
  }

  let nftContractAddress = event.params.nftContract
  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract == null) {
    nftContract = handleNewNftContract(nftContractAddress)
  }
  offer.nftContract = nftContract.id

  offer.initialCreator = event.params.msgSender
  offer.creationTimestamp = event.block.timestamp

  offer.origin = event.address
  offer.disable = event.params.disable
  offer.name =
    isNewOffer || event.params.name.length > 0 ? event.params.name : offer.name

  let metadataURL = event.params.offerMetadata
  let isNewMetadata =
    isNewOffer || (metadataURL.length > 0 && metadataURL != offer.metadataURL)
  offer.metadataURL = isNewMetadata ? metadataURL : offer.metadataURL

  if (isNewMetadata) {
    let ipfsHash = ''

    let ipfsParsing = metadataURL.split('ipfs://')
    if (ipfsParsing.length == 2) {
      ipfsHash = ipfsParsing[1]
    }

    let httpParsing = metadataURL.split('/ipfs/')
    if (httpParsing.length == 2) {
      ipfsHash = httpParsing[1]
    }

    if (ipfsHash.length > 0) {
      offer.metadata = ipfsHash
      AdOfferMetadataTemplate.create(ipfsHash)
    }
  }

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
    let adParameter = AdParameter.load(event.params.adParameter)

    if (adParameter == null) {
      adParameter = AdParameter.loadInBlock(event.params.adParameter)
      if (adParameter == null) {
        const split = event.params.adParameter.split('-')
        adParameter = new AdParameter(event.params.adParameter)
        adParameter.base = split[0]
        adParameter.variants = split.slice(1)
        adParameter.save()
      }
    }

    let adOfferParameterLinkId = offer.id.concat('-').concat(adParameter.id)

    let adOfferParameterLink = AdOfferParameterLink.load(adOfferParameterLinkId)

    if (adOfferParameterLink == null) {
      adOfferParameterLink = AdOfferParameterLink.loadInBlock(
        adOfferParameterLinkId
      )
    }
    if (adOfferParameterLink == null) {
      adOfferParameterLink = new AdOfferParameterLink(adOfferParameterLinkId)
      adOfferParameterLink.adOffer = offer.id
      adOfferParameterLink.adParameter = adParameter.id
    }

    adOfferParameterLink.enable = event.params.enable
    adOfferParameterLink.save()
  }

  /**************************************************************************
   * UpdateOfferAdParameter entity
   ************************************************************************** */

  let entity = new UpdateOfferAdParameter(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerId = event.params.offerId
  entity.adParameter = event.params.adParameter
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
