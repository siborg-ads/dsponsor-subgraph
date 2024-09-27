import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  logStore,
  createMockedFunction
} from 'matchstick-as/assembly/index'
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import {
  handleCallWithProtocolFeeDSponsorAdmin,
  handleFeeUpdateDSponsorAdmin,
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

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    const nftContractAddress = Address.fromString(
      '0xE60D18328A96949242B35809F4cED1F4e35ac4BB'
    )

    createMockedFunction(nftContractAddress, 'name', 'name():(string)')
      .withArgs([])
      .returns([ethereum.Value.fromString('DSponsorNFT')])
    createMockedFunction(nftContractAddress, 'symbol', 'symbol():(string)')
      .withArgs([])
      .returns([ethereum.Value.fromString('DNFT')])
    createMockedFunction(nftContractAddress, 'baseURI', 'baseURI():(string)')
      .withArgs([])
      .returns([ethereum.Value.fromString('https://mybaseuri.com')])
    createMockedFunction(
      nftContractAddress,
      'contractURI',
      'contractURI():(string)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromString('https://mycontracturi.com')])
    createMockedFunction(
      nftContractAddress,
      'MAX_SUPPLY',
      'MAX_SUPPLY():(uint256)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1000))])
    createMockedFunction(nftContractAddress, 'MINTER', 'MINTER():(address)')
      .withArgs([])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000111')
        )
      ])
    createMockedFunction(
      nftContractAddress,
      'trustedForwarder',
      'trustedForwarder():(address)'
    )
      .withArgs([])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000222')
        )
      ])
    createMockedFunction(nftContractAddress, 'owner', 'owner():(address)')
      .withArgs([])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000333')
        )
      ])
    createMockedFunction(
      nftContractAddress,
      'royaltyInfo',
      'royaltyInfo(uint256,uint256):(address,uint256)'
    )
      .withArgs([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('0')),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('10000'))
      ])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000333')
        ),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1000'))
      ])
    createMockedFunction(
      nftContractAddress,
      'applyTokensAllowlist',
      'applyTokensAllowlist():(bool)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromBoolean(true)])

    createMockedFunction(
      nftContractAddress,
      'totalSupply',
      'totalSupply():(uint256)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(100))])

    createMockedFunction(
      nftContractAddress,
      'tokenByIndex',
      'tokenByIndex(uint256):(uint256)'
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])
      .reverts()

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
        '780x00000000000000000000000000000000000000010x0000000000000000000000000000000000000055 test 0x0000000000000000000000000000000000000044' // additionalInformation
        // ''
      )
    )

    handleFeeUpdateDSponsorAdmin(
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
