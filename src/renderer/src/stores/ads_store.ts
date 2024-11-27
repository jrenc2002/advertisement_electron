import { defineStore } from 'pinia'
export const adsStore = defineStore('ads', {
  state: () => {
    return {
      ads_video: [] as any[],
      ads_image: [] as any[],
      ads_hasDownload_video: [] as any[],
      ads_hasDownload_image: [] as any[],
      ads: [] as any[],
      ads_hasDownload: [] as any[]
    }
  },
  getters: {
    getAds_video: (state) => state.ads_video,
    getAds_image: (state) => state.ads_image,
    getAds_hasDownload_video: (state) => state.ads_hasDownload_video,
    getAds_hasDownload_image: (state) => state.ads_hasDownload_image,
    getAds: (state) => state.ads,
    getAds_hasDownload: (state) => state.ads_hasDownload
  },
  actions: {
    setAds_video(ads: any[]) {
      this.ads_video = ads
    },
    setAds_image(ads: any[]) {
      this.ads_image = ads
    },
    setAds_hasDownload_video(ads: any[]) {
      this.ads_hasDownload_video = ads
    },
    setAds_hasDownload_image(ads: any[]) {
      this.ads_hasDownload_image = ads
    },
    setAds(ads: any[]) {
      this.ads = ads
    },
    setAds_hasDownload(ads: any[]) {
      this.ads_hasDownload = ads
    },
    addAds_hasDownload_video(ad: any) {
      this.ads_hasDownload_video.push(ad)
    },
    addAds_hasDownload_image(ad: any) {
      this.ads_hasDownload_image.push(ad)
    },
    addAds(ad: any) {
      this.ads.push(ad)
    },
    addAds_hasDownload(ad: any) {
      this.ads_hasDownload.push(ad)
    }
  },
  persist: true
})
