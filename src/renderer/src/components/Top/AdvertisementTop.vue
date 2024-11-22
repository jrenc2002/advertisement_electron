<template>
  <div class="top-advertise">
    <div v-if="currentAd">
      <!-- 如果有图片URL并且图片可见，显示图片 -->
      <img
        v-if="currentAd.Advertisement.image_url && isImageVisible"
        :src="currentAd.Advertisement.image_url"
        alt="Advertisement Image"
        class="advertisement-media"
      />

      <!-- 如果有视频URL并且视频可见，显示视频 -->
      <video
        v-if="currentAd.Advertisement.video_url && isVideoVisible"
        ref="videoElement"
        :src="currentAd.Advertisement.video_url"
        class="advertisement-media"
        muted
        autoplay
        playsinline
        @ended="handleVideoEnd"
      ></video>

      <!-- 倒计时显示 -->
      <div class="countdown-timer">{{ remainingTime }}秒</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { adsStore } from '../../stores'

// 从 Pinia store 中获取广告列表
const ads = computed(() => adsStore().getAds)

// 当前广告的索引，初始为0
const currentAdIndex = ref(0)

// 控制图片和视频的可见性
const isImageVisible = ref(true)
const isVideoVisible = ref(false)

// 引用视频元素，以便控制播放
const videoElement = ref<HTMLVideoElement | null>(null)

// 定时器 ID，用于广告轮播
let adTimer: number | null = null

// 定时器 ID，用于倒计时
let countdownTimer: number | null = null

// 计算属性，获取当前广告对象
const currentAd = computed(() => ads.value[currentAdIndex.value])

// 剩余时间（秒）
const remainingTime = ref<number>(0)

// 固定的图片展示时长（秒）
const IMAGE_DISPLAY_DURATION = currentAd.value?.play_duration

// 开始广告轮播循环
const startAdCycle = () => {
  clearAdTimer() // 清除之前的广告轮播定时器
  clearCountdownTimer() // 清除之前的倒计时定时器

  if (!currentAd.value) return // 如果当前广告不存在，直接返回

  const playDuration = currentAd.value.play_duration // 播放时长（秒）

  // 初始化剩余时间为整个广告的播放时长
  remainingTime.value = playDuration

  // 启动倒计时
  startCountdown(playDuration)

  // 检查广告是否有图片和视频
  const hasImage = !!currentAd.value.Advertisement.image_url
  const hasVideo = !!currentAd.value.Advertisement.video_url

  if (hasImage && hasVideo) {
    // 如果广告同时有图片和视频
    showImage() // 首先显示图片
    // 设置定时器，在图片展示时长后显示视频
    adTimer = window.setTimeout(() => {
      showVideo(playDuration - IMAGE_DISPLAY_DURATION) // 显示视频，并传入剩余播放时间
    }, IMAGE_DISPLAY_DURATION * 1000)
  } else if (hasImage) {
    // 如果广告只有图片
    showImage()
    // 设置定时器，在整个播放时长后切换到下一个广告
    adTimer = window.setTimeout(() => {
      nextAd()
    }, playDuration * 1000)
  } else if (hasVideo) {
    // 如果广告只有视频
    showVideo(playDuration) // 显示视频，播放整个广告时长
  } else {
    // 如果广告既没有图片也没有视频，直接切换到下一个广告
    nextAd()
  }

  // 设置整个广告播放结束时，自动切换到下一个广告
  adTimer = window.setTimeout(() => {
    nextAd()
  }, playDuration * 1000)
}

// 显示图片的方法
const showImage = () => {
  isImageVisible.value = true // 显示图片
  isVideoVisible.value = false // 隐藏视频
}

// 显示视频的方法，参数为可播放的时长
const showVideo = (playTime: number) => {
  isImageVisible.value = false // 隐藏图片
  isVideoVisible.value = true // 显示视频

  if (videoElement.value) {
    videoElement.value.currentTime = 0 // 从头开始播放
    const playPromise = videoElement.value.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // 视频已成功播放
          console.log('视频已开始播放')
        })
        .catch((err) => {
          // 播放视频失败，切换广告
          console.error('视频播放失败:', err)
          nextAd()
        })
    }

    // 计算视频应播放的次数
    const videoDuration = videoElement.value.duration
    if (videoDuration > 0) {
      const loopCount = Math.ceil(playTime / videoDuration)
      videoElement.value.loop = true // 设置视频循环播放
    } else {
      // 如果视频时长未知或为0，设置循环播放
      videoElement.value.loop = true
    }
  }
}

// 处理视频播放结束的方法
const handleVideoEnd = () => {
  // 视频循环播放，不做额外处理
  // 因为已设置 videoElement.value.loop = true
}

// 切换到下一个广告的方法
const nextAd = () => {
  currentAdIndex.value = (currentAdIndex.value + 1) % ads.value.length // 更新当前广告索引，循环播放
  startAdCycle() // 开始下一个广告的循环
}

// 清除广告轮播定时器的方法
const clearAdTimer = () => {
  if (adTimer !== null) {
    clearTimeout(adTimer) // 清除定时器
    adTimer = null
  }
}

// 启动倒计时的方法
const startCountdown = (duration: number) => {
  clearCountdownTimer() // 清除之前的倒计时定时器
  remainingTime.value = duration // 重置剩余时间

  countdownTimer = window.setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value -= 1 // 每秒减少1
    } else {
      clearCountdownTimer() // 剩余时间为0时清除倒计时定时器
    }
  }, 1000)
}

// 清除倒计时定时器的方法
const clearCountdownTimer = () => {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer) // 清除倒计时定时器
    countdownTimer = null
  }
}

// 监听 ads 的变化，当广告列表更新时，重置索引并重新开始循环
watch(
  ads,
  () => {
    currentAdIndex.value = 0 // 重置当前广告索引
    startAdCycle() // 重新开始广告循环
  },
  { immediate: true, deep: true }
)

// 组件挂载时启动广告循环
onMounted(() => {
  if (ads.value.length > 0) {
    startAdCycle()
  }
})

// 组件卸载前清除定时器，防止内存泄漏
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
  display: flex; /* 使用 Flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: relative; /* 相对定位，方便内部绝对定位元素 */
  overflow: hidden; /* 隐藏溢出内容 */
}

.advertisement-media {
  width: 100%; /* 宽度占满容器 */
  height: 100%; /* 高度占满容器 */
  object-fit: cover; /* 保持纵横比，覆盖整个容器 */
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
