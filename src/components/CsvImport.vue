<template>
  <div class="text-center">
    <div
      v-if="!state.fileName"
      @dragover="fileDragOver"
      @dragleave="fielDragLeave"
      @drop="fileDrop"
      class="rounded-lg"
      :class="{'border border-dashed border-gray-900/25 p-6': !state.fileName}"
    >
      <DocumentIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
      <div class="my-4 flex leading-6 text-gray-600">
        <label for="file-upload" class="relative w-full cursor-pointer rounded-md text-indigo-600 hover:text-indigo-500">
          <p class="text-lg">{{ title }}</p>
          <p class="text-sm leading-5 text-gray-600 ml-2">or Drag and Drop (CSV)</p>
          <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="csv" @change="onFileChange" />
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useToast } from 'vue-toastification'
import { DocumentIcon, DocumentRemoveIcon } from '@heroicons/vue/solid'

const toast = useToast()

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
})

const emits = defineEmits(['csvData', 'clear'])

const state = reactive({
  fileName: null as null | string,
  isLoading: false,
})

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
    emits('csvData', props.id, state.fileName, dt)
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
  state.isLoading = false
  emits('clear')
}
</script>
