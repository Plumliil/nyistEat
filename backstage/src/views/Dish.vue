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
          <el-button link type="primary" size="small" @click="deleteDish(scope.row)"
            >Delete</el-button
          >
          <el-button link type="primary" size="small" @click="EditDish(scope.row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="top"></div>
  </el-card>

  <el-dialog v-model="dialogFormVisible" title="add dish">
    <el-form :model="postDishForm" label-position="left">
      <el-form-item label="image" :label-width="100">
        <el-input
          v-model="postDishForm.image"
          placeholder="https://sm.ms/image/pjZ5atWzcGyPlYq"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="name" :label-width="100">
        <el-input v-model="postDishForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="price" :label-width="100">
        <el-input v-model="postDishForm.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="score" :label-width="100">
        <el-input v-model="postDishForm.score" autocomplete="off" />
      </el-form-item>
      <el-form-item label="like" :label-width="100">
        <el-input v-model="postDishForm.like" autocomplete="off" />
      </el-form-item>
      <el-form-item label="window" :label-width="100">
        <el-input v-model="postDishForm.window" autocomplete="off" />
      </el-form-item>
      <el-form-item label="address" :label-width="100">
        <el-cascader :options="addressOptions" v-model="postDishForm.address" clearable />
      </el-form-item>
      <el-form-item label="classification" :label-width="100">
        <el-select
          v-model="postDishForm.classification"
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

const postDishForm = reactive({
  image: "https://sm.ms/image/pjZ5atWzcGyPlYq",
  name: "",
  price: "",
  score: null,
  classification: "",
  like: null,
  address:[],
  window: "",
});

let dishData = reactive([]);

onMounted(async () => {
  const { data: dish } = await axios.get("dish/get");
  dishData.push(...dish.dishList);
});

const searchValue = ref("");
const dialogFormVisible = ref(false);

const addData = () => {
  dialogFormVisible.value = true;
};
const confirmPost = async () => {
  // Data judgment
  // 空为true
  let flag = true; 
  for (let v in postDishForm) {
    if (!postDishForm[v]) {
      flag = true;
    } else {
      flag = false;
    }
  }
  console.log(flag);
  if (flag) {
    ElMessage({
      showClose: true,
      message: "have empty data",
      type: "error",
    });
  } else {
    console.log('next');
    console.log(postDishForm);
    //  dish add
    const { data: dishSet } = await axios.post("dish/add", postDishForm);
    dishData.push(dishSet.dish);
    console.log('dishSet',dishSet);
    ElMessage({
      showClose: true,
      message: "success add",
      type: "success",
    });
    // window add
    const postWindowForm = reactive({
      name: postDishForm["window"],
      dishes: [dishSet.dish],
      classification: postDishForm["classification"],
      address: postDishForm["address"],
    });
    const { data: windowUpdate } = await axios.put(
      "window/update",
      postWindowForm
    );
    console.log(windowUpdate);
    dialogFormVisible.value = flag;
  }
  dialogFormVisible.value = flag;
};

const deleteDish= async (v)=>{
  console.log(v);
  const dishDelete=await axios.post('dish/delete',v);
  console.log(dishDelete);
  ElMessage({
      showClose: true,
      message: "success delete",
      type: "success",
    });
}

const EditDish=()=>{
  ElMessage({
      showClose: true,
      message: "success edit",
      type: "success",
    });
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
</style>
