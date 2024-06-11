<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { IEdit } from "./type";

const ruleFormRef = ref<FormInstance>();
interface IProps {
  ruleForm: any;
}
let props = defineProps<IProps>();

const checkKind = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("菜品名称不能为空"));
  }
  callback();
};

const validateName = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("菜品名称不能为空"));
  } else {
    if (props.ruleForm.foodName !== "") {
      if (!ruleFormRef.value) return;
    }
    callback();
  }
};
const validateSale = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<typeof props.ruleForm>>({
  name: [{ validator: validateName, trigger: "blur" }],
  checkSale: [{ validator: validateSale, trigger: "blur" }],
  kind: [{ validator: checkKind, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(editData, "submit!");
    } else {
      console.log("error submit!");
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const kindId = ref(0);
const categories = props.ruleForm.categories;
const selectValue = ref(props.ruleForm.kindName);

console.log(categories, "props.categories");
const handelKindName = (val: number) => {
  categories.forEach((element) => {
    if (element.id == val) {
      selectValue.value = element.name;
      props.ruleForm.foodKindId = val;
      props.ruleForm.kindName = selectValue.value;
    }
    return;
  });
  console.log(selectValue.value, "种类id");
};

const handelFoodName = (val: String) => {
  editData.foodName = val;
  console.log(editData.foodName, "foodName");
};
const handelfoodSale = (val: Number) => {
  editData.foodSale = val;
  console.log(editData.foodSale, "foodSale");
};
const editData: IEdit = reactive({
  foodId: 0,
  foodName: "",
  foodSale: 0,
  foodKindId: 0,
});
watch(
  () => props.ruleForm.value,
  (newVal, oldVal) => {
    // 当 ruleForm 发生变化时执行的逻辑
    props.ruleForm.value = newVal;
    console.log("ruleForm changed:", props.ruleForm.value);
  },
  {
    deep: true, // 深度监听
  }
);
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="菜品名称" prop="name">
        <el-input
          v-model="props.ruleForm.foodName"
          type="text"
          autocomplete="off"
          @change="handelFoodName"
        />
      </el-form-item>
      <el-form-item label="菜品价格" prop="checkSale">
        <el-input
          v-model="props.ruleForm.foodSale"
          type="text"
          autocomplete="off"
          @change="handelfoodSale"
        />
      </el-form-item>
      <el-form-item label="菜品种类" prop="kind">
        <el-select
          v-model="selectValue"
          placeholder="Please select a zone"
          @change="handelKindName"
        >
          <el-option
            v-for="item in props.ruleForm.categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜品图片" prop="">
        <el-upload
          :limit="1"
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Submit
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
</style>