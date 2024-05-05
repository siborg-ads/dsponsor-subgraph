import { Value } from '@graphprotocol/graph-ts'
import { NewDSponsorNFT as NewDSponsorNFTEvent } from '../generated/DSponsorNFTFactory/DSponsorNFTFactory'
import { NewDSponsorNFT, NftContract } from '../generated/schema'

export function handleNewDSponsorNFT(event: NewDSponsorNFTEvent): void {
  let currencies = Value.fromAddressArray(
    event.params.currencies
  ).toBytesArray()
  let prices = event.params.prices

  /**************************************************************************
   * NftContract entity
   ************************************************************************** */

  let nftContractAddress = event.params.contractAddr

  let allowedTokenIds = event.params.allowedTokenIds

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract == null) {
    nftContract = new NftContract(nftContractAddress)
  }

  nftContract.name = event.params.name
  nftContract.symbol = event.params.symbol
  nftContract.baseURI = event.params.baseURI
  nftContract.contractURI = event.params.contractURI
  nftContract.maxSupply = event.params.maxSupply
  nftContract.minter = event.params.minter
  nftContract.forwarder = event.params.forwarder
  nftContract.allowList = allowedTokenIds.length > 0

  nftContract.save()

  /**************************************************************************
   * NewDSponsorNFT entity
   ************************************************************************** */

  let entity = new NewDSponsorNFT(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddr = event.params.contractAddr
  entity.owner = event.params.owner
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.baseURI = event.params.baseURI
  entity.contractURI = event.params.contractURI
  entity.maxSupply = event.params.maxSupply
  entity.minter = event.params.minter
  entity.forwarder = event.params.forwarder
  entity.royaltyBps = event.params.royaltyBps
  entity.currencies = currencies
  entity.prices = prices
  entity.allowedTokenIds = event.params.allowedTokenIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
