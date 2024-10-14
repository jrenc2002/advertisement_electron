<template>
  <div class="home">
    <div class="home-content">
      <div class="home-body">
        <div class="home-body-title">緊急通告</div>
        <div class="home-body-nav">
          <!-- <div class="home-body-nav-item">緊急通告</div>
          <div class="home-body-nav-item">一般通告</div>
          <div class="home-body-nav-item">法團通告</div>
          <div class="home-body-nav-item">政府通告</div> -->
          <router-link to="/urgentNotice">緊急通告</router-link>
          <router-link to="/generalNotice">一般通告</router-link>
          <router-link to="/legalNotice">法團通告</router-link>
          <router-link to="/governmentNotice">政府通告</router-link>
        </div>
      </div>
      <div class="home-body-content">

      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  .home-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .home-return-button {
      display: flex;
      justify-content: start;
      align-items: start;
      gap: 3px;
      align-self: stretch;
      border-radius: 3px;
      background: #fff;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
      button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 3px;
        border: none;
        margin-left: 20px;
        margin-top: 10px;
        background: none;
        cursor: pointer;
        color: #ffa500;
        font-family: 'Adelle Sans Devanagari';
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px; /* 100% */
        letter-spacing: 2.8px;
        border-radius: 3px;
        border: 1px solid white;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
      }
    }
    .home-body {
      display: flex;
      flex-direction: column;
      background-color: rgb(128, 128, 224);
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      .home-body-title {
        color: #000;
        font-family: 'Adelle Sans Devanagari';
        font-size: 38px;
        font-style: normal;
        font-weight: 700;
        line-height: 44px;
        letter-spacing: 4.8px;
      }
      .home-body-nav {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 60%;
        justify-content: space-between;
        align-items: center;

        .home-body-nav-item {
          color: #888;
          font-family: 'Adelle Sans Devanagari';
          font-size: 24px;
          font-style: normal;
          font-weight: 400;
          line-height: 28px; /* 116.667% */
          text-decoration-line: underline;
        }
      }
    }
  }
}
</style>
