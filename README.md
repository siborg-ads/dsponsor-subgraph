# dsponsor-subgraph

## Use the deployed API

GraphQL endpoint: <https://api.studio.thegraph.com/proxy/65744/dsponsor-mumbai/0.0.1/graphql>

```graphql
query MyQuery {
  # query `NewSponsorNFT` data events from DSponsorNFTFactory contract
  newDSponsorNFTs {
    contractAddr
    owner
  }
  # query `UpdateOffer` data events from DSponsorAdmin contract
  updateOffers {
    offerId
    nftContract
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
graph codegen && graph build
```

### Test

Docker must be installed on the machine.

```bash
npm run test 
```

### Deploy

```bash
graph deploy --studio dsponsor-mumbai
```
