<template>
  <el-card class="campus-card">
    <div class="header">
      <el-input
        v-model="searchValue"
        class="searchIpt"
        placeholder="Type something"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
    </div>
    <el-divider />
    <el-table :data="windowData" style="width: 100%">
      <el-table-column prop="_id" label="id" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="dishes" label="菜品">
        <template v-slot="scope">
          <div v-for="(item, index) in scope.row.dishes" :key="index">
            <p style="display: inline-block; padding: 0 10px">
              {{ index + 1 }}   :  {{ item.name }}
            </p>
            <!-- <p>{{ item}}</p> -->
            <el-button
              link
              type="primary"
              size="small"
              @click="detailDish(item)"
              >查看</el-button
            >
            <!-- <el-button link type="primary" size="small" @click="EditDish(item)"
              >编辑</el-button
            > -->
            <el-button
              link
              type="primary"
              size="small"
              @click="deleteDish(item)"
              >删除</el-button
            >
            <p
              style="
                margin: 5px;
                border-top: 1px solid rgba(128, 128, 128, 0.5);
              "
            ></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="classification" label="分类" />
      <el-table-column prop="address" label="位置" />
      <el-table-column prop="updatedAt" label="最近更新时间" />
      <el-table-column fixed="right" label="Operations">
        <template v-slot="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="confirmOperation(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="top"></div>
  </el-card>

  <el-dialog v-model="detailDialogForm" title="dish detail">
    <el-form :model="dishDetailForm" label-position="left">
      <el-form-item label="image" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.image"
          placeholder="https://sm.ms/image/pjZ5atWzcGyPlYq"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="name" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.value.name"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="price" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.value.price"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="score" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.value.score"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="like" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.value.like"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="window" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.value.window"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="address" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.value.address"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="classification" :label-width="100">
        <el-input
          disabled
          v-model="dishDetailForm.value.classification"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="detailDialogForm = false">Cancel</el-button>
        <el-button type="primary" @click="confirmPost" :disabled="postBtn"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "Window",
};
</script>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

let windowData = reactive([]);

onMounted(async () => {
  const { data: window } = await axios.get("window/get");
  windowData.push(...window.windowList);
  console.log(windowData);
  //   windowData.forEach(item=>{
  //     item.dishes.forEach((item1,index1)=>{
  //         if(!item1){
  //             item.splice(index1,1);
  //         }
  //     })
  //   })
});

const searchValue = ref("");
const detailDialogForm = ref(false);
const dishDetailForm = reactive({});

const detailDish = async (v) => {
  detailDialogForm.value = true;
  dishDetailForm.value = v;
};

const deleteDish = async (v) => {
  const dishDelete = await axios.post("dish/delete", v);
  console.log(dishDelete);
  ElMessage({
    showClose: true,
    message: "success delete",
    type: "success",
  });
};

// const EditDish = () => {
//   ElMessage({
//     showClose: true,
//     message: "success edit",
//     type: "success",
//   });
// };

const deleteWindow = async (v) => {
  const windowDelete = await axios.post("window/delete", v);
  console.log(windowDelete);
};

const confirmOperation = (v) => {
  ElMessageBox.confirm("是否要删除该食堂窗口?", "Warning", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  })
    .then(() => {
      deleteWindow(v);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
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
}
</style>
