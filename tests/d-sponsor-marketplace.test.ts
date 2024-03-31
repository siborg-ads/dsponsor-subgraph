import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AcceptedOffer } from "../generated/schema"
import { AcceptedOffer as AcceptedOfferEvent } from "../generated/DSponsorMarketplace/DSponsorMarketplace"
import { handleAcceptedOffer } from "../src/d-sponsor-marketplace"
import { createAcceptedOfferEvent } from "./d-sponsor-marketplace-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let offeror = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let offerId = BigInt.fromI32(234)
    let assetContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenId = BigInt.fromI32(234)
    let seller = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let quantityBought = BigInt.fromI32(234)
    let totalPricePaid = BigInt.fromI32(234)
    let newAcceptedOfferEvent = createAcceptedOfferEvent(
      offeror,
      offerId,
      assetContract,
      tokenId,
      seller,
      quantityBought,
      totalPricePaid
    )
    handleAcceptedOffer(newAcceptedOfferEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AcceptedOffer created and stored", () => {
    assert.entityCount("AcceptedOffer", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AcceptedOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "offeror",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AcceptedOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "offerId",
      "234"
    )
    assert.fieldEquals(
      "AcceptedOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assetContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AcceptedOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "AcceptedOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "seller",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AcceptedOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "quantityBought",
      "234"
    )
    assert.fieldEquals(
      "AcceptedOffer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalPricePaid",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
