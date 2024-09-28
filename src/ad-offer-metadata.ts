import {
  BigInt,
  Bytes,
  dataSource,
  json,
  JSONValue,
  JSONValueKind
} from '@graphprotocol/graph-ts'

import { AdOfferMetadata } from '../generated/schema'

import { JSONStringifyValue } from './common'
import { log } from 'matchstick-as'

export function handleAdOfferMetadata(content: Bytes): void {
  let adOfferMetadata = new AdOfferMetadata(dataSource.stringParam())
  const JSON = json.try_fromBytes(content)

  if (JSON.isOk && JSON.value.isNull() == false) {
    adOfferMetadata.content = JSONStringifyValue(JSON.value)

    if (JSON.value.kind == JSONValueKind.OBJECT) {
      let valueObject = JSON.value.toObject()
      let creatorDataValue = valueObject.get('creator')

      if (
        creatorDataValue &&
        creatorDataValue.isNull() == false &&
        creatorDataValue.kind == JSONValueKind.OBJECT
      ) {
        let creatorDataObject = creatorDataValue.toObject()
        let creatorNameValue = creatorDataObject.get('name')
        if (
          creatorNameValue &&
          creatorNameValue.isNull() == false &&
          creatorNameValue.kind == JSONValueKind.STRING
        ) {
          adOfferMetadata.creator_name = creatorNameValue.toString()
        }
        let createDescriptionValue = creatorDataObject.get('description')
        if (
          createDescriptionValue &&
          createDescriptionValue.isNull() == false &&
          createDescriptionValue.kind == JSONValueKind.STRING
        ) {
          adOfferMetadata.creator_description =
            createDescriptionValue.toString()
        }
        let creatorImageValue = creatorDataObject.get('image')
        if (
          creatorImageValue &&
          creatorImageValue.isNull() == false &&
          creatorImageValue.kind == JSONValueKind.STRING
        ) {
          adOfferMetadata.creator_image = creatorImageValue.toString()
        }
        let creatorCategoriesValue = creatorDataObject.get('categories')
        if (
          creatorCategoriesValue &&
          creatorCategoriesValue.isNull() == false &&
          creatorCategoriesValue.kind == JSONValueKind.ARRAY
        ) {
          adOfferMetadata.creator_categories = creatorCategoriesValue
            .toArray()
            .map<string>((value: JSONValue) => JSONStringifyValue(value))
        }
      }
      let offerData = valueObject.get('offer')
      if (
        offerData &&
        offerData.isNull() == false &&
        offerData.kind == JSONValueKind.OBJECT
      ) {
        let offerDataObject = offerData.toObject()

        let offerNameValue = offerDataObject.get('name')
        if (
          offerNameValue &&
          offerNameValue.isNull() == false &&
          offerNameValue.kind == JSONValueKind.STRING
        ) {
          adOfferMetadata.offer_name = offerNameValue.toString()
        }
        let offerDescriptionValue = offerDataObject.get('description')
        if (
          offerDescriptionValue &&
          offerDescriptionValue.isNull() == false &&
          offerDescriptionValue.kind == JSONValueKind.STRING
        ) {
          adOfferMetadata.offer_description = offerDescriptionValue.toString()
        }
        let offerImageValue = offerDataObject.get('image')
        if (
          offerImageValue &&
          offerImageValue.isNull() == false &&
          offerImageValue.kind == JSONValueKind.STRING
        ) {
          adOfferMetadata.offer_image = offerImageValue.toString()
        }
        let offerTermsValue = offerDataObject.get('terms')
        if (
          offerTermsValue &&
          offerTermsValue.isNull() == false &&
          offerTermsValue.kind == JSONValueKind.STRING
        ) {
          adOfferMetadata.offer_terms = offerTermsValue.toString()
        }
        let offerCategoriesValue = offerDataObject.get('categories')
        if (
          offerCategoriesValue &&
          offerCategoriesValue.isNull() == false &&
          offerCategoriesValue.kind == JSONValueKind.ARRAY
        ) {
          adOfferMetadata.offer_categories = offerCategoriesValue
            .toArray()
            .map<string>((value: JSONValue) => JSONStringifyValue(value))
        }
        let offerVisibilityValue = offerDataObject.get('visibility')
        if (
          offerVisibilityValue &&
          offerVisibilityValue.isNull() == false &&
          offerVisibilityValue.kind == JSONValueKind.OBJECT
        ) {
          let offerVisibilityObject = offerVisibilityValue.toObject()
          let offerVisibilityInterfacesValue =
            offerVisibilityObject.get('interfaces')
          if (
            offerVisibilityInterfacesValue &&
            offerVisibilityInterfacesValue.isNull() == false &&
            offerVisibilityInterfacesValue.kind == JSONValueKind.ARRAY
          ) {
            adOfferMetadata.offer_visibility_interfaces =
              offerVisibilityInterfacesValue
                .toArray()
                .map<string>((value: JSONValue) => JSONStringifyValue(value))
          }
          let offerVisibilityTargetsValue = offerVisibilityObject.get('targets')
          if (
            offerVisibilityTargetsValue &&
            offerVisibilityTargetsValue.isNull() == false &&
            offerVisibilityTargetsValue.kind == JSONValueKind.ARRAY
          ) {
            adOfferMetadata.offer_visibility_targets =
              offerVisibilityTargetsValue
                .toArray()
                .map<string>((value: JSONValue) => JSONStringifyValue(value))
          }
        }
        let offerValidFromValue = offerDataObject.get('valid_from')
        if (
          offerValidFromValue &&
          offerValidFromValue.isNull() == false &&
          offerValidFromValue.kind == JSONValueKind.STRING
        ) {
          let date = Date.parse(offerValidFromValue.toString())
          let time = date.getTime()
          if (time > 0) {
            adOfferMetadata.offer_validFrom = BigInt.fromI64(time)
          }
        }
        let offerValidToValue = offerDataObject.get('valid_to')
        if (
          offerValidToValue &&
          offerValidToValue.isNull() == false &&
          offerValidToValue.kind == JSONValueKind.STRING
        ) {
          let date = Date.parse(offerValidToValue.toString())
          let time = date.getTime()
          if (time > 0) {
            adOfferMetadata.offer_validTo = BigInt.fromI64(time)
          }
        }
        let tokenMetadataValue = offerDataObject.get('token_metadata')
        if (tokenMetadataValue && tokenMetadataValue.isNull() == false) {
          adOfferMetadata.offer_token_metadataContent =
            JSONStringifyValue(tokenMetadataValue)
        }
      }
    }
  }
  adOfferMetadata.save()
}
