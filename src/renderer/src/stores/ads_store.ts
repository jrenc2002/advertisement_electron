import { defineStore } from 'pinia'
export const adsStore = defineStore('ads', {
  state: () => {
    return {
      ads: [] as any[],
      ads_hasDownload: [] as any[],
      ads_hasDownload_path: [] as any[]
    }
  },
  getters: {
    getAds: (state) => state.ads,
    getAds_hasDownload: (state) => state.ads_hasDownload,
    getAds_hasDownload_path: (state) => state.ads_hasDownload_path
  },
  actions: {
    setAds(ads: any[]) {
      this.ads = ads
    },
    setAds_hasDownload(ads: any[]) {
      this.ads_hasDownload = ads
    },
    setAds_hasDownload_path(ads: any[]) {
      this.ads_hasDownload_path = ads
    },
    addAds(ad: any) {
      const exists = this.ads.some((existingAd) => existingAd.ID === ad.ID)
      if (!exists) {
        this.ads.push(ad)
      }
    },
    addAds_hasDownload(ad: any) {
      const exists = this.ads_hasDownload.some((existingAd) => existingAd.ID === ad.ID)
      if (!exists) {
        this.ads_hasDownload.push(ad)
      }
    },
    addAds_hasDownload_path(ad: any) {
      const exists = this.ads_hasDownload_path.some((existingAd) => existingAd.adId === ad.adId)
      if (!exists) {
        this.ads_hasDownload_path.push(ad)
      }
    }
  },
  persist: true
})
