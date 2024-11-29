<template>
  <div class="top-advertise">
    <div v-if="currentAd">
      <img
        v-if="currentAd.Advertisement.image_url && isImageVisible"
        ref="imageElement"
        :src="currentAd.path ? currentAd.path : currentAd.Advertisement.image_url"
        alt="Advertisement Image"
        class="advertisement-media"
      />

      <video
        v-if="currentAd.Advertisement.video_url && isVideoVisible"
        ref="videoElement"
        :width="mediaWidth"
        :src="currentAd.path ? currentAd.path : currentAd.Advertisement.video_url"
        class="advertisement-media"
        muted
        autoplay
        loop
        @ended="handleVideoEnd"
      ></video>

      <!-- 倒计时显示 -->
      <div class="countdown-timer">{{ remainingTime }}秒{{ taskStore.formattedCountdown }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { adsStore } from '@renderer/stores/ads_store'
import { useTaskStore } from '@renderer/stores/task_store'

const taskStore = useTaskStore()
// isImageVisible isVideoVisible
const isImageVisible = ref(true)
const isVideoVisible = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const imageElement = ref<HTMLImageElement | null>(null)

// timer
let adTimer: number | null = null
let countdownTimer: number | null = null
const remainingTime = ref<number>(0)

// ads store
const ads = computed(() => adsStore().getAds)
const ads_hasDownload = computed(() => adsStore().getAds_hasDownload)

// currentAd
const currentAdIndex = ref(0)
const currentAd = ref<any>(null)
const adsHasDownloadMap = computed(() => {
  const map = new Map<number, any>()
  ads_hasDownload.value.forEach((ad) => {
    map.set(ad.Advertisement.ID, ad)
  })
  console.log('adsHasDownloadMap', map)
  return map
})

// start ad cycle
const startAdCycle = () => {
  clearAdTimer()
  clearCountdownTimer()

  if (ads.value.length > 0) {
    const ad = ads.value[currentAdIndex.value]
    const downloadedAd = adsHasDownloadMap.value?.get(ad.Advertisement.ID)
    if (downloadedAd) {
      currentAd.value = downloadedAd
      console.log('播放下载的', currentAd.value)
    } else {
      currentAd.value = ad
      console.log('播放未下载的', currentAd.value)
    }
  }
  if (!currentAd.value) return

  let playDuration = 5
  if (!currentAd.value.path) {
    playDuration = currentAd.value.play_duration
  } else {
    playDuration = currentAd.value.Advertisement.video_duration
  }
  console.log('playDuration', playDuration)
  remainingTime.value = playDuration
  startCountdown(playDuration)

  // check ad has image and video
  let hasImage = false
  let hasVideo = false
  if (currentAd.value.Advertisement.type === 'img') {
    hasImage = !!currentAd.value.Advertisement.image_url
    hasVideo = false
  } else if (currentAd.value.Advertisement.type === 'video') {
    hasImage = false
    hasVideo = !!currentAd.value.Advertisement.video_url
  }
  console.log('hasImage', hasImage)
  console.log('hasVideo', hasVideo)

  if (hasImage) {
    showImage()
    adTimer = window.setTimeout(() => {
      nextAd()
    }, playDuration * 1000)
  } else if (hasVideo) {
    showVideo()
    adTimer = window.setTimeout(() => {
      nextAd()
    }, playDuration * 1000)
  } else {
    nextAd()
  }
}

const showImage = () => {
  isImageVisible.value = true
  isVideoVisible.value = false
}

const showVideo = () => {
  isImageVisible.value = false
  isVideoVisible.value = true

  if (videoElement.value) {
    const handleLoadedMetadata = () => {
      videoElement.value!.currentTime = 0
      const playPromise = videoElement.value!.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('视频播放成功')
          })
          .catch((err) => {
            console.log('播放时间', videoElement.value!.currentTime)
            console.warn('视频播放失败,且即将跳到下一个广告:', err)
          })
      }
    }

    // 检查元数据是否已经加载
    if (videoElement.value!.readyState >= 1) {
      // HAVE_METADATA
      handleLoadedMetadata()
    } else {
      videoElement.value!.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })
    }
  }
}

const handleVideoEnd = () => {
  // 视频循环播放，不做额外处理
}

// next ad
const nextAd = () => {
  console.log('nextAd', ads.value.length, ads_hasDownload.value.length)
  currentAdIndex.value = (currentAdIndex.value + 1) % ads.value.length

  startAdCycle()
}

// clear ad cycle timer
const clearAdTimer = () => {
  if (adTimer !== null) {
    clearTimeout(adTimer) // 清除定时器
    adTimer = null
  }
}

// start countdown
const startCountdown = (duration: number) => {
  clearCountdownTimer()
  remainingTime.value = duration

  countdownTimer = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value -= 1
    } else {
      clearCountdownTimer()
      if (videoElement.value) {
        videoElement.value.pause()
      }
      nextAd()
    }
  }, 1000)
}

// clear countdown timer
const clearCountdownTimer = () => {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}
// watch ads
watch(
  ads,
  () => {
    console.log('ads changed', currentAdIndex.value)
    // currentAdIndex.value = 0
    if (ads.value.length < currentAdIndex.value) {
      currentAdIndex.value = 0
    }
    // unbind binding
    else if (ads.value.length === 0) {
      if (videoElement.value) {
        videoElement.value.pause()
        clearAdTimer()
        clearCountdownTimer()
      }
    }
    if (remainingTime.value > 0) {
      //延時執行
      setTimeout(() => {
        console.log('广告列表变化，开始广告循环')
        startAdCycle()
      }, remainingTime.value * 1000)
    } else {
      console.log('广告列表变化，开始广告循环')
      startAdCycle()
    }
  },
  { immediate: true, deep: true }
)

/*
get window size and update media width
**/
const mediaWidth = ref(1094) // 初始宽度
const updateMediaWidth = (size: { width: number; height: number }) => {
  const maxWidth = 1440
  mediaWidth.value = size.width > maxWidth ? maxWidth : size.width // 例如，填充窗口宽度的90%
}

window.api.getWindowSize().then((size) => {
  updateMediaWidth(size)
})
const handleResize = (size: { width: number; height: number }) => {
  updateMediaWidth(size)
}

window.api.onWindowResize(handleResize)

onBeforeUnmount(() => {
  clearAdTimer()
  clearCountdownTimer()
})
</script>

<style scoped>
.top-advertise {
  width: 100vw; /* 宽度占满视口宽度 */
  height: 438px; /* 固定高度 */
  background-color: #f0f0f0; /* 背景颜色 */
  display: flex; /* Flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: relative; /* 相对定位 */
  overflow: hidden; /* 隐藏溢出内容 */
}

.advertisement-media {
  height: auto; /* 保持纵横比 */
  max-height: 100%; /* 防止超过容器高度 */
  display: block;
  border-radius: 10px;
  object-fit: contain; /* 缩放以适应容器，不裁剪 */
}

.countdown-timer {
  position: absolute; /* 绝对定位，相对于 .top-advertise 容器 */
  bottom: 10px; /* 距离底部10px */
  right: 10px; /* 距离右侧10px */
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  color: #fff; /* 白色文字 */
  padding: 5px 10px; /* 内边距 */
  border-radius: 5px; /* 圆角边框 */
  font-size: 14px; /* 字体大小 */
}
</style>
