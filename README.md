# dsponsor-subgraph

## Use the deployed API

### Base (Chain ID = 8453)

* DSponsor subgraph deployed on The Graph Network: <https://thegraph.com/explorer/subgraphs/5VzXGF3GZBgtDcbMik1t9HgzNxL4do69ozgiJfMEFBSN>

* GraphQL playground endpoint: <https://api.studio.thegraph.com/query/65744/dsponsor-base/version/latest>

### Mode (Chain ID = 34443)

* GraphQL playground endpoint: <https://api.studio.thegraph.com/query/65744/dsponsor-mode/version/latest>

### Sepolia Testnet (Chain ID = 11155111)

* GraphQL playground endpoint: <https://api.studio.thegraph.com/query/65744/dsponsor-sepolia/version/latest>

### Request example

```graphql
query MyQuery {
  # get latest ad offers
  adOffers(
    orderBy: creationTimestamp
    orderDirection: desc
    first: 15
    where: { and: [{ disable: false }] }
  ) {
    id # offerId
    name

    # --> Fetch and parse https://github.com/dcast-media/dips/blob/dip-0002/antho31/dip-0002.md#example-schema-json
    # to get creator & offer info  (you may have token_metadata info too)
    # offer.name, offer.image
    metadataURL

    nftContract {
      id # DSponsorNFT smart contract address
      contractURI

      allowList # defines if there is a token allowlist
      # default mint prices
      prices(where: { enabled: true }) {
        currency # ERC20 smart contract
        amount # wei, mind decimals() function to transform in human readable value !
        enabled
      }

      # ERC-2981: NFT Royalty Standard
      royalty {
        receiver 
        bps
      }

      # get all tokens - /!\ non-minted tokens may not appear here
      tokens {
        tokenId
        owner
        mint {
          tokenData
          transactionHash # if = null => not minted yet, so it's available
        }
        setInAllowList # to check is allowList (above) is true, define if is in allowlist
      }
    }
  }
  # get current marketplace listing (auctions & direct buys)
  marketplaceListings(
    orderBy: endTime
    orderDirection: asc
    where: {
      and: [
        {
          status: CREATED
          quantity_gt: 0
          # startTime_lte: 1713371400 # TO REPLACE BY current timestamp
          # endTime_gte: 1713371400 # TO REPLACE BY current timestamp
        }
      ]
    }
  ) {
    id # listingId
    token {
      tokenId
      nftContract {
        id # = assetContract
        adOffers {
          metadataURL # offerMetadata
        }
      }
      mint {
        tokenData
      }
    }

    # listingType = 0 <-> 'Direct', listingType = 1 <-> 'Auction'
    listingType

    currency # ERC20 smart contract addr
    # PRICE
    # if listingType = 'Direct'
    #    price = buyoutPricePerToken
    # else if listingType = 'Auction'
    #    price = bids[0].totalBidAmount || reservePricePerToken
    reservePricePerToken
    buyoutPricePerToken
    bids(orderBy: totalBidAmount, orderDirection: desc, first: 1) {
      bidder
      totalBidAmount
      status
    }

    lister

    startTime
    endTime

    # 'UNSET', 'CREATED', 'COMPLETED' or 'CANCELLED'
    status

    tokenType
    transferType
    rentalExpirationTimestamp
  }
  # get all revenues per month, year, currency
  epochCurrencyRevenues {
    year
    month
    currency
    totalAmount 
    callsWithProtocolFee {
      fee
      spender
      enabler
      referralAddresses
      transactionHash
      revenueTransaction {
        # fees from mint in this tx
        mints {
          contractAddress
          tokenId
          tokenData
          from
          to
          amount
          feeMethodology
          currency
          amountSentToProtocol
          protocolRecipient
        }
        # fees from a direct lisitng (secondary sale) in this tx
        marketplaceDirectBuys {
          id
          listing {
            id
            token {
              nftContract {
                id
              }
            }
          }
          feeMethodology
          amountSentToProtocol # same as fee
          protocolRecipient
          amountSentToSeller
          amountSentToCreator
          creatorRecipient
          quantityBought
          totalPricePaid
        }
      }
    }
  }
}
```

## Development

Follow the instructions from [The Graph website](https://thegraph.com/docs/en/developing/creating-a-subgraph/).

### Setup

```bash
npm install -g @graphprotocol/graph-cli
npm i
graph auth --studio <deploy-key-from-studio>
```

### Build

```bash
npm run build
```

### Test

Docker must be installed on the machine.

```bash
npm run test 
```

### Deploy

#### Available networks

* `base`
* `mode-mainnet`
* `sepolia`

#### Deploy on The Graph Studio

```bash
npm run deploy-sepolia
```

#### Deploy on Alchemy Subgraphs

```
graph deploy dsponsor-subgraph-sepolia \
--version-label v0.1 \
--node https://subgraphs.alchemy.com/api/subgraphs/deploy \
--ipfs https://ipfs.satsuma.xyz 
--network sepolia \
--deploy-key <DEPLOY_KEY>
```

* Get you API key on the [Alchemy dashboard](https://dashboard.alchemy.com/)
* Replace `sepolia` by `base` to deploy on main network
* Get the deployment  
