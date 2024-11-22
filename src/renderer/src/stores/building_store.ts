import { defineStore } from 'pinia'

export const buildingStore = defineStore('building', {
  state: () => {
    return {
      building: {} as any
    }
  },
  getters: {
    getBuilding: (state) => state.building
  },
  actions: {
    setBuilding(building: any) {
      this.building = building
    }
  },
  persist: true
})
