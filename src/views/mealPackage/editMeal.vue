<script setup lang="ts">
import { ref, reactive, onMounted, watch, watchEffect } from "vue";
import { type ComponentSize, ElMessage, type FormInstance, type FormRules, genFileId, type UploadProps, type UploadRawFile } from "element-plus";
import { useRowStore } from "@/stores/counter";
import { useRouter } from "vue-router";
import { API } from "./api";
import AddForm from "./component/add.vue";
const rowStore = useRowStore();
const router = useRouter();
interface RuleForm {
  name: string;
  sort: string;
  count: string;
  desc: string;
  image:string
}
const currentRow = reactive<any>(rowStore.currentRow || {});
console.log(currentRow);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "Hello",
  sort: "",
  count: "",
  desc: "",
  image:""
});

const handleChange = (newValue: any) => {
  ruleForm.sort = newValue;
  console.log(ruleForm.sort);
};

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  sort: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  count: [
    {
      required: true,
      message: "Please select Activity count",
      trigger: "change",
    },
  ],
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
});
const formLabelWidth = "140px";

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const dialogFormVisible = ref(false);
const ruleForm2 = ref<any>({});
const tableData = ref<any>([]);
const dishList = async () => {
  let res = await API["dishList"]();
  console.log(res, "dishList");
  if (res != null) {
    tableData.value =res.data.data
    ruleForm2.value = {
      type: res.data.data,
    };
  }
};
const AddDish = async () => {
  dialogFormVisible.value = true;

  let res = await API["add"]();
};
const menuQuantities = reactive<any>({});
const data = ref<any>([])
function handleUpdate(updatedMenuQuantities: any) {
  // 在这里处理更新后的menuQuantities
  menuQuantities.value = {...updatedMenuQuantities};
  
 console.log(menuQuantities.value)
  
}
// watch(  
//   () => menuQuantities.value,  
//   (newValue, oldValue) => {  
//     data.value = tableData.value.filter((item: any) => {  
//       return Object.keys(newValue).includes(item.foodId);  
//     });  
//     console.log(data);  
//   },  
//   { deep: true }  
// );  
// watch(()=>menuQuantities.value,
// ()=>{
//   // 遍历 tableData.value 数组，过滤元素并添加 quantity 属性  
// for (const item of tableData.value) {  
//   // 检查 menuQuantities.value 对象是否有与 item.foodId 相同的键  
//   if (menuQuantities.value.hasOwnProperty(item.foodId)) {  
//     // 如果有，将对应的数量值添加到 item 中作为一个新属性  
//     item.quantity = menuQuantities.value[item.foodId];  
//     // 同时将该项添加到 data.value 数组中  
//     data.value.push(item);  
//   }  
// }  

  
// // 输出过滤并添加了 quantity 属性的数组  
// console.log(data.value);
  
// },
// {deep:true,immediate:true}
// )
watchEffect(() => {  
  data.value = tableData.value.reduce((acc: any[], item: { foodId: string|number; }) => {  
    if (menuQuantities.value[item.foodId] !== undefined) {  
      // 如果menuQuantities中有对应的foodId，就添加quantity属性，并推送到acc中  
      acc.push({ ...item, quantity: menuQuantities.value[item.foodId] });  
    }  
    console.log(data.value);
    return acc;  
  }, []);  
});  

//编辑图片
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  console.log("??????")
  ruleForm.image = response.data
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
const handleFoodImg = (file: any, fileList: any) =>{
  if (file && fileList.length === 1) {  
    // 这里假设你已经处理了文件上传并得到了URL，或者你可以在这里触发上传  
    // foodImg.value = '假设的URL'; // 实际应该是上传后从响应中获取的URL  
    // 这里我们只模拟触发上传  
    submitUpload();  

}
}
const upload = ref<any>()
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

const handleDelete =(index:Number, row:any) =>{
  data.value.splice(index, 1)
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
onMounted(() => {
  dishList();
});
if (!rowStore.currentRow) {
  router.push({ path: "/mealPackage/mealPackage" });
}
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="套餐名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="套餐分类" prop="sort">
            <el-select
              v-model="ruleForm.sort"
              placeholder="请选择"
              @change="handleChange"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in currentRow"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="套餐价格" prop="count">
            <el-input v-model="ruleForm.count" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="套餐菜品" required>
       <div style="border: 1px solid #e1e1e1; width: 800px;">
        <el-button @click="AddDish" type="warning" style="margin: 10px;">添加菜品</el-button>
        <el-table :data="data" stripe style="width: 100%" size="small">
          <el-table-column label="菜品名称" align="center">
            <template #default="scope">
             {{ scope.row.foodName }}
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template #default="scope">
              {{ scope.row.foodSale }}
            </template>
          </el-table-column>
          <el-table-column label="份数" align="center">
            <template #default="scope">
              {{ scope.row.quantity }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>  
              
            </template>
          </el-table-column>
        </el-table>
       </div>
      </el-form-item>
      <el-form-item label="菜品图片" prop="">
        <el-upload
          :limit="1"
          ref="upload"
          class="avatar-uploader"
          action="http://127.0.0.1:8080/menu/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceed"
          :auto-upload="false"
          @change="handleFoodImg"
        >
          <img v-if="ruleForm.image" :src="ruleForm.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
      <el-form-item label="套餐描述" prop="desc">
        <el-input
          v-model="ruleForm.desc"
          type="textarea"
          :rows="8"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Create
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <AddForm
      :ruleForm="ruleForm2"
      @update-menu-quantities="handleUpdate"
    ></AddForm>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>