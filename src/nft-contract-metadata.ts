import { NftContractMetadata } from '../generated/schema'

import { Bytes, dataSource, json, JSONValueKind } from '@graphprotocol/graph-ts'
import { JSONStringifyValue } from './common'
import { RegExp } from 'assemblyscript-regex'
import { log } from 'matchstick-as'

export function handleNftContractMetadata(content: Bytes): void {
  let nftContractMetadata = new NftContractMetadata(dataSource.stringParam())
  const JSON = json.try_fromBytes(content)

  if (JSON.isOk && JSON.value.isNull() == false) {
    nftContractMetadata.content = JSONStringifyValue(JSON.value)

    if (JSON.value.kind == JSONValueKind.OBJECT) {
      let valueObject = JSON.value.toObject()

      let name = valueObject.get('name')
      if (name && name.isNull() == false && name.kind == JSONValueKind.STRING) {
        nftContractMetadata.name = name.toString()
      }
      let description = valueObject.get('description')
      if (
        description &&
        description.isNull() == false &&
        description.kind == JSONValueKind.STRING
      ) {
        nftContractMetadata.description = description.toString()
      }
      let image = valueObject.get('image')
      if (
        image &&
        image.isNull() == false &&
        image.kind == JSONValueKind.STRING
      ) {
        nftContractMetadata.image = image.toString()
      }
      let external_url = valueObject.get('external_url')
      if (
        external_url &&
        external_url.isNull() == false &&
        external_url.kind == JSONValueKind.STRING
      ) {
        nftContractMetadata.external_url = external_url.toString()
      }
      let external_link = valueObject.get('external_link')
      if (
        external_link &&
        external_link.isNull() == false &&
        external_link.kind == JSONValueKind.STRING
      ) {
        nftContractMetadata.external_link = external_link.toString()
      }
      let collaboratorsValue = valueObject.get('collaborators')
      if (
        collaboratorsValue &&
        collaboratorsValue.kind == JSONValueKind.ARRAY
      ) {
        nftContractMetadata.collaborators = collaboratorsValue
          .toArray()
          .map<Bytes>((value) => {
            let res = Bytes.fromHexString('')
            let ethAddressRegex = new RegExp('^0x[0-9A-Fa-f]{40}$')
            if (
              value.kind == JSONValueKind.STRING &&
              ethAddressRegex.test(value.toString())
            ) {
              res = Bytes.fromHexString(value.toString())
            }
            return res
          })
          .filter((value) => {
            return value != Bytes.fromHexString('')
          })
      }
    }
  }
  nftContractMetadata.save()
}
