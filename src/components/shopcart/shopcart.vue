<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight:totalCount>0}">
            <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
          </div>
          <!-- v-show="totalCount>0 "-->
          <div class="countNum" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight:totalCount>0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="payPrice" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls" :key="ball.id">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="aftereEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li v-for="food in selectFoods" :key="food.id" class="food">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span><span class="symbol">¥</span><span class="realPrice">{{food.price*food.count}}</span>{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="maskFade">
      <div class="list-mask" v-show="listShow" @click="hideMask"></div>
    </transition>
  </div>
</template>
<script >
import BScroll from 'better-scroll'
import cartcontrol from '../../components/cartcontrol/cartcontrol'
export default {
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      // 这里要是函数形式
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // 五个小球
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: false
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let total = 0
      this.selectFoods.forEach(food => {
        total += food.count
      })
      return total
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let payDiff = this.minPrice - this.totalPrice
        return `还差¥${payDiff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      if (this.totalPrice > this.minPrice) {
        return 'enough'
      } else {
        return 'not-enough'
      }
    },
    listShow () {
      // 数量为0
      if (!this.totalCount) {
        this.foldTrue()
        return false
      }
      let show = !this.fold
      if (show) {
        // 更新DOM
        this.$nextTick(() => {
          this.scrollFun()
        })
      }
      return show
    }
  },
  components: {
    cartcontrol
  },
  methods: {
    scrollFun () {
      // 没有的话就实例化,有就刷新
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.listContent, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    foldTrue () {
      this.fold = true
    },
    drop (el) {
      // target
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          // 设置可见
          ball.show = true
          // 存储target
          ball.el = el
          this.dropBalls.push(ball)
          // 找到就退出 this.dropBalls的元素个数随着点击的速度增加,而动画没有完成而增加
          return
        }
      }
    },
    // 进入之前
    beforeEnter (el) {
      let count = this.dropBalls.length
      // console.log(el)
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // 获得元素的相当于视口的位置
          // 要获取位置,因此那个el元素不能突然消失,transition动画
          let rect = ball.el.getBoundingClientRect()
          // 点击的按钮与小球（fixed）之间x方向的差值
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          // window.innerHeight 视口高度
          // 显示
          el.style.display = ''
          // 外层元素做纵向的动画，y是变量
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `transform3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          // 内层元素做横向动画
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `transform3d(${x}px,0,0)`
        }
      }
    },
    // 进入
    enter (el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'transform3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'transform3d(0,0,0)'
        // 相当于回调函数
        el.addEventListener('transitionend', done)
      })
    },
    // 进入之后
    aftereEnter (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideMask () {
      // this.listShow会重新计算
      this.fold = true
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`需要支付${this.totalPrice}元`)
      // 阻止点击事件冒泡
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin"
.shopcart
  position: fixed
  left: 0
  bottom: 0
  width: 100%
  height: 48px
  z-index: 50
  .content
    display: flex
    height: 48px
    font-size: 0
    background: #141d27
    color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        position: relative;
        top: -8px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        // 盒子模型,包括边距
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;
        // background red
        .logo
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;
          &.highlight
            background: #00a0dc;
          .icon-shopping_cart
            color: #80858a;
            // color red
            // vertical-align top
            font-size: 24px;
            line-height: 48px;

            &.highlight
              color: #ffffff;
        .countNum
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          background: red;
          color: white;
          font-size: 9px;
          line-height: 16px;
          border-radius: 16px;
          text-align: center;
          font-weight: 700;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
      .price
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        padding-right: 12px;
        // 注意有竖线,因此要用这种方式
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
        &.highlight
          color: #ffffff;
      .desc
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-weight: 500;
    .content-right
      flex: 0 0 105px;
      width: 105px;
      .payPrice
        font-size: 12px;
        text-align: center;
        font-weight: 700;
        height: 48px;
        line-height: 48px;
        background: #2b333b;
        &.enough
          background: #00b43c;
          color: white;
        &.not-enough
          background: #2b333b;
  .ball-container
    .ball
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      // &.drop-transition
      transition: all .4s cubic-bezier(.19,-0.61,.77,.48)
      .inner
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #00a0dc;
        transition: all .4s linear;
  .shopcart-list
    position absolute
    top 0
    left 0
    z-index -1
    width 100%
    transform translate3d(0,-100%,0)
    // 进入和退出的过程
    &.fold-enter-active, &.fold-leave-active
      transition all .4s linear
    &.fold-enter, &.fold-leave-active
      transform translate3d(0,0,0)
    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background #f3f5f7
      border-bottom 1px solid #dbdee1
      .title
        float left
        font-size 14px
        color rgb(7,17,27)
      .empty
        float right
        color rgb(0,160,220)
        font-size 12px
    .list-content
      padding 0 18px
      max-height 217px
      background #ffffff
      overflow hidden
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7,17,27,0.1))
        .name
          line-height  24px
          font-size 14px
          color rgb(7,17,27)
        .price
          font-size 0
          color red
          line-height 24px
          position absolute
          right 90px
          bottom 6px
          .symbol
            font-size 10px
            font-weight normal
          .realPrice
            font-size 14px
            font-weight 700
        .cartcontrol-wrapper
          position absolute
          bottom 6px
          right 0
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index -5
    background rgba(7,17,27,0.6)
    backdrop-filter blur(10px)
    &.maskFade-enter-active, &.maskFade-leave-active
      transition all .4s linear
    &.maskFade-enter, &.maskFade-leave-active
      background rgba(7,17,27,0)
</style>
