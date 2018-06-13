<template>
  <div class="foods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="item.id" class="menu-item" :class="{'current':currentIndex===index}" @click="menuSclect(index)">
          <span class="text">
            <span v-show="item.type>-1" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <!-- 先是有哪些item,再是food -->
      <ul>
        <li v-for="item in goods" :key="item.id" class="food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.id" class="food-item" @click="selectFoodDetail(food)">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                </div>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span class="percent">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <!-- 对应cartcontrol.vue中的this.$emit('add'事件名称, event.target,传递参数) -->
                  <cartcontrol :food="food" @add="addFood"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 下面的购物车 -->
    <shopcart ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></shopcart>
    <food :food="selectedFood" ref="foodRef" @addFood="addFood"></food>
  </div>
</template>
<script >
import shopcart from '../../components/shopcart/shopcart'
import food from '../../components/food/food'
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [ ],
      listHeight: [ ],
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach(item => {
        item.foods.forEach(food => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((response) => {
      // console.log(response)
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        // DOM更新,才能执行函数
        this.$nextTick(() => {
          this._initBscroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    menuSclect (index) {
      // 找到右边商品
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      // 对应的位置
      let el = foodList[index]
      // 设置移动到对应的元素和时间
      this.foodsScroll.scrollToElement(el, 800)
    },
    // 初始化bscroll
    _initBscroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        // 类似于探针的效果
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        // 四舍五入+绝对值
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // 计算高度
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    addFood (target) {
      this._drop(target)
    },
    // 下落
    _drop (target) {
      // 子组件shopcart的drop函数
      // 优化体验,异步执行
      this.$nextTick(() => {
        // 主要  子组件中的函数
        this.$refs.shopcart.drop(target)
      })
    },
    selectFoodDetail (food) {
      this.selectedFood = food
      this.$refs.foodRef.showDetail()
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin"
.foods
  position absolute
  width 100%
  top 174px
  bottom 46px
  display flex
  overflow hidden
  .menu-wrapper
  // 等分 内容不足缩放情况 占维空间
    flex 0 0 80px
    width 80px
    background-color rgb(#f3f5f7)
    // background-color rgb(red)
    .menu-item
      display table
      width 56px
      height 54px
      padding 0 12px
      line-height 14px
      &.current
        position relative
        margin-top -1px
        z-index 9
        // 注意z-index
        background-color #fff
        font-weight 700
        .text
          border-none()
      .icon
        vertical-align top
        display inline-block
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        font-size 12px
        display table-cell
        width 56px
        vertical-align middle
        border-1px(rgba(7,17,27,0.1))
  .foods-wrapper
    flex 1
    .title
      height 26px
      font-size 12px
      line-height 26px
      padding-left 14px
      color rgb(147,153,159)
      background-color #f3f5f7
      border-left 2px solid #d9dde1
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
        padding-bottom 0px
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
          height 14px
        .desc
          font-size 10px
          color rgb(147,153,159)
          line-height 10px
          // height 10px
          margin-bottom 8px
      .extra
        font-size 10px
        color rgb(147,153,159)
        line-height 10px
        height 10px
        // margin-bottom 8px
        .count
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
        right 0
        bottom 12px
</style>
