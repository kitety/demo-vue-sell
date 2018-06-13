<template>
  <div class="rativeSeclect">
    <div class="rating-type">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0)">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1)">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script type="text/scmascript-6">
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
export default {
  props: {
    // 这一格式,都是这样的array,object,number
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  computed: {
    positive () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negative () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select (type) {
      // type为选择的类型 全部2推荐0吐槽1
      this.$emit('seclectTypeChange', type)
    },
    toggleContent () {
      this.$emit('toggleContentList')
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.rativeSeclect
  .rating-type
    margin 0 18px
    padding 18px 0
    border-1px(rgba(7,17,27,0.1))
    // 间隙
    font-size 0px
    .block
      display inline-block
      padding 8px 12px
      border-radius 1px
      margin-right 8px
      color rgb(77,85,93)
      font-size 12px
      line-height 16px
      &.active
          color #ffffff
      &.positive
        background #ccecf8
        &.active
          background rgb(0,160,220)
      &.negative
        background #e9ebec
        &.active
          background rgb(77,85,93)
      .count
        font-size 8px
        margin-left 3px
  .switch
    padding 12px 18px
    line-height 24px
    border-bottom 1px solid gba(7,17,27,0.1)
    color rgb(147,153,159)
    font-size 0
    border-1px(rgba(7,17,27,0.1))
    &.on
      .icon-check_circle
        color #00c850
    .icon-check_circle
      display inline-block
      vertical-align top
      font-size 24px
      margin-right 4px
    .text
      display inline-block
      vertical-align top
      font-size 12px
</style>
