<template>
  <div>
    <div>
      <img  src="@/assets/img/404_images/404.png" alt="404" style="width:800px; margin:20px;">
    </div>
    <div>
      <div style="font-size: 32px;font-weight: bold;line-height: 40px;color: #1482f0;">OOPS!</div>
      <!-- <div class="bullshit__info">All rights reserved -->
        <!-- <a style="color:#20a0ff" href="https://wallstreetcn.com" target="_blank">wallstreetcn</a> -->
      <!-- </div> -->
      <div style="font-size: 20px;line-height: 24px;color: #222;font-weight: bold;">{{ message }}</div>
      <div style="font-size: 13px;line-height: 21px;color: grey;">Please check that the URL you entered is correct, or click the button below to return to the homepage.</div>
      <a href="/home" class="bullshit__return-home" 
        style="width: 310px;height: 66px;background: #1482f0;
              border-radius: 100px;text-align: center;color: #ffffff;font-size: 15px;
              line-height: 36px;cursor: pointer;">Back to home</a>
    </div>   
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style scoped>

</style>