<template>
  <div class="mv-main-body">
    <main-header></main-header>
    <section class="mv-main-container">
      <main-menus></main-menus>
      <router-view/>
    </section>
  </div>
</template>

<script>
import MainHeader from '@/bundles/commonBundle/header/Main' //引入头部
import MainMenus from '@/bundles/commonBundle/menus/Main' //引入左侧导航
export default {
  components: {
    MainHeader,
    MainMenus
  },
  data() {
    return {

    }
  },
  created() {
    // this.$http.post('http://172.16.6.86:58080/login/ajaxLogin',{}).then(function (result) {
    //   console.log(result)
    // })
    // this.$http.post('http://172.16.6.86:5010/sms-agw/brandInfoCtr/getBrandInfoByPage',{}).then(function (result) {
    //   console.log(result)
    // })
  }
}
</script>

<style src="./index.scss" lang="scss"></style>
