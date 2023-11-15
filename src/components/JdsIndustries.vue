<template>
  <div class="h-full">
    <div v-if="!state.isLoading">
      <!-- Upload -->
      <div
        @dragover="fileDragOver"
        @dragleave="fielDragLeave"
        @drop="fileDrop"
        class="rounded-lg"
        :class="{'border border-dashed border-gray-900/25 p-6': !state.fileName}"
      >
        <div v-if="!state.fileName" class="text-center">
          <DocumentIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div class="my-4 flex leading-6 text-gray-600">
            <label for="file-upload" class="relative w-full cursor-pointer rounded-md text-indigo-600 hover:text-indigo-500">
              <p class="text-lg">Upload a Catalog CSV file</p>
              <p class="text-sm leading-5 text-gray-600 ml-2">or Drag and Drop (CSV)</p>
              <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="xlsx,csv" @change="onFileChange" />
            </label>
          </div>
        </div>
        <div v-else class="text-white">
          <div class="flex items-center">
            <span class="mr-4">{{ state.fileName }}</span>
            <DocumentRemoveIcon
              class="h-6 w-6 text-red-700 cursor-pointer"
              aria-hidden="true"
              @click="clear"
            />
          </div>
          <div class="flex items-center mt-4 space-x-2">
            <input
              v-model="state.skus"
              class="h-9 w-full bg-white bg-opacity-5 rounded text-white px-2 focus:ring-none focus:outline-none"
              placeholder="Items (distinguish by comma)"
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
        </div>
      </div>
      <!-- Table -->
      <div v-if="state.fileName" class="w-full mt-8 overflow-x-auto overflow-y-hidden">
        <table class="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th v-if="state.header.length">
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
                v-for="col in state.header"
                :key="col"
                scope="col"
                class="whitespace-nowrap text-left text-sm font-semibold text-whit"
              >
                <span class="p-3">{{ col }}</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="(row, index) of tableData" :key="`${row[1]}-${index}`">
              <td v-if="row.length">
                <input
                  type="checkbox"
                  class="bg-white bg-opacity-5 mr-3 rounded"
                  :value="row[1]"
                  v-model="state.selectedItems"
                />
              </td>
              <td class="w-32 h-16 py-1">
                <img :src="`${JDS_INDUSTRIES_IMAGE_URL}/${row[13]}`" class="w-full" />
              </td>
              <td
                v-for="cell of row"
                :key="cell"
                class="whitespace-nowrap p-3 text-sm font-medium text-white max-w-xs truncate"
              >
                <span>{{ cell }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div v-if="state.fileName" class="flex items-center justify-between">
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
import { computed, reactive } from "vue";
import { useToast } from 'vue-toastification'
import { DocumentIcon, DocumentRemoveIcon } from '@heroicons/vue/solid'
import Pagination from '@/components/Pagination.vue'
import { JDS_INDUSTRIES_IMAGE_URL } from '@/constants'
import { downloadCSVFile, InkSoftTemplateHeaders, mapJdsToInksoft } from '@/helpers'

const toast = useToast()

const props = defineProps({
  webstore: {
    type: String,
    default: ''
  }
})

const state = reactive({
  fileName: null as null | string,
  header: [] as string[],
  list: [] as any[],
  isLoading: false,
  page: 1,
  pageLength: 10,
  filteredList: [] as any[],
  selectedItems: [] as any[],
  selectAll: false,
  skus: ''
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

const updatePage = (value: number) => {
  state.page += value
}

const filter = () => {
  if (!state.skus) {
    state.filteredList = state.list
    return
  }
  const skus = state.skus.split(',').map(_ => _.trim().toLowerCase())
  state.filteredList = state.list.filter(data => skus.includes(data[1]?.trim().toLowerCase()) || false)
  state.page = 1
}

const selectAll = (e: any) => {
  if (e.target.checked) {
    state.selectedItems = state.filteredList.map(data => data[1])
  } else {
    state.selectedItems = []
  }
}

const getData = (dataString: string) => {
  const dataStringLines = dataString.split(/\r\n|\n/)
  const list = []
  for (let i = 0; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
      let item = []
      for (let j = 0; j < row.length; j++) {
          let d = row[j]
          if (d.length > 0) {
              if (d[0] == '"')
              d = d.substring(1, d.length - 1)
              if (d[d.length - 1] == '"')
              d = d.substring(d.length - 2, 0)
              d = d.replaceAll('""', '"')
          }
          item.push(d)
      }

      // remove the blank rows
      if (Object.values(item).filter(x => x).length > 0) {
        if (i === 0) {
          state.header = item
        } else {
          list.push(item)
        }
      }
  }
  state.list = list
  state.filteredList = list
}

const fileDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const fielDragLeave = (event: DragEvent) => {
  event.preventDefault()
}

const fileRead = (file: File) => {
  // Validation
  const tmpName = file.name.split('.')
  const extension = tmpName.pop()?.toLowerCase()
  if (!extension || extension !== 'csv') {
    toast.error('Invalid file format. Must be csv file.')
    return
  }

  state.isLoading = true
  state.fileName = file.name
  const reader = new FileReader()
  reader.onload = (evt: any) => {
    const dt = evt.target.result
    getData(dt)
    state.isLoading = false
  };
  reader.readAsBinaryString(file);
}

const fileDrop = (event: DragEvent) => {
  event.preventDefault()
  if (!event || !event.dataTransfer) {
    return
  }
  const files: FileList = event.dataTransfer.files
  if (!files.length) {
    return
  }
  const file = files[0]
  fileRead(file)
}

const onFileChange = (e: any) => {
  const file = e.target.files[0]
  if (!file) {
    return
  }
  fileRead(file)
}

const clear = () => {
  state.fileName = null
  state.header = []
  state.list = []
  state.isLoading = false
  state.page = 1
  state.filteredList = []
  state.skus = ''
  state.selectAll = false
  state.selectedItems = []
}

const exportCsv = () => {
  if (!state.selectedItems.length) {
    toast.error('Please select Items to export.')
    return;
  }
  const selected = state.filteredList.filter(data => state.selectedItems.includes(data[1]))
  const converted = mapJdsToInksoft(props.webstore, selected)
  downloadCSVFile(InkSoftTemplateHeaders, converted)
}
</script>
