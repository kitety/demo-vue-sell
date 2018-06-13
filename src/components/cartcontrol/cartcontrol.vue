<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0"  @click.stop.prevent="decCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script type="text/scmascript-6">
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  // 这里的数据修改会直接影响最根本的数据
  methods: {
    addCart (event) {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 0)
        // console.log(this.food.count)
      }
      this.food.count++
      // 事件名称,传递的参数 对应good中间的@add="addFood"
      this.$emit('add', event.target)
    },
    decCart () {
      if (this.food.count > 0) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size 0
  .cart-decrease
    display inline-block
    padding 6px
    opacity 1
    transform translate3d(0,0,0)
    .inner
      display inline-block
      line-height 24px
      font-size 24px
      color #00a0dc
      // rotate的动画设定
      transition all .4s linear
      transform  rotate(0)
    // 进入和退出的过程
    &.move-enter-active, &.move-leave-active
      transition all .4s linear
    // 进入状态和离开过程
    // move-leave的状态就是enter的结束状态
    &.move-enter, &.move-leave-active
      opacity 0
      transform translate3d(24px,0,0)
      .inner
        transform rotate(180deg)
  .cart-add
    display inline-block
    padding 6px
    font-size 24px
    line-height 24px
    color #00a0dc
  .cart-count
    display inline-block
    font-size 10px
    width 12px
    padding-top 6px
    line-height 24px
    vertical-align top
    text-align center
    color #9a9fa5
</style>
