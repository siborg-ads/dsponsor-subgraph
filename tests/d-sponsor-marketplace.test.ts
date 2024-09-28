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
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import {
  handleAcceptedOffer,
  handleAuctionClosed,
  handleCallWithProtocolFeeDSponsorMarketplace,
  handleCancelledOffer,
  handleFeeUpdateDSponsorMarketplace,
  handleListingAdded,
  handleListingRemoved,
  handleListingUpdated,
  handleNewBid,
  handleNewOffer,
  handleNewSale,
  handleOwnershipTransferredDSponsorMarketplace
} from '../src/d-sponsor-marketplace'
import {
  createAcceptedOfferEvent,
  createAuctionClosedEvent,
  createCallWithProtocolFeeEvent,
  createCancelledOfferEvent,
  createFeeUpdateEvent,
  createListingAddedEvent,
  createListingRemovedEvent,
  createListingUpdatedEvent,
  createNewBidEvent,
  createNewOfferEvent,
  createNewSaleEvent,
  createOwnershipTransferredEvent
} from './d-sponsor-marketplace-utils'

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    let ZERO_ADDRESS = Address.fromString(
      '0x0000000000000000000000000000000000000000'
    )
    let nftContractAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001'
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
      .reverts()

    createMockedFunction(
      nftContractAddress,
      'MAX_SUPPLY',
      'MAX_SUPPLY():(uint256)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1000))])
    createMockedFunction(nftContractAddress, 'MINTER', 'MINTER():(address)')
      .withArgs([])
      .reverts()

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
      .reverts()

    createMockedFunction(
      nftContractAddress,
      'royaltyInfo',
      'royaltyInfo(uint256,uint256):(address,uint256)'
    )
      .withArgs([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('0')),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('10000'))
      ])
      .reverts()

    createMockedFunction(
      nftContractAddress,
      'applyTokensAllowlist',
      'applyTokensAllowlist():(bool)'
    )
      .withArgs([])
      .reverts()

    createMockedFunction(
      nftContractAddress,
      'totalSupply',
      'totalSupply():(uint256)'
    )
      .withArgs([])
      .reverts()

    let currency = Address.fromString(
      '0x0000000000000000000000000000000000000002'
    )

    let tokenType = 1
    let transferType = 0
    let createdStatus = 1

    let auctionListingId1 = BigInt.fromI32(1)
    let auctionListingId2 = BigInt.fromI32(2)
    let directListingId3 = BigInt.fromI32(3)
    let directListingId4 = BigInt.fromI32(4)

    let offerId1 = BigInt.fromI32(10)
    let offerId2 = BigInt.fromI32(20)

    let tokenId1 = BigInt.fromI32(1)
    let tokenId2 = BigInt.fromI32(2)
    let tokenId3 = BigInt.fromI32(3)
    let tokenId4 = BigInt.fromI32(4)

    let seller = Address.fromString(
      '0x0000000000000000000000000000000000000011'
    )
    let user = Address.fromString('0x0000000000000000000000000000000000000012')

    let quantity = BigInt.fromI32(1)
    let reserveAmount = BigInt.fromI32(234)
    let buyAmount = BigInt.fromI32(1203)

    let startTime = BigInt.fromI32(1713371292)
    let endTime = BigInt.fromI32(1716049692)

    let rentalExpirationTimestamp = BigInt.fromI32(1716049693)

    let listingTypeDirect = 0
    let listingTypeAuction = 1

    let referralAdditionalInformation =
      'test 0x0000000000000000000000000000000000000044'

    handleNewOffer(
      createNewOfferEvent(
        user,
        offerId1,
        nftContractAddress,
        changetype<ethereum.Tuple>([
          ethereum.Value.fromUnsignedBigInt(offerId1),
          ethereum.Value.fromUnsignedBigInt(tokenId1),
          ethereum.Value.fromUnsignedBigInt(quantity),
          ethereum.Value.fromUnsignedBigInt(buyAmount),
          ethereum.Value.fromUnsignedBigInt(endTime),
          ethereum.Value.fromAddress(user),
          ethereum.Value.fromAddress(nftContractAddress),
          ethereum.Value.fromAddress(currency),
          ethereum.Value.fromI32(tokenType),
          ethereum.Value.fromI32(transferType),
          ethereum.Value.fromUnsignedBigInt(rentalExpirationTimestamp),
          ethereum.Value.fromI32(createdStatus),
          ethereum.Value.fromString(referralAdditionalInformation)
        ])
      )
    )

    handleNewOffer(
      createNewOfferEvent(
        user,
        offerId1,
        nftContractAddress,
        changetype<ethereum.Tuple>([
          ethereum.Value.fromUnsignedBigInt(offerId2),
          ethereum.Value.fromUnsignedBigInt(tokenId2),
          ethereum.Value.fromUnsignedBigInt(quantity),
          ethereum.Value.fromUnsignedBigInt(buyAmount),
          ethereum.Value.fromUnsignedBigInt(endTime),
          ethereum.Value.fromAddress(user),
          ethereum.Value.fromAddress(nftContractAddress),
          ethereum.Value.fromAddress(currency),
          ethereum.Value.fromI32(tokenType),
          ethereum.Value.fromI32(transferType),
          ethereum.Value.fromUnsignedBigInt(rentalExpirationTimestamp),
          ethereum.Value.fromI32(createdStatus),
          ethereum.Value.fromString(referralAdditionalInformation)
        ])
      )
    )

    handleAcceptedOffer(
      createAcceptedOfferEvent(
        user,
        offerId1,
        nftContractAddress,
        tokenId1,
        seller,
        quantity,
        reserveAmount
      )
    )

    handleCancelledOffer(createCancelledOfferEvent(user, offerId2))

    handleListingAdded(
      createListingAddedEvent(
        directListingId3,
        nftContractAddress,
        seller,
        changetype<ethereum.Tuple>([
          ethereum.Value.fromUnsignedBigInt(auctionListingId1),
          ethereum.Value.fromAddress(seller),
          ethereum.Value.fromAddress(nftContractAddress),
          ethereum.Value.fromUnsignedBigInt(tokenId1),
          ethereum.Value.fromUnsignedBigInt(startTime),
          ethereum.Value.fromUnsignedBigInt(endTime),
          ethereum.Value.fromUnsignedBigInt(quantity),
          ethereum.Value.fromAddress(currency),
          ethereum.Value.fromUnsignedBigInt(reserveAmount),
          ethereum.Value.fromUnsignedBigInt(buyAmount),
          ethereum.Value.fromI32(tokenType),
          ethereum.Value.fromI32(transferType),
          ethereum.Value.fromUnsignedBigInt(rentalExpirationTimestamp),
          ethereum.Value.fromI32(listingTypeAuction)
        ])
      )
    )

    handleListingAdded(
      createListingAddedEvent(
        directListingId3,
        nftContractAddress,
        seller,
        changetype<ethereum.Tuple>([
          ethereum.Value.fromUnsignedBigInt(auctionListingId2),
          ethereum.Value.fromAddress(seller),
          ethereum.Value.fromAddress(nftContractAddress),
          ethereum.Value.fromUnsignedBigInt(tokenId2),
          ethereum.Value.fromUnsignedBigInt(startTime),
          ethereum.Value.fromUnsignedBigInt(endTime),
          ethereum.Value.fromUnsignedBigInt(quantity),
          ethereum.Value.fromAddress(currency),
          ethereum.Value.fromUnsignedBigInt(reserveAmount),
          ethereum.Value.fromUnsignedBigInt(buyAmount),
          ethereum.Value.fromI32(tokenType),
          ethereum.Value.fromI32(transferType),
          ethereum.Value.fromUnsignedBigInt(rentalExpirationTimestamp),
          ethereum.Value.fromI32(listingTypeAuction)
        ])
      )
    )

    handleListingAdded(
      createListingAddedEvent(
        directListingId3,
        nftContractAddress,
        seller,
        changetype<ethereum.Tuple>([
          ethereum.Value.fromUnsignedBigInt(directListingId3),
          ethereum.Value.fromAddress(seller),
          ethereum.Value.fromAddress(nftContractAddress),
          ethereum.Value.fromUnsignedBigInt(tokenId3),
          ethereum.Value.fromUnsignedBigInt(startTime),
          ethereum.Value.fromUnsignedBigInt(endTime),
          ethereum.Value.fromUnsignedBigInt(quantity),
          ethereum.Value.fromAddress(currency),
          ethereum.Value.fromUnsignedBigInt(reserveAmount),
          ethereum.Value.fromUnsignedBigInt(buyAmount),
          ethereum.Value.fromI32(tokenType),
          ethereum.Value.fromI32(transferType),
          ethereum.Value.fromUnsignedBigInt(rentalExpirationTimestamp),
          ethereum.Value.fromI32(listingTypeDirect)
        ])
      )
    )

    handleListingAdded(
      createListingAddedEvent(
        directListingId3,
        nftContractAddress,
        seller,
        changetype<ethereum.Tuple>([
          ethereum.Value.fromUnsignedBigInt(directListingId4),
          ethereum.Value.fromAddress(seller),
          ethereum.Value.fromAddress(nftContractAddress),
          ethereum.Value.fromUnsignedBigInt(tokenId4),
          ethereum.Value.fromUnsignedBigInt(startTime),
          ethereum.Value.fromUnsignedBigInt(endTime),
          ethereum.Value.fromUnsignedBigInt(quantity),
          ethereum.Value.fromAddress(currency),
          ethereum.Value.fromUnsignedBigInt(reserveAmount),
          ethereum.Value.fromUnsignedBigInt(buyAmount),
          ethereum.Value.fromI32(tokenType),
          ethereum.Value.fromI32(transferType),
          ethereum.Value.fromUnsignedBigInt(rentalExpirationTimestamp),
          ethereum.Value.fromI32(listingTypeDirect)
        ])
      )
    )

    handleListingUpdated(
      createListingUpdatedEvent(
        directListingId3,
        seller,
        changetype<ethereum.Tuple>([
          ethereum.Value.fromUnsignedBigInt(quantity),
          ethereum.Value.fromUnsignedBigInt(reserveAmount),
          ethereum.Value.fromUnsignedBigInt(buyAmount),
          ethereum.Value.fromAddress(currency),
          ethereum.Value.fromUnsignedBigInt(startTime),
          ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(3600000)), // secondsUntilEndTime
          ethereum.Value.fromUnsignedBigInt(rentalExpirationTimestamp)
        ])
      )
    )

    handleNewBid(
      createNewBidEvent(
        auctionListingId1,
        quantity,
        user,
        reserveAmount.times(BigInt.fromI32(2)),
        ZERO_ADDRESS,
        BigInt.fromI32(1),
        currency,
        endTime
      )
    )

    handleAuctionClosed(
      createAuctionClosedEvent(auctionListingId1, seller, false, seller, user)
    )
    handleAuctionClosed(
      createAuctionClosedEvent(auctionListingId2, seller, true, seller, user)
    )

    handleListingRemoved(createListingRemovedEvent(directListingId3, seller))

    handleNewSale(
      createNewSaleEvent(
        directListingId4,
        nftContractAddress,
        seller,
        user,
        quantity,
        buyAmount
      )
    )

    handleCallWithProtocolFeeDSponsorMarketplace(
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

    handleFeeUpdateDSponsorMarketplace(
      createFeeUpdateEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // feeRecipient
        BigInt.fromI32(690) // 6.9 % fee
      )
    )

    handleOwnershipTransferredDSponsorMarketplace(
      createOwnershipTransferredEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // previousOwner
        Address.fromString('0x0000000000000000000000000000000000000002') // newOwner
      )
    )
  })

  afterAll(() => {
    clearStore()
  })

  test('Print store - DSponsorMarketplace', () => {
    // logStore()
  })
})
