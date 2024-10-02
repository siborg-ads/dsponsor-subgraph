# dsponsor-subgraph

## Use the deployed API

### Base (Chain ID = 8453)

* Deployment on The Graph Network: <https://thegraph.com/explorer/subgraphs/5VzXGF3GZBgtDcbMik1t9HgzNxL4do69ozgiJfMEFBSN>

### Mode (Chain ID = 34443)

* Deployment on The Graph Network: <https://thegraph.com/explorer/subgraphs/8EUn6sf7pTNdaR19GoPWTpE4E26A8TNneM91ZuWG4iYm>

### Sepolia Testnet (Chain ID = 11155111)

* Deployment on The Graph Network: <https://thegraph.com/explorer/subgraphs/6cBNjYUC1ELWtGccxrMq6ZSmCzPq23iwxvinwoYQbyvV>

### Abstract Testnet (Chain ID = 11124)

* Deployment on Goldsky: <https://api.goldsky.com/api/public/project_cm1qqbk4dayqh01qz977dapkx/subgraphs/dsponsor-abstract-testnet/2.0.4/gn>

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

    metadataURL
    metadata {
      creator_categories
      offer_name
      offer_categories
      offer_validFrom
      offer_validTo
    }

    nftContract {
      id # DSponsorNFT smart contract address
      owner # contract owner

      contractURI
      metadata {
        name
        description
        external_link
      }

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
        owner # token ownshership
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

#### Deploy on The Graph Studio

```bash
npm run deploy-<THEGRAPH-NETWORK>
```

##### Available `THEGRAPH-NETWORK` values

* `base`
* `mode-mainnet`
* `sepolia`

#### Deploy on Alchemy Subgraphs

 Get you API key on the [Alchemy dashboard](https://dashboard.lchemy.com/)

```
graph deploy dsponsor-subgraph-sepolia \
--version-label v0.1 \
--node https://subgraphs.alchemy.com/api/subgraphs/deploy \
--ipfs https://ipfs.satsuma.xyz 
--network <ALCHEMY-NETWORK> \
--deploy-key <DEPLOY_KEY>
```

##### Available `ALCHEMY-NETWORK` values

* `base`
* `mode-mainnet`
* `sepolia`

#### Deploy on Goldsky

* First you should update the `subgraph.yaml` and then rebuild

```
rm -rf build && rm-rf generated
npm run build
```

* Get you API key on the [Goldsky dashboard](https://app.goldsky.com/)

```
goldsky login
goldsky subgraph deploy <NAME>/<VERSION> --path .
```
