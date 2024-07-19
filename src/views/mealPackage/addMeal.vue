<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, toRaw } from "vue";
import {
  type ComponentSize,
  ElMessage,
  type FormInstance,
  type FormRules,
  genFileId,
  type UploadProps,
  type UploadRawFile,
  ElMessageBox,
} from "element-plus";
import { useRowStore } from "@/stores/counter";
import { useRouter } from "vue-router";
import { API } from "./api";
import AddForm from "./component/add.vue";
const rowStore = useRowStore();
const router = useRouter();
interface RuleForm {
  name: string;
  sortId: string;
  count: string;
  desc: string;
  image: string;
}
const currentRow = reactive<any>(rowStore.currentRow || {});
console.log(currentRow);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive<RuleForm>({
  name: "",
  sortId: "",
  count: "",
  desc: "",
  image: "",
});

const handleChange = (newValue: any) => {
  ruleForm.sortId = newValue;
  console.log(ruleForm.sortId);
};

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入套餐名字", trigger: "change" },
    { min: 3, max: 6, message: "名字字数在3-6个字之间", trigger: "change" },
  ],
  sortId: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  image: [{ required: true, message: "请上传图片", trigger: "click" }],
  count: [
    {
      required: true,
      message: "请输入价格",
      trigger: "blur",
    },
    {
      pattern: /^\d+(\.\d+)?$/,
      message: "请输入正确的价格",
      trigger: "blur",
    },
  ],
  desc: [
    { required: true, message: "请输入内容", trigger: "blur" },
  ],
});

const dialogFormVisible = ref(false);
const ruleForm2 = ref<any>({});
const tableData = ref<any>([]);
const dishList = async () => {
  let res = await API["dishList"]();
  console.log(res, "dishList");
  if (res != null) {
    tableData.value = res.data.data;
    ruleForm2.value = {
      type: res.data.data,
    };
  }
};

const AddDish = async () => {
  dialogFormVisible.value = true;
};
const menuQuantities = reactive<any>({});
const data = ref<any>([]);
function handleUpdate(updatedMenuQuantities: any) {
  // 在这里处理更新后的menuQuantities
  menuQuantities.value = { ...updatedMenuQuantities };

  console.log(menuQuantities.value);
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

const mealManage = reactive<any>({
  name: "",
  sortId: "",
  price: "",
  image: "",
  descp: "",
});

watch(
  () => ruleForm,
  () => {
    mealManage.name = ruleForm.name;
    mealManage.sortId = ruleForm.sortId;
    mealManage.price = ruleForm.count;
    mealManage.image = ruleForm.image;
    mealManage.descp = ruleForm.desc;
    // console.log(mealManage)
  },
  { deep: true }
);

watch(
  () => menuQuantities,
  () => {
    data.value = [];
    data.value = tableData.value.reduce(
      (acc: any[], item: { foodId: string | number }) => {
        if (menuQuantities.value[item.foodId] !== undefined && acc.length < 4) {
          // 如果menuQuantities中有对应的foodId，就添加quantity属性，并推送到acc中
          acc.push({ ...item, quantity: menuQuantities.value[item.foodId] });
        }
        return acc;
      },
      []
    );

    if (data.value.length > 4) {
      data.value = data.value.slice(0, 4);
    }
    console.log(menuQuantities.value);
  },
  { deep: true, immediate: true }
);
// 方法来更新menuQuantities
function updateMenuQuantity(foodId: string, newQuantity: number) {
  menuQuantities.value[foodId] = newQuantity;
}
watch(
  data,
  (newVal, oldVal) => {
    ruleForm.count = newVal.reduce((sum: number, item: any) => {
      return sum + item.foodSale * item.quantity;
    }, null);
    console.log(ruleForm.count, "zongjia");
  },
  { deep: true, immediate: true } // 使用 deep 选项来深度观察数组内部的变化
);
const showDeleteIcon = ref(false);
//编辑图片
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log("??????");
  ruleForm.image = response.data;
  console.log(response, "上传图片成功后返回");
  submitUpload();
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // 使用数组和 includes 方法来检查 MIME 类型
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error("必须是图片，并且格式是（JPEG或PNG或JPG格式）");
    return false;
  }
  // 文件大小检查（单位：MB）
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("文件大小必须小于2MB");
    return false;
  }
  // 如果文件类型和大小都符合要求，返回 true
  return true;
};
const handleFoodImg = (file: any, fileList: any) => {
  if (file && fileList.length === 1) {
    // 这里假设你已经处理了文件上传并得到了URL，或者你可以在这里触发上传
    // foodImg.value = '假设的URL'; // 实际应该是上传后从响应中获取的URL
    // 这里我们只模拟触发上传
    submitUpload();
  }
};
const upload = ref<any>();
const submitUpload = () => {
  upload.value!.submit();
};

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  submitUpload();
};
const clearImage = () => {
  ruleForm.image = "";
};

