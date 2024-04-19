import { newMockEvent } from 'matchstick-as'
import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts'
import {
  AcceptedOffer,
  AuctionClosed,
  CallWithProtocolFee,
  CancelledOffer,
  FeeUpdate,
  ListingAdded,
  ListingRemoved,
  ListingUpdated,
  NewBid,
  NewOffer,
  NewSale,
  OwnershipTransferred
} from '../generated/DSponsorMarketplace/DSponsorMarketplace'

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

export function createAcceptedOfferEvent(
  offeror: Address,
  offerId: BigInt,
  assetContract: Address,
  tokenId: BigInt,
  seller: Address,
  quantityBought: BigInt,
  totalPricePaid: BigInt
): AcceptedOffer {
  let acceptedOfferEvent = changetype<AcceptedOffer>(newMockEvent())

  acceptedOfferEvent.parameters = new Array()

  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam('offeror', ethereum.Value.fromAddress(offeror))
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      'assetContract',
      ethereum.Value.fromAddress(assetContract)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      'tokenId',
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam('seller', ethereum.Value.fromAddress(seller))
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      'quantityBought',
      ethereum.Value.fromUnsignedBigInt(quantityBought)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      'totalPricePaid',
      ethereum.Value.fromUnsignedBigInt(totalPricePaid)
    )
  )

  return acceptedOfferEvent
}

export function createAuctionClosedEvent(
  listingId: BigInt,
  closer: Address,
  cancelled: boolean,
  auctionCreator: Address,
  winningBidder: Address
): AuctionClosed {
  let auctionClosedEvent = changetype<AuctionClosed>(newMockEvent())

  auctionClosedEvent.parameters = new Array()

  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      'listingId',
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam('closer', ethereum.Value.fromAddress(closer))
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam('cancelled', ethereum.Value.fromBoolean(cancelled))
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      'auctionCreator',
      ethereum.Value.fromAddress(auctionCreator)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      'winningBidder',
      ethereum.Value.fromAddress(winningBidder)
    )
  )

  return auctionClosedEvent
}

export function createCancelledOfferEvent(
  offeror: Address,
  offerId: BigInt
): CancelledOffer {
  let cancelledOfferEvent = changetype<CancelledOffer>(newMockEvent())

  cancelledOfferEvent.parameters = new Array()

  cancelledOfferEvent.parameters.push(
    new ethereum.EventParam('offeror', ethereum.Value.fromAddress(offeror))
  )
  cancelledOfferEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return cancelledOfferEvent
}

export function createListingAddedEvent(
  listingId: BigInt,
  assetContract: Address,
  lister: Address,
  listing: ethereum.Tuple
): ListingAdded {
  let listingAddedEvent = changetype<ListingAdded>(newMockEvent())

  listingAddedEvent.parameters = new Array()

  listingAddedEvent.parameters.push(
    new ethereum.EventParam(
      'listingId',
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingAddedEvent.parameters.push(
    new ethereum.EventParam(
      'assetContract',
      ethereum.Value.fromAddress(assetContract)
    )
  )
  listingAddedEvent.parameters.push(
    new ethereum.EventParam('lister', ethereum.Value.fromAddress(lister))
  )
  listingAddedEvent.parameters.push(
    new ethereum.EventParam('listing', ethereum.Value.fromTuple(listing))
  )

  return listingAddedEvent
}

export function createListingRemovedEvent(
  listingId: BigInt,
  listingCreator: Address
): ListingRemoved {
  let listingRemovedEvent = changetype<ListingRemoved>(newMockEvent())

  listingRemovedEvent.parameters = new Array()

  listingRemovedEvent.parameters.push(
    new ethereum.EventParam(
      'listingId',
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingRemovedEvent.parameters.push(
    new ethereum.EventParam(
      'listingCreator',
      ethereum.Value.fromAddress(listingCreator)
    )
  )

  return listingRemovedEvent
}

export function createListingUpdatedEvent(
  listingId: BigInt,
  listingCreator: Address
): ListingUpdated {
  let listingUpdatedEvent = changetype<ListingUpdated>(newMockEvent())

  listingUpdatedEvent.parameters = new Array()

  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'listingId',
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      'listingCreator',
      ethereum.Value.fromAddress(listingCreator)
    )
  )

  return listingUpdatedEvent
}

export function createNewBidEvent(
  listingId: BigInt,
  bidder: Address,
  quantityWanted: BigInt,
  totalBidAmount: BigInt,
  currency: Address
): NewBid {
  let newBidEvent = changetype<NewBid>(newMockEvent())

  newBidEvent.parameters = new Array()

  newBidEvent.parameters.push(
    new ethereum.EventParam(
      'listingId',
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam('bidder', ethereum.Value.fromAddress(bidder))
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam(
      'quantityWanted',
      ethereum.Value.fromUnsignedBigInt(quantityWanted)
    )
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam(
      'totalBidAmount',
      ethereum.Value.fromUnsignedBigInt(totalBidAmount)
    )
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam('currency', ethereum.Value.fromAddress(currency))
  )

  return newBidEvent
}

export function createNewOfferEvent(
  offeror: Address,
  offerId: BigInt,
  assetContract: Address,
  offer: ethereum.Tuple
): NewOffer {
  let newOfferEvent = changetype<NewOffer>(newMockEvent())

  newOfferEvent.parameters = new Array()

  newOfferEvent.parameters.push(
    new ethereum.EventParam('offeror', ethereum.Value.fromAddress(offeror))
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      'offerId',
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      'assetContract',
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam('offer', ethereum.Value.fromTuple(offer))
  )

  return newOfferEvent
}

export function createNewSaleEvent(
  listingId: BigInt,
  assetContract: Address,
  lister: Address,
  buyer: Address,
  quantityBought: BigInt,
  totalPricePaid: BigInt
): NewSale {
  let newSaleEvent = changetype<NewSale>(newMockEvent())

  newSaleEvent.parameters = new Array()

  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      'listingId',
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      'assetContract',
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam('lister', ethereum.Value.fromAddress(lister))
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam('buyer', ethereum.Value.fromAddress(buyer))
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      'quantityBought',
      ethereum.Value.fromUnsignedBigInt(quantityBought)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      'totalPricePaid',
      ethereum.Value.fromUnsignedBigInt(totalPricePaid)
    )
  )

  return newSaleEvent
}
