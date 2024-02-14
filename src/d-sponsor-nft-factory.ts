import { Address, Value } from '@graphprotocol/graph-ts'
import { NewDSponsorNFT as NewDSponsorNFTEvent } from '../generated/DSponsorNFTFactory/DSponsorNFTFactory'
import { NewDSponsorNFT } from '../generated/schema'

export function handleNewDSponsorNFT(event: NewDSponsorNFTEvent): void {
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
  entity.forwarder = event.params.forwarder
  entity.royaltyBps = event.params.royaltyBps
  entity.currencies = Value.fromAddressArray(
    event.params.currencies
  ).toBytesArray()
  entity.prices = event.params.prices
  entity.allowedTokenIds = event.params.allowedTokenIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
