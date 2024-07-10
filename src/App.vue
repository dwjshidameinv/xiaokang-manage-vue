<script setup lang='ts'>


</script>
<template>
   <router-view></router-view>
</template>

<style lang="scss" scoped>
.item1{
    width: 140px;
    margin:10px 15px;
    box-sizing: border-box;
}

.mymenu .el-menu-item.is-active {  
  background-color: white; 
  border-radius: 10px;
  color: #303133; 
 
}
.top {
    height: 60px;
    line-height: 60px;
    background: #ebae00;
}
.middle {
    display: flex;
    > div {
        height: calc(100vh - 60px);
    }
    .left {
        width: 180px;
        padding-top: 30px;
        box-sizing: border-box;
        background: #343946;
    }
    .right {
        flex: 1;
        background-color: #E8E9EB;
    }
}
</style>
