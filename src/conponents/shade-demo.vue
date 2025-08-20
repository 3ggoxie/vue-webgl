<template>
  <div class="shade-root">
    <canvas width="100" height="100" ref="canRef"> </canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import droneSvg from '@/assets/icon.svg'
import { Canvg } from 'canvg'

type breathCircle = {
  radius: number
  alpha: number
  state: 'fading' | 'growing'
}
const canRef = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  if (canRef.value instanceof HTMLCanvasElement) {
    const ctx = canRef.value.getContext('2d')

    // 配置参数
    const config = {
      centerX: canRef.value.width / 2,
      centerY: canRef.value.height / 2, //中心点位置
      baseRadius: 5, // 新生圆半径
      maxRadius: 100, // 扩散最大半径
      growthSpeed: 0.2, // 扩散速度
      fadeStartRatio: 0.4, // 淡出阈值（扩散半径/扩散最大半径）
      spawnThreshold: 0.35, // 新生圆触发阈值
      baseColor: [255, 0, 255], // RGB基础色
      maxAlpha: 0.2, // 边缘最大透明度
      iconSize: 32, //icon大小
    }

    const iconImg = new Image()
    iconImg.src = droneSvg
    await new Promise((resolve) => (iconImg.onload = resolve)) // 等待加载完成

    // 创建离屏Canvas渲染SVG
    const offscreenCanvas = document.createElement('canvas')
    if (offscreenCanvas) {
      console.log(offscreenCanvas)
    }
    offscreenCanvas.width = config.iconSize
    offscreenCanvas.height = config.iconSize
    offscreenCanvas.style.color = 'pink'
    const offscreenCtx = offscreenCanvas.getContext('2d')

    if (offscreenCtx) {
      // 使用canvg渲染SVG到离屏Canvas
      const v = await Canvg.from(offscreenCtx, droneSvg)
      await v.render() // 等待渲染完成
    }

    const circles: breathCircle[] = [] // 圆环池

    // 第一个圆环
    circles.push({
      radius: config.baseRadius,
      alpha: config.maxAlpha,
      state: 'growing',
    })

    function render() {
      if (ctx && canRef.value) {
        ctx.clearRect(0, 0, canRef.value.width, canRef.value.height)

        // 更新绘制状态
        let shouldSpawnNew = false
        for (let i = circles.length - 1; i >= 0; i--) {
          const circle = circles[i]

          switch (circle.state) {
            case 'growing':
              circle.radius += config.growthSpeed
              // 触发淡出
              if (circle.radius > config.maxRadius * config.fadeStartRatio) {
                circle.state = 'fading'
                // 标记生成新圆环
                shouldSpawnNew = true
              }
              break

            case 'fading':
              circle.alpha *= 0.96
              if (circle.alpha <= 0.01) {
                circles.splice(i, 1)
                continue
              }
              break
          }

          // 径向渐变透明度
          // createRadialGradient(x0, y0, r0, x1, y1, r1)
          // 0：开始圆，1：结束圆
          const gradient = ctx.createRadialGradient(
            config.centerX,
            config.centerY,
            0,
            config.centerX,
            config.centerY,
            circle.radius,
          )

          // 渐变设置
          // addColorStop(offset, color)
          // offset：偏移量∈[0.1]。0：起始位置，1：结束位置。
          // color：颜色
          gradient.addColorStop(0, `rgba(${config.baseColor.join(',')}, 0)`)
          gradient.addColorStop(0.3, `rgba(${config.baseColor.join(',')}, 0)`) // 30%半径处完全透明
          gradient.addColorStop(0.8, `rgba(${config.baseColor.join(',')}, ${circle.alpha * 0.6})`)
          gradient.addColorStop(1, `rgba(${config.baseColor.join(',')}, ${circle.alpha})`)

          //根据参数绘圆
          ctx.beginPath()
          ctx.arc(config.centerX, config.centerY, circle.radius, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // 生成新圆环
        if (shouldSpawnNew || circles.length === 0) {
          circles.push({
            radius: config.baseRadius,
            alpha: config.maxAlpha,
            state: 'growing',
          })
        }

        // ctx.drawImage(img, canRef.value.width / 2, canRef.value.height / 2)
        if (offscreenCanvas) {
          const x = config.centerX - config.iconSize / 2
          const y = config.centerY - config.iconSize / 2
          ctx.drawImage(offscreenCanvas, x, y)
        }
        //下次重绘调用渲染函数
        requestAnimationFrame(render)
      }
    }

    // 启动动画
    render()
  }
})
</script>
<style scoped>
.shade-root {
  width: 100%;
  height: 100vh;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}
canvas {
  /* background: wheat; */
}
</style>
