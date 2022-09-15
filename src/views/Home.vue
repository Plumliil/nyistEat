<template>
  <div class="common-layout">
    <el-container class="container">
      <!-- <el-header class="header">Header</e
        l-header> -->
      <el-container>
        <el-aside class="aside" width="200px">Aside</el-aside>
        <el-main class="main">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.common-layout {
  * {
  margin: 0;
  padding: 0;
}
  .container {
    height: 100vh;
    .header {
      background-color: antiquewhite;
    }
    .aside {
      background-color: aquamarine;
    }
    .main {
      background-color: bisque;
    }
  }
}
</style>
