# dsponsor-subgraph

## Use the deployed API

GraphQL endpoint: <https://api.studio.thegraph.com/proxy/65744/dsponsor-sepolia/version/latest/graphql>

```graphql
query MyQuery {
  adOffers(orderBy: id) {
    id
    metadataURL
    name
    initialCreator
    admins
    adParameters {
      id
      base
      variants
    }
    nftContract {
      id
      maxSupply
      prices {
        currency
        amount
        enabled
      }
      tokens {
        tokenId
        setInAllowList
        marketplaceListings {
          id
          status
          listingType
          transferType
          completedBid {
            bidder
            totalBidAmount
            revenueTransaction {
              id
            }
          }
          bids {
            listing {
              id
            }
            bidder
          }
          directBuys {
            buyer
            listing {
              id
            }
            totalPricePaid
            revenueTransaction {
              id
            }
          }
        }
        marketplaceOffers {
          id
          totalPrice
          currency
          revenueTransaction {
            id
          }
        }
        mint {
          to
          blockTimestamp
          tokenData
          revenueTransaction {
            id            
          }
        }
        currentProposals {
          token {
            tokenId
          }
          adParameter {
            id
          }
          acceptedProposal {
            id
            data
          }
          pendingProposal {
            id
            data
          }
          rejectedProposal {
            id
            data
            rejectReason
          }
        }
        allProposals {
          token {
            tokenId
          }
          adParameter {
            id
          }
          data
          status
          rejectReason
          creationTimestamp
          lastUpdateTimestamp
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

```bash
npm run deploy-sepolia
```
