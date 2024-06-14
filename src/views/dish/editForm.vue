<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { IEdit } from "./type";
import type { UploadProps , UploadInstance, UploadRawFile} from 'element-plus'
import { ElMessage,genFileId } from "element-plus"
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

const kindId = ref(0);
const categories = props.ruleForm.categories;
const selectValue = ref('');

const handelKindName = (val: number) => {
  categories.forEach((element) => {
    if (element.id == val) {
      props.ruleForm.kindName = element.name;
      props.ruleForm.foodKindId = val;
    }
    return;
  });
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



//编辑图片
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  console.log("??????")
  props.ruleForm.foodImg = response.data
  console.log(response,"上传图片成功后返回")
  submitUpload()
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {  
  // 使用数组和 includes 方法来检查 MIME 类型  
  const allowedTypes = ['image/jpeg', 'image/png'];  
  if (!allowedTypes.includes(rawFile.type)) {  
    ElMessage.error('提交的必须是图片（JPEG 或 PNG 格式）！');  
    return false;  
  }  
  // 文件大小检查（单位：MB）  
  if (rawFile.size / 1024 / 1024 > 2) {  
    ElMessage.error('文件大小必须小于2MB');  
    return false;  
  }  
  // 如果文件类型和大小都符合要求，返回 true  
  return true;  
}

const upload = ref<UploadInstance>()
const submitUpload = () => {
  upload.value!.submit()
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  submitUpload()
}

watch(
  () => props.ruleForm,
  (newVal, oldVal) => {
    // 当 ruleForm 发生变化时执行的逻辑
    // props.ruleForm.value = newVal;
    console.log("ruleForm changed:", props.ruleForm);
  },
  {
    deep: true, // 深度监听
  }
)

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
      :limit="1"
      :on-exceed="handleExceed"
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
          v-model="props.ruleForm.kindName"
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
          ref="upload"
          class="avatar-uploader"
          action="http://192.168.43.170:8080/menu/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceed"
          :auto-upload="false"

        >
          <img v-if="props.ruleForm.foodImg" :src="props.ruleForm.foodImg" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">

.avatar-uploader .avatar {
  width: 50px;
  height: 50px;
  display: block;
  overflow: hidden;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  text-align: center;
}
</style>