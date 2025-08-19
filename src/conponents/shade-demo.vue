<template>
  <div class="shade-root">
    <canvas width="600" height="600" ref="canRef"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
type breathCircle = {
  radius: number
  alpha: number
  state: 'fading' | 'growing'
}
const canRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canRef.value instanceof HTMLCanvasElement) {
    const ctx = canRef.value.getContext('2d')

    // 配置参数
    const config = {
      centerX: canRef.value.width / 2,
      centerY: canRef.value.height / 2,
      baseRadius: 5, // 新生圆半径
      maxRadius: 100, // 扩散最大半径
      growthSpeed: 0.2, // 扩散速度
      fadeStartRatio: 0.4, // 淡出起始比例
      spawnThreshold: 0.35, // 新生圆触发阈值
      baseColor: [255, 0, 0], // RGB基础色
      maxAlpha: 0.2, // 边缘最大透明度
    }

    const circles: breathCircle[] = [] // 圆环池

    // 初始化第一个圆环
    circles.push({
      radius: config.baseRadius,
      alpha: config.maxAlpha,
      state: 'growing',
    })

    function render() {
      if (ctx && canRef.value) {
        ctx.clearRect(0, 0, canRef.value.width, canRef.value.height)

        // 更新并绘制所有圆环
        let shouldSpawnNew = false
        for (let i = circles.length - 1; i >= 0; i--) {
          const circle = circles[i]

          switch (circle.state) {
            case 'growing':
              circle.radius += config.growthSpeed
              // 提前触发淡出（原80%半径时淡出）
              if (circle.radius > config.maxRadius * config.fadeStartRatio) {
                circle.state = 'fading'
                shouldSpawnNew = true // 标记需要新生圆环
              }
              break

            case 'fading':
              circle.alpha *= 0.96 // 非线性衰减（更平滑）
              if (circle.alpha <= 0.01) {
                circles.splice(i, 1)
                continue
              }
              break
          }

          // 核心改进：径向渐变透明度重构
          const gradient = ctx.createRadialGradient(
            config.centerX,
            config.centerY,
            0,
            config.centerX,
            config.centerY,
            circle.radius,
          )
          // 圆心完全透明 → 80%半径处完全透明 → 边缘80%透明度
          gradient.addColorStop(0, `rgba(${config.baseColor.join(',')}, 0)`)
          gradient.addColorStop(0.3, `rgba(${config.baseColor.join(',')}, 0)`) // 30%半径处完全透明
          gradient.addColorStop(0.8, `rgba(${config.baseColor.join(',')}, ${circle.alpha * 0.6})`)
          gradient.addColorStop(1, `rgba(${config.baseColor.join(',')}, ${circle.alpha})`)

          ctx.beginPath()
          ctx.arc(config.centerX, config.centerY, circle.radius, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // 新生圆环逻辑
        if (shouldSpawnNew || circles.length === 0) {
          circles.push({
            radius: config.baseRadius,
            alpha: config.maxAlpha,
            state: 'growing',
          })
        }

        requestAnimationFrame(render)
      }
    }

    // 启动动画
    render()
  }
})
</script>
<style scoped>
canvas {
  background: wheat;
}
</style>
