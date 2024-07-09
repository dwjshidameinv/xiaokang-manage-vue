<script setup lang='ts'>
import {ref,reactive} from 'vue'
import Top from "../../components/TopForm.vue" 
 
 const sel = reactive({
  ipValue: "",
  stateValue: -1,
  selectCategoryId: 0,
});
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
//  :options="category"
//         @selectValue1="handleSelectValue"
//         @inputValue="handleInputValue"
//         @selectValue2="handleSelectValue2"
//         :menu="menu"
//         :front3="'状态'"
//         class="MyTopForm" 
</script>
<template>
<div>
    <Top :placeholder1="'分类名称'"
        :front1="'分类名称'"
        :front2="'分类类型'"
      />
      <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
    </el-table>
</div>
</template>

<style lang="scss" scoped>
</style>
