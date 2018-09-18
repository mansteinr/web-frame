//处理menu相关事情
export default {
  data() {
    return {
      menuActive: '1-4-1'
    }
  },
  methods: {
    //菜单点击
    handleSelect(key) {
      this.menuActive = key
      this.$router.push(key)
    }
  }
}
