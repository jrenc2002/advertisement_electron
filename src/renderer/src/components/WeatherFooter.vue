<template>
  <div class="weather-footer">
    <div class="weather-footer-left">
      <div class="weather-footer-left-item">
        <p class="p-title">
          {{
            weatherData?.weatherForecast?.[0]?.forecastDate?.replace(
              /(\d{4})(\d{2})(\d{2})/,
              '$1/$2/$3'
            )
          }}
        </p>
        <p class="p-title">{{ weatherData?.weatherForecast?.[0]?.week }}</p>
        <p class="p-content">
          {{ weatherData?.weatherForecast?.[0]?.forecastWeather }}
        </p>
        <p class="p-content">
          {{ weatherData?.weatherForecast?.[0]?.forecastWind }}
        </p>
      </div>
    </div>
    <div class="weather-footer-right">
      <div
        v-for="(forecast, index) in weatherData?.weatherForecast?.slice(0, 5)"
        :key="index"
        class="weather-footer-right-item"
      >
        <!-- 判断是不是今天 -->
        <p
          v-if="index === 0"
          class="p-content-right"
        >today</p>
        <!-- 星期几原本是中文，转换为英文开头三个字母 -->
        <p
          v-else
          class="p-content-right"
        >{{ forecast?.week?.slice(0, 3) }}</p>

        <img
          :src="`src/assets/weatherIcons/pic${forecast?.ForecastIcon}.png`"
          :alt="`pic${forecast?.ForecastIcon}`"
        />
        <p class="p-content-right">
          {{ forecast?.forecastMintemp?.value }}°C~{{ forecast?.forecastMaxtemp?.value }}°C
        </p>
        <!-- <p>最低温度: {{ forecast?.forecastMintemp?.value }}°C</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface WeatherData {
  weatherForecast?: {
    forecastDate?: string
    week?: string
    forecastWeather?: string
    forecastWind?: string
    forecastMaxtemp?: {
      value?: string
    }
    forecastMintemp?: {
      value?: string
    }
    ForecastIcon?: string
  }[]
}

const weatherData = ref<WeatherData>()

onMounted(() => {
  axios
    .get('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc')
    .then((response) => {
      weatherData.value = response.data
      console.log(weatherData.value)
      console.log(weatherData.value?.weatherForecast?.[0]?.ForecastIcon)
    })
    .catch((error) => {
      console.error('请求失败:', error)
    })
})
</script>

<style lang="scss" scoped>
.weather-footer {
  width: 100%;
  height: 100%;
  background: linear-gradient(358.97deg, #ffa500 -12.36%, #ffffff 189.94%);
  display: flex;
  direction: row;
  padding: 20px 30px;
  justify-content: space-between;
  img {
    width: 60px;
    height: 60px;
    color: #fff;
    filter: brightness(0) invert(1); /* 设置 SVG 图标的颜色 */
  }
  .weather-footer-left {
    width: 24%;
    display: flex;
    justify-content: row;
    flex-direction: column;
    row-gap: 48spx;
    .weather-footer-left-item {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
      justify-content: center;
      align-items: center;
    }
    .p-title {
      color: #fff;
      font-family: 'Adelle Sans Devanagari';
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      line-height: 30px; /* 125% */
    }
    .p-content {
      color: #fff;
      text-align: center;
      font-family: 'Adelle Sans Devanagari';
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 30px; /* 125% */
    }
    .p-content-right {
      color: #fff;
      font-family: 'Adelle Sans Devanagari';
      font-size: 26px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0.11px;
    }
  }
  .weather-footer-right {
    width: 68%;
    display: flex;
    justify-content: row;
    flex-direction: row;
    align-items: center;
    padding: 10px 0;
    column-gap: 10px;
    gap: 48px;
  }
  .weather-footer-right-item {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    align-items: center;
    font-weight: 400;
  }
}
</style>
