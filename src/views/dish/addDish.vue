<script setup lang="ts">
import { ref, reactive, onMounted,defineEmits,defineProps,watch, type Ref} from 'vue'
import {type FormInstance,type FormRules,type UploadProps,ElMessage,genFileId,type UploadRawFile} from "element-plus"
const emit = defineEmits(['handleFoodName','handleKindId','handleSale','handleFoodImg','reset'])  
const ruleFormRef = ref<any>();
interface IProps {
  ruleForm: {
      foodName: '',  
      sale: '',
      kindId:''
      foodImg:'' ,
      categories?:any,
      resetKey: {  
      type: Number,  
      default: 0  
    }  
  }
  
}
let props = defineProps<IProps>();
const foodName = ref<String>('')
const handelName = () =>{
    emit("handleFoodName",foodName)
}
const kindId = ref<any>('')
const handleKindId =() =>{
    console.log("菜品类型",kindId.value)
     emit("handleKindId",kindId)
}
const sale : Ref<number | null> = ref(null)
const handleSale = () =>{
    console.log("菜品售价",sale.value)
     emit("handleSale",sale)
}
const foodImg = ref<String>('')
const handleFoodImg = (file: any, fileList: any) =>{
  if (file && fileList.length === 1) {  
    // 这里假设你已经处理了文件上传并得到了URL，或者你可以在这里触发上传  
    // foodImg.value = '假设的URL'; // 实际应该是上传后从响应中获取的URL  
    // 这里我们只模拟触发上传  
    submitUpload();  
    console.log("菜品图片",foodImg.value)
     emit("handleFoodImg",foodImg)

}
}
console.log(props.ruleForm,"addForm")
watch(
  ()=>  props.ruleForm,
  (newVal, oldVal) =>{  
    console.log(props.ruleForm,"addForm")
    }  
    ) 
// 验证函数  
const checkKind = (rule: any, value: any, callback: any) => {  
  if (value == "") {  
    callback(new Error("菜品种类不能为空"));  
  } else {  
    callback();  
  }  
};  
  
const validateName = (rule: any, value: any, callback: any) => {
  if (value == "") {  
    callback(new Error("菜品名称不能为空"));  
  } else {  
    callback();  
  }  
};  
  
const validateSale = (rule: any, value: any, callback: any) => { 
    console.log(value,"lll") 
  if (value == "" || isNaN(Number(value))) {  
    callback(new Error("请输入有效的菜品价格"));  
  } else {  
    callback();  
  }  
};  
const rules = reactive<FormRules<typeof props.ruleForm>>({
  foodName: [{ required: true, validator: validateName, trigger: "blur" }],
  sale: [{ required: true, validator: validateSale, trigger: "blur" }],
  kindId: [{ required: true, validator: checkKind, trigger: "blur" }],
});
//重置
const resetForm = (formEl: FormInstance | undefined) => {
  console.log("ruleFormRef",formEl)
  if (!formEl) return
  formEl.resetFields()
}

//编辑图片
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  foodImg.value = response.data
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

const uploadRef = ref<any>()
const submitUpload = () => {
  uploadRef.value!.submit()
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
  submitUpload()
}

const resetInternalState = () => {  
  foodName.value = '';  
  kindId.value = '';  
  sale.value = null;
  foodImg.value = ''
  console.log('子组件状态已重置');  
}; 

watch(
  ()=>  props.ruleForm.resetKey,
  (newVal, oldVal) =>{  
      // 当 resetKey 变化时，执行重置逻辑  
     resetInternalState();  
    }  
    ) 
    console.log(foodImg,"foodImg")
</script>

<template>
  <div>
       <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="props.ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
  >
    <el-form-item label="菜品名称" prop="foodName">
      <el-input v-model="foodName" @change="handelName"/>
    </el-form-item>
     <el-form-item label="菜品价格" prop="sale">
        <el-input
          v-model="sale"
          type="text"
          autocomplete="off"
          @change="handleSale"
        />
      </el-form-item>
   <el-form-item label="菜品种类" prop="kind">
        <el-select
          v-model="kindId"
          placeholder="请挑选一种类型"
          @change="handleKindId"
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
          ref="uploadRef"
          class="avatar-uploader"
          action="http://127.0.0.1:8080/menu/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceed"
          :auto-upload="false"
        @change="handleFoodImg"
    
        >
          <img v-if="foodImg" :src="String(foodImg)" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

    <el-form-item>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
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