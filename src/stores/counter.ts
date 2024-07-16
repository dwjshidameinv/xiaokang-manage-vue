import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useRowStore = defineStore('row', {  
  state: () => ({  
    currentRow: null  
  }),  
  actions: {  
    setCurrentRow(row:any) {  
      this.currentRow = row;  
    }  
  }  
})

export const usePageLoadStatusStore = defineStore('pageLoadStatus', {  
  state: () => ({  
    isClassifyEditLoaded: false,  
  }),  
  actions: {  
    setClassifyEditLoaded(status:any) {  
      this.isClassifyEditLoaded = status;  
    },  
  },  
});