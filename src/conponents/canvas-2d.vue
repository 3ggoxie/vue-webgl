<template>
  <canvas width="800" height="800" ref="canvasRef" class="canv"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canvasRef.value instanceof HTMLCanvasElement) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true)
      ctx.moveTo(110, 75)
      ctx.arc(75, 75, 35, 0, Math.PI, false)
      ctx.moveTo(65, 65)
      ctx.arc(60, 65, 5, 0, Math.PI * 2, true)
      ctx.moveTo(95, 65)
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true)
      ctx.stroke()
    }
  }
})
</script>

<style scoped>
canvas {
  background: wheat;
}
</style>
