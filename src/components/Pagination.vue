<template>
  <nav class="w-full flex items-center justify-between py-3" aria-label="Pagination">
    <div class="hidden sm:block">
      <p class="text-sm text-gray-100">
        Showing
        {{ ' ' }}
        <span class="font-medium">{{ showingNumbers[0] }}</span>
        {{ ' ' }}
        to
        {{ ' ' }}
        <span class="font-medium">{{ showingNumbers[1] }}</span>
        {{ ' ' }}
        of
        {{ ' ' }}
        <span class="font-medium">{{ props.total }}</span>
        {{ ' ' }}
        results
      </p>
    </div>
    <div class="flex flex-1 justify-between sm:justify-end">
      <button
        class="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        @click="updatePage(-1)">
        Previous
      </button>
      <button
        class="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        @click="updatePage(1)">
        Next
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  pageLength: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['updatePage'])

const showingNumbers = computed(() => {
  const start = (props.page - 1) * props.pageLength
  const end = Math.min(props.total, start+props.pageLength)
  return [start+1, end]
})

const updatePage = (value: number) => {
  const start = (props.page - 1) * props.pageLength
  const end = start + props.pageLength
  if (value === 1 && end >= props.total) {
    return
  }
  if (value === -1 && props.page === 1) {
    return
  }
  emits('updatePage', value)
}

</script>
