<template>
  <el-card class="campus-card">
    <div class="header">
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
            <el-option label="窗口" value="name" />
            <el-option label="分类" value="classification" />
          </el-select>
        </template>
      </el-input>
    </div>
    <el-divider />
    <el-table :data="windowData" style="width: 100%" table-layout="auto">
      <el-table-column type="index" label="#" align="center" />
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="image" label="图片" align="center">
        <template v-slot="scope">
          <img
            style="width: 150px; height: 100px"
            :src="scope.row.image"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="dishes" label="菜品" align="center">
        <template v-slot="scope">
          <div class="dishes">
            <div v-for="(item, index) in scope.row.dishes" :key="index">
              <p style="display: inline-block; padding: 0 10px">
                {{ index + 1 }} : {{ item.name }}
              </p>
              <el-button
                link
                type="primary"
                size="small"
                @click="detailDish(item)"
                >查看</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="deleteDish(item)"
                >删除</el-button
              >
            </div>
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
          <el-button
            link
            type="primary"
            size="small"
            @click="editWindow(scope.row)"
            >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="top"></div>
  </el-card>

  <el-dialog v-model="updateDialog" title="图片修改">
    <el-form :model="updateForm" label-position="left">
      <el-form-item label="图片">
        <div class="uploadImg">
          <div>
            <input class="btn" type="button" value="选择" />
            <input
              style="opacity: 0"
              @change="imageSub"
              type="file"
              multiple="multiple"
            />
          </div>
          <span>{{ updateForm.image }}</span>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="postUpdateData"
          >添加</el-button
        >
      </span>
    </template>
  </el-dialog>

  <div class="demo-pagination-block">
    <el-pagination
      v-model:currentPage="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 50]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
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
import { transAddress } from "../utils/index";
let windowData = ref([]);
let total = ref(0);

async function getWindowData() {
  console.log(searchQuery);
  const { data: window } = await axios.get(
    `window/get?type=${searchQuery.type}&value=${searchQuery.value}&limit=${searchQuery.limit}&offset=${searchQuery.offset}`
  );
  windowData.value = window.list;
  windowData.value.forEach((item) => {
    item.updatedAt = item.updatedAt.substring(0, 10);
    item.address = transAddress(item.address).join("-");
  });
  total.value = window.count;
}

onMounted(async () => {
  getWindowData();
});
const searchQuery = reactive({
  type: "",
  value: "",
  limit: 10,
  offset: 0,
});

const search = async () => {
  getWindowData();
};

const handleSizeChange = (val) => {
  searchQuery.limit = val;
  getWindowData();
};
const handleCurrentChange = (val) => {
  searchQuery.offset = 10 * (val - 1);
  getWindowData();
};
const detailDialogForm = ref(false);
const dishDetailForm = reactive({});

const detailDish = async (v) => {
  detailDialogForm.value = true;
  dishDetailForm.value = v;
};

const deleteDish = async (v) => {
  const dishDelete = await axios.post("window/dishDelete", v);
  console.log(dishDelete);
  ElMessage({
    showClose: true,
    message: "success delete",
    type: "success",
  });
};

const deleteWindow = async (v) => {
  const windowDelete = await axios.post("window/delete", v);
  if (windowDelete.status === 200) {
    setTimeout(() => {
      getWindowData();
    }, 1000);
  }
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

let updateDialog = ref(false);
let updateForm = reactive({
  image: "http://180.76.195.252:3366/public/default/dishImg.png",
});
const editWindow = (v) => {
  updateDialog.value = true;
  console.log(v);
  updateForm._id=v._id;
};

const imageSub = async (e) => {
  let files = e.target.files;
  // // 上传部分
  let data = new FormData();
  for (let i = 0; i < files.length; i++) {
    data.append("file", files[i]);
  }
  let { data: imgResponse } = await axios.post("upload/window", data);
  console.log(imgResponse);
  updateForm.image = imgResponse.img.url;
};

const postUpdateData=async ()=>{
  console.log(updateForm);
  let { data: window } = await axios.post('window/imgUpdate',updateForm);
  console.log(window);
  if(window.state==='success'){
    updateDialog.value = false;
    getWindowData();
  }
}
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
.dishes {
  // background-color: pink;
  overflow-y: scroll;
  max-height: 200px;
  p {
    margin: 5px;
    // border-top: 1px solid rgba(128, 128, 128, 0.5);
  }
}
.uploadImg {
  width: 90%;
  margin: 0 auto;
  height: 30px;
  display: flex;
  justify-content: center;
  div {
    position: relative;
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
