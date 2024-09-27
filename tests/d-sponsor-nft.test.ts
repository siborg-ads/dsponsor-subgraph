import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  logStore,
  createMockedFunction
} from 'matchstick-as/assembly/index'
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
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

    createMockedFunction(nftContractAddress, 'name', 'name():(string)')
      .withArgs([])
      .returns([ethereum.Value.fromString('DSponsorNFT')])
    createMockedFunction(nftContractAddress, 'symbol', 'symbol():(string)')
      .withArgs([])
      .returns([ethereum.Value.fromString('DNFT')])
    createMockedFunction(nftContractAddress, 'baseURI', 'baseURI():(string)')
      .withArgs([])
      .returns([ethereum.Value.fromString('https://mybaseuri.com')])
    createMockedFunction(
      nftContractAddress,
      'contractURI',
      'contractURI():(string)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromString('https://mycontracturi.com')])
    createMockedFunction(
      nftContractAddress,
      'MAX_SUPPLY',
      'MAX_SUPPLY():(uint256)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1000))])
    createMockedFunction(nftContractAddress, 'MINTER', 'MINTER():(address)')
      .withArgs([])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000111')
        )
      ])
    createMockedFunction(
      nftContractAddress,
      'trustedForwarder',
      'trustedForwarder():(address)'
    )
      .withArgs([])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000222')
        )
      ])
    createMockedFunction(nftContractAddress, 'owner', 'owner():(address)')
      .withArgs([])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000333')
        )
      ])
    createMockedFunction(
      nftContractAddress,
      'royaltyInfo',
      'royaltyInfo(uint256,uint256):(address,uint256)'
    )
      .withArgs([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('0')),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('10000'))
      ])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000333')
        ),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1000'))
      ])
    createMockedFunction(
      nftContractAddress,
      'applyTokensAllowlist',
      'applyTokensAllowlist():(bool)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromBoolean(true)])

    createMockedFunction(
      nftContractAddress,
      'totalSupply',
      'totalSupply():(uint256)'
    )
      .withArgs([])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1))])

    createMockedFunction(
      nftContractAddress,
      'tokenByIndex',
      'tokenByIndex(uint256):(uint256)'
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])

    createMockedFunction(
      nftContractAddress,
      'tokenIdIsAllowedToMint',
      'tokenIdIsAllowedToMint(uint256):(bool)'
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])
      .returns([ethereum.Value.fromBoolean(true)])

    createMockedFunction(
      nftContractAddress,
      'ownerOf',
      'ownerOf(uint256):(address)'
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000088')
        )
      ])

    createMockedFunction(
      nftContractAddress,
      'userOf',
      'userOf(uint256):(address)'
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])
      .returns([
        ethereum.Value.fromAddress(
          Address.fromString('0x0000000000000000000000000000000000000089')
        )
      ])

    createMockedFunction(
      nftContractAddress,
      'userExpires',
      'userExpires(uint256):(uint256)'
    )
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])
      .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1111555))])

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

  test('Print store - DSponsorNFT', () => {
    // logStore()
  })
})
