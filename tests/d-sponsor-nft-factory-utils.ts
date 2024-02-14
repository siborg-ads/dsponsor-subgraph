import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { NewDSponsorNFT } from "../generated/DSponsorNFTFactory/DSponsorNFTFactory"

export function createNewDSponsorNFTEvent(
  contractAddr: Address,
  owner: Address,
  name: string,
  symbol: string,
  baseURI: string,
  contractURI: string,
  maxSupply: BigInt,
  forwarder: Address,
  royaltyBps: BigInt,
  currencies: Array<Address>,
  prices: Array<BigInt>,
  allowedTokenIds: Array<BigInt>
): NewDSponsorNFT {
  let newDSponsorNftEvent = changetype<NewDSponsorNFT>(newMockEvent())

  newDSponsorNftEvent.parameters = new Array()

  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddr",
      ethereum.Value.fromAddress(contractAddr)
    )
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam("baseURI", ethereum.Value.fromString(baseURI))
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam(
      "contractURI",
      ethereum.Value.fromString(contractURI)
    )
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam(
      "maxSupply",
      ethereum.Value.fromUnsignedBigInt(maxSupply)
    )
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam("forwarder", ethereum.Value.fromAddress(forwarder))
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam(
      "royaltyBps",
      ethereum.Value.fromUnsignedBigInt(royaltyBps)
    )
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam(
      "currencies",
      ethereum.Value.fromAddressArray(currencies)
    )
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam(
      "prices",
      ethereum.Value.fromUnsignedBigIntArray(prices)
    )
  )
  newDSponsorNftEvent.parameters.push(
    new ethereum.EventParam(
      "allowedTokenIds",
      ethereum.Value.fromUnsignedBigIntArray(allowedTokenIds)
    )
  )

  return newDSponsorNftEvent
}
