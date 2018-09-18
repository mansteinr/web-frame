<template>
	<el-container style="height: 100%;">
		<el-header>
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			  <el-menu-item index="1">处理中心</el-menu-item>
			  <el-submenu index="2">
			    <template slot="title">我的工作台</template>
			    <el-menu-item index="2-1">选项1</el-menu-item>
			    <el-menu-item index="2-2">选项2</el-menu-item>
			    <el-menu-item index="2-3">选项3</el-menu-item>
			    <el-submenu index="2-4">
			      <template slot="title">选项4</template>
			      <el-menu-item index="2-4-1">选项1</el-menu-item>
			      <el-menu-item index="2-4-2">选项2</el-menu-item>
			      <el-menu-item index="2-4-3">选项3</el-menu-item>
			    </el-submenu>
			  </el-submenu>
			  <el-menu-item index="3" disabled>消息中心</el-menu-item>
			  <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
			</el-menu>
		</el-header>
	  <el-container>
	  	<el-aside width="200px">
		  	<el-menu
		      default-active="2"
		      class="el-menu-vertical-demo"
		      @open="handleOpen"
		      @close="handleClose"
		      text-color="#fff"
		      active-text-color="#ffd04b">
		      <el-submenu index="1">
		        <template slot="title">
		          <i class="el-icon-location"></i>
		          <span>导航一</span>
		        </template>
		        <el-menu-item-group>
		          <template slot="title">分组一</template>
		          <el-menu-item index="1-1">选项1</el-menu-item>
		          <el-menu-item index="1-2">选项2</el-menu-item>
		        </el-menu-item-group>
		        <el-menu-item-group title="分组2">
		          <el-menu-item index="1-3">选项3</el-menu-item>
		        </el-menu-item-group>
		        <el-submenu index="1-4">
		          <template slot="title">选项4</template>
		          <el-menu-item index="1-4-1">选项1</el-menu-item>
		        </el-submenu>
		      </el-submenu>
		      <el-menu-item index="2">
		        <i class="el-icon-menu"></i>
		        <span slot="title">导航二</span>
		      </el-menu-item>
		      <el-menu-item index="3" disabled>
		        <i class="el-icon-document"></i>
		        <span slot="title">导航三</span>
		      </el-menu-item>
		      <el-menu-item index="4">
		        <i class="el-icon-setting"></i>
		        <span slot="title">导航四</span>
		      </el-menu-item>
		    </el-menu>
		  </el-aside>
		  <el-container style="padding: 10px;">
		    <router-view/>
		  </el-container>
	  </el-container>
	</el-container>
</template>

<script>
export default {
  data() {
	  return {
	    activeIndex: '1',
	    activeIndex2: '1'
	  };
	},
	methods: {
	  handleSelect(key, keyPath) {
	    console.log(key, keyPath);
	  },
	  handleOpen(key, keyPath) {
	    console.log(key, keyPath);
	  },
	  handleClose(key, keyPath) {
	    console.log(key, keyPath);
	  }
	},
  mounted () {
  	/*Vue内部调用api*/
		console.log(this.API.base.login);
  },
  beforeDestroy () {

  }
}
</script>

<style>

</style>