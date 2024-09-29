import { log } from 'matchstick-as'
import {
  // Approval as ApprovalEvent,
  // ApprovalForAll as ApprovalForAllEvent,
  ContractURIUpdated as ContractURIUpdatedEvent,
  DSponsorNFT,
  // Initialized as InitializedEvent,
  Mint as MintEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RoyaltySet as RoyaltiesSetEvent,
  TokensAllowlist as TokensAllowlistEvent,
  TokensAllowlistUpdated as TokensAllowlistUpdatedEvent,
  Transfer as TransferEvent,
  UpdateDefaultMintPrice as UpdateDefaultMintPriceEvent,
  UpdateMintPrice as UpdateMintPriceEvent,
  UpdateUser as UpdateUserEvent
} from '../generated/DSponsorNFT/DSponsorNFT'
import {
  // Approval,
  // ApprovalForAll,
  ContractURIUpdated,
  FeeParamsForContract,
  // Initialized,
  Mint,
  NftContract,
  NftPrice,
  OwnershipTransferred,
  RevenueTransaction,
  RoyaltiesSet,
  Token,
  TokenPrice,
  TokensAllowlist,
  TokensAllowlistUpdated,
  Transfer,
  UpdateDefaultMintPrice,
  UpdateMintPrice,
  UpdateUser
} from '../generated/schema'
import { NftContractMetadata as NftContractMetadataTemplate } from '../generated/templates'
import { BigInt } from '@graphprotocol/graph-ts'
import { handleNewNftContract } from './common'

const FEE_METHODOLOGY = 'ADDED_TO_AMOUNT' // ADDED_TO_AMOUNT

/*
export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
*/

