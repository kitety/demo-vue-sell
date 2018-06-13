<template>
  <div class="ratings" ref="ratingRef">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore" class="star"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore" class="star"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="deliveryTime-wrapper">
            <span class="title">送达时间</span>
            <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingseclect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="ratings" @seclectTypeChange="seclectTypeChangeFun" @toggleContentList="togConFun()"></ratingseclect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" :key="rating.id" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" alt="" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score" class="star"></star>
                <span v-show="rating.deliveryTime" class="deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" :key="item.id" class="item">{{item}}</span>
              </div>
              <div class="rateTime">{{rating.rateTime | formatDateFun}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script >
import Bscroll from 'better-scroll'
import star from '../../components/star/star'
import split from '../../components/split/split'
import {formatDate} from '../../common/js/date'
import ratingseclect from '../../components/ratingseclect/ratingseclect'
const ALL = 2
const ERR_OK = 0
// const POSITIVE = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  filters: {
    formatDateFun (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  created () {
    this.$http.get('/api/ratings').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.ratings = response.data
        this.$nextTick(() => {
          this.scroll = new Bscroll(this.$refs.ratingRef, {
            click: true
          })
        })
      }
    })
  },
  components: {
    star,
    split,
    ratingseclect
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
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin"
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        width 137px
        text-align center
        border-right 1px solid #e6e7e8
        padding-bottom 6px 0
        // 兼容iphone5
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          font-size 24px
          color #ff9900
          line-height 24px
          margin-bottom 6px
        .title
          font-size 12px
          color #07111b
          line-height 12px
          margin-bottom 8px
        .rank
          font-size 10px
          color #a4a9ae
          line-height 10px
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          line-height 18px
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            vertical-align top
            font-size 12px
            color #07111b
            line-height 18px
            margin-right 12px
          .star
            display inline-block
            vertical-align top
            font-size 18px
            margin-right 12px
          .score
            display inline-block
            vertical-align top
            color #ff9900
            line-height 18px
            font-size 12px
        .deliveryTime-wrapper
          font-size 0
          // 下面两个都是span,不用vertical-align top
          .title
            display inline-block
            font-size 12px
            color #07111b
            line-height 18px
            margin-right 12px
          .deliveryTime
            display inline-block
            color rgb(147,153,159)
            line-height 18px
            font-size 12px
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(#e6e7e8)
        .avatar
          flex 0 0 28px
          border-radius 50%
          margin-right 12px
          img
            width 28px
        .content
          position relative
          flex 1
          .name
            font-size 10px
            line-height 12px
            color rgb(7,17,27)
            margin-bottom 4px
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              vertical-align top
              margin-right 6px
            .deliveryTime
              display inline-block
              vertical-align top
              font-size 10px
              line-height 12px
              color rgb(147,153,159)
          .text
            font-size 12px
            line-height 18px
            color rgb(7,17,27)
            margin-bottom 8px
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up,.item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color #00a0dc
            .item
              border 1px solid #e6e7e8
              border-radius 1px
              padding 0 6px
              color #93999f
              background #ffffff
          .rateTime
            position absolute
            top 0
            right 0
            font-size 10px
            color rgb(147,153,159)
            line-height 12px
</style>
