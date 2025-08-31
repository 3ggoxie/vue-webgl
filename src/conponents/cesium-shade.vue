<template>
  <div id="cesiumContainer" style="width: 100%"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import {
  Ion,
  Viewer,
  Cartesian3,
  Color,
  PointGraphics,
  LabelGraphics,
  ScreenSpaceEventType,
  defined,
  HorizontalOrigin,
  VerticalOrigin,
  LabelStyle,
  HeightReference,
  Material,
  MaterialAppearance,
  EllipseGeometry,
  GeometryInstance,
  Primitive,
  ScreenSpaceEventHandler,
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

onMounted(() => {
  Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MDEzOTlkMS02NGNkLTQyNDYtOWU2YS03ZGFhZTFmMThhZGEiLCJpZCI6MzEwNzc4LCJpYXQiOjE3NDk1MzMzNzN9.PUNeA9lTn8QkCnriv1uIpbYR8PEwGCcVhSblWHLlegA'

  const viewer = new Viewer('cesiumContainer', {
    animation: false, // 移除动画控件
    timeline: false, // 移除时间轴控件
    geocoder: false, // 移除地理编码控件
    homeButton: false, // 移除主页按钮
    sceneModePicker: false, // 移除场景模式选择器
    selectionIndicator: false, // 移除选择指示器
    fullscreenButton: false, // 移除全屏按钮
    vrButton: false, // 移除 VR 按钮
  })

  // 创建波纹扩散函数
  function createRippleEffect(
    viewer: Viewer,
    longitude: number,
    latitude: number,
    radius: number,
    color: string,
    speed: number,
  ) {
    const instance = new GeometryInstance({
      geometry: new EllipseGeometry({
        center: Cartesian3.fromDegrees(longitude, latitude, 0),
        semiMinorAxis: radius,
        semiMajorAxis: radius,
      }),
    })

    const appearance = new MaterialAppearance({
      material: new Material({
        fabric: {
          uniforms: {
            color: Color.fromCssColorString(color),
            speed: speed,
          },
          source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
              czm_material material = czm_getDefaultMaterial(materialInput);
              material.diffuse = 1.5 * color.rgb;
              vec2 st = materialInput.st;
              float dis = distance(st, vec2(0.5, 0.5));

              // 创建三道波纹，每道间隔0.3的时间
              float per1 = fract(czm_frameNumber * 0.032 * speed);
              float per2 = fract((czm_frameNumber * 0.032 * speed) - 0.3);
              float per3 = fract((czm_frameNumber * 0.032 * speed) - 0.6);

              // 计算每道波纹的透明度
              float pass1 = step(per1 * 0.3, dis) == 0.0? color.a * dis / per1: 0.0;
              float pass2 = step(per2 * 0.3, dis) == 0.0? color.a * dis / per2: 0.0;
              float pass3 = step(per3 * 0.3, dis) == 0.0? color.a * dis / per3: 0.0;

              // 实现渐变消失效果
              pass1 = pass1 * (1.0 - per1) * 2.0;
              pass2 = pass2 * (1.0 - per2) * 2.0;
              pass3 = pass3 * (1.0 - per3) * 2.0;

              // 取最大值作为最终透明度
              material.alpha = max(max(pass1, pass2), pass3);
              return material;
            }
          `,
        },
      }),
    })

    return viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: instance,
        appearance: appearance,
      }),
    )
  }

  createRippleEffect(viewer, 121.65, 29.89, 100, 'rgba(0, 255, 255, 0.8)', 0.2)

  // 为波纹中心添加标注点和标签
  viewer.entities.add({
    id: 'ripple-center',
    name: '波纹中心',
    position: Cartesian3.fromDegrees(121.65, 29.89),
    point: new PointGraphics({
      pixelSize: 8,
      color: Color.CYAN,
      outlineColor: Color.WHITE,
      outlineWidth: 2,
      heightReference: HeightReference.CLAMP_TO_GROUND,
    }),
    label: new LabelGraphics({
      text: '波纹扩散',
      font: '14pt Arial',
      fillColor: Color.CYAN,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      style: LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cartesian3(0, -60, 0),
      horizontalOrigin: HorizontalOrigin.CENTER,
      verticalOrigin: VerticalOrigin.BOTTOM,
    }),
  })

  // ==================== 设置相机视角 ====================
  // viewer.camera.setView({
  //   destination: Cartesian3.fromDegrees(116, 30, 3000000),
  //   orientation: {
  //     heading: 0.0,
  //     pitch: -0.99,
  //     roll: 0.0,
  //   },
  // })
  // 使用 flyTo 方法，自动计算最佳视角
  // viewer.flyTo(viewer.entities)

  // ==================== 点击事件处理 ====================

  viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(function onLeftClick(
    event: ScreenSpaceEventHandler.PositionedEvent,
  ) {
    const pickedObject = viewer.scene.pick(event.position)
    if (defined(pickedObject) && defined(pickedObject.id)) {
      console.log('点击的动画标注:', pickedObject.id.name || pickedObject.id.id)

      if (pickedObject.id.name) {
        alert(`点击了: ${pickedObject.id.name}`)
      }
    }
  }, ScreenSpaceEventType.LEFT_CLICK)

  console.log('标注动画示例已加载！')
  console.log('可以使用 pauseAnimations() 和 resumeAnimations() 来控制动画')
})
</script>

<style>
.cesium-viewer .cesium-widget-credits {
  display: none !important;
}

.cesium-viewer .cesium-viewer-toolbar {
  display: none !important;
}
#cesiumContainer{
  width: 100%;
  height: 100%;
}
</style>
