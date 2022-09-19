<template>
  <el-card class="campus-card">
    <div class="header">
      <el-button type="primary" @click="addData">添加</el-button>
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
    value: "headquartersWest",
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
let dishData = reactive([]);

onMounted(async () => {
  const { data: dish } = await axios.get("dish/get");
  dishData.push(...dish.dishList);
});

const searchValue = ref("");
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
      dishData.push(dishSet.dish);
      console.log("dishSet", dishSet);
    } else {
      const { data: dishUpdate } = await axios.put(
        "dish/update",
        postDishForm.value
      );
      windowAdd_update(dishUpdate);
      dishData.push(dishUpdate.dish);
      console.log("dishUpdate", dishUpdate);
    }
    ElMessage({
      showClose: true,
      message: "success add",
      type: "success",
    });

    dialogFormVisible.value = flag;
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
  console.log(v);
  const dishDelete = await axios.post("dish/delete", v);
  console.log(dishDelete);
  ElMessage({
    showClose: true,
    message: "success delete",
    type: "success",
  });
};

const EditDish = (v) => {
  isAdd.value = false;
  postDishForm.value = v;
  console.log(postDishForm.value);
  dialogFormVisible.value = true;
  ElMessage({
    showClose: true,
    message: "success edit",
    type: "success",
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
