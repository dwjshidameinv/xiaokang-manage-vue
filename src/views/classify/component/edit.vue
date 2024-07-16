<script setup lang="ts">
import { useRowStore } from "../../../stores/counter";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import {API} from "../api"
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRoute ,useRouter} from "vue-router";
const route = useRoute();
const router = useRouter()
//pina全局row
const rowStore = useRowStore();
interface RuleForm {  
  name: String, 
  state: 0 | 1;  
    type: [],  
    description: String,  
 
}  
// 使用 computed 来创建一个响应式的计算属性
// const currentRow = computed(() => rowStore.currentRow);

  const currentRow = reactive<any>(rowStore.currentRow || {});  
    const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({  
    name: currentRow.name ?? '', // 使用空字符串作为默认值  
    state: currentRow.state , // 使用 false 作为默认值  
    type: [],  
    description: currentRow.description,  
  });

watch(() =>ruleForm.state,
 ()=>{
  console.log("ruleForm.state",ruleForm.state)
 }
)
const rules = reactive<any>({
  name: [
    { required: true, message: "请输入名字", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  description: [
    { required: true, message: "请输入介绍信息", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      // console.log(id)
      const data = reactive({
        id:currentRow.id,
        categoryId:form.categoryId,
        name:ruleForm.name,
        description:ruleForm.description,
        state:ruleForm.state
      })
      ElMessageBox.confirm("确定要修改吗？", "编辑提醒", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
      }).then(async()=>{
        let res = await API['edit'](data)
        try{
          if (res.data.code === 200) {
          router.push("/classify/classify");
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          console.log(res,"编辑成功后执行")
        } else {
          // 处理网络错误或其他异常
          router.push("/classify/classify");
          ElMessage({
            message: "修改失败",
            type: "error",
          });
        }
        }catch(error){
              // 处理网络错误或其他异常
        router.push("/classify/classify");
        console.error(error);
        ElMessage({
          message: "发生错误",
          type: "error",
        });
       }
    }).catch(() => {
      ElMessage({
        type: "info",
        message: "修改取消",
      });
    });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
//编辑的是菜品还是套餐，通过路由type来选择

const form  = reactive<any>({
  label1:"",
  label2:"",
  categoryId:""


})
const switchState = computed({  
  get(): boolean {  
    return ruleForm.state === 1;  
  },  
  set(newVal: boolean): void {  
    ruleForm.state = newVal ? 1 : 0;  
  },  
});
function setForm() {
  const type = route.query.type;
  if (type === "dish") {
    form.label1 = "菜品分类名称"
    form.label2 = "菜品分类介绍"
    form.categoryId = 0
    console.log("dish");
  } else if (type === "meal") {
    form.label1 = "套餐分类名称"
    form.label2 = "套餐分类介绍"
    form.categoryId = 1
    console.log("meal");
  }
}

onMounted(() => {
  setForm();
  if (!rowStore.currentRow) {  
    router.push({ path: '/classify/classify' });  
  }  
});

</script>

<template>
  <div>
    <div class="box">
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="'large'"
        status-icon
      >
        <el-form-item :label="form.label1" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-switch v-model="switchState" />
        </el-form-item>
        <el-form-item :label="form.label2" prop="description">
          <el-input v-model="ruleForm.description" type="textarea" :rows="8" maxlength="200" show-word-limit/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            Create
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 900px;
  margin: 0 auto;
  height: auto;
  padding-top: 20px;
}
</style>