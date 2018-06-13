<template>
  <div id="app">
    <sellHeader :seller="seller"></sellHeader>
    <div class="tab ">
      <router-link to="/goods" class="tab-item">商品</router-link>
      <router-link to="/rating" class="tab-item">评论</router-link>
      <router-link to="/seller" class="tab-item">商家</router-link>
    </div>
    <router-view class="content" :seller="seller"></router-view>
  </div>
</template>
<script type="text/scmascript-6">
import sellHeader from './components/header/header.vue'
import {urlParse} from './common/js/util'
const ERR_OK = 0
export default {
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  created () {
    this.$http.get('/api/seller?' + this.seller.id).then((response) => {
      // console.log(response)
      response = response.body
      if (response.errno === ERR_OK) {
        // this.seller = response.data
        // 用es6语法
        this.seller = Object.assign({}, this.seller, response.data)
      }
    })
  },
  components: {
    sellHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl'
#app
  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    position relative
    // 与后面对的绝对定位的border对应
    // border-bottom 1px solid rgba(7,17,27,0.1)
    // 用下面的函数
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      text-align center
      font-size 14px
    &>a
        display block
      font-size 14px
      color rgb(77,85,93)
      // 这里不用定义，直接在父元素定义
      // line-height 14px
    .router-link-active
      color rgb(240,20,20)
</style>
