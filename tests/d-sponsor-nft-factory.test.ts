import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from 'matchstick-as/assembly/index'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { NewDSponsorNFT } from '../generated/schema'
import { NewDSponsorNFT as NewDSponsorNFTEvent } from '../generated/DSponsorNFTFactory/DSponsorNFTFactory'
import { handleNewDSponsorNFT } from '../src/d-sponsor-nft-factory'
import { createNewDSponsorNFTEvent } from './d-sponsor-nft-factory-utils'

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    let contractAddr = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    )
    let owner = Address.fromString('0x0000000000000000000000000000000000000001')
    let name = 'Example string value'
    let symbol = 'Example string value'
    let baseURI = 'Example string value'
    let contractURI = 'Example string value'
    let maxSupply = BigInt.fromI32(234)
    let minter = Address.fromString(
      '0x0000000000000000000000000000000000000002'
    )
    let forwarder = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    )
    let royaltyBps = BigInt.fromI32(234)
    let currencies = [
      Address.fromString('0x0000000000000000000000000000000000000001')
    ]
    let prices = [BigInt.fromI32(234)]
    let allowedTokenIds = [BigInt.fromI32(234)]
    let newNewDSponsorNFTEvent = createNewDSponsorNFTEvent(
      contractAddr,
      owner,
      name,
      symbol,
      baseURI,
      contractURI,
      minter,
      maxSupply,
      forwarder,
      royaltyBps,
      currencies,
      prices,
      allowedTokenIds
    )
    handleNewDSponsorNFT(newNewDSponsorNFTEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test('NewDSponsorNFT created and stored', () => {
    assert.entityCount('NewDSponsorNFT', 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'contractAddr',
      '0x0000000000000000000000000000000000000001'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'owner',
      '0x0000000000000000000000000000000000000001'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'name',
      'Example string value'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'symbol',
      'Example string value'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'baseURI',
      'Example string value'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'contractURI',
      'Example string value'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'maxSupply',
      '234'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'forwarder',
      '0x0000000000000000000000000000000000000001'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'royaltyBps',
      '234'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'currencies',
      '[0x0000000000000000000000000000000000000001]'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'prices',
      '[234]'
    )
    assert.fieldEquals(
      'NewDSponsorNFT',
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000',
      'allowedTokenIds',
      '[234]'
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
