import { log } from 'matchstick-as'
import {
  CallWithProtocolFee as CallWithProtocolFeeEvent,
  FeeUpdate as FeeUpdateEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from '../generated/DSponsorAdmin/DSponsorAdmin'
import {
  CallWithProtocolFee,
  EpochCurrencyRevenue,
  FeeParamsForContract,
  FeeUpdate,
  NftContract,
  OwnershipTransferred,
  RevenueTransaction,
  RoyaltiesSet,
  Token,
  UpdateUser
} from '../generated/schema'
import { Match, RegExp } from 'assemblyscript-regex'
import { Address, BigInt, ByteArray, Bytes } from '@graphprotocol/graph-ts'
import { DSponsorNFT, SetUserCall } from '../generated/DSponsorNFT/DSponsorNFT'

export function handleNewNftContract(nftContractAddress: Address): NftContract {
  let nftContract = new NftContract(nftContractAddress)

  let contract = DSponsorNFT.bind(nftContractAddress)

  let name = contract.try_name()
  if (!name.reverted) {
    nftContract.name = name.value
  }
  let symbol = contract.try_symbol()
  if (!symbol.reverted) {
    nftContract.symbol = symbol.value
  }
  let baseURI = contract.try_baseURI()
  if (!baseURI.reverted) {
    nftContract.baseURI = baseURI.value
  }
  let contractURI = contract.try_contractURI()
  if (!contractURI.reverted) {
    nftContract.contractURI = contractURI.value
  }
  let maxSupply = contract.try_MAX_SUPPLY()
  if (!maxSupply.reverted) {
    nftContract.maxSupply = maxSupply.value
  }
  let minter = contract.try_MINTER()
  if (!minter.reverted) {
    nftContract.minter = minter.value
  }
  let forwarder = contract.try_trustedForwarder()
  if (!forwarder.reverted) {
    nftContract.forwarder = forwarder.value
  }
  let owner = contract.try_owner()
  if (!owner.reverted) {
    nftContract.owner = owner.value
  }
  let royaltyInfo = contract.try_royaltyInfo(
    BigInt.fromI32(0),
    BigInt.fromI32(10000)
  )
  if (!royaltyInfo.reverted) {
    let royalty = new RoyaltiesSet(nftContractAddress)
    royalty.nftContract = nftContract.id
    royalty.receiver = royaltyInfo.value.value0
    royalty.bps = royaltyInfo.value.value1
    royalty.save()
  }
  let allowList = contract.try_applyTokensAllowlist()
  if (!allowList.reverted) {
    nftContract.allowList = allowList.value
  }

  let totalSupply = contract.try_totalSupply()
  if (!totalSupply.reverted) {
    let isEnumerable = contract.try_tokenByIndex(BigInt.fromI32(0))
    if (!isEnumerable.reverted) {
      if (totalSupply.value.lt(BigInt.fromI32(1001))) {
        for (
          let i = BigInt.fromI32(0);
          i.lt(totalSupply.value);
          i = i.plus(BigInt.fromI32(1))
        ) {
          let tokenIdExists = contract.try_tokenByIndex(i)

          if (!tokenIdExists.reverted) {
            let tokenId = tokenIdExists.value
            let token = new Token(
              nftContractAddress
                .toHexString()
                .concat('-')
                .concat(tokenId.toString())
            )
            token.nftContract = nftContract.id
            token.tokenId = tokenId

            let tokenIdIsAllowedToMint =
              contract.try_tokenIdIsAllowedToMint(tokenId)
            if (!tokenIdIsAllowedToMint.reverted) {
              token.setInAllowList = tokenIdIsAllowedToMint.value
            }

            let owner = contract.try_ownerOf(tokenId)
            if (!owner.reverted) {
              token.owner = owner.value
            }

            let user = contract.try_userOf(tokenId)
            let expires = contract.try_userExpires(tokenId)
            if (
              !user.reverted &&
              !expires.reverted &&
              user.value !=
                Address.fromString('0x0000000000000000000000000000000000000000')
            ) {
              let userEntity = new UpdateUser(
                nftContractAddress.concat(Bytes.fromUTF8(tokenId.toString()))
              )
              userEntity.nftContract = nftContract.id
              userEntity.tokenId = tokenId
              userEntity.user = user.value
              userEntity.expires = expires.value
              userEntity.save()
            }

            token.save()
          }
        }
      }
    }
  }

  nftContract.save()
  return nftContract
}

export function handleCallWithProtocolFee(
  event: CallWithProtocolFeeEvent
): void {
  /**************************************************************************
   * EpochCurrencyRevenue entity
   ************************************************************************** */
  let currency = event.params.currency
  let feeAmount = event.params.feeAmount
  let date = new Date(event.block.timestamp.toI64() * 1000)
  let year = date.getUTCFullYear()
  let month = date.getUTCMonth() + 1 // getUTCMonth() returns month from 0-11
  let formattedMonth = month < 10 ? '0' + month.toString() : month.toString()
  let epochID =
    year.toString() + '-' + formattedMonth + '-' + currency.toHexString()

  let epochCurrencyRevenue = EpochCurrencyRevenue.load(epochID)
  if (epochCurrencyRevenue == null) {
    epochCurrencyRevenue = EpochCurrencyRevenue.loadInBlock(epochID)
  }
  if (epochCurrencyRevenue == null) {
    epochCurrencyRevenue = new EpochCurrencyRevenue(epochID)
    epochCurrencyRevenue.year = year
    epochCurrencyRevenue.month = month
    epochCurrencyRevenue.currency = currency
    epochCurrencyRevenue.totalAmount = new BigInt(0)
  }

  let totalAmount = epochCurrencyRevenue.totalAmount
  epochCurrencyRevenue.totalAmount = totalAmount.plus(feeAmount)
  epochCurrencyRevenue.save()

  /**************************************************************************
   * CallWithProtocolFee entity
   ************************************************************************** */

  let id = event.transaction.hash.concatI32(event.logIndex.toI32())
  let entity = new CallWithProtocolFee(id)

  entity.target = event.params.origin
  entity.currency = event.params.currency
  entity.fee = event.params.feeAmount
  entity.enabler = event.params.enabler
  entity.spender = event.params.spender
  entity.referralAdditionalInformation = event.params.additionalInformation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  ////////

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

  let refData = event.params.additionalInformation
  let refAddresses: Bytes[] = []
  let regex = new RegExp('0x[a-fA-F0-9]{40}', 'g')
  let match: Match | null = regex.exec(refData)
  while (match != null) {
    let addr = match.matches[0]
    refAddresses.push(Bytes.fromHexString(addr))
    match = regex.exec(refData)
  }
  if (refAddresses.length == 0) {
    // if no referral, DCAST DAO as referral
    let daoAddr: string = '0x5b15Cbb40Ef056F74130F0e6A1e6FD183b14Cdaf'
    refAddresses.push(Bytes.fromHexString(daoAddr))
  }
  let refShare =
    refAddresses.length > 0
      ? ((100 / (3 * refAddresses.length)) as i32) // truncate %
      : 0
  entity.referralAddresses = refAddresses
  entity.referralUnitShare = refShare
  entity.referralNb = refAddresses.length

  entity.epochCurrencyRevenue = epochCurrencyRevenue.id

  entity.save()
}

export function handleFeeUpdate(event: FeeUpdateEvent): void {
  /**************************************************************************
   * FeeParamsForContract entity
   ************************************************************************** */

  let smartcontractAddr = event.address

  let feeParamsForContract = FeeParamsForContract.load(smartcontractAddr)
  if (feeParamsForContract == null) {
    feeParamsForContract = FeeParamsForContract.loadInBlock(smartcontractAddr)
  }
  if (feeParamsForContract == null) {
    feeParamsForContract = new FeeParamsForContract(smartcontractAddr)
  }

  feeParamsForContract.feeRecipient = event.params.recipient
  feeParamsForContract.feeBps = event.params.bps
  feeParamsForContract.lastUpdateTimestamp = event.block.timestamp
  feeParamsForContract.save()

  /**************************************************************************
   * FeeUpdate entity
   ************************************************************************** */

  let entity = new FeeUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeRecipient = event.params.recipient
  entity.feeBps = event.params.bps

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let contractAddress = event.address

  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contractAddress = event.address
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
