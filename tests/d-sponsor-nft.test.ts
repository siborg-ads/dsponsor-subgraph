import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  logStore
} from 'matchstick-as/assembly/index'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  createContractURIUpdatedEvent,
  createMintEvent,
  createOwnershipTransferredEvent,
  createRoyaltiesSetEvent,
  createTokensAllowlistEvent,
  createTokensAllowlistUpdatedEvent,
  createTransferEvent,
  createUpdateDefaultMintPriceEvent,
  createUpdateMintPriceEvent,
  createUpdateUserEvent
} from './d-sponsor-nft-utils'
import {
  handleContractURIUpdated,
  handleMint,
  handleOwnershipTransferred,
  handleRoyaltiesSet,
  handleTokensAllowlist,
  handleTokensAllowlistUpdated,
  handleTransfer,
  handleUpdateDefaultMintPrice,
  handleUpdateMintPrice,
  handleUpdateUser
} from '../src/d-sponsor-nft'

describe('Describe entity assertions', () => {
  beforeAll(() => {
    const nftContractAddress = Address.fromString(
      '0xa16081f360e3847006db660bae1c6d1b2e17ec2a'
    )
    const tokenId = BigInt.fromI32(0)
    const currency1 = Address.fromString(
      '0x0000000000000000000000000000000000000081'
    )
    const amount1 = BigInt.fromI32(100)
    const currency2 = Address.fromString(
      '0x0000000000000000000000000000000000000082'
    )
    const amount2 = BigInt.fromI32(200)

    handleMint(
      createMintEvent(
        tokenId,
        Address.fromString('0x0000000000000000000000000000000000000000'), // from
        Address.fromString('0x0000000000000000000000000000000000000001'), // to
        currency1,
        amount1,
        'tokenData'
      )
    )

    handleOwnershipTransferred(
      createOwnershipTransferredEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // previousOwner
        Address.fromString('0x0000000000000000000000000000000000000002') // newOwner
      )
    )

    handleRoyaltiesSet(
      createRoyaltiesSetEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // recipient
        BigInt.fromI32(1000) // bps (10%)
      )
    )

    handleTokensAllowlist(createTokensAllowlistEvent(true))

    handleTokensAllowlistUpdated(
      createTokensAllowlistUpdatedEvent(tokenId, true)
    )

    handleUpdateDefaultMintPrice(
      createUpdateDefaultMintPriceEvent(currency2, true, amount2)
    )

    handleUpdateMintPrice(
      createUpdateMintPriceEvent(tokenId, currency2, true, amount2)
    )

    handleUpdateUser(
      createUpdateUserEvent(
        tokenId,
        Address.fromString('0x0000000000000000000000000000000000000003'), // user
        BigInt.fromI32(1111555) // expires
      )
    )

    handleTransfer(
      createTransferEvent(
        Address.fromString('0x0000000000000000000000000000000000000001'), // previousOwner
        Address.fromString('0x0000000000000000000000000000000000000002'), // newOwner
        tokenId
      )
    )

    handleContractURIUpdated(
      createContractURIUpdatedEvent('http://contractURI')
    )
  })

  afterAll(() => {
    clearStore()
  })

  test('Print store - DSSponsorNFT', () => {
    // logStore()
  })
})
