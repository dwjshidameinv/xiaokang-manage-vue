<script setup lang='ts'>
import {ref,defineEmits} from 'vue'
import type { FormInstance } from 'element-plus';
const emit = defineEmits(['selectValue1','inputValue','selectValue2'])

interface IProps {
    options?:any,
    placeholder1?:String,
    front1?:String,
    placeholder2?:String,
    front2?:String,
    placeholder3?:String,
    front3?:String,
    change?:any,
    menu?:any,
}
// vue
const props = defineProps<IProps>()
const input1 = ref()
const ipValue = ref()
const ipValue2 = ref()
const handleChange1 = (input:any)=>{
    input1.value = input
    console.log(input)
    emit('inputValue', input);  
}
const handleChange2 = (newValue:any)=>{
    ipValue.value = newValue
    console.log(ipValue)
    emit('selectValue1', newValue);  
}
const handleChange3 = (value:any)=>{
  ipValue2.value = value
    console.log(ipValue2)
    emit('selectValue2', value);  
}

</script>
<template>
<div>
    <el-text style="margin-left:30px;" class="myText">{{props.front1}}：</el-text>
    <el-input
    v-model="input1"
    style="width: 180px"
    :placeholder="props.placeholder1"
    clearable size="default"
    @change="handleChange1"
  />
  <el-text style="margin-left:30px;" class="myText">{{props.front2}}：</el-text>
  <el-select
    v-model="ipValue"
    clearable
    :placeholder="props.placeholder2"
    style="width: 180px"
    @change="handleChange2"
  >
    <el-option
      v-for="item in props.options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
<el-text class="myText" style="margin-left: 30px;">{{props.front3}}：</el-text>
  <el-select width="50px" 
    v-model="ipValue2"
    clearable
    :placeholder="props.placeholder2"
    style="width: 180px"
    @change="handleChange3"
  >
    <el-option
      v-for="item in menu"
      :key="item.id"
      :label="item.state"
      :value="item.id"
    />
  </el-select>

</div>
</template>

<style lang="scss" scoped>
.myText{
    font-size: 12px;
    font-weight: bold;
}
</style>
