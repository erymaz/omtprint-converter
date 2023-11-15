export * from './jdsIndustries.helper'

export const jsonToCsv = (rows: any[]): string => {
  let fileParsed = ''
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    let line = ''
    for (const key in row) {
      if (line !== '') {
        line += ','
      }
      line += (row as any)[key]
    }
    fileParsed += line + '\r\n'
  }
  return fileParsed
}

export const arrayToCsv = (rows: any[]): string => {
  let fileParsed = ''
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const line = row.join(',')
    fileParsed += line + '\r\n'
  }
  return fileParsed
}

export const downloadCSVFile = (header: string[], list: any[]) => {
  const fileParsed = arrayToCsv([
    header,
    ...list
  ])
  const fileBlob = new Blob([fileParsed], { type: 'text/csv' })
  const fileLink = document.createElement('a')
  fileLink.href = URL.createObjectURL(fileBlob)
  const datetime = new Date().toISOString()
  fileLink.download = `Result-${datetime}.csv`
  fileLink.click()
}

export const InkSoftTemplateHeaders = [
  'Webstore(s)',
  'Category(s)',
  'Product Name (Required)',
  'Product Description (Required)',
  'SKU/Item Number (Required)',
  'MFG Sku (Required)',
  'Size (Required)',
  'Weight (oz) (Required)',
  'Color 1 Name (Required)',
  'Color 2 Name',
  'Color 1 Hex Value (Required)',
  'Color 2 Hex Value',
  'Supplier Name (Required)',
  'Manufacturer Name (Required)',
  'Customer Price (of 1) (Required)',
  'Product Cost (of 1) (Required)',
  'GTIN/UPC Code',
  'Search Tags',
  'Front Image',
  'Back Image',
  'Third Image',
  'Fourth Image',
  'Pre-Decorated Item',
  'Max Imprint Colors',
  'Minimum Per Order'
]
