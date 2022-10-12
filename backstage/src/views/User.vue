<template>
  <el-card class="campus-card">
    <div class="header">
      <!-- <el-button type="primary" @click="addData">添加</el-button> -->
      <el-input
        v-model="searchQuery.value"
        class="searchIpt"
        placeholder="Type something"
      >
        <template #prepend>
          <el-button :icon="Search" @click="search" />
        </template>
        <template #append>
          <el-select
            v-model="searchQuery.type"
            placeholder="Select"
            style="width: 90px"
          >
            <el-option label="昵称" value="name" />
            <el-option label="email" value="email" />
          </el-select>
        </template>
      </el-input>
    </div>
    <el-divider />
    <el-table :data="userData" style="width: 100%">
      <el-table-column prop="_id" label="id" />
      <el-table-column prop="image" label="图片">
        <template v-slot="scope">
          <img
            style="width: 50px; height: 50px"
            :src="scope.row.image"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="gender" label="性别">
        <template v-slot="scope">
          <p>{{scope.row.gender===0?'男':'女'}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="__v" label="活跃度" />
      <el-table-column prop="updatedAt" label="最近更新时间" />
      <!-- <el-table-column fixed="right" label="Operations">
        <template v-slot="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="deleteDish(scope.row)"
            >删除</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="EditDish(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "User",
};
</script>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import axios from "axios";

const searchQuery = reactive({
  type: "",
  value: "",
  limit: 10,
  offset: 0,
});
let userData = ref([]);
// 分页
let total = ref(0);

async function getUserData() {
  // userData.value=[];
  const { data: user } = await axios.get(
    `user/adminGet?type=${searchQuery.type}&value=${searchQuery.value}&limit=${searchQuery.limit}&offset=${searchQuery.offset}`
  );
  userData.value = user.list;
  total.value = user.count;
  console.log(user);
  console.log(userData);
}

onMounted(async () => {
  //   getuserData();
  getUserData();
  console.log("mounted");
});

const search = async () => {
  getUserData();
};
</script>

<style lang="less" scoped>
.campus-card {
  margin: 10px;
  min-height: 600px;
  .header {
    display: flex;
    justify-content: space-between;
    .searchIpt {
      width: 300px;
    }
  }

  .demo-pagination-block + .demo-pagination-block {
    margin-top: 10px;
  }
  .demo-pagination-block .demonstration {
    margin-bottom: 16px;
  }
}
.uploadImg {
  width: 90%;
  margin: 0 auto;
  // background-color: pink;
  height: 30px;
  display: flex;
  justify-content: center;
  // background-color: aqua;
  div {
    // flex: 1;
    position: relative;
    // width: 70px;
    // background-color: red;
    input {
      position: absolute;
    }
    .btn {
      height: 30px;
      width: 70px;
      margin-left: 15px;
      border: 1px solid #dcdfe6;
      background-color: #ffffff;
      border-radius: 3px;
    }
  }
  span {
    flex: 1;
    display: inline-block;
  }
}
</style>
