import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  logStore
} from 'matchstick-as/assembly/index'
import { Address, BigInt, ByteArray, Bytes, log } from '@graphprotocol/graph-ts'
import {
  handleCallWithProtocolFeeDSponsorAdmin,
  handleOwnershipTransferredDSponsorAdmin,
  handleUpdateAdProposal,
  handleUpdateAdValidation,
  handleUpdateOffer,
  handleUpdateOfferAdParameter,
  handleUpdateOfferAdmin,
  handleUpdateOfferValidator
} from '../src/d-sponsor-admin'
import {
  createCallWithProtocolFeeEvent,
  createFeeUpdateEvent,
  createOwnershipTransferredEvent,
  createUpdateAdProposalEvent,
  createUpdateAdValidationEvent,
  createUpdateOfferAdParameterEvent,
  createUpdateOfferAdminEvent,
  createUpdateOfferEvent,
  createUpdateOfferValidatorEvent
} from './d-sponsor-admin-utils'
import { handleFeeUpdate } from '../src/common'

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    const nftContractAddress = Address.fromString(
      '0xE60D18328A96949242B35809F4cED1F4e35ac4BB'
    )
    const offerId = BigInt.fromI32(5)
    const tokenId = BigInt.fromI32(0)
    const proposalId1 = BigInt.fromI32(1)
    const proposalId3 = BigInt.fromI32(3)
    const adParameter1 = 'linkURL'
    const adData11 = 'https://www.google.com'
    const adData12 = 'https://www.google2.com'
    const proposalId2 = BigInt.fromI32(2)
    const adParameter2 = 'imageURL'
    const adData2 = 'https://www.google.com/image.png'

    handleUpdateOffer(
      createUpdateOfferEvent(
        offerId,
        true,
        'MyOffer',
        'http://myoffermetadata.com',
        nftContractAddress,
        Address.fromString('0x0000000000000000000000000000000000000005')
      )
    )

    handleUpdateOfferAdParameter(
      createUpdateOfferAdParameterEvent(
        offerId,
        Bytes.fromUTF8(adParameter1),
        true,
        adParameter1
      )
    )
    handleUpdateOfferAdParameter(
      createUpdateOfferAdParameterEvent(
        offerId,
        Bytes.fromUTF8(adParameter2),
        true,
        adParameter2
      )
    )
    handleUpdateOfferAdParameter(
      createUpdateOfferAdParameterEvent(
        offerId,
        Bytes.fromUTF8(adParameter1),
        false,
        adParameter1
      )
    )

    handleUpdateOfferAdmin(
      createUpdateOfferAdminEvent(
        offerId,
        Address.fromString('0x0000000000000000000000000000000000000005'),
        true
      )
    )

    handleUpdateOfferValidator(
      createUpdateOfferValidatorEvent(
        offerId,
        Address.fromString('0x0000000000000000000000000000000000000006'),
        true
      )
    )

    handleUpdateAdProposal(
      createUpdateAdProposalEvent(
        offerId,
        tokenId,
        proposalId1,
        adParameter1,
        adData11
      )
    )

    handleUpdateAdProposal(
      createUpdateAdProposalEvent(
        offerId,
        tokenId,
        proposalId2,
        adParameter2,
        adData2
      )
    )

    handleUpdateAdValidation(
      createUpdateAdValidationEvent(
        offerId,
        tokenId,
        proposalId1,
        adParameter1,
        true,
        'valid message'
      )
    )

    handleUpdateAdProposal(
      createUpdateAdProposalEvent(
        offerId,
        tokenId,
        proposalId3,
        adParameter1,
        adData12
      )
    )

    handleUpdateAdValidation(
      createUpdateAdValidationEvent(
        offerId,
        tokenId,
        proposalId3,
        adParameter1,
        true,
        'valid message'
      )
    )

    handleCallWithProtocolFeeDSponsorAdmin(
      createCallWithProtocolFeeEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // target
        Address.fromString('0x0000000000000000000000000000000000000001'), // currency
        BigInt.fromI32(234), // fee
        Address.fromString('0x0000000000000000000000000000000000000001'), // enabler
        Address.fromString('0x0000000000000000000000000000000000000001'), // spender
        'referral addtionnal info' // additionalInformation
      )
    )

    handleFeeUpdate(
      createFeeUpdateEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // feeRecipient
        BigInt.fromI32(690) // 6.9 % fee
      )
    )

    handleOwnershipTransferredDSponsorAdmin(
      createOwnershipTransferredEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // previousOwner
        Address.fromString('0x0000000000000000000000000000000000000002') // newOwner
      )
    )
  })

  afterAll(() => {
    clearStore()
  })

  test('Print store - DSponsorAdmin', () => {
    // logStore()
  })
})
