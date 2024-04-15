import {
  CallWithProtocolFee as CallWithProtocolFeeEvent,
  FeeUpdate as FeeUpdateEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  AcceptedOffer as AcceptedOfferEvent,
  AuctionClosed as AuctionClosedEvent,
  CancelledOffer as CancelledOfferEvent,
  ListingAdded as ListingAddedEvent,
  ListingRemoved as ListingRemovedEvent,
  ListingUpdated as ListingUpdatedEvent,
  NewBid as NewBidEvent,
  NewOffer as NewOfferEvent,
  NewSale as NewSaleEvent
} from '../generated/DSponsorMarketplace/DSponsorMarketplace'

import {
  CallWithProtocolFee as CallWithProtocolFeeCommonEvent,
  FeeUpdate as FeeUpdateCommonEvent,
  OwnershipTransferred as OwnershipTransferredCommonEvent
} from '../generated/DSponsorAdmin/DSponsorAdmin'

import {
  AcceptedOffer,
  AuctionClosed,
  CancelledOffer,
  ListingAdded,
  ListingRemoved,
  ListingUpdated,
  NewBid,
  NewOffer,
  NewSale
} from '../generated/schema'

import {
  handleCallWithProtocolFee,
  handleFeeUpdate,
  handleOwnershipTransferred
} from './common'

export function handleCallWithProtocolFeeDSponsorMarketplace(
  event: CallWithProtocolFeeEvent
): void {
  handleCallWithProtocolFee(changetype<CallWithProtocolFeeCommonEvent>(event))
}

export function handleFeeUpdateDSponsorMarketplace(
  event: FeeUpdateEvent
): void {
  handleFeeUpdate(changetype<FeeUpdateCommonEvent>(event))
}

export function handleOwnershipTransferredDSponsorMarketplace(
  event: OwnershipTransferredEvent
): void {
  handleOwnershipTransferred(changetype<OwnershipTransferredCommonEvent>(event))
}

export function handleAcceptedOffer(event: AcceptedOfferEvent): void {
  let entity = new AcceptedOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.offerId = event.params.offerId
  entity.assetContract = event.params.assetContract
  entity.tokenId = event.params.tokenId
  entity.seller = event.params.seller
  entity.quantityBought = event.params.quantityBought
  entity.totalPricePaid = event.params.totalPricePaid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionClosed(event: AuctionClosedEvent): void {
  let entity = new AuctionClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.closer = event.params.closer
  entity.cancelled = event.params.cancelled
  entity.auctionCreator = event.params.auctionCreator
  entity.winningBidder = event.params.winningBidder

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelledOffer(event: CancelledOfferEvent): void {
  let entity = new CancelledOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingAdded(event: ListingAddedEvent): void {
  let entity = new ListingAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.assetContract = event.params.assetContract
  entity.lister = event.params.lister
  entity.listing_listingId = event.params.listing.listingId
  entity.listing_tokenOwner = event.params.listing.tokenOwner
  entity.listing_assetContract = event.params.listing.assetContract
  entity.listing_tokenId = event.params.listing.tokenId
  entity.listing_startTime = event.params.listing.startTime
  entity.listing_endTime = event.params.listing.endTime
  entity.listing_quantity = event.params.listing.quantity
  entity.listing_currency = event.params.listing.currency
  entity.listing_reservePricePerToken =
    event.params.listing.reservePricePerToken
  entity.listing_buyoutPricePerToken = event.params.listing.buyoutPricePerToken
  entity.listing_tokenType = event.params.listing.tokenType
  entity.listing_transferType = event.params.listing.transferType
  entity.listing_rentalExpirationTimestamp =
    event.params.listing.rentalExpirationTimestamp
  entity.listing_listingType = event.params.listing.listingType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingRemoved(event: ListingRemovedEvent): void {
  let entity = new ListingRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.listingCreator = event.params.listingCreator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingUpdated(event: ListingUpdatedEvent): void {
  let entity = new ListingUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.listingCreator = event.params.listingCreator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewBid(event: NewBidEvent): void {
  let entity = new NewBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.bidder = event.params.bidder
  entity.quantityWanted = event.params.quantityWanted
  entity.totalBidAmount = event.params.totalBidAmount
  entity.currency = event.params.currency

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewOffer(event: NewOfferEvent): void {
  let entity = new NewOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.offerId = event.params.offerId
  entity.assetContract = event.params.assetContract
  entity.offer_offerId = event.params.offer.offerId
  entity.offer_tokenId = event.params.offer.tokenId
  entity.offer_quantity = event.params.offer.quantity
  entity.offer_totalPrice = event.params.offer.totalPrice
  entity.offer_expirationTimestamp = event.params.offer.expirationTimestamp
  entity.offer_offeror = event.params.offer.offeror
  entity.offer_assetContract = event.params.offer.assetContract
  entity.offer_currency = event.params.offer.currency
  entity.offer_tokenType = event.params.offer.tokenType
  entity.offer_transferType = event.params.offer.transferType
  entity.offer_rentalExpirationTimestamp =
    event.params.offer.rentalExpirationTimestamp
  entity.offer_status = event.params.offer.status
  entity.offer_referralAdditionalInformation =
    event.params.offer.referralAdditionalInformation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewSale(event: NewSaleEvent): void {
  let entity = new NewSale(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.assetContract = event.params.assetContract
  entity.lister = event.params.lister
  entity.buyer = event.params.buyer
  entity.quantityBought = event.params.quantityBought
  entity.totalPricePaid = event.params.totalPricePaid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
