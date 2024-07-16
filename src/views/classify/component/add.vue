<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, reactive, onMounted } from "vue";
import { API } from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  label1: "",
  name: "",
  categoryId: "",

  desc: "",
});

const onSubmit = () => {
  console.log("submit!");
  addDish();
};
const onCancel = () => {
  form.categoryId = "";
  form.desc = "";
  form.name = "";
  router.push("/classify/classify");
};
const route = useRoute();

onMounted(() => {
  setForm();
});

function setForm() {
  const type = route.query.type;
  if (type === "dish") {
    form.label1 = "菜品类型名称";
    form.categoryId = 0 + "";
  } else if (type === "meal") {
    form.label1 = "套餐类型名称";
    form.categoryId = 1 + "";
  }
}
const addDish = async () => {
  const data = reactive({
    name: form.name,
    categoryId: form.categoryId,
    description: form.desc,
  });
  ElMessageBox.confirm("确定要添加吗？", "添加提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let res = await API["add"](data);
      try {
        if (res.data.code === 200) {
          router.push("/classify/classify");
          ElMessage({
            message: "添加成功",
            type: "success",
          });
          console.log("添加成功后执行", res);
        } else {
          // 处理网络错误或其他异常
          router.push("/classify/classify");

          ElMessage({
            message: "添加失败",
            type: "error",
          });
        }
      } catch (error) {
        // 处理网络错误或其他异常
        router.push("/classify/classify");

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
};
</script>

<template>
  <div>
    <div class="box">
      <el-form
        :model="form"
        :size="'large'"
        label-width="auto"
        style="max-width: 600px; margin: 0 auto"
        :label-position="'top'"
      >
        <el-form-item :label="form.label1">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="form.desc" type="textarea" class="hello" />
        </el-form-item>
        <el-form-item
          style="padding-left: 420px; padding-top: 30px; padding-bottom: 80px"
        >
          <el-button @click="onCancel">取消</el-button>
          <el-button type="warning" @click="onSubmit">确认</el-button>
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