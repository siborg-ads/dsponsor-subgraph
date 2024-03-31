# dsponsor-subgraph

## Use the deployed API

GraphQL endpoint: <https://api.studio.thegraph.com/proxy/65744/dsponsor-sepolia/version/latest/graphql>

```graphql
query MyQuery {
  # query `NewSponsorNFT` data events from DSponsorNFTFactory contract
  newDSponsorNFTs {
    contractAddr
    owner
  }
  # on offer creation by creator, query from DSponsorNFTAdmin contract
  updateOffers {
    id
    name
    nftContract
    offerId
    offerMetadata
  }
  # when sponsor buy ad space from offer, query from DSponsorNFTAdmin contract
   mints {
    tokenId 
    tokenData
    to
    from
    currency
  }
  # when sponsor submit ad data for a specific parameter (ex: image url for adParamter 'logo'), query from DSponsorNFTAdmin contract
  updateAdProposals {
    adParameter
    data
    id
    offerId
    proposalId
    tokenId
  }
  # when creator validate (or reject) ad data, query from DSponsorNFTAdmin contract
  updateAdValidations {
    tokenId
    reason
    proposalId
    offerId
  }
  # when someone create a direct listing (DSponsorMarketplace contract)
  listingAddeds {
    listingId
    listing_tokenId
    listing_assetContract
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
