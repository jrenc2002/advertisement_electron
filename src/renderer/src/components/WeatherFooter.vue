<template>
  <div class="weather-footer">
    <div class="weather-footer-left">
      <div class="weather-footer-left-item">
        <!-- Display formatted date -->
        <p class="p-title">
          {{
            new Date(weatherData_today?.temperature?.recordTime || new Date()).toLocaleDateString(
              'zh-CN',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }
            )
          }}
        </p>
        <!-- Display day of the week -->
        <p class="p-title">
          {{
            new Date(weatherData_today?.temperature?.recordTime || new Date()).toLocaleDateString(
              'zh-CN',
              {
                weekday: 'long'
              }
            )
          }}
        </p>
        <div class="div-today">
          <!-- <img
            :src="`src/assets/weatherIcons/pic${weatherData_today?.icon[0]}.png`"
            :alt="`pic${weatherData_today?.icon[0]}`"
          /> -->
          <img
            :src="getWeatherIcon(weatherData_today?.icon[0] || 50)"
            alt=""
          />
          <!-- Display temperature for "九龙城" -->
          <p class="p-content">
            {{
              weatherData_today?.temperature?.data.find((item) => item.place === '九龙城')?.value
            }}°C
          </p>
        </div>
        <!-- <p class="p-content">
          {{ getWeatherDetails(weatherData_today?.icon[0] || 50) }}
        </p> -->

        <div
          v-for="(warning, key) in weatherData_warning"
          :key="key"
        >
          <p class="p-content">{{ warning.name }}</p>
        </div>
      </div>
    </div>
    <div class="weather-footer-right">
      <div
        v-for="(forecast, index) in weatherData_forecast?.weatherForecast?.slice(0, 5)"
        :key="index"
        class="weather-footer-right-item"
      >
        <!-- 这换成月份和日,不需要年份 -->
        <p v-if="index === 0">Tomorrow</p>
        <p
          v-else
          class="p-content-right-week-temperature"
        >{{ forecast?.week?.slice(0, 3) }}</p>
        <!-- <img
          :src="`src/assets/weatherIcons/pic${forecast?.ForecastIcon}.png`"
          :alt="`pic${forecast?.ForecastIcon}`"
        /> -->
        <img
          :src="getWeatherIcon(forecast?.ForecastIcon || 50)"
          alt=""
        />
        <!-- <p class="p-content">
          {{ getWeatherDetails(forecast?.ForecastIcon || 50) }}
        </p> -->
        <p class="p-content-right-week-temperature">
          {{ forecast?.forecastMintemp?.value }}°C~{{ forecast?.forecastMaxtemp?.value }}°C
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import img50 from '@renderer/assets/weatherIcons/pic50.png'
import img51 from '@renderer/assets/weatherIcons/pic51.png'
import img52 from '@renderer/assets/weatherIcons/pic52.png'
import img53 from '@renderer/assets/weatherIcons/pic53.png'
import img54 from '@renderer/assets/weatherIcons/pic54.png'

import img60 from '@renderer/assets/weatherIcons/pic60.png'
import img61 from '@renderer/assets/weatherIcons/pic61.png'
import img62 from '@renderer/assets/weatherIcons/pic62.png'
import img63 from '@renderer/assets/weatherIcons/pic63.png'
import img64 from '@renderer/assets/weatherIcons/pic64.png'
import img65 from '@renderer/assets/weatherIcons/pic65.png'

import img70 from '@renderer/assets/weatherIcons/pic70.png'
import img71 from '@renderer/assets/weatherIcons/pic71.png'
import img72 from '@renderer/assets/weatherIcons/pic72.png'
import img73 from '@renderer/assets/weatherIcons/pic73.png'
import img74 from '@renderer/assets/weatherIcons/pic74.png'
import img75 from '@renderer/assets/weatherIcons/pic75.png'
import img76 from '@renderer/assets/weatherIcons/pic76.png'
import img77 from '@renderer/assets/weatherIcons/pic77.png'

import img80 from '@renderer/assets/weatherIcons/pic80.png'
import img81 from '@renderer/assets/weatherIcons/pic81.png'
import img82 from '@renderer/assets/weatherIcons/pic82.png'
import img83 from '@renderer/assets/weatherIcons/pic83.png'
import img84 from '@renderer/assets/weatherIcons/pic84.png'
import img85 from '@renderer/assets/weatherIcons/pic85.png'

import img90 from '@renderer/assets/weatherIcons/pic90.png'
import img91 from '@renderer/assets/weatherIcons/pic91.png'
import img92 from '@renderer/assets/weatherIcons/pic92.png'
import img93 from '@renderer/assets/weatherIcons/pic93.png'

const getWeatherIcon = (icon: number) => {
  switch (icon) {
    case 50:
      return img50
    case 51:
      return img51
    case 52:
      return img52
    case 53:
      return img53
    case 54:
      return img54
    case 60:
      return img60
    case 61:
      return img61
    case 62:
      return img62
    case 63:
      return img63
    case 64:
      return img64
    case 65:
      return img65
    case 70:
      return img70
    case 71:
      return img71
    case 72:
      return img72
    case 73:
      return img73
    case 74:
      return img74
    case 75:
      return img75
    case 76:
      return img76
    case 77:
      return img77
    case 80:
      return img80
    case 81:
      return img81
    case 82:
      return img82
    case 83:
      return img83
    case 84:
      return img84
    case 85:
      return img85
    case 90:
      return img90
    case 91:
      return img91
    case 92:
      return img92
    case 93:
      return img93
    default:
      return img50
  }
}
// import { getWeatherDetails } from '@renderer/data/iconIds'

interface WeatherData_forecast {
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
    ForecastIcon?: number
  }[]
}
interface RainfallItem {
  unit: string
  place: string
  max: number
  main: string
}

interface TemperatureItem {
  place: string
  value: number
  unit: string
}

interface HumidityItem {
  unit: string
  value: number
  place: string
}

interface WeatherData_today {
  rainfall: {
    data: RainfallItem[]
    startTime: string
    endTime: string
  }
  warningMessage: string
  icon: number[]
  iconUpdateTime: string
  uvindex: string
  updateTime: string
  temperature: {
    data: TemperatureItem[]
    recordTime: string
  }
  tcmessage: string
  mintempFrom00To09: string
  rainfallFrom00To12: string
  rainfallLastMonth: string
  rainfallJanuaryToLastMonth: string
  humidity: {
    recordTime: string
    data: HumidityItem[]
  }
}
interface WeatherData_today_detail {
  // generalSituation: '一股干燥的偏东气流正为广东沿岸带来普遍晴朗的天气。下午本港大部分地区的相对湿度维持在百分之六十以下。'
  // tcInfo: ''
  // fireDangerWarning: ''
  // forecastPeriod: '本港地区今晚及明日天气预测'
  // forecastDesc: '大致天晴。明早最低气温约26度，日间干燥，市区最高气温约30度，新界再高一两度。吹和缓至清劲偏东风，初时离岸及高地间中吹强风。'
  // outlook: '随后数日云量较多，下周中期有几阵骤雨。'
  // updateTime: '2024-10-12T18:45:00+08:00'
  generalSituation: string
  tcInfo: string
  fireDangerWarning: string
  forecastPeriod: string
  forecastDesc: string
  outlook: string
  updateTime: string
}
const weatherData_forecast = ref<WeatherData_forecast>()
const weatherData_today = ref<WeatherData_today>()
const weatherData_today_detail = ref<WeatherData_today_detail>()
const weatherData_warning = ref()

onMounted(() => {
  axios
    .get('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en  ')
    .then((response) => {
      weatherData_forecast.value = response.data
      console.log(weatherData_forecast.value)
    })
    .catch((error) => {
      console.error('请求未来天气失败:', error)
    })

  axios
    .get('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=sc')
    .then((response) => {
      weatherData_today.value = response.data
      console.log(weatherData_today.value)
    })
    .catch((error) => {
      console.error('请求今日天气失败:', error)
    })
  axios
    .get('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=sc')
    .then((response) => {
      weatherData_today_detail.value = response.data
      console.log(weatherData_today_detail.value)
    })
    .catch((error) => {
      console.error('请求今日天气详情失败:', error)
    })
  axios
    .get('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=sc')
    .then((response) => {
      weatherData_warning.value = response.data
      console.log(weatherData_warning.value)
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
    column-gap: 10px;
    gap: 10px;
    justify-content: center;
    .weather-footer-left-item {
      display: flex;
      flex-direction: column;
      align-items: center; // 确保子元素水平居中
      justify-content: center; // 确保子元素垂直居中
      gap: 10px;
      width: 100%; // 占满父容器的宽度
      .div-today {
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: end;
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
      .p-content-right-week-temperature {
        color: #fff;
        font-family: 'Adelle Sans Devanagari';
        font-size: 26px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.11px;
      }
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
