<template>
  <div class="header">
      <div class="content-wraper">
        <div class="avatar">
          <img :src="seller.avatar" width="64" height="64">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="support">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin-wraper" @click="showDetail">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <img :src="seller.avatar" width="100%" height="100%">
      </div>
      <transition name="fade">
        <div class="detail" v-show="detailShow" transition="fade">
          <div class="detail-wrapper clearfix">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="sell-warpper">
                <star :size="48" :score="seller.score"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul v-if="seller.supports" class="support">
                <li class="support-item" v-for="(item,index) in seller.supports" :key="item.id">
                  <span class="icon" :class="classMap[seller.supports[index].type]" ></span>
                  <span class="text">{{seller.supports[index].description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="hideDetail">
            <i class="icon-close"></i>
          </div>
        </div>
      </transition>

  </div>
</template>
<script >
import star from '../../components/star/star'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      classMap: [],
      detailShow: false
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  },
  components: {
    star
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin"
.header
  color #ffffff
  overflow hidden
  position relative
  background rgba(7,17,27,0.5)
  .content-wraper
    position relative
    padding 24px 12px 18px 24px
    font-size  0
    .avatar
      display inline-block
      vertical-align top
      img
        border-radius 2px
    .content
      display inline-block
      margin-left 16px
      .title
        margin 2px 0 8px 0
        .brand
          display inline-block
          width 30px
          height 18px
          bg-image('brand')
          background-size 30px 18px
          background-repeat no-repeat
          vertical-align  top
        .name
          font-size 16px
          line-height 18px
          font-weight bold
          margin-left 6px
      .description
        line-height 12px
        font-size 12px
        margin-bottom 10px
      .support
        .icon
          vertical-align top
          display inline-block
          width 12px
          height 12px
          margin 0 4px 2px 0
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_1')
          &.discount
            bg-image('discount_1')
          &.guarantee
            bg-image('guarantee_1')
          &.invoice
            bg-image('invoice_1')
          &.special
            bg-image('special_1')
        .text
          font-size 10px
          line-height 12px
    .support-count
      position absolute
      right 12px
      bottom 14px
      padding 0 8px
      height 24px
      line-height 24px
      border-radius 14px
      background-color rgba(0, 0, 0, 0.2)
      text-align center
      .count
        vertical-align top
        font-size 10px
      .icon-keyboard_arrow_right
        margin-left 2px
        line-height 24px
        font-size 10px
  .bulletin-wraper
    height 28px
    list-style 28px
    position relative
    padding 0 26px 0 12px
    // 设置点点点...
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    background-color rgba(7,17,27,0.2)
    .bulletin-title
      display inline-block
      width 22px
      height 12px
      vertical-align bottom
      margin-top 8px
      bg-image('bulletin')
      background-size 22px 12px
      background-repeat no-repeat
    .bulletin-text
      // vertical-align top
      margin 0 4px
      font-size 10px
    .icon-keyboard_arrow_right
      position absolute
      font-style 10px
      right 12px
      top 4px
  .background
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    z-index -3
    filter blur(10px)
  .fade-enter
    opacity:0
  .fade-leave
    opacity:1
  .fade-enter-active
    transition:opacity .5s
  .fade-leave-active
    opacity:0
    transition:opacity .5s
  .detail
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 100
    overflow auto
    background rgba(7,17,27,0.8)
    backdrop-filter blur(10px)
    .detail-wrapper
      min-height 100%
      width 100%
      .detail-main
        margin-top 64px
        // 一定padding
        padding-bottom 64px
        .name
          height 16px
          text-align center
          line-height 16px
          font-weight 700
        .sell-warpper
          margin-top 16px
          text-align center
          padding 2px 0
          .star
            height 24px
        .title
          display flex
          width 80%
          margin 28px auto 24px auto
          .line
            flex 1
            position relative
            top -7px
            border-bottom  1px solid rgba(255,255,255,0.2)
          .text
            padding 0 12px
            font-size 14px
            line-height 14px
            font-weight 700
        .support
          width 80%
          margin 0 auto
          .support-item
            padding 0 12px 0 12px
            margin-bottom 12px
            font-size 0
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              width 16px
              height 16px
              margin-right 6px
              background-size 16px 16px
              background-repeat no-repeat
              vertical-align top
              &.decrease
                bg-image('decrease_2')
              &.discount
                bg-image('discount_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              font-size 12px
              line-height 16px
              font-weight 200
        .bulletin
          width 80%
          margin 0 auto
          .content
            padding 0 12px
            font-size 12px
            font-weight 200
            line-height 24px
    .detail-close
      position relative
      width 32px
      height 32px
      margin -64px auto
      clear both
      font-size 32px
</style>
