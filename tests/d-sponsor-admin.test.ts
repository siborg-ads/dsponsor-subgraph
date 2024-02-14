import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CallWithProtocolFee } from "../generated/schema"
import { CallWithProtocolFee as CallWithProtocolFeeEvent } from "../generated/DSponsorAdmin/DSponsorAdmin"
import { handleCallWithProtocolFee } from "../src/d-sponsor-admin"
import { createCallWithProtocolFeeEvent } from "./d-sponsor-admin-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let target = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let currency = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let fee = BigInt.fromI32(234)
    let enabler = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let spender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let additionalInformation = "Example string value"
    let newCallWithProtocolFeeEvent = createCallWithProtocolFeeEvent(
      target,
      currency,
      fee,
      enabler,
      spender,
      additionalInformation
    )
    handleCallWithProtocolFee(newCallWithProtocolFeeEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CallWithProtocolFee created and stored", () => {
    assert.entityCount("CallWithProtocolFee", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CallWithProtocolFee",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "target",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CallWithProtocolFee",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "currency",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CallWithProtocolFee",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "fee",
      "234"
    )
    assert.fieldEquals(
      "CallWithProtocolFee",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "enabler",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CallWithProtocolFee",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CallWithProtocolFee",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "additionalInformation",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
