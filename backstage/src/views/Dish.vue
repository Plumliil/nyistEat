<template>
  <el-card class="campus-card">
    <div class="header">
      <!-- 添加食物 -->
      <el-button type="primary" @click="addData">添加</el-button>
      <!-- 搜索 -->
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
            <el-option label="菜名" value="name" />
            <el-option label="窗口" value="window" />
            <el-option label="价钱" value="price" />
            <!-- <el-option label="地址" value="address" /> -->
          </el-select>
        </template>
      </el-input>
    </div>
    <el-divider />
    <!-- 数据表格 -->
    <el-table :data="dishData" style="width: 100%">
      <el-table-column type="index" label="#" />
      <el-table-column prop="image" label="图片">
        <template v-slot="scope">
          <img
            style="width: 150px; height: 100px"
            :src="scope.row.image"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="classification" label="分类">
        <template v-slot="scope">
          {{ scope.row.classification }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="位置">
        <template v-slot="scope">
          {{ transAddress(scope.row.address).join('-') }}
        </template>
      </el-table-column>
      <el-table-column prop="window" label="窗口" />
      <el-table-column prop="like" label="喜欢">
        <template v-slot="scope">
          {{ typeof scope.row.like === object ? scope.row.like.length : 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="最近更新时间" />
      <el-table-column fixed="right" label="Operations">
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
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 食物修改 -->
  <el-dialog v-model="editDialog" title="修改食物">
    <el-form :model="editDishForm" label-position="left">
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
          <span>{{ editDishForm.value.image }}</span>
        </div>
      </el-form-item>
      <el-form-item label="name" :label-width="100">
        <el-input v-model="editDishForm.value.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="price" :label-width="100">
        <el-input v-model="editDishForm.value.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="window" :label-width="100">
        <el-input v-model="editDishForm.value.window" autocomplete="off" />
      </el-form-item>
      <el-form-item label="address" :label-width="100">
        <el-cascader
          :options="addressOptions"
          v-model="editDishForm.value.address"
          clearable
        />
      </el-form-item>
      <el-form-item label="classification" :label-width="100">
        <el-select
          v-model="editDishForm.value.classification"
          placeholder="Please select"
        >
          <el-option label="面食" value="pasta" />
          <el-option label="米饭" value="rice" />
          <el-option label="饼类" value="cake" />
          <el-option label="粥类" value="porridge" />
          <el-option label="小吃" value="snack" />
          <el-option label="更多" value="other" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialog = false">Cancel</el-button>
        <el-button type="primary" @click="editConfirmPost" :disabled="!isEditValidate"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 食物添加 -->
  <el-dialog v-model="addDialog" title="添加食物">
    <el-form :model="addDishForm" label-position="left">
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
          <span>{{ addDishForm.value.image }}</span>
        </div>
      </el-form-item>
      <el-form-item label="name" :label-width="100">
        <el-input v-model="addDishForm.value.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="price" :label-width="100">
        <el-input v-model="addDishForm.value.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="window" :label-width="100">
        <el-input v-model="addDishForm.value.window" autocomplete="off" />
      </el-form-item>
      <el-form-item label="address" :label-width="100">
        <el-cascader
          :options="addressOptions"
          v-model="addDishForm.value.address"
          clearable
        />
      </el-form-item>
      <el-form-item label="classification" :label-width="100">
        <el-select
          v-model="addDishForm.value.classification"
          placeholder="Please select"
        >
          <el-option label="面食" value="pasta" />
          <el-option label="米饭" value="rice" />
          <el-option label="饼类" value="cake" />
          <el-option label="粥类" value="porridge" />
          <el-option label="小吃" value="snack" />
          <el-option label="更多" value="other" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="addConfirmPost"
          :disabled="!isAddValidate"
          >添加</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 分页设置 -->
  <div class="demo-pagination-block">
    <el-pagination
      :page-sizes="[10, 20, 50]"
      small="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "Dish",
};
</script>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { transAddress} from "../utils/index";

const addressOptions = [
  {
    value: "eastCampus",
    label: "东校区",
  },
  {
    value: "headOfTheSouth",
    label: "本部南苑",
    children: [
      {
        value: "minzu",
        label: "民族餐厅",
      },
      {
        value: "fengwei",
        label: "风味餐厅",
      },
      {
        value: "zhuyao",
        label: "南苑餐厅",
        children: [
          {
            value: "firstFloor",
            label: "一楼",
          },
          {
            value: "secondFloor",
            label: "二楼",
          },
        ],
      },
    ],
  },
  {
    value: "headOfTheWest",
    label: "本部西苑",
    children: [
      {
        value: "firstFloor",
        label: "一楼",
      },
      {
        value: "secondFloor",
        label: "二楼",
      },
    ],
  },
];

const addDishForm = reactive({});
const editDishForm = reactive({});
let dishData = ref([]);
// 搜索
const searchQuery = reactive({
  type: "",
  value: "",
  limit: 10,
  offset: 0,
});
// 分页
let total = ref(0);

async function getDishData() {
  // dishData.value=[];
  const { data: dish } = await axios.get(
    `dish/adminGet?type=${searchQuery.type}&value=${searchQuery.value}&limit=${searchQuery.limit}&offset=${searchQuery.offset}`
  );
  dishData.value = dish.list;
  total.value = dish.count;
  dishData.value.forEach((item) => {
    item.updatedAt = item.updatedAt.substring(0, 10);
    // item.address = transAddress(item.address).join("-");
  });
}

onMounted(async () => {
  getDishData();
});

const handleSizeChange = (val) => {
  searchQuery.limit = val;
  getDishData();
};
const handleCurrentChange = (val) => {
  searchQuery.offset = 10 * (val - 1);
  getDishData();
};

const search = async () => {
  getDishData();
};

const addDialog = ref(false);
const editDialog = ref(false);
const isAddValidate = ref(true);
const isEditValidate = ref(true);
const addData = () => {
  addDishForm.value = {
    image: "http://180.76.195.252:3366/public/default/dishImg.png",
    name: "",
    price: "",
    score: [],
    classification: "",
    like: [],
    address: [],
    window: "",
  };
  addDialog.value = true;
};


// Add Data Judgment
watch(
  addDishForm,
  () => {
    isAddValidate.value = true;
    for (const key in addDishForm.value) {
      let flag =
        addDishForm.value[key] !== "" && addDishForm.value["address"] != false;
      if (!flag) {
        console.log(addDishForm.value["address"]);
        isAddValidate.value = false;
      }
    }
    console.log(isAddValidate.value);
  }
);
watch(
  editDishForm,
  () => {
    isEditValidate.value = true;
    for (const key in editDishForm.value) {
      let flag =
      editDishForm.value[key] !== "" && editDishForm.value["address"] != false;
      if (!flag) {
        console.log(editDishForm.value["address"]);
        isEditValidate.value = false;
      }
    }
    console.log(isEditValidate.value);
  }
);
async function windowAdd_update(option) {
  const postWindowForm = {
    name: option["window"],
    dishes: [option],
    classification: [option["classification"]],
    address: option["address"],
  };
  console.log(postWindowForm);
  const { data: windowUpdate } = await axios.post(
    "window/update",
    postWindowForm
  );
}
const addConfirmPost = async () => {
  const { data: dishSet } = await axios.post("dish/add", addDishForm.value);
  windowAdd_update(dishSet.dish);
  dishData.value.push(dishSet.dish);
  ElMessage({
    showClose: true,
    message: "success add",
    type: "success",
  });
  addDialog.value = false;
};

const editConfirmPost = async () => {
  const { data: dishUpdate } = await axios.put(
    "dish/update",
    editDishForm.value
  );
  windowAdd_update(dishUpdate.dishUpdate);
  // dishData.value.push(dishUpdate.dishUpdate);
  editDialog.value = false;
};

const EditDish = async (v) => {
  editDishForm.value = v;
  editDialog.value = true;
  console.log(v);
};

const deleteDish = async (v) => {
  console.log(v);
  const dishDelete = await axios.post("dish/delete", v);
  console.log(dishDelete);
  if (dishDelete.status === 200) {
    ElMessage({
      showClose: true,
      message: "success delete",
      type: "success",
    });
    setTimeout(() => {
      getDishData();
    }, 1000);
  }
};

const imageSub = async (e) => {
  console.log(111);
  let files = e.target.files;
  // // 上传部分
  let data = new FormData();
  for (let i = 0; i < files.length; i++) {
    data.append("file", files[i]);
  }
  let { data: imgResponse } = await axios.post("upload/dish", data);
  console.log(imgResponse);
  addDishForm.value.image = imgResponse.img.url;
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
