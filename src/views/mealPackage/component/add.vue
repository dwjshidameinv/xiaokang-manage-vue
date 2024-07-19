<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 800px"
    :model="props.ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="菜品" prop="region">
      <div
        v-for="(item, index) in selectedMenus"
        :key="index"
        class="menu-item"
      >
        <span style="border-radius: 5px">{{
          getFoodNameById(item.foodId)
        }}</span>
        <el-select v-model="item.foodId" placeholder="请选择菜品" z-index="-1">
          <el-option
            v-for="food in availableFoodList"
            :key="food.foodId"
            :label="food.foodName"
            :value="food.foodId"
          />
        </el-select>

        <el-input-number
          v-model="item.quantity"
          :min="1"
          :max="4"
          aria-label="数量"
        ></el-input-number>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="removeMenuItem(index)"
          >删除</el-button
        >
      </div>
      <el-button
        type="warning"
        style="color: #fff"
        color="#EBAE00"
        @click="addMenuItem"
        :disabled="selectedMenus.length >= 4"
        >添加菜品</el-button
      >
    </el-form-item>

    <el-form-item style="margin-left: 320px">
      <el-button
        type="success"
        style="color: #fff"
        @click="submitForm(ruleFormRef)"
      >
        确认
      </el-button>
      <el-button type="danger" @click="resetForm(ruleFormRef)">取消</el-button>
    </el-form-item>
  </el-form>
</template>
  
  <script lang="ts" setup>
import { computed, reactive, ref, watch, defineEmits } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
const emit = defineEmits(["update-menu-quantities", "close-dialog"]);

let props = defineProps<IProps>();

interface IProps {
  ruleForm: {
    type?: any;
  };
  initialMenuQuantities?: Record<number, number>; // 可选，用于初始化
}
const handleChange = (value: number) => {
  console.log(value);
};
const selectedMenus = reactive<SelectedMenu[]>([]);
// 监视 menuQuantities 的变化

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
interface SelectedMenu {
  foodId: number; // 改为字符串，因为props.ruleForm.type中的foodId是字符串
  quantity: number;
}
let menuQuantities: Record<number, number> = {}; // 改为字符串键

// 初始化selectedMenus和menuQuantities
watch(
  () => props.initialMenuQuantities,
  (newQuantities) => {
    if (newQuantities) {
      console.log(newQuantities);
      selectedMenus.splice(0, selectedMenus.length); // 清空现有数据
      menuQuantities = {}; // 清空menuQuantities，以防有旧数据
      for (const [key, quantity] of Object.entries(newQuantities)) {  
        let foodId = parseInt(key)
        selectedMenus.push({ foodId, quantity }); // 正确地将每个菜品ID和数量添加到selectedMenus中  
        menuQuantities[foodId] = quantity; // 直接使用foodId作为键，因为它已经是字符串类型  
      }  

      // 如果你需要调试输出，可以在这里打印selectedMenus或menuQuantities
      // console.log(selectedMenus);
    }
  },
  { immediate: true, deep: true } // 注意：对于对象字面量，deep: true 是必要的，但immediate: true 取决于你是否需要在组件挂载时立即执行
);
//
watch(
  () => selectedMenus,
  () => {
    menuQuantities = {};
    // console.log(selectedMenus);
    selectedMenus.forEach((item: any) => {
      if (item.foodId !== "") {
        menuQuantities[item.foodId] = item.quantity;
      }
    });
  },
  { deep: true }
);

function getFoodNameById(foodId: number) {
  const food = props.ruleForm.type.find(
    (food: { foodId: number }) => food.foodId === foodId
  );
  return food ? food.foodName : "未知菜品";
}

const selectedFoodIds = computed(() =>
  selectedMenus.map((menu) => menu.foodId).filter((id) => id !== 0)
);

const availableFoodList = computed(() =>
  props.ruleForm.type.filter(
    (food: { foodId: number }) => !selectedFoodIds.value.includes(food.foodId)
  )
);

function addMenuItem() {
  if (selectedMenus.length < 4) {
    selectedMenus.push({ foodId: 0, quantity: 1 });
  }
}

function removeMenuItem(index: number) {
  selectedMenus.splice(index, 1);
}

// 可以在这里添加一个方法来处理表单提交，将selectedMenus发送到后端

const rules = reactive<FormRules<typeof props.ruleForm>>({
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
      trigger: "change",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(menuQuantities, "menuQuantities");
      emit("update-menu-quantities", menuQuantities);
      // 发射一个关闭对话框的事件
      emit("close-dialog");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  emit("close-dialog");
};
</script>
<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.menu-item {
  width: 500px;
  margin-right: 10px;
  position: relative;
}
.el-select {
  border: 0;
  width: 5px;
  position: absolute;
  left: 120px;
}
.menu-item .el-input-number {
  width: 100px;
  margin-right: 10px;
  margin-left: 20px;
}
span {
  width: 150px;
  display: block;
  border: 1px solid #e1e1e1;
  text-align: center;
}
.menu-item .el-button {
  margin-left: 20px;
  height: 32px;
  width: 45px;
  line-height: 32px;
  padding: 0 15px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button[type="primary"] {
  margin-right: 10px;
}

.el-button[type="success"] {
  width: 100%;
}
.el-button[type="danger"] {
  padding: 0;
}
.el-input-number {
  background-color: #b8de11;
}
.el-select__wrapper {
  box-shadow: 0;
}
.el-select__wrapper .is-hovering:not(.is-focused) {
  box-shadow: 0 !important;
}
</style>
  