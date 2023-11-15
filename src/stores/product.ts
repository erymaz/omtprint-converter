import { defineStore } from 'pinia'
import $http from '@/api/service'
import { IProduct } from '@/types'

const getDefaultState = () => {
  return {
    products: [],
    isLoading: false,
  }
}

export const useProductStore = defineStore({
  id: 'product',
  state: () => getDefaultState(),

  actions: {
    async fetchProducts(): Promise<IProduct[]> {
      try {
        const response = await $http.get<IProduct[]>('/users')
        return response.data
      } catch (error) {
        console.log(error)
        return []
      }
    }
  }
})
