<script setup lang='ts'>
import { reactive, ref, watch, onMounted } from "vue";
import { API } from "./api";
import type { IMenu } from "./type";
import TopForm from "../../components/TopForm.vue";
import Edit from "./editForm.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { loadavg } from "os";
import type { IEdit } from "./type";
import Add from "./addDish.vue"

const tableData = ref([]);
const List = reactive({
  placeholder1: "请输入",
  front1: "菜品名称",
  placeholder2: "请选择",
  front2: "菜品分类",
  front3: "售卖状态",
});
const sel = reactive({
  ipValue: "",
  stateValue: -1,
  selectCategoryId: 0,
});
const total = ref(0);
const category = ref([]);
//获取列表
const page = reactive({
  pageNum: 1,
  limit: 7,
});
const selectData = reactive({
  pageNum: 1,
  limit: 7,
  name: sel.ipValue,
  stateId: sel.stateValue,
  categoryId: sel.selectCategoryId,
});
watch(
  () => sel.ipValue,
  (newValue) => (selectData.name = newValue)
  // { immediate: true } // 立即触发一次回调
);
watch(
  () => sel.stateValue,
  (newValue) => (selectData.stateId = newValue)
);
watch(
  () => sel.selectCategoryId,
  (newValue) => (selectData.categoryId = newValue)
);
watch(
  () => selectData.pageNum,
  (newValue) => {
    selectMenuList();
  } // 当 pageNum 改变时，只调用 menuList
);
watch(
  () => selectData.limit,
  (newValue) => selectMenuList() // 当 limit 改变时，也调用 menuList
);

const handleSelectValue = (newValue: any) => {
  sel.selectCategoryId = newValue;
  console.log(sel.selectCategoryId, "cateId");
};
const handleInputValue = (input: any) => {
  sel.ipValue = input;
  console.log(sel.ipValue, "inputValueText");
};
const handleSelectValue2 = (value: any) => {
  sel.stateValue = value;
  console.log(sel.stateValue, "stateValue");
};
const isLoading = ref(true); // 初始状态为加载中

const selectMenuList = async () => {
  isLoading.value = true;
  await new Promise((resolve) => {
    setTimeout(resolve, 500); // 延迟2秒后解析Promise
  });
  let res = await API["list2"](selectData);
  if (res != null) {
    console.log(res, "selectMenuList");
    tableData.value = res.data.data.list;
    total.value = res.data.data.count;
  }
  isLoading.value = false;
};

