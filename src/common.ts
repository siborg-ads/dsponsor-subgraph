import { log } from 'matchstick-as'
import {
  CallWithProtocolFee as CallWithProtocolFeeEvent,
  FeeUpdate as FeeUpdateEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from '../generated/DSponsorAdmin/DSponsorAdmin'
import {
  CallWithProtocolFee,
  FeeUpdate,
  OwnershipTransferred
} from '../generated/schema'

export function handleCallWithProtocolFee(
  event: CallWithProtocolFeeEvent
): void {
  let id = event.transaction.hash.concatI32(event.logIndex.toI32())
  let entity = new CallWithProtocolFee(id)

  entity.target = event.params.origin
  entity.currency = event.params.currency
  entity.fee = event.params.feeAmount
  entity.enabler = event.params.enabler
  entity.spender = event.params.spender
  entity.additionalInformation = event.params.additionalInformation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeeUpdate(event: FeeUpdateEvent): void {
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
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
