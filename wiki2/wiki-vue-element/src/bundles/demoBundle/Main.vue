<template>
	<section class="mv-main-container-warp">
		<section class="mv-card mv-mt mv-ph">
			<el-button @click="changeLocale">{{$t("my.name")}}</el-button>
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
		</section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      value3: '',
      value4: '',
      value5: ''
    };
  },
  mounted() {
    //vm.$emit('pick', new Date())
  },
  methods: {
    changeLocale() {
      let locale = this.$i18n.locale

      console.log(locale)
      if (locale === 'zh') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'zh'
      }
    }
  }
}
</script>