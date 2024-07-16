<script setup lang='ts'>
import { ref } from "vue";
import { asyncRoutes } from "../../router/index";

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
<template>
  <div>
    <div class="top"></div>
    <div class="middle">
      <div class="left">
        <el-col>
          <el-menu
            class="mymenu"
            router
            active-text-color="#ffd04b"
            background-color="#343946"
            default-active="2"
            text-color="#fff"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item
              :index="item.path"
              v-for="item in asyncRoutes"
              :key="item.path"
              class="item1"
            >
              <template #title>
                <el-icon v-if="item.meta?.icon">
                  <component :is="item.meta?.icon"></component>
                </el-icon>
                <span>{{ item.meta?.til }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-col>
      </div>
      <div class="right">
        <div class="border">

            <router-view />
         
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.item1 {
  width: 140px;
  margin: 10px 15px;
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
    background-color: #e8e9eb;
    .border {
      width: 1320px;
      background: #fff;
      margin-left: 20px;
      margin-top: 20px;
    }
  }
}
</style>
