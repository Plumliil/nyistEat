<template>
  <el-card class="campus-card">
    <div class="header">
      <el-button type="primary" @click="addData">添加</el-button>
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
    <el-table :data="dishData" style="width: 100%">
      <el-table-column prop="_id" label="id" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="classification" label="分类" />
      <el-table-column prop="address" label="位置" />
      <el-table-column prop="window" label="窗口" />
      <el-table-column prop="image" label="图片" />
      <el-table-column prop="score" label="分数" />
      <el-table-column prop="like" label="喜欢" />
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
    <div class="top"></div>
  </el-card>

  <el-dialog v-model="dialogFormVisible" title="add dish">
    <el-form :model="postDishForm" label-position="left">
      <el-form-item label="image" :label-width="100">
        <el-input
          v-model="postDishForm.value.image"
          placeholder="https://sm.ms/image/pjZ5atWzcGyPlYq"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="name" :label-width="100">
        <el-input v-model="postDishForm.value.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="price" :label-width="100">
        <el-input v-model="postDishForm.value.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="score" :label-width="100">
        <el-input v-model="postDishForm.value.score" autocomplete="off" />
      </el-form-item>
      <el-form-item label="like" :label-width="100">
        <el-input v-model="postDishForm.value.like" autocomplete="off" />
      </el-form-item>
      <el-form-item label="window" :label-width="100">
        <el-input v-model="postDishForm.value.window" autocomplete="off" />
      </el-form-item>
      <el-form-item label="address" :label-width="100">
        <el-cascader
          :options="addressOptions"
          v-model="postDishForm.value.address"
          clearable
        />
      </el-form-item>
      <el-form-item label="classification" :label-width="100">
        <el-select
          v-model="postDishForm.value.classification"
          placeholder="Please select"
        >
          <el-option label="面食" value="pasta" />
          <el-option label="米饭" value="rice" />
          <el-option label="麻辣烫" value="malatang" />
          <el-option label="饼类" value="cake" />
          <el-option label="粥类" value="porridge" />
          <el-option label="小吃" value="snack" />
          <el-option label="更多" value="other" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmPost" :disabled="postBtn"
          >Confirm</el-button
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
  name: "Dish",
};
</script>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage } from "element-plus";

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

const postDishForm = reactive({});
let isAdd = ref(true);
let dishData = ref([]);
// let dishList = [];
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
    `dish/get?type=${searchQuery.type}&value=${searchQuery.value}&limit=${searchQuery.limit}&offset=${searchQuery.offset}`
  );
  dishData.value = dish.list;
  total.value = dish.count;
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

const dialogFormVisible = ref(false);

const addData = () => {
  isAdd.value = true;
  postDishForm.value = {
    image: "https://sm.ms/image/pjZ5atWzcGyPlYq",
    name: "",
    price: "",
    score: null,
    classification: "",
    like: null,
    address: [],
    window: "",
  };
  dialogFormVisible.value = true;
};

const confirmPost = async () => {
  // Data judgment
  // 空为true

  console.log(postDishForm);

  let flag = true;
  for (let v in postDishForm) {
    if (!postDishForm[v]) {
      flag = true;
      console.log(postDishForm.value);
      console.log(v);
    } else {
      flag = false;
    }
  }
  console.log(flag);
  if (flag) {
    console.log(postDishForm.value);
    ElMessage({
      showClose: true,
      message: "have empty data",
      type: "error",
    });
  } else {
    //  dish add
    if (isAdd.value) {
      const { data: dishSet } = await axios.post(
        "dish/add",
        postDishForm.value
      );
      windowAdd_update(dishSet);
      dishData.value.push(dishSet.dish);
      console.log("dishSet", dishSet);
    } else {
      const { data: dishUpdate } = await axios.put(
        "dish/update",
        postDishForm.value
      );
      windowAdd_update(dishUpdate);
      dishData.value.push(dishUpdate.dish);
      console.log("dishUpdate", dishUpdate);
    }
    ElMessage({
      showClose: true,
      message: "success add",
      type: "success",
    });
    dialogFormVisible.value = flag;
    location.reload();
  }
  // window add
  async function windowAdd_update(value) {
    const postWindowForm = reactive({
      name: postDishForm.value["window"],
      dishes: [value.dish],
      classification: postDishForm.value["classification"],
      address: postDishForm.value["address"],
    });
    const { data: windowUpdate } = await axios.put(
      "window/update",
      postWindowForm
    );
  }
  dialogFormVisible.value = flag;
};

const deleteDish = async (v) => {
  const dishDelete = await axios.post("dish/delete", v);
  ElMessage({
    showClose: true,
    message: "success delete",
    type: "success",
  });
  location.reload();
};

const EditDish = (v) => {
  isAdd.value = false;
  postDishForm.value = v;
  dialogFormVisible.value = true;
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
</style>
