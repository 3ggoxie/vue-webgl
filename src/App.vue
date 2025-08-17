<template>
  <h1>hello,webgl</h1>
  <canvas width="800" height="800" ref="canvasRef" class="canv"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import missW from './assets/missW.jpg';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const img = new Image()
img.src = missW


onMounted(() => {
  if (canvasRef.value instanceof HTMLCanvasElement) { // 类型守卫
    const ctx = canvasRef.value.getContext('2d');
    if (ctx) {
      img.onload = function () {
        ctx.drawImage(img, 0, 0)
      }
    }
  }
});
</script>



<style scoped>
canvas {
  background: wheat;
}
</style>
