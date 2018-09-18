<template>
  <div>
    {{api}}<router-view/>
  </div>
  
</template>

<script>
console.log('测试打包删除log')

export default {
  data() {
    return {
      api: this.API.base.login
    }
  }
}
</script>