watch(
  () => isLoading,
  (newValue) => selectMenuList()
);
const categoryList = async () => {
  let res = await API["category"]();
  if (res == null) {
    return "error";
  }
  category.value = res.data.data;
  console.log(category.value, "categoryList");
};
function formatDateTime(isoString: any) {
  // 使用Date对象解析ISO字符串
  const date = new Date(isoString);

  // 检查日期对象是否有效
  if (isNaN(date.getTime())) {
    throw new Error("Invalid ISO 8601 date time string");
  }

  // 使用字符串模板和字符串切片来格式化日期和时间
  const formattedString = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${(
    "0" + date.getHours()
  ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${(
    "0" + date.getSeconds()
  ).slice(-2)}`;

  return formattedString;
}
//编辑操作
// 弹窗
const dialogVisible1 = ref(false);
//编辑用户
// 创建一个用户对象
const ruleForm = ref<any>({});

const handleEdit = (index: number, row: IMenu) => {
  dialogVisible1.value = true;
  // 创建一个新的对象，包含row的所有属性和一个新的categories属性
  ruleForm.value = {
    ...row,
    categories: category.value, // 假设category是已经在外部定义的数组
  };
  console.log(index, row, ruleForm.value);
};

// 编辑提交
const submitEdit = async () => {
  console.log(ruleForm.value, "aaa");

  const editForm = reactive<IEdit>({
    foodId: ruleForm.value.foodId,
    foodName: ruleForm.value.foodName,
    foodSale: ruleForm.value.foodSale,
    foodImg: ruleForm.value.foodImg,
    foodKindId: ruleForm.value.foodKindId,
  });
  console.log("修改的editForm",editForm)
  let res = await API["edit"](editForm);
  try {
    if (res.data.code === 200) {
      // 假设这是成功的响应结构
      console.log(res, "编辑操作成功");
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      // 在这里调用 selectMenuList 来重新获取数据
      await selectMenuList();
    } else {
      // 处理错误或失败的响应
      ElMessage({
        message: "修改失败",
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
  dialogVisible1.value = false;
};

const handleClose = (done: () => void) => {
  done();
};
// 删除操作
const handleDelete = (index: number, row: IMenu) => {
  console.log(index, row);
  let id = row.foodId as number;
  ElMessageBox.confirm("确定要删除吗？", "删除提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let res = await API["delete"](id);
      try {
        if (res.data.code == 200) {
          console.log(res, "删除操作执行");
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          await selectMenuList();
        } else {
          // 处理错误或失败的响应
          ElMessage({
            message: res.data.data,
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
        message: "删除取消",
      });
    });
};

//新建菜品

const dialogVisible2 = ref(false)
const ruleForm2 = ref<any>({});
const foodName = ref<String>('')
const handelFoodName = (val:any) =>{
  foodName.value = val
  console.log("foodName:",foodName.value)
}
const foodKindId = ref<any>('')
const handleKindId = (val:any)=>{
  foodKindId.value = val
  console.log("foodKindId:",foodKindId.value)
}
const foodSale = ref<any>('')
const handleSale = (val:any)=>{
  foodSale.value = val
  console.log("foodSale:",foodSale.value)
}
const foodImg = ref<String>('')
const handleFoodImg = (val:any)=>{
  foodImg.value = val
  console.log("foodImg:",foodImg.value)
}
const addDish = () =>{
  dialogVisible2.value = true;
  ruleForm2.value = {
    categories: category.value, 
  };
}
//新增菜品提交
const submitAdd = () =>{
   const addData = reactive<IEdit>({
    foodName:foodName.value,
    foodSale:foodSale.value,
    foodKindId:foodKindId.value,
    foodImg:foodImg.value
  })
  ElMessageBox.confirm("确定要添加吗？", "添加提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then( async()=> {
    let res = await API['add'](addData)
    try {
      if(res.data.code ===200 &&res.data.data == 1){
        ElMessage({
          message:"添加成功",
          type:"success"
        })
        await selectMenuList();
        console.log("添加成功后执行",res)
      }else{
          // 处理网络错误或其他异常
        ElMessage({
          message: res.data.data,
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
  })
  dialogVisible2.value = false;
}
//在售停售调整
const handleSaleVal = async (index: number, row: IMenu) =>{
  // console.log("www",row)
  const editForm = reactive<IEdit>({
    foodId:row.foodId,
    foodState:row.foodState
  })
  let res = await API["edit"](editForm);
   ElMessageBox.confirm("确定修改售卖状态？", "修改提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then( async()=> {
    let res = await API['edit'](editForm)
    try {
      if(res.data.code ===200 &&res.data.data == 1){
        ElMessage({
          message:"修改成功",
          type:"success"
        })
        await selectMenuList();
        console.log("修改成功后执行",res)
      }else{
          // 处理网络错误或其他异常
        ElMessage({
          message: res.data.data,
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
  })
}
//选择操作

const multipleSelection = ref<any[]>([]);
const handleSelectionChange = (val: any[]) => {

  multipleSelection.value = val;
  console.log("qqq",multipleSelection.value)
};
const batchDelete = () => {
  
  ElMessageBox.confirm("确定将选择的菜品删除吗？", "删除提醒", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then( async() => {
      multipleSelection.value.forEach(async(item,index)=>{
        let id = item.foodId
        let res = await API["delete"](id);
      try {
        if (res.data.code == 200) {
          console.log(res, "删除操作执行");
        } else {
          // 处理错误或失败的响应
          ElMessage({
            message: res.data.data,
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
       ElMessage({
          message: "删除成功",
          type: "success",
        });
        await selectMenuList()
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    });
}
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: IMenu;
  rowIndex: number;
}) => {
  // console.log(rowIndex,"haha")
  if ((rowIndex + 1) % 2 != 0) {
    return "warning-row";
  } else {
    return "success-row";
  }
};

const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
const menu = [
  {
    id: 1,
    state: "在售",
  },
  {
    id: 0,
    state: "停售",
  },
];

watch(
  () => tableData,
  (newVal, oldVal) => {
    // 当 ruleForm 发生变化时执行的逻辑
    console.log("tableData 改变了:");
  }
);

onMounted(() => {
  selectMenuList(), categoryList();
});
</script>

<template>
  <div class="border1">
    <div class="ttop">
      <TopForm
        :placeholder1="List.placeholder1"
        :front1="List.front1"
        :placeholder2="List.placeholder2"
        :front2="List.front2"
        :options="category"
        @selectValue1="handleSelectValue"
        @inputValue="handleInputValue"
        @selectValue2="handleSelectValue2"
        :menu="menu"
        :front3="List.front3"
        class="MyTopForm"
      />
      <el-button
        style="background-color: bisque; margin-left: 10px"
        @click="selectMenuList"
        >查询</el-button
      >

      <el-button style="margin-left: 50px" type="danger" text @click="batchDelete"
        >批量删除</el-button
      >
      <el-button
        style="margin-left: 10px; color: #000; font-size: 12px"
        type="warning"
        @click="addDish"
        >+ 新增菜品</el-button
      >
    </div>
    <div v-if="isLoading" class="loading-box">
      <svg
        t="1717852293366"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="7137"
        width="200"
        height="200"
      >
        <path
          d="M521.813333 44.501333a44.245333 44.245333 0 0 0-43.733333 44.672c-0.213333 24.277333 0 48.554667 0 72.832 0 25.002667-0.341333 49.962667 0.085333 74.965334 0.426667 24.789333 20.181333 43.221333 45.226667 43.008a43.776 43.776 0 0 0 43.733333-43.52c0.256-49.237333 0.298667-98.56 0-147.797334-0.170667-25.344-20.053333-44.288-45.312-44.16M342.186667 125.226667c-7.594667-13.013333-19.797333-19.498667-35.072-19.541334-32.213333 0-51.882667 33.877333-35.754667 62.464 23.808 42.24 48.042667 84.266667 72.405333 126.165334 11.904 20.394667 36.693333 26.88 56.704 15.488a41.002667 41.002667 0 0 0 15.914667-55.808 7949.354667 7949.354667 0 0 0-74.154667-128.768m-209.664 215.04c40.661333 23.594667 81.408 47.018667 122.112 70.528 6.144 3.541333 12.544 6.314667 19.882667 5.888a37.717333 37.717333 0 0 0 37.888-28.928c4.565333-16.768-2.474667-33.706667-18.56-43.093334a28154.026667 28154.026667 0 0 0-122.922667-71.253333c-20.650667-11.904-43.861333-6.4-54.869333 12.8-11.178667 19.456-4.565333 41.813333 16.469333 54.016m31.317334 216.32c24.192 0 48.426667 0.170667 72.618666-0.085333 21.461333-0.213333 35.882667-15.061333 35.541334-35.84-0.298667-19.84-15.488-34.304-36.266667-34.304h-142.08c-22.144 0.085333-37.290667 14.677333-37.162667 35.498666 0.128 20.309333 15.189333 34.56 36.864 34.688 23.466667 0.128 46.976 0 70.485334 0m139.093333 91.904a31.402667 31.402667 0 0 0-42.965333-11.861333c-42.666667 24.32-85.077333 49.066667-127.445334 73.813333-10.154667 5.973333-14.933333 15.488-15.104 23.296 0.042667 27.989333 24.96 43.946667 46.208 32.128a5476.778667 5476.778667 0 0 0 128.426667-74.154666c15.786667-9.301333 19.712-27.818667 10.837333-43.221334m84.266667 93.184c-13.098667-3.754667-25.344 1.28-32.896 14.336-23.722667 41.002667-47.36 82.090667-70.826667 123.306667-9.173333 16.042667-5.376 32.682667 8.96 41.216 14.677333 8.789333 31.36 3.754667 40.96-12.8 23.466667-40.405333 46.677333-80.896 70.016-121.344 3.029333-5.248 5.205333-10.666667 5.290667-13.653333 0-16.341333-8.533333-27.392-21.504-31.061334m135.168 40.576c-15.061333 0.085333-25.088 10.922667-25.173333 27.648-0.128 23.253333 0 46.506667 0 69.717334h-0.085334c0 23.936-0.128 47.914667 0 71.850666 0.128 16.725333 10.154667 27.562667 25.173334 27.690667 15.530667 0.128 25.728-10.837333 25.770666-28.16 0.128-46.848 0.128-93.696 0.085334-140.501333 0-17.237333-10.325333-28.330667-25.770667-28.245334m162.389333-23.893333a21.76 21.76 0 0 0-30.933333-8.149333 21.76 21.76 0 0 0-7.808 30.293333c24.064 42.368 48.512 84.565333 72.96 126.72 4.138667 7.168 10.666667 11.008 19.2 10.88a21.973333 21.973333 0 0 0 19.456-32.896c-23.893333-42.538667-48.298667-84.736-72.874667-126.890667m219.946667-37.76l-124.586667-72.106666a18.56 18.56 0 0 0-14.08-2.688c-8.362667 2.048-13.696 7.381333-15.146666 15.701333-1.706667 9.941333 3.541333 16.64 11.818666 21.461333l81.92 47.274667c13.952 8.106667 27.690667 16.512 41.898667 24.064a18.901333 18.901333 0 0 0 28.458667-16.554667 19.029333 19.029333 0 0 0-10.24-17.152m44.8-215.04c-22.826667-0.128-45.653333-0.042667-68.437334-0.042666v-0.042667c-23.125333 0-46.293333-0.085333-69.418666 0-12.373333 0.085333-19.2 5.802667-19.413334 15.872-0.170667 10.197333 6.485333 16.042667 18.944 16.085333 46.293333 0.085333 92.586667 0.128 138.88 0.042667 12.245333 0 19.413333-5.930667 19.626667-15.701333 0.170667-9.941333-7.466667-16.213333-20.224-16.213334m-172.288-116.608c41.344-23.850667 82.645333-47.744 123.904-71.68 4.48-2.56 7.552-6.272 7.466667-11.861333-0.128-10.112-10.24-15.957333-19.712-10.581333-41.728 23.893333-83.285333 48.042667-124.8 72.277333-6.997333 4.096-9.642667 10.538667-5.12 17.92 4.437333 7.210667 11.093333 8.106667 18.261333 3.925333M665.173333 283.349333c4.736-0.256 7.509333-3.157333 9.728-7.04 4.48-7.936 9.173333-15.786667 13.738667-23.68 18.730667-32.554667 37.504-65.109333 56.149333-97.706666 4.693333-8.106667 2.773333-15.274667-4.352-16.981334-7.04-1.706667-9.984 3.413333-12.885333 8.405334l-63.061333 109.525333c-2.602667 4.565333-5.546667 9.045333-7.594667 13.866667-2.858667 6.570667 1.536 13.397333 8.277333 13.610666"
          fill="#999999"
          p-id="7138"
        ></path>
      </svg>
    </div>
    <!-- 当 isLoading 为 false 且 tableData 有数据时显示表格 -->

    <el-table
      v-if="!isLoading && tableData.length >= 1"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      class="myTable"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="菜品名称" width="120" align="center" >
        <template #default="scope">
          {{ scope.row.foodName }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="120" align="center">
        <template #default="scope">
          <div>
            <img
              v-if="scope.row.foodImg"
              :src="scope.row.foodImg"
              style="width: 40px; height: 40px"
            />
            <img v-else src="" style="width: 40px; height: 40px" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="菜品分类" width="120" align="center">
        <template #default="scope">
          <span>{{ scope.row.kindName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售价" width="120" align="center">
        <template #default="scope">
          <span>{{ scope.row.foodSale }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template #default="scope">
          <!-- <span>{{ row.foodState }}</span> -->
          <span v-if="scope.row.foodState == 1">在售</span>
          <span v-else>停售</span>
        </template>
      </el-table-column>
      <el-table-column label="最后操作时间" width="220" align="center">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.foodAot) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            type="primary"
            text
            class="myButton"
          >
            编辑
          </el-button>
          <el-button
            class="myButton"
            size="small"
            type="danger"
            text
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
          <el-button
            class="myButton"
            size="small"
            text
            :type="scope.row.foodState == 0 ? 'primary' : 'danger'"
            @click="handleSaleVal(scope.$index, scope.row)"
          >
            <span v-if="scope.row.foodState == 0">启售</span>
            <span v-else>停售</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!isLoading && tableData.length <= 0" class="box">
      <svg
        t="1717750273296"
        class="icon hahaa"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="14416"
        width="200"
        height="200"
      >
        <path
          d="M960 705.672533C960 801.216 755.8912 853.333333 437.333333 853.333333c-246.272-0.085333-373.9008-66.474667-368.925866-151.650133C74.517333 596.919467 254.357333 546.133333 500.629333 546.133333 746.901333 546.133333 960 652.672 960 705.672533z"
          fill="#F7F6F6"
          p-id="14417"
        ></path>
        <path
          d="M715.8272 713.1136s-9.096533 13.666133-20.360533 16.226133c0 0 38.557867 0.256 64.1152 3.413334 0 0 12.130133-18.359467 17.762133-19.639467-0.085333 0-40.721067 2.56-61.5168 0z m115.844267-16.823467s10.397867 2.986667 18.628266 3.413334c0 0 1.821867 21.0944-15.163733 34.1632 0 0-8.661333-8.541867-18.628267-12.381867 0 0 18.197333-6.237867 15.163734-25.194667zM813.0432 631.466667s9.096533 11.6992 22.0928 2.901333c0 0-1.472 19.729067 5.376 22.72 4.155733 2.56 12.821333 8.541867 12.821333 8.541867s-20.360533 8.964267-36.821333-7.688534c-6.5024-7.684267-3.4688-22.203733-3.4688-26.474666z"
          fill="#BDC7DE"
          p-id="14418"
        ></path>
        <path
          d="M742.301867 644.8768L563.2 789.333333l-6.126933-287.6416 188.16-108.650666z"
          fill="#E7EAEE"
          p-id="14419"
        ></path>
        <path
          d="M243.2 694.869333v-109.666133l261.341867 75.554133c17.5104-125.482667 52.5312-187.3408 52.5312-159.061333 0 15.018667 3.938133 213.405867 6.126933 287.637333l-320-94.464z"
          fill="#C7CCD7"
          p-id="14420"
        ></path>
        <path
          d="M560.034133 503.466667L469.333333 490.666667V315.733333l277.333334 79.138134z"
          fill="#B9BEC6"
          p-id="14421"
        ></path>
        <path
          d="M469.333333 486.4L247.466667 424.379733 469.333333 315.733333z"
          fill="#D9DDE9"
          p-id="14422"
        ></path>
        <path
          d="M806.4 533.333333l-62.314667-136.533333-1.685333 117.853867z"
          fill="#D6DDE9"
          p-id="14423"
        ></path>
        <path
          d="M508.096 665.6L187.733333 568.443733 248.213333 422.4 558.933333 501.1072z"
          fill="#DBE4EE"
          p-id="14424"
        ></path>
        <path
          d="M890.9056 181.969067c-5.218133-7.7952-43.029333 0.866133-59.9808 25.975466-4.778667 7.7952-9.9968 31.172267-6.084267 25.975467 9.9968-14.72 28.2496-6.058667 42.154667-17.749333 11.7376-9.5232 28.689067-28.142933 23.9104-34.2016z"
          fill="#F0F1F4"
          p-id="14425"
        ></path>
        <path
          d="M826.368 238.933333h-1.792c-4.032-2.197333 4.036267-25.0368 6.272-29.4272 13.444267-20.202667 40.328533-29.4272 53.768533-30.306133 5.376 0 8.512 1.757867 10.304 3.950933 7.168 10.103467-23.744 37.333333-24.64 37.333334-7.168 6.152533-15.232 7.031467-22.852266 7.906133-8.064 1.757867-15.68 2.197333-20.608 9.224533 0.896 0.439467 0.448 1.3184-0.448 1.3184z m59.144533-56.661333c-13.44 0-38.084267 9.224533-50.628266 28.113067-3.136 4.829867-5.376 15.3728-7.168 21.0816 6.272-6.148267 13.44-7.0272 20.608-7.906134 7.168-0.878933 14.336-2.197333 20.608-7.0272 13.444267-11.4176 26.884267-28.1088 23.748266-31.624533-0.448-1.757867-3.136-2.632533-7.168-2.632533z"
          fill="#B9BEC6"
          p-id="14426"
        ></path>
        <path
          d="M843.605333 217.6l-3.072-2.235733c14.0416-18.325333 30.280533-32.183467 64.512-42.013867 3.072-0.896 4.8256-1.792 5.265067-1.792 1.757867-0.891733 1.757867-0.891733 6.144-0.891733l0.878933 4.023466c-3.950933 0.896-3.950933 0.896-5.265066 0.896-0.878933 0-2.197333 0.891733-5.269334 1.783467-33.792 8.942933-50.026667 22.353067-63.1936 40.2304z"
          fill="#B9BEC6"
          p-id="14427"
        ></path>
        <path
          d="M217.6 727.0528c-0.861867 7.825067-32.7424 16.955733-55.5776 6.088533-7.752533-3.0464-20.676267-17.826133-15.940267-15.2192 13.789867 5.218133 23.697067-6.954667 38.775467-5.218133 12.4928 2.176 32.7424 8.260267 32.7424 14.3488z"
          fill="#F0F1F4"
          p-id="14428"
        ></path>
        <path
          d="M183.1808 738.133333c-8.174933 0-16.7808-1.800533-24.5248-4.9536-5.162667-2.2528-19.793067-14.4128-17.642667-18.4704 0 0 0.861867-2.248533 3.874134-0.896 6.882133 3.1488 12.0448 0.896 18.9312-1.8048 6.024533-2.2528 12.0448-4.9536 19.793066-3.153066 6.882133 0.900267 33.988267 7.210667 33.988267 16.6656 0 2.2528-1.719467 4.9536-5.162667 6.306133-6.455467 3.153067-17.211733 6.306133-29.256533 6.306133z m-36.573867-19.818666c3.012267 4.053333 9.0368 8.558933 12.906667 11.264 17.642667 8.106667 40.448 4.949333 49.480533-1.8048 2.1504-1.800533 3.012267-2.2528 3.012267-3.157334 0-4.053333-15.918933-10.3552-30.976-12.608-6.8864-0.900267-12.049067 1.800533-17.642667 3.153067-4.736 2.2528-9.898667 4.5056-16.7808 3.153067z"
          fill="#B9BEC6"
          p-id="14429"
        ></path>
        <path
          d="M228.194133 725.333333c-14.775467-3.963733-26.948267-2.2016-37.8112-1.762133-10.8672 0.439467-19.1232 1.762133-28.2496-1.757867l1.736534-3.963733c7.825067 3.080533 16.951467 2.2016 26.948266 1.762133 11.298133-0.8832 23.901867-2.2016 38.2464 1.757867l-0.8704 3.963733z m470.9376-409.9072c-11.298133 0-24.337067-2.645333-38.6816-8.362666l1.7408-3.963734c25.207467 9.685333 44.765867 11.008 59.541334 3.080534-5.649067-2.641067-9.130667-6.161067-11.3024-9.685334-4.778667-7.04-5.649067-16.285867-2.171734-24.648533 2.606933-7.04 12.168533-10.564267 19.9936-11.008 8.6912-0.4352 16.081067 2.205867 19.1232 7.488 2.171733 4.398933 3.473067 11.882667-5.218133 24.648533-3.042133 4.842667-6.954667 8.8064-10.862933 11.886934 4.343467 0.878933 9.1264 1.762133 15.645866 1.762133 22.165333 0 39.547733-17.169067 51.285334-50.624l3.908266 1.322667c-12.603733 35.652267-31.291733 53.700267-55.6288 53.700266-8.260267 0-14.775467-1.322667-19.9936-3.080533-7.3856 5.282133-16.512 7.483733-27.3792 7.483733z m31.726934-50.180266h-1.7408c-7.8208 0.439467-14.340267 3.959467-16.0768 8.362666-2.6112 7.04-2.176 14.523733 1.736533 20.689067 2.176 3.080533 5.649067 6.600533 12.168533 9.2416 4.778667-3.080533 8.6912-7.483733 12.168534-12.765867 5.649067-8.802133 7.389867-15.402667 5.218133-19.805866-3.042133-4.4032-8.695467-5.7216-13.474133-5.7216z m-420.608 394.325333c-8.96 1.668267-19.562667 1.578667-31.7312-0.7936l0.785066-3.345067c21.290667 3.869867 36.9408 1.937067 47.458134-6.5152-4.868267-1.237333-8.085333-3.524267-10.3424-5.9008-4.778667-4.842667-6.869333-11.972267-5.303467-19.101866 1.041067-5.9904 8.081067-10.2144 14.165333-11.712 6.784-1.672533 13.038933-0.704 16.170667 2.9952 2.346667 3.170133 4.522667 8.891733-0.5248 20.2496-1.6512 4.309333-4.168533 8.008533-6.865067 11.003733 3.562667 0 7.4752 0 12.603734-0.968533 17.472-3.345067 28.6848-19.541333 33.028266-47.7184l3.306667 0.439466c-4.693333 30.024533-16.776533 47.104-35.985067 50.798934-6.519467 1.237333-11.822933 1.237333-16.256 0.618666-5.0432 5.192533-11.908267 8.277333-20.514133 9.9456z m17.642666-44.458667l-1.390933 0.260267c-6.084267 1.493333-10.692267 5.282133-11.477333 9.066667-1.041067 5.9904 0.4352 11.797333 4.437333 16.0256 2.171733 2.112 5.3888 4.309333 10.948267 5.461333 3.306667-3.1744 5.738667-7.223467 7.739733-11.886933 3.127467-7.837867 3.562667-13.294933 1.216-16.375467-3.042133-3.0848-7.650133-3.259733-11.477333-2.555733z"
          fill="#CDD2D9"
          p-id="14430"
        ></path>
        <path
          d="M623.035733 809.813333c-7.232 8.576-6.621867 22.754133 10.5472 24.503467 13.422933 1.403733 30.592 5.162667 56.388267-4.113067l106.069333-65.211733c17.339733-10.6752 19.780267-35.272533 4.5312-48.750933-0.264533-0.264533-0.5248-0.5248-0.874666-0.699734a30.353067 30.353067 0 0 0-34.513067-3.413333c-33.2928 18.645333-116.177067 66.781867-142.148267 97.681067z"
          fill="#E2E6ED"
          opacity=".7"
          p-id="14431"
        ></path>
        <path
          d="M673.4592 823.466667L644.266667 776.375467l146.496-88.4224c3.362133-2.005333 7.786667-0.96 9.9968 2.350933l21.674666 34.9696c2.0352 3.400533 0.9728 7.675733-2.389333 9.856L673.4592 823.466667z"
          fill="#FDE9CB"
          p-id="14432"
        ></path>
        <path
          d="M757.8624 705.284267L773.546667 695.466667 802.133333 743.236267l-15.68 9.813333-28.586666-47.765333zM631.466667 816.213333l13.602133-40.516266 28.586667 47.7696-42.1888-7.253334z"
          fill="#FADAAB"
          p-id="14433"
        ></path>
        <path
          d="M674.133333 813.397333L779.8272 750.933333l0.9728 1.536L675.106133 814.933333z"
          fill="#FFFFFF"
          p-id="14434"
        ></path>
        <path
          d="M444.842667 376.362667l-1.813334 1.851733a5.205333 5.205333 0 0 1-7.355733 0l-37.380267-38.058667c-1.992533-2.0224-1.992533-5.371733 0-7.483733l1.8176-1.851733a5.205333 5.205333 0 0 1 7.351467 0l37.380267 38.058666c1.992533 2.112 1.992533 5.461333 0 7.483734z m59.8784-13.3888h-2.594134c-2.858667 0-5.192533-2.376533-5.192533-5.2864V303.957333c0-2.909867 2.333867-5.2864 5.192533-5.2864h2.594134c2.858667 0 5.192533 2.376533 5.192533 5.2864v53.7344c0 2.909867-2.338133 5.2864-5.192533 5.2864z m59.182933 15.240533l-1.813333-1.851733c-1.992533-2.026667-1.992533-5.376 0-7.488l37.376-38.0544a5.205333 5.205333 0 0 1 7.355733 0l1.8176 1.851733c1.992533 2.0224 1.992533 5.371733 0 7.488l-37.376 38.0544a5.205333 5.205333 0 0 1-7.36 0z"
          fill="#ACBBD1"
          p-id="14435"
        ></path>
      </svg>
    </div>
    <el-pagination
      v-else-if="!isLoading && tableData.length >= 1"
      class="myPage"
      v-model:current-page="selectData.pageNum"
      v-model:page-size="selectData.limit"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-model="dialogVisible1" title="编辑菜品" width="500">
      <Edit :ruleForm="ruleForm" ref="editForm" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="submitEdit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible2" title="新增菜品" width="500" draggable
     > 
    <Add @handleFoodName="handelFoodName" @handleKindId="handleKindId" @handleSale="handleSale" @handleFoodImg="handleFoodImg" :ruleForm ="ruleForm2" />
     <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="submitAdd"> 确定 </el-button>
        </div>
     </template>
  </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.border1{
  background-color: #fff;
   margin-left: 20px;
   margin-top: 20px;
   width: 1320px;
}
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.loading-box {
  width: 800px;
  svg {
    margin-top: 200px;
    margin-left: 400px;
    width: 100px;
    height: 100px;
  }
}
.ttop {
  height: 80px;
  line-height: 80px;
}

.MyTopForm {
  float: left;
}
.myTable {
  font-size: 12px;
}
.myPage {
  margin-left: 700px;
}
.box {
  width: 900px;
  height: 600px;
  .icon.hahaa {
    margin-left: 450px;
    margin-top: 200px;
  }
}
</style>
