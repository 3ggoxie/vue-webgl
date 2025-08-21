<template>
  <div class="container">
    <h1 style="text-align: center" id="myElement">hello,webgl</h1>
    <!-- <canvas2d></canvas2d> -->
    <!-- <shadeDemo></shadeDemo> -->
    <cesium-shade class="map"></cesium-shade>
  </div>
</template>

<script setup lang="ts">
// import canvas2d from './conponents/canvas-2d.vue'
// import shadeDemo from '@/conponents/shade-demo.vue'
import { onMounted } from 'vue'
import cesiumShade from './conponents/cesium-shade.vue'
onMounted(() => {
  const h = document.getElementById('myElement')
  console.log('ssg', h?.offsetHeight)
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
.map {
  height: calc(100vh - 43px);
}
</style>