const handleDelete = (index: Number, row: any) => {
  data.value.splice(index, 1);
  delete menuQuantities.value[row.foodId];
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      // 使用 toRaw 函数获取原始数据
      const rawData = toRaw(menuQuantities);
      const haha1 = reactive<any>({
        mealManage: { ...mealManage },
        menuQuantities: rawData.value,
      });
      console.log(haha1);
      ElMessageBox.confirm("确定添加？", "添加提醒", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await API["add"](haha1);
          console.log("添加后执行", res);
          try {
            if (res.data.code === 200) {
              ElMessage({
                message: "添加成功",
                type: "success",
              });
              router.push("/mealPackage/mealPackage");
            } else {
              // 处理网络错误或其他异常
              ElMessage({
                message: res.data.msg,
                type: "error",
              });
            }
          } catch (error) {
            // 处理网络错误或其他异常
            console.error(error);
            ElMessage({
              message: "发生错误",
              type: "error",
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "添加取消",
          });
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  ElMessageBox.confirm("确定返回 （返回后会清空内容）？", "返回", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      if (!formEl) return;
      formEl.resetFields();
     router.push("/mealPackage/mealPackage")
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "返回取消",
      });
    });
};
onMounted(() => {
  dishList();
});
if (!rowStore.currentRow) {
  router.push({ path: "/mealPackage/mealPackage" });
}
</script>

<template>
  <div class="box">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px; position: relative"
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
              v-model="ruleForm.sortId"
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
          <el-popover
            ref="popover"
            placement="right"
            title="小提示"
            :width="350"
            trigger="hover"
            content="已选好的菜品会为您算出总价，请考虑是否降低价格"
          >
            <template #reference>
              <el-form-item label="套餐价格" prop="count">
                <el-input v-model="ruleForm.count" />
              </el-form-item>
            </template>
          </el-popover>
        </el-col>
      </el-row>
      <el-form-item label="套餐菜品" required>
        <div style="border: 1px solid #e1e1e1; width: 800px">
          <el-button @click="AddDish" type="warning" style="margin: 10px"
            >添加菜品</el-button
          >
          <div
            style="width: 100%; height: 0; border-top: 1px solid #e1e1e1"
          ></div>
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
                <el-input-number
                  v-model="scope.row.quantity"
                  :min="1"
                  :max="4"
                  aria-label="数量"
                  size="small"
                  style="width: 70px"
                  @change="(newValue:number) => updateMenuQuantity(scope.row.foodId, newValue)"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="总价" align="center">
              <template #default="scope">
                {{ scope.row.foodSale * scope.row.quantity }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button
                  color="#E9AD24"
                  size="small"
                  type="danger"
                  style="color: #fff"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="套餐图片" prop="image">
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
          <div
            class="father"
            @mouseover="showDeleteIcon = true"
            @mouseleave="showDeleteIcon = false"
          >
            <img v-if="ruleForm.image" :src="ruleForm.image" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon box1"><Plus /></el-icon>
            <el-icon
              v-if="showDeleteIcon && ruleForm.image"
              icon="el-icon-delete"
              circle
              @click="clearImage"
              class="avatar-uploader-icon box2"
              ><Delete color="#363636"
            /></el-icon>
          </div>
        </el-upload>
      </el-form-item>
      <el-row>
        <el-col :span="17">
          <el-form-item label="套餐描述" prop="desc">
            <el-input
              v-model="ruleForm.desc"
              type="textarea"
              :rows="5"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <el-row style="margin-top: 80px; margin-left: 25px">
              <el-col :span="10">
                <el-button
                  type="primary"
                  @click="submitForm(ruleFormRef)"
                  :disabled="data.length < 2"
                >
                  确认添加
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  style="margin-left: 30px"
                  @click="resetForm(ruleFormRef)"
                  >返回</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-dialog v-model="dialogFormVisible" title="套餐菜品" width="500" draggable>
    <AddForm
      :ruleForm="ruleForm2"
      @update-menu-quantities="handleUpdate"
      @close-dialog="dialogFormVisible = false"
      :initialMenuQuantities="menuQuantities.value"
    ></AddForm>
  </el-dialog>
</template>

<style scoped lang="scss">
.box {
  margin-left: 250px;
}
.father {
  position: relative;
  border: 1px solid #e1e1e1; /* 根据需要添加或移除边框 */
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
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

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px; /* 使图标垂直居中 */
}

.box2 {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}
.father img {  
  /* 初始透明度，如果需要的话 */  
  opacity: 1;  
  transition: opacity 0.1s ease; /* 可选的平滑过渡效果 */  
}  
.father:hover .box2 {
  background-color: rgba(199, 187, 187, 0.5);
  display: block;
}
.father:hover img {  
  opacity: 0.5; /* 鼠标悬停时的透明度 */  
}
</style>