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
          <img
            :src="`src/assets/weatherIcons/pic${weatherData_today?.icon[0]}.png`"
            :alt="`pic${weatherData_today?.icon[0]}`"
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
          class="p-content-right"
        >{{ forecast?.week?.slice(0, 3) }}</p>
        <img
          :src="`src/assets/weatherIcons/pic${forecast?.ForecastIcon}.png`"
          :alt="`pic${forecast?.ForecastIcon}`"
        />
        <!-- <p class="p-content">
          {{ getWeatherDetails(forecast?.ForecastIcon || 50) }}
        </p> -->
        <p class="p-content-right">
          {{ forecast?.forecastMintemp?.value }}°C~{{ forecast?.forecastMaxtemp?.value }}°C
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
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
