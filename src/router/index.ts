import { createMemoryHistory, createRouter } from 'vue-router'
import canvas2d from '@/conponents/canvas-2d.vue'
import shadeDemo from '@/conponents/shade-demo.vue'
import cesiumShade from '@/conponents/cesium-shade.vue'
import loadTable from '@/conponents/load-table.vue'

const routes = [
  { path: '/canvas', component: canvas2d },
  { path: '/shade', component: shadeDemo },
  {path:'/map',component:cesiumShade},
  {path:'/table',component:loadTable}
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