export function handleContractURIUpdated(event: ContractURIUpdatedEvent): void {
  /**************************************************************************
   * NftContract entity
   ************************************************************************** */

  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract != null) {
    let contractURI = event.params.contractURI

    if (contractURI.length && nftContract.contractURI != contractURI) {
      nftContract.contractURI = event.params.contractURI

      let ipfsHash = ''

      let ipfsParsing = contractURI.split('ipfs://')
      if (ipfsParsing.length == 2) {
        ipfsHash = ipfsParsing[1]
      }

      let httpParsing = contractURI.split('/ipfs/')
      if (httpParsing.length == 2) {
        ipfsHash = httpParsing[1]
      }

      if (ipfsHash.length > 0) {
        if (ipfsHash.endsWith('/')) {
          ipfsHash = ipfsHash.slice(0, -1)
        }
        nftContract.metadata = ipfsHash
        NftContractMetadataTemplate.create(ipfsHash)
      }
    }

    nftContract.save()

    /**************************************************************************
     * ContractURIUpdated entity
     ************************************************************************** */

    let entity = new ContractURIUpdated(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    entity.nftContract = nftContract.id

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

/*
export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
*/

export function handleMint(event: MintEvent): void {
  let entity = new Mint(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  /**************************************************************************
   * Token entity
   ************************************************************************** */
  let tokenId = event.params.tokenId
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract != null) {
    let tokenEntityId = nftContractAddress
      .toHexString()
      .concat('-')
      .concat(tokenId.toString())
    let token = Token.load(tokenEntityId)
    if (token == null) {
      token = Token.loadInBlock(tokenEntityId)
      if (token == null) {
        token = new Token(tokenEntityId)
        token.nftContract = nftContractAddress
        token.tokenId = tokenId
        token.setInAllowList = false
      }
    }

    token.mint = entity.id

    token.save()

    /**************************************************************************
     * Mint entity
     ************************************************************************** */

    // revenue tx

    let transactionHash = event.transaction.hash
    let revenueTransaction = RevenueTransaction.load(transactionHash)
    if (revenueTransaction == null) {
      revenueTransaction = RevenueTransaction.loadInBlock(transactionHash)
    }
    if (revenueTransaction == null) {
      revenueTransaction = new RevenueTransaction(transactionHash)
      revenueTransaction.blockTimestamp = event.block.timestamp
      revenueTransaction.save()
    }
    entity.revenueTransaction = revenueTransaction.id

    // compute fees, amounts
    const minterAddr = event.params.from // DSponsorAdmin contract

    let feeParamsForContract = FeeParamsForContract.load(minterAddr)
    if (feeParamsForContract == null) {
      feeParamsForContract = FeeParamsForContract.loadInBlock(minterAddr)
    }
    if (feeParamsForContract != null) {
      let amountSentToSeller = event.params.amount
      let feeBps = feeParamsForContract.feeBps
      let feeMethodology = FEE_METHODOLOGY // ADD_TO_AMOUNT
      let amountSentToProtocol = amountSentToSeller
        .times(feeBps)
        .div(BigInt.fromI32(10000))

      entity.feeMethodology = feeMethodology
      entity.amountSentToProtocol = amountSentToProtocol
      entity.protocolRecipient = feeParamsForContract.feeRecipient
      entity.totalPaid = amountSentToProtocol.plus(amountSentToSeller)
    }

    entity.nftContract = nftContract.id
    entity.token = token.id

    // from event payload
    entity.tokenId = event.params.tokenId
    entity.from = event.params.from
    entity.to = event.params.to
    entity.currency = event.params.currency
    entity.amount = event.params.amount
    entity.tokenData = event.params.tokenData

    // hard fixes

    if (
      entity.tokenId ==
      BigInt.fromString(
        '84804459743585640999492341093635394304172261892188928833175833963721084538597'
      )
    ) {
      entity.tokenData = 'liquidity'
    } else if (
      entity.tokenId ==
      BigInt.fromString(
        '70622639689279718371527342103894932928233838121221666359043189029713682937432'
      )
    ) {
      entity.tokenData = 'test'
    }

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  /**************************************************************************
   * NftContract entity
   ************************************************************************** */

  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract != null) {
    nftContract.owner = event.params.newOwner
    nftContract.save()

    /**************************************************************************
     * OwnershipTransferred entity
     ************************************************************************** */

    let entity = new OwnershipTransferred(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    entity.contractAddress = nftContractAddress
    entity.previousOwner = event.params.previousOwner
    entity.newOwner = event.params.newOwner

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

export function handleRoyaltiesSet(event: RoyaltiesSetEvent): void {
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract != null) {
    /**************************************************************************
     * RoyaltiesSet entity
     ************************************************************************** */
    let entity = new RoyaltiesSet(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )

    entity.nftContract = nftContract.id
    entity.receiver = event.params.receiver
    entity.bps = event.params.bps

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
    ////////

    nftContract.royalty = entity.id
    nftContract.save()
  }
}

export function handleTokensAllowlist(event: TokensAllowlistEvent): void {
  /**************************************************************************
   * NftContract entity
   ************************************************************************** */

  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract != null) {
    nftContract.allowList = event.params.allowed
    nftContract.save()

    /**************************************************************************
     * TokensAllowlist entity
     ************************************************************************** */

    let entity = new TokensAllowlist(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )

    entity.nftContract = nftContract.id

    entity.allowed = event.params.allowed

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

export function handleTokensAllowlistUpdated(
  event: TokensAllowlistUpdatedEvent
): void {
  /**************************************************************************
   * Token entity
   ************************************************************************** */
  let tokenId = event.params.tokenId
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract == null) {
    nftContract = handleNewNftContract(nftContractAddress)
  }

  if (nftContract != null) {
    let tokenEntityId = nftContractAddress
      .toHexString()
      .concat('-')
      .concat(tokenId.toString())
    let allowed = event.params.allowed

    let token = Token.load(tokenEntityId)
    if (token == null) {
      token = Token.loadInBlock(tokenEntityId)
      if (token == null) {
        token = new Token(tokenEntityId)
        token.nftContract = nftContractAddress
        token.tokenId = tokenId
      }
    }

    token.setInAllowList = allowed
    token.save()

    /**************************************************************************
     * TokensAllowlistUpdated entity
     ************************************************************************** */

    let entity = new TokensAllowlistUpdated(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )

    entity.nftContract = nftContract.id
    entity.token = token.id

    entity.tokenId = event.params.tokenId
    entity.allowed = event.params.allowed

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

export function handleTransfer(event: TransferEvent): void {
  /**************************************************************************
   * Token entity
   ************************************************************************** */
  let tokenId = event.params.tokenId
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract != null) {
    let tokenEntityId = nftContractAddress
      .toHexString()
      .concat('-')
      .concat(tokenId.toString())

    let token = Token.load(tokenEntityId)
    if (token == null) {
      token = Token.loadInBlock(tokenEntityId)
      if (token == null) {
        token = new Token(tokenEntityId)
        token.nftContract = nftContractAddress
        token.tokenId = tokenId
        token.setInAllowList = true
      }
    }

    token.owner = event.params.to
    token.save()

    /**************************************************************************
     * Transfer entity
     ************************************************************************** */

    let entity = new Transfer(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    entity.nftContract = nftContract.id
    entity.token = token.id

    entity.from = event.params.from
    entity.to = event.params.to
    entity.tokenId = event.params.tokenId

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

export function handleUpdateDefaultMintPrice(
  event: UpdateDefaultMintPriceEvent
): void {
  /**************************************************************************
   * Price entity
   ************************************************************************** */

  let currency = event.params.currency
  let enabled = event.params.enabled
  let amount = event.params.amount
  let nftContractAddress = event.address

  let nftContract = NftContract.load(nftContractAddress)

  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract == null) {
    nftContract = handleNewNftContract(nftContractAddress)
  }

  if (nftContract != null) {
    let priceId = nftContractAddress
      .toHexString()
      .concat('-')
      .concat(currency.toHexString())
      .concat('-all')

    let price = NftPrice.load(priceId)

    if (price == null) {
      price = NftPrice.loadInBlock(priceId)
    }

    if (price == null) {
      price = new NftPrice(priceId)
      price.nftContract = nftContractAddress
      price.currency = currency
    }

    price.amount = amount
    price.enabled = enabled
    price.save()

    /**************************************************************************
     * UpdateDefaultMintPrice entities
     ************************************************************************** */

    let entity = new UpdateDefaultMintPrice(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )

    entity.nftContract = nftContract.id

    entity.currency = event.params.currency
    entity.enabled = event.params.enabled
    entity.amount = event.params.amount

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

export function handleUpdateMintPrice(event: UpdateMintPriceEvent): void {
  /**************************************************************************
   * Price entity
   ************************************************************************** */

  let currency = event.params.currency
  let enabled = event.params.enabled
  let amount = event.params.amount
  let nftContractAddress = event.address
  let tokenId = event.params.tokenId

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }
  if (nftContract != null) {
    let token = Token.load(
      nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
    )

    if (token == null) {
      token = Token.loadInBlock(
        nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
      )
    }

    if (token == null) {
      token = new Token(
        nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
      )
      token.nftContract = nftContractAddress
      token.tokenId = tokenId
      token.setInAllowList = false
      token.save()
    }

    let priceId = nftContractAddress
      .toHexString()
      .concat('-')
      .concat(currency.toHexString())
      .concat('-')
      .concat(tokenId.toString())

    let price = TokenPrice.load(priceId)

    if (price == null) {
      price = TokenPrice.loadInBlock(priceId)
    }

    if (price == null) {
      price = new TokenPrice(priceId)
      price.token = token.id // nftAddress-tokenId
      price.currency = currency
    }

    price.amount = amount
    price.enabled = enabled
    price.save()

    /**************************************************************************
     * UpdateDefaultMintPrice entities
     ************************************************************************** */

    let entity = new UpdateMintPrice(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )

    entity.nftContract = nftContract.id

    entity.tokenId = event.params.tokenId
    entity.currency = event.params.currency
    entity.enabled = event.params.enabled
    entity.amount = event.params.amount

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

export function handleUpdateUser(event: UpdateUserEvent): void {
  let nftContractAddress = event.address

  /**************************************************************************
   * Token entity
   ************************************************************************** */

  let tokenId = event.params.tokenId

  let nftContract = NftContract.load(nftContractAddress)
  if (nftContract == null) {
    nftContract = NftContract.loadInBlock(nftContractAddress)
  }

  if (nftContract != null) {
    /**************************************************************************
     * UpdateUser entity
     ************************************************************************** */

    let entity = new UpdateUser(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )

    entity.nftContract = nftContract.id

    entity.tokenId = event.params.tokenId
    entity.user = event.params.user
    entity.expires = event.params.expires

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()

    /**************************************************************************
     * Token entity
     ************************************************************************** */

    let token = Token.load(
      nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
    )

    if (token == null) {
      token = Token.loadInBlock(
        nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
      )
    }

    if (token == null) {
      token = new Token(
        nftContractAddress.toHexString().concat('-').concat(tokenId.toString())
      )
      token.nftContract = nftContractAddress
      token.tokenId = tokenId
      token.setInAllowList = false
    }

    token.user = entity.id

    token.save()
  }
}
