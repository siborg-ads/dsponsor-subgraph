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
  createTokensAllowlistEvent,
  createTokensAllowlistUpdatedEvent,
  createUpdateDefaultMintPriceEvent,
  createUpdateMintPriceEvent,
  createUpdateUserEvent
} from './d-sponsor-nft-utils'
import {
  handleContractURIUpdated,
  handleMint,
  handleOwnershipTransferred,
  handleTokensAllowlist,
  handleTokensAllowlistUpdated,
  handleUpdateDefaultMintPrice,
  handleUpdateMintPrice,
  handleUpdateUser
} from '../src/d-sponsor-nft'
import { handleNewDSponsorNFT } from '../src/d-sponsor-nft-factory'
import { createNewDSponsorNFTEvent } from './d-sponsor-nft-factory-utils'

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

    handleNewDSponsorNFT(
      createNewDSponsorNFTEvent(
        nftContractAddress,
        Address.fromString('0x0000000000000000000000000000000000000001'), // owner
        'DSponsorNFT',
        'DSNFT',
        'https://api.dsponsor.io/nft/{id}',
        'http://metadata.dsponsor.io/nft',
        Address.fromString('0x0000000000000000000000000000000000000002'), // minter
        BigInt.fromI32(1000000), // maxSupply
        Address.fromString('0x0000000000000000000000000000000000000003'), // forwarder
        BigInt.fromI32(1000), // 10% royalty fee
        [currency1, currency2],
        [amount1, amount2],
        []
      )
    )

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
