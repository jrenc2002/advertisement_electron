<template>
  <div class="weather-footer">
    <div class="weather-footer-left">
      <div class="weather-footer-left-item">
        <p>{{ weatherData?.weatherForecast?.[0]?.forecastDate }}</p>
        <p>{{ weatherData?.weatherForecast?.[0]?.week }}</p>
        <p>{{ weatherData?.weatherForecast?.[0]?.forecastWeather }}</p>
        <p>{{ weatherData?.weatherForecast?.[0]?.forecastWind }}</p>
        <p>最高温度:
          {{ weatherData?.weatherForecast?.[0]?.forecastMaxtemp?.value }}°C</p>
        <p>最低温度:
          {{ weatherData?.weatherForecast?.[0]?.forecastMintemp?.value }}°C</p>
        <!-- <img
          :src="`/path/to/icons/${weatherData?.weatherForecast?.[0]?.ForecastIcon}.png`"
          alt="Weather Icon"
        /> -->
      </div>
    </div>
    <div class="weather-footer-right">
      <div
        v-for="(forecast, index) in weatherData?.weatherForecast?.slice(1, 6)"
        :key="index"
        class="weather-footer-right-item"
      >
        <p>{{ forecast?.week }}</p>
        <p>最高温度: {{ forecast?.forecastMaxtemp?.value }}°C</p>
        <p>最低温度: {{ forecast?.forecastMintemp?.value }}°C</p>
        <!-- <img
          :src="`/path/to/icons/${forecast?.ForecastIcon}.png`"
          alt="Weather Icon"
        /> -->
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
  row-gap: 30px;
  justify-content: space-between;
  .weather-footer-left {
    width: 24%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    row-gap: 10px;
  }
  .weather-footer-right-item {
    margin-bottom: 10px;
  }
}
</style>
