<template>
  <div class="container">
    <h1 style="text-align: center;">Hello WebGL</h1>
    <nav>
      <RouterLink to="/canvas">画布</RouterLink>
      <RouterLink to="/shade">着色器</RouterLink>
      <RouterLink to="/map">地图</RouterLink>
      <RouterLink to="/table">表格</RouterLink>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>

</template>

<script setup lang="ts">


</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

.content {
  border: 5px solid rebeccapurple;
  height: calc(100vh - 70px);
}
nav{
  display: flex;
  flex-flow: row nowrap;
  gap: 5px;
  justify-content: center;
}
</style>
