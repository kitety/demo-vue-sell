<template>
  <transition name="detailMove">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sellCount">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @add="addFoodDetail"></cartcontrol>
          </div>
          <transition name="moveAdd">
            <div class="buy" v-show="!food.count||food.count<1"  @click.stop.prevent="addFoodCart($event)">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingseclect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @seclectTypeChange="seclectTypeChangeFun" @toggleContentList="togConFun()"></ratingseclect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length" >
              <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="rating-item" :key="rating.id">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt="" width="12" height="12" class="avatar">
                </div>
                <div class="time">{{rating.rateTime|formatDateFun}}</div>
                <p class="text">
                  <!-- :class绑定对象 -->
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from 'vue'
import {formatDate} from '../../common/js/date'
import Bscroll from 'better-scroll'
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import split from '../../components/split/split'
import ratingseclect from '../../components/ratingseclect/ratingseclect'
const ALL = 2
const POSITIVE = 0
// const NEGATIVE = 1
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  filters: {
    formatDateFun (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    seclectTypeChangeFun (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    togConFun () {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow (type, text) {
      // 只看有内容,但是没有内容显示
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    addFoodDetail (target) {
      this.$emit('addFood', target)
    },
    // goods中调用
    showDetail () {
      this.showFlag = true
      this.selectType = POSITIVE
      this.onlyContent = false
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new Bscroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFoodCart (event) {
      Vue.set(this.food, 'count', 1)
      this.addFoodDetail(event.target)
    }
  },
  components: {
    cartcontrol,
    split,
    ratingseclect
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.food
  position fixed
  top 0
  left 0
  z-index 30
  width 100%
  bottom 48px
  background #ffffff
  transform translate3d(0,0,0)
  opacity 1
  &.detailMove-enter-active, &.detailMove-leave-active
    transition all .4s linear
  &.detailMove-enter, &.detailMove-leave-active
    transform translate3d(100%,0,0)
    opacity 0
  .image-header
    position relative
    width 100%
    height 0
    padding-top 100%
    img
      position absolute
      top 0
      left 0
      width 100%
      height 100%
    .back
      position absolute
      top 10px
      left 0
      .icon-arrow_lift
        // 转换为块元素
        display block
        padding 10px
        color #fff
        font-size 10px
  .content
    padding 18px
    position relative
    .title
      line-height 14px
      font-size 14px
      font-weight 700
      margin-bottom 8px
      color rgb(7,17,27)
    .detail
      margin-bottom 18px
      font-size 0px
      line-height 10px
      height 10px
      .sellCount,.rating
        color #9ba0a6
        font-size 10px
      .sellCount
        margin-right 12px
    .price
      line-height 24px
      font-weight normal
      .now
        font-size 14px
        color #f01414
        margin-right 8px
        height 24px
        font-weight 700
      .old
        font-size 10px
        color rgb(147,153,159)
        text-decoration line-through
    .cartcontrol-wrapper
      position absolute
      right 12px
      bottom 12px
    .buy
      position absolute
      right 18px
      bottom 18px
      z-index 10
      height 24px
      line-height 24px
      padding 0 12px
      box-sizing border-box
      font-size 10px
      border-radius 12px
      background #00a0dc
      color #fff
      opacity 1
      // width 100%
      &.moveAdd-enter-active, &.moveAdd-leave-active
        transition all 0.45s linear
      &.moveAdd-enter, &.moveAdd-leave-active
        opacity 0
        z-index -1
  .info
    padding 18px
    .title
      line-height 14px
      margin-bottom 6px
      font-size 14px
      color #000
    .text
      color rgb(77,85,93)
      line-height 24px
      font-size 12px
      padding 0 8px
  .rating
    .title
      padding 18px 18px 0
    .rating-wrapper
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px(rgba(7,17,27,0.1))
        .user
          position absolute
          right 0
          // 16px的padding不会影响到绝对定位
          top 16px
          line-height 12px
          font-size 0
          .name
            margin-right 6px
            display inline-block
            vertical-align top
            font-size 10px
            color rgb(147,153,159)
          .avatar
            border-radius 50%
        .time
          font-size 10px
          color rgb(147,153,159)
          line-height 12px
          margin-bottom 6px
        .text
          line-height 16px
          font-size 12px
          color rgb(7,17,27)
          .icon-thumb_up,.icon-thumb_down
            margin-right 4px
            font-size 12px
          .icon-thumb_down
            color #b7bbbf
          .icon-thumb_up
            color #00a0dc
      .no-rating
        padding 16px 0
        font-size 12px
        color rgb(147,153,159)
        text-align center
</style>
