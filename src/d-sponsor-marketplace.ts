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
  FeeParamsForContract,
  ListingAdded,
  ListingRemoved,
  ListingUpdated,
  MarketplaceBid,
  MarketplaceDirectBuy,
  MarketplaceListing,
  MarketplaceOffer,
  NewBid,
  NewOffer,
  NewSale,
  NftContract,
  RevenueTransaction,
  Token
} from '../generated/schema'

import {
  handleCallWithProtocolFee,
  handleFeeUpdate,
  handleOwnershipTransferred
} from './common'
import { BigInt, Bytes } from '@graphprotocol/graph-ts'

const FEE_METHODOLOGY = 'CUT_TO_AMOUNT'

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
  /**************************************************************************
   * MarketplaceOffer entity
   ************************************************************************** */

  let offerId = event.params.offerId.toString()

  let marketplaceOffer = MarketplaceOffer.load(offerId.toString())
  if (marketplaceOffer == null) {
    marketplaceOffer = MarketplaceOffer.loadInBlock(offerId.toString())
  }

  if (marketplaceOffer != null) {
    let transactionHash = event.transaction.hash
    let revenueTransaction = RevenueTransaction.load(transactionHash)
    if (revenueTransaction == null) {
      revenueTransaction = RevenueTransaction.loadInBlock(transactionHash)
    }
    if (revenueTransaction == null) {
      revenueTransaction = new RevenueTransaction(transactionHash)
      revenueTransaction.blockTimestamp = event.block.timestamp
      revenueTransaction.save()
    }

    let smartContractAddr = event.address
    let feeParamsForContract = FeeParamsForContract.load(smartContractAddr)
    if (feeParamsForContract == null) {
      feeParamsForContract = FeeParamsForContract.loadInBlock(smartContractAddr)
    }
    if (feeParamsForContract != null) {
      let baseAmount = marketplaceOffer.totalPrice
      let feeBps = feeParamsForContract.feeBps

      let feeMethodology = FEE_METHODOLOGY // CUT_TO_AMOUNT
      let amountSentToProtocol = baseAmount
        .times(feeBps)
        .div(BigInt.fromI32(10000))
      let amountSentToSeller = baseAmount.minus(amountSentToProtocol)

      let token = Token.load(marketplaceOffer.token)
      if (token == null) {
        token = Token.loadInBlock(marketplaceOffer.token)
      }
      if (token != null) {
        let nftContract = NftContract.load(token.nftContract)
        if (nftContract == null) {
          nftContract = NftContract.loadInBlock(token.nftContract)
        }
        if (nftContract != null) {
          let royaltiesBps = nftContract.royaltyBps
          if (royaltiesBps && royaltiesBps > BigInt.fromI32(0)) {
            let amountSentToCreator = baseAmount
              .times(royaltiesBps)
              .div(BigInt.fromI32(10000))
            amountSentToSeller = amountSentToSeller.minus(amountSentToCreator)
            marketplaceOffer.amountSentToCreator = amountSentToCreator
            marketplaceOffer.creatorRecipient = nftContract.owner
          }
        }
      }

      marketplaceOffer.feeMethodology = feeMethodology
      marketplaceOffer.amountSentToProtocol = amountSentToProtocol
      marketplaceOffer.protocolRecipient = feeParamsForContract.feeRecipient
      marketplaceOffer.amountSentToSeller = amountSentToSeller
    }

    marketplaceOffer.sellerRecipient = event.params.seller
    marketplaceOffer.revenueTransaction = transactionHash
    marketplaceOffer.status = 'COMPLETED'
    marketplaceOffer.lastUpdateTimestamp = event.block.timestamp
    marketplaceOffer.save()
  }

  /**************************************************************************
   * AcceptedOffer entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceListing entity
   ************************************************************************** */
  let listingId = event.params.listingId.toString()

  let marketplaceListing = MarketplaceListing.load(listingId.toString())
  if (marketplaceListing == null) {
    marketplaceListing = MarketplaceListing.loadInBlock(listingId.toString())
  }

  if (marketplaceListing != null) {
    let cancelled = event.params.cancelled
    marketplaceListing.status = cancelled ? 'CANCELLED' : 'COMPLETED'

    let bids: MarketplaceBid[] = marketplaceListing.bids.load()
    let winningBidTimestamp = BigInt.fromI32(0)
    let winningBidId: Bytes = new Bytes(0)
    for (let i = 0; i < bids.length; i++) {
      let creationTimestamp = bids[i].creationTimestamp
      if (
        !cancelled &&
        creationTimestamp.ge(winningBidTimestamp) &&
        event.params.winningBidder == bids[i].bidder
      ) {
        winningBidTimestamp = creationTimestamp
        winningBidId = bids[i].id
      }
      bids[i].status = 'CANCELLED'
      bids[i].lastUpdateTimestamp = event.block.timestamp
      bids[i].save()
    }

    if (!cancelled) {
      let winningBid = MarketplaceBid.load(winningBidId)
      if (winningBid != null) {
        winningBid.status = 'COMPLETED'

        let transactionHash = event.transaction.hash
        let revenueTransaction = RevenueTransaction.load(transactionHash)
        if (revenueTransaction == null) {
          revenueTransaction = RevenueTransaction.loadInBlock(transactionHash)
        }
        if (revenueTransaction == null) {
          revenueTransaction = new RevenueTransaction(transactionHash)
          revenueTransaction.blockTimestamp = event.block.timestamp
          revenueTransaction.save()
        }
        winningBid.revenueTransaction = transactionHash

        // compute fees, amounts
        let smartContractAddr = event.address
        let feeParamsForContract = FeeParamsForContract.load(smartContractAddr)
        if (feeParamsForContract == null) {
          feeParamsForContract =
            FeeParamsForContract.loadInBlock(smartContractAddr)
        }
        if (feeParamsForContract != null) {
          let baseAmount = winningBid.totalBidAmount
          let feeBps = feeParamsForContract.feeBps

          let feeMethodology = FEE_METHODOLOGY // CUT_TO_AMOUNT
          let amountSentToProtocol = baseAmount
            .times(feeBps)
            .div(BigInt.fromI32(10000))
          let amountSentToSeller = baseAmount.minus(amountSentToProtocol)

          let token = Token.load(marketplaceListing.token)
          if (token == null) {
            token = Token.loadInBlock(marketplaceListing.token)
          }
          if (token != null) {
            let nftContract = NftContract.load(token.nftContract)
            if (nftContract == null) {
              nftContract = NftContract.loadInBlock(token.nftContract)
            }
            if (nftContract != null) {
              let royaltiesBps = nftContract.royaltyBps
              if (royaltiesBps && royaltiesBps > BigInt.fromI32(0)) {
                let amountSentToCreator = baseAmount
                  .times(royaltiesBps)
                  .div(BigInt.fromI32(10000))
                amountSentToSeller =
                  amountSentToSeller.minus(amountSentToCreator)
                winningBid.amountSentToCreator = amountSentToCreator
                winningBid.creatorRecipient = nftContract.owner
              }
            }
          }

          winningBid.feeMethodology = feeMethodology
          winningBid.amountSentToProtocol = amountSentToProtocol
          winningBid.protocolRecipient = feeParamsForContract.feeRecipient
          winningBid.amountSentToSeller = amountSentToSeller
          winningBid.sellerRecipient = marketplaceListing.lister
        }

        winningBid.save()
        marketplaceListing.completedBid = winningBidId
      }
    }

    marketplaceListing.lastUpdateTimestamp = event.block.timestamp
    marketplaceListing.save()
  }

  /**************************************************************************
   * AuctionClosed entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceOffer entity
   ************************************************************************** */
  let offerId = event.params.offerId.toString()

  let marketplaceOffer = MarketplaceOffer.load(offerId.toString())
  if (marketplaceOffer == null) {
    marketplaceOffer = MarketplaceOffer.loadInBlock(offerId.toString())
  }

  if (marketplaceOffer != null) {
    marketplaceOffer.status = 'CANCELLED'
    marketplaceOffer.lastUpdateTimestamp = event.block.timestamp
    marketplaceOffer.save()
  }

  /**************************************************************************
   * CancelledOffer entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceListing entity
   ************************************************************************** */

  let listingId = event.params.listingId.toString()
  let listingType =
    event.params.listing.listingType === 0 ? 'Direct' : 'Auction'
  let tokenType =
    event.params.listing.tokenType === 0
      ? 'ERC1155'
      : event.params.listing.tokenType === 1
      ? 'ERC721'
      : 'ERC20'
  let transferType = event.params.listing.transferType === 0 ? 'Rent' : 'Sale'

  let nftContractAddress = event.params.listing.assetContract

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
    nftContract.allowList = false
    nftContract.save()
  }

  let tokenId = event.params.listing.tokenId

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

  let marketplaceListing = new MarketplaceListing(listingId)
  marketplaceListing.listingType = listingType
  marketplaceListing.lister = event.params.lister
  marketplaceListing.token = tokenEntityId
  marketplaceListing.startTime = event.params.listing.startTime
  marketplaceListing.endTime = event.params.listing.endTime
  marketplaceListing.quantity = event.params.listing.quantity
  marketplaceListing.currency = event.params.listing.currency
  marketplaceListing.reservePricePerToken =
    event.params.listing.reservePricePerToken
  marketplaceListing.buyoutPricePerToken =
    event.params.listing.buyoutPricePerToken
  marketplaceListing.tokenType = tokenType
  marketplaceListing.transferType = transferType
  marketplaceListing.rentalExpirationTimestamp =
    event.params.listing.rentalExpirationTimestamp
  marketplaceListing.status = 'CREATED'
  marketplaceListing.creationTimestamp = event.block.timestamp
  marketplaceListing.lastUpdateTimestamp = event.block.timestamp

  marketplaceListing.save()

  /**************************************************************************
   * ListingAdded entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceListing entity
   ************************************************************************** */
  let listingId = event.params.listingId.toString()

  let marketplaceListing = MarketplaceListing.load(listingId.toString())
  if (marketplaceListing == null) {
    marketplaceListing = MarketplaceListing.loadInBlock(listingId.toString())
  }

  if (marketplaceListing != null) {
    marketplaceListing.status = 'CANCELLED'
    marketplaceListing.lastUpdateTimestamp = event.block.timestamp
    marketplaceListing.save()
  }

  /**************************************************************************
   * ListingRemoved entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceListing entity
   ************************************************************************** */

  // @todo - need ListingUpdateParams in event

  /**************************************************************************
   * ListingAdded entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceBid entity
   ************************************************************************** */
  let listingId = event.params.listingId.toString()

  let marketplaceListing = MarketplaceListing.load(listingId.toString())
  if (marketplaceListing == null) {
    marketplaceListing = MarketplaceListing.loadInBlock(listingId.toString())
  }

  if (marketplaceListing != null) {
    let bids: MarketplaceBid[] = marketplaceListing.bids.load()
    for (let i = 0; i < bids.length; i++) {
      bids[i].status = 'CANCELLED'
      bids[i].lastUpdateTimestamp = event.block.timestamp
      bids[i].save()
    }

    let marketplaceBid = new MarketplaceBid(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    marketplaceBid.listing = marketplaceListing.id
    marketplaceBid.bidder = event.params.bidder
    marketplaceBid.quantity = event.params.quantityWanted
    marketplaceBid.totalBidAmount = event.params.totalBidAmount
    marketplaceBid.currency = event.params.currency
    marketplaceBid.status = 'CREATED'
    marketplaceBid.creationTxHash = event.transaction.hash
    marketplaceBid.creationTimestamp = event.block.timestamp
    marketplaceBid.lastUpdateTimestamp = event.block.timestamp
    marketplaceBid.save()

    marketplaceListing.lastUpdateTimestamp = event.block.timestamp
    marketplaceListing.save()
  }

  /**************************************************************************
   * NewBid entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceOffer entity
   ************************************************************************** */

  let offerId = event.params.offerId.toString()
  let tokenType =
    event.params.offer.tokenType === 0
      ? 'ERC1155'
      : event.params.offer.tokenType === 1
      ? 'ERC721'
      : 'ERC20'
  let transferType = event.params.offer.transferType === 0 ? 'Rent' : 'Sale'

  let nftContractAddress = event.params.offer.assetContract

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
    nftContract.allowList = false
    nftContract.save()
  }

  let tokenId = event.params.offer.tokenId

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

  let marketplaceOffer = new MarketplaceOffer(offerId)
  marketplaceOffer.offeror = event.params.offeror
  marketplaceOffer.token = tokenEntityId
  marketplaceOffer.quantity = event.params.offer.quantity
  marketplaceOffer.currency = event.params.offer.currency
  marketplaceOffer.totalPrice = event.params.offer.totalPrice
  marketplaceOffer.tokenType = tokenType
  marketplaceOffer.transferType = transferType
  marketplaceOffer.expirationTimestamp = event.params.offer.expirationTimestamp
  marketplaceOffer.rentalExpirationTimestamp =
    event.params.offer.rentalExpirationTimestamp
  marketplaceOffer.status = 'CREATED'
  marketplaceOffer.referralAdditionalInformation =
    event.params.offer.referralAdditionalInformation
  marketplaceOffer.creationTimestamp = event.block.timestamp
  marketplaceOffer.lastUpdateTimestamp = event.block.timestamp
  marketplaceOffer.save()

  /**************************************************************************
   * NewOffer entity
   ************************************************************************** */

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
  /**************************************************************************
   * MarketplaceListing entity
   ************************************************************************** */
  let listingId = event.params.listingId.toString()

  let marketplaceListing = MarketplaceListing.load(listingId.toString())
  if (marketplaceListing == null) {
    marketplaceListing = MarketplaceListing.loadInBlock(listingId.toString())
  }

  if (marketplaceListing != null) {
    let marketplaceDirectBuy = new MarketplaceDirectBuy(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    marketplaceDirectBuy.listing = marketplaceListing.id
    marketplaceDirectBuy.buyer = event.params.buyer
    marketplaceDirectBuy.quantityBought = event.params.quantityBought
    marketplaceDirectBuy.totalPricePaid = event.params.totalPricePaid

    let transactionHash = event.transaction.hash
    let revenueTransaction = RevenueTransaction.load(transactionHash)
    if (revenueTransaction == null) {
      revenueTransaction = RevenueTransaction.loadInBlock(transactionHash)
    }
    if (revenueTransaction == null) {
      revenueTransaction = new RevenueTransaction(transactionHash)
      revenueTransaction.blockTimestamp = event.block.timestamp
      revenueTransaction.save()
    }

    // compute fees, amounts
    let smartContractAddr = event.address
    let feeParamsForContract = FeeParamsForContract.load(smartContractAddr)
    if (feeParamsForContract == null) {
      feeParamsForContract = FeeParamsForContract.loadInBlock(smartContractAddr)
    }
    if (feeParamsForContract != null) {
      let baseAmount = marketplaceDirectBuy.quantityBought
      let feeBps = feeParamsForContract.feeBps

      let feeMethodology = FEE_METHODOLOGY // CUT_TO_AMOUNT
      let amountSentToProtocol = baseAmount
        .times(feeBps)
        .div(BigInt.fromI32(10000))
      let amountSentToSeller = baseAmount.minus(amountSentToProtocol)

      let token = Token.load(marketplaceListing.token)
      if (token == null) {
        token = Token.loadInBlock(marketplaceListing.token)
      }
      if (token != null) {
        let nftContract = NftContract.load(token.nftContract)
        if (nftContract == null) {
          nftContract = NftContract.loadInBlock(token.nftContract)
        }
        if (nftContract != null) {
          let royaltiesBps = nftContract.royaltyBps
          if (royaltiesBps && royaltiesBps > BigInt.fromI32(0)) {
            let amountSentToCreator = baseAmount
              .times(royaltiesBps)
              .div(BigInt.fromI32(10000))
            amountSentToSeller = amountSentToSeller.minus(amountSentToCreator)
            marketplaceDirectBuy.amountSentToCreator = amountSentToCreator
            marketplaceDirectBuy.creatorRecipient = nftContract.owner
          }
        }
      }

      marketplaceDirectBuy.feeMethodology = feeMethodology
      marketplaceDirectBuy.amountSentToProtocol = amountSentToProtocol
      marketplaceDirectBuy.protocolRecipient = feeParamsForContract.feeRecipient
      marketplaceDirectBuy.amountSentToSeller = amountSentToSeller
      marketplaceDirectBuy.sellerRecipient = marketplaceListing.lister
    }

    marketplaceDirectBuy.revenueTransaction = transactionHash

    marketplaceDirectBuy.save()

    let currentQuantity: BigInt = marketplaceListing.quantity.minus(
      event.params.quantityBought
    )
    if (currentQuantity.le(BigInt.fromI32(0))) {
      marketplaceListing.status = 'COMPLETED'
    }
    marketplaceListing.quantity = currentQuantity
    marketplaceListing.lastUpdateTimestamp = event.block.timestamp
    marketplaceListing.save()
  }

  /**************************************************************************
   * NewSale entity
   ************************************************************************** */

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
