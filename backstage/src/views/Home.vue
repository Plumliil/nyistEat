<template>
  <div class="common-layout">
    <el-container class="container">
      <el-container>
        <el-aside class="aside" width="200px">
          <el-menu default-active="1" class="el-menu-vertical-demo">
            <router-link to="/home/dish">
              <el-menu-item index="1">
                <el-icon><icon-menu /></el-icon>
                <span>餐品</span>
              </el-menu-item>
            </router-link>
            <router-link to="/home/window">
              <el-menu-item index="2">
                <el-icon><icon-menu /></el-icon>
                <span>窗口</span>
              </el-menu-item>
            </router-link>
            <router-link to="/home/user">
              <el-menu-item index="3">
                <el-icon><icon-menu /></el-icon>
                <span>用户</span>
              </el-menu-item>
            </router-link>
            <router-link to="/home/Square">
              <el-menu-item index="4">
                <el-icon><document /></el-icon>
                <span>广场</span>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
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
      // background-color: aquamarine;
      // border-right: 1px solid gray;
    }
    .main {
      // background-color: bisque;
    }
  }
}
</style>
