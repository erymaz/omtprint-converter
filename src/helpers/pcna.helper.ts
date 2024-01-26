import { InkSoftTemplateHeaders } from '.'

export const pcnaRequiredFieldIds = [2, 3, 6, 8, 9, 11, 12, 26]

// InkSoftIdx: JSDIdx
const PcnaIndexMap: Record<number, number> = {
  1: 4,     // Category(s) - CategoryWeb
  2: 6,     // Product Name (Required) - ItemName
  3: 8,    // Product Description (Required) - DESCRIPTION
  4: 3,     // SKU/Item Number (Required) - PCNA_SKU_Number
  5: 3,     // MFG Sku (Required) - PCNA_SKU_Number
  6: 11,    // Size (Required) - Product_Size
  7: 12,    // Weight (Required) - Product_Weight
  8: 9,    // Color 1 Name (Required) - MARKET_COLORS
  9: -1,    // Color 2 Name -
  10: 9,   // Todo: Color 1 Hex Value (Required) - 
  11: -1,   // Color 2 Hex Value -
  12: -1,   // Supplier Name (Required) -
  13: -1,   // Manufacturer Name (Required) -
  14: -1,   // Customer Price (Required) -
  15: 26,    // Product Cost (Required) - USDPriceCol1
  16: -1,   // GTIN/UPC Code
  17: -1,   // Search Tags
  18: -1,   // Front Image - IMAGE
  19: -1,   // Back Image
  20: -1,   // Third Image
  21: -1,   // Fourth Image
  22: -1,   // Pre-Decorated Item
  23: -1,   // Max Imprint Colors
  24: -1,   // Minimum Per Order
}

export const mapPcnaToInksoft = (store: string, productList: string[][], productMediaMap: Record<string, string[]>): (string | number)[][] => {
  const inkSoftList: (string | number)[][] = []
  for (let i = 0; i < productList.length; i++) {
    const productInfo = productList[i]
    const converted: (string | number)[] = []
    for (let j = 0; j < InkSoftTemplateHeaders.length; j++) {
      if (j === 0) {
        // Webstore
        converted.push(store)
      } else if (j === 10) {
        // Todo: Color Hex value
        converted.push('#FFFFFF')
      } else if (j === 12 || j === 13) {
        // Supplier, Manufacturer Name
        converted.push('PCNA')
      } else if (j === 14) {
        // Customer Price
        converted.push(0)
      } else if (j === 18) {
        // Image
        const key = productInfo[3]
        const images = productMediaMap[key]
        if (images?.length) {
          converted.push(images[3] ?? images[2] ?? images[0])
        } else {
          converted.push('unknown')
        }
      } else {
        const mappingIdx = PcnaIndexMap[j];
        converted.push(`"${productInfo[mappingIdx] || ''}"`)
      }
    }
    inkSoftList.push(converted)
  }
  return inkSoftList
}
