<template>
  <div>
    <div v-if="!state.isLoading">
      <!-- Upload -->
      <div class="grid grid-cols-2 gap-4">
        <CsvImport
          id="productData"
          title="Upload a Product Data CSV"
          @csv-data="getData"
          @clear="clear"
        />
        <CsvImport
          id="productMedia"
          title="Upload a Product Media CSV"
          @csv-data="getData"
          @clear="clear"
        />
      </div>

      <!-- Table -->
      <div v-if="state.productData.fileName && state.productMedia.fileName" class="w-full mt-8 overflow-x-auto overflow-y-hidden">
        <div class="flex flex-col md:flex-row items-center mb-4 space-x-2">
          <input
            v-model="state.division"
            class="h-9 w-96 bg-white bg-opacity-5 rounded text-white px-2 focus:ring-none focus:outline-none"
            placeholder="Division"
          />
          <input
            v-model="state.brand"
            class="h-9 w-full bg-white bg-opacity-5 rounded text-white px-2 focus:ring-none focus:outline-none"
            placeholder="Brand"
          />
          <button
            class="h-9 relative inline-flex items-center rounded-md bg-white bg-opacity-5 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-offset-0"
            @click="filter">
            Filter
          </button>
          <button
            class="h-9 whitespace-nowrap relative inline-flex items-center rounded-md bg-white bg-opacity-5 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-offset-0"
            @click="exportCsv">
            Export CSV for InkSoft
          </button>
        </div>
        <table class="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th v-if="state.productData.header.length">
                <input
                  v-model="state.selectAll"
                  type="checkbox"
                  class="bg-white bg-opacity-5 mr-3 mb-1 rounded"
                  @change="selectAll"
                />
              </th>
              <th>
                <span class="w-32">IMAGE</span>
              </th>
              <th
                v-for="col in state.productData.header"
                :key="col"
                scope="col"
                class="whitespace-nowrap text-left text-sm font-semibold text-whit"
              >
                <span class="p-3">{{ col }}</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="(row, index1) of tableData" :key="`${row[1]}-${index1}`">
              <td v-if="row.length">
                <input
                  type="checkbox"
                  class="bg-white bg-opacity-5 mr-3 rounded"
                  :value="row[3]"
                  v-model="state.selectedItems"
                />
              </td>
              <td class="w-32 h-16 py-1">
                <img :src="getImageUrl(row[3])" class="w-full" />
              </td>
              <td
                v-for="(cell, index2) of row"
                :key="`${cell}-${index2}`"
                class="whitespace-nowrap p-3 text-sm font-medium text-white max-w-xs truncate"
              >
                <span>{{ cell }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="state.productData.fileName && state.productMedia.fileName" class="flex items-center justify-between">
        <Pagination
          :page="state.page"
          :page-length="state.pageLength"
          :total="state.filteredList.length"
          @updatePage="updatePage"
        />
      </div>
    </div>

    <!-- Loading spin -->
    <div v-else>
      <div
        style="border-top-color:transparent"
        class="w-5 h-5 mt-3 border-4 mx-auto border-blue-400 border-solid rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue"
import { useToast } from 'vue-toastification'
import Pagination from '@/components/Pagination.vue'
import CsvImport from "./CsvImport.vue";
import { downloadCSVFile, InkSoftTemplateHeaders, mapPcnaToInksoft, pcnaRequiredFieldIds } from '@/helpers'

const toast = useToast()

const props = defineProps({
  webstore: {
    type: String,
    default: ''
  }
})

const state = reactive({
  productData: {
    fileName: null as null | string,
    header: [] as string[],
    list: [] as string[][],
  },
  productMedia: {
    fileName: null as null | string,
    list: {} as Record<string, string[]>,
  },
  isLoading: false,
  page: 1,
  pageLength: 10,
  filteredList: [] as string[][],
  selectedItems: [] as string[],
  selectAll: false,
  division: '',
  brand: ''
})

const tableData = computed(() => {
  const start = (state.page - 1) * state.pageLength
  if (start > state.filteredList.length) {
    return []
  }
  const end = Math.min(state.filteredList.length, start+state.pageLength);
  const data = state.filteredList.slice(start, end)
  return data
})

const filter = () => {
  if (!state.division && !state.brand) {
    state.filteredList = state.productData.list
    return
  }
  let _filtered = state.productData.list.slice()
  if (state.division) {
    _filtered = _filtered.filter(data => data[0].toLowerCase() === state.division.toLowerCase())
  }
  if (state.brand) {
    _filtered = _filtered.filter(data => data[1].toLowerCase() === state.brand.toLowerCase())
  }
  state.filteredList = _filtered
  state.page = 1
}

const getData = (id: string, fileName: string, dataString: string) => {
  const dataStringLines = dataString.split(/\r\n|\n/)
  const list: string[][] = []
  const imageMap: Record<string, string[]> = {}
  let header: string[] = []
  for (let i = 0; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
      // const row = dataStringLines[i].split(",")
      const item: string[] = []
      for (let j = 0; j < row.length; j++) {
        let d = row[j]
        if (d[0] === '"') {
          d = d.substring(1, d.length - 1)
        }
        if (d[d.length - 1] === '"') {
          d = d.substring(0, d.length - 2)
        }
        item.push(d || 'Unknown')
      }

      // remove the blank rows
      if (Object.values(item).filter(x => x).length > 0) {
        if (i === 0) {
          header = item
        } else {
          let validRow = true
          for (const idx of pcnaRequiredFieldIds) {
            if (!item[idx]) {
              validRow = false
              break
            }
          }
          if (id === 'productMedia') {
            const key = item[1]
            if (!imageMap[key]?.length) {
              imageMap[key] = []
            }
            imageMap[key].push(item[2])
          } else if (validRow) {
            list.push(item)
          }
        }
      }
  }

  if (id === 'productMedia') {
    state.productMedia.list = imageMap
    state.productMedia.fileName = fileName
  } else {
    state.productData.header = header
    state.productData.list = list
    state.productData.fileName = fileName
    state.filteredList = list
  }
}

const getImageUrl = (sku: string): string => {
  const key = sku
  const images = state.productMedia.list[key]
  if (images?.length) {
    return images[3] ?? images[2] ?? images[0]
  } else {
    return ''
  }
}

const selectAll = (e: any) => {
  if (e.target.checked) {
    state.selectedItems = state.filteredList.map(data => data[3])
  } else {
    state.selectedItems = []
  }
}

const clear = () => {
  state.productData.fileName = null
  state.productData.header = []
  state.productData.list = []
  state.productMedia.fileName = null
  state.productMedia.header = []
  state.productMedia.list = []
  state.filteredList = []
  state.isLoading = false
  state.page = 1
  state.filteredList = []
  state.division = ''
  state.brand = ''
  state.selectAll = false
  state.selectedItems = []
}

const updatePage = (value: number) => {
  state.page += value
}

const exportCsv = () => {
  if (!state.selectedItems.length) {
    toast.error('Please select products to export.')
    return;
  }
  const selected = state.filteredList.filter(data => state.selectedItems.includes(data[3]))
  const converted = mapPcnaToInksoft(props.webstore, selected, state.productMedia.list)
  downloadCSVFile(InkSoftTemplateHeaders, converted)
}
</script>
