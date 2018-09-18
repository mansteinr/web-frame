<template>
	<div>
		<el-button @click="changeLocale">{{$t("my.name")}}</el-button>
    <el-button @click="startHacking">Start</el-button>
    <div class="block">
		  <span class="demonstration">周</span>
		  <el-date-picker
		    v-model="value3"
		    type="week"
		    format="yyyy 第 WW 周"
		    placeholder="选择周">
		  </el-date-picker>
		</div>
		<div class="block">
		  <span class="demonstration">月</span>
		  <el-date-picker
		    v-model="value4"
		    type="month"
		    placeholder="选择月">
		  </el-date-picker>
		</div>
		<div class="block">
		  <span class="demonstration">年</span>
		  <el-date-picker
		    v-model="value5"
		    align="right"
		    type="year"
		    placeholder="选择年">
		  </el-date-picker>
		</div>
	  <el-table
	    :data="tableData"
	    border
	    style="width: 100%">
	    <el-table-column
	      prop="date"
	      label="日期"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="姓名"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="address"
	      label="地址">
	    </el-table-column>
	  </el-table>
	</div>
</template>

<script>
export default {
	data() {
	  return {
	    value3: '',
	    value4: '',
	    value5: '',
	    tableData: [{
	      date: '2016-05-02',
	      name: '王小虎',
	      address: '上海市普陀区金沙江路 1518 弄'
	    }, {
	      date: '2016-05-04',
	      name: '王小虎',
	      address: '上海市普陀区金沙江路 1517 弄'
	    }, {
	      date: '2016-05-01',
	      name: '王小虎',
	      address: '上海市普陀区金沙江路 1519 弄'
	    }, {
	      date: '2016-05-03',
	      name: '王小虎',
	      address: '上海市普陀区金沙江路 1516 弄'
	    }]
	  };
  },
  mounted() {
  	//vm.$emit('pick', new Date())
  },
  methods: {
    startHacking () {
      this.$notify({
        title: 'It works!',
        type: 'success',
        message: 'We\'ve laid the ground work for you. It\'s time for you to build something epic!',
        duration: 5000
      })
    },
    changeLocale () {
			let locale = this.$i18n.locale
			locale === 'zh' ? this.$i18n.locale = 'en' : this.$i18n.locale = 'zh'
    }
  }
}
</script>

<style>
</style>