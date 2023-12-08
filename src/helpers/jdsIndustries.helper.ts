import { InkSoftTemplateHeaders } from '.'
import { JDS_INDUSTRIES_IMAGE_URL } from '@/constants'

export const requiredFieldIds = [2, 23, 1, 15, 11, 5]

// InkSoftIdx: JSDIdx
const JdsIndexMap: Record<number, number | string> = {
  1: 0,     // Category(s) - CLASS
  2: 2,     // Product Name (Required) - DESCRIPTION 1
  3: 23,    // Product Description (Required) - LONG DESCRIPTION
  4: 1,     // SKU/Item Number (Required) - ITEM
  5: 1,     // MFG Sku (Required) - ITEM
  6: 15,    // Size (Required) - SIZE
  7: 11,    // Weight (Required) - WEIGHT
  8: 14,    // Color 1 Name (Required) - COLOR
  9: -1,    // Color 2 Name -
  10: 14,   // Todo: Color 1 Hex Value (Required) - 
  11: -1,   // Color 2 Hex Value -
  12: -1,   // Supplier Name (Required) -
  13: -1,   // Manufacturer Name (Required) -
  14: -1,   // Customer Price (Required) -
  15: 5,    // Product Cost (Required) - LESS THAN CASE PRICE
  16: -1,   // GTIN/UPC Code
  17: -1,   // Search Tags
  18: 13,   // Front Image - IMAGE
  19: -1,   // Back Image
  20: -1,   // Third Image
  21: -1,   // Fourth Image
  22: -1,   // Pre-Decorated Item
  23: -1,   // Max Imprint Colors
  24: -1,   // Minimum Per Order
}

export const mapJdsToInksoft = (store: string, JDSList: any[]): any[] => {
  const inkSoftList = []
  for (let i = 0; i < JDSList.length; i++) {
    const productInfo = JDSList[i]
    const converted = []
    for (let j = 0; j < InkSoftTemplateHeaders.length; j++) {
      if (j === 0) {
        // Webstore
        converted.push(store)
      } else if (j === 10) {
        // Todo: Color Hex value
        // const mappingIdx = JdsIndexMap[j];
        converted.push('#FFFFFF')
      } else if (j === 12 || j === 13) {
        // Supplier, Manufacturer Name
        converted.push('JDS')
      } else if (j === 14) {
        // Customer Price
        converted.push(0)
      } else if (j === 18) {
        // Image
        const mappingIdx = JdsIndexMap[j];
        if (!productInfo[mappingIdx]) {
          converted.push('unknown')
        } else {
          converted.push(`${JDS_INDUSTRIES_IMAGE_URL}/${productInfo[mappingIdx]}`)
        }
      } else {
        const mappingIdx = JdsIndexMap[j];
        converted.push(productInfo[mappingIdx] || '')
      }
    }
    inkSoftList.push(converted)
  }
  return inkSoftList
}
