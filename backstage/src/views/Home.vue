<template>
  <div class="common-layout">
    <el-container class="container">
      <el-container>
        <el-aside class="aside" width="200px">
          <el-menu :default-active="activeRouter" class="el-menu-vertical-demo">
            <router-link to="/home/dish">
              <el-menu-item index="/home/dish">
                <el-icon><icon-menu /></el-icon>
                <span>餐品</span>
              </el-menu-item>
            </router-link>
            <router-link to="/home/window">
              <el-menu-item index="/home/window">
                <el-icon><icon-menu /></el-icon>
                <span>窗口</span>
              </el-menu-item>
            </router-link>
            <router-link to="/home/user">
              <el-menu-item index="/home/user">
                <el-icon><icon-menu /></el-icon>
                <span>用户</span>
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

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

let activeRouter = ref("/home/dish");
watch(
  activeRouter,
  () => {
    activeRouter.value = route.path;
  },
  { immediate: true }
);
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
