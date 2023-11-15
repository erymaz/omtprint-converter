<template>
  <div class="dashboard mx-auto py-24 text-white">
    <h2 class="font-bold text-white text-3xl">Convert Catalogs</h2>
    <div class="flex items-center w-60 my-4">
      <input
        v-model="state.webstore"
        class="h-9 w-60 mr-4 bg-white bg-opacity-5 rounded text-white px-2 focus:ring-none focus:outline-none"
        placeholder="Webstore"
      />
      <select v-model="state.selectedVendor" class="flex-1 h-9 bg-white bg-opacity-5 rounded border-none">
        <option :value="null" class="text-gray-400" disabled>
          Select Vendor
        </option>
        <option
          v-for="vendor of vendors"
          :key="vendor.id"
          :value="vendor.id"
          class="text-black"
        >
          {{ vendor.name }}
        </option>
      </select>
    </div>

    <JdsIndustries v-if="state.selectedVendor === 'jds_industries'" :webstore="state.webstore" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import JdsIndustries from '@/components/JdsIndustries.vue';

const toast = useToast()

const vendors = ref([
  {
    id: 'jds_industries',
    name: 'JDS Industries'
  }
])

const state = reactive({
  webstore: '',
  fileName: null as null | string,
  header: [] as string[],
  list: [] as any[],
  isLoading: false,
  downloadFile: 'csv',
  selectedVendor: null as null | string
})
</script>

<style scoped>
.dashboard {
  max-width: 1160px;
  width: 100%;
  height: 100%;
}
</style>
