# dsponsor-subgraph

## Use the deployed API

GraphQL endpoint: <https://api.studio.thegraph.com/proxy/65744/dsponsor-sepolia/version/latest/graphql>

```graphql
query MyQuery {
  adOffers(
    # query exemple
    # filtering is possible up to one nesting level only
    where: {or: [{nftContract_: {id: "0xE60D18328A96949242B35809F4cED1F4e35ac4BB"}}, {nftContract_: {maxSupply_gte: 100000}}]}
    orderBy: id
  ) {
    id # offerId
    metadataURL
    name
    initialCreator
    admins
    adParameters {
      id # adParameter value
    }
    nftContract {
      id # nft contract adress
      maxSupply
      prices {
        currency
        amount
        enabled
      }
      tokens {
        tokenId
        setInAllowList
        mint {
          to
          blockTimestamp
          tokenData
        }
        currentProposals {
          token {
            tokenId
          }
          adParameter {
            id # adParameter value
          }
          acceptedProposal {
            id # proposalId
            data
          }
          pendingProposal {
            id # proposalId
            data
          }
          rejectedProposal {
            id # proposalId
            data
            rejectReason
          }
        }
        allProposals {
          token {
            tokenId
          }
          adParameter {
            id # proposalId
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
