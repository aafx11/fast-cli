<template>
  <div class="m-tabs">
    <div class="m-tabs__header">
      <div
        v-for="(item,index) in labelList" :key="index" :class="['m-tabs__item',{
          actived:activeName === item.name
        }]"
      >
        <Maker-Icon class="m-tabs__icon" :icon-name="item.icon"></Maker-Icon>
        <span>{{ item.label }}</span>
      </div>
      <div
        v-show="showIndicator"
        class="m-tabs__indicator"
        :style="{
          top: `${indicatorStyle.top}px`,
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          height: `${indicatorStyle.height}px`,
        }"
      >
      </div>
    </div>
    <div class="m-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      activeName: () => this.activeName,
    };
  },
  props: {
    activeName: {
      type: [String, Number],
      default: undefined
    }
  },
  data() {
    return {
      showIndicator: false,
      labelList: [],
      indicatorStyle: {
        width: 0,
        height: 44,
        top: 0,
        left: 0
      }
    };
  },
  watch: {
    activeName: {
      handler(value, oldValue) {
        console.log('value', value);
        if (value !== oldValue) {
          this.updateIndicator();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getLabelList();
  },
  methods: {
    updateIndicator() {
      this.$nextTick(() => {
        const el = this.$el.querySelector('.actived');
        if (el) {
          const offset = {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight,
          };
          this.indicatorStyle = offset;
          if (!this.showIndicator) this.showIndicator = true;
        } else {
          this.indicatorStyle = null;
        }
      });
    },
    getLabelList() {
      const labelList = [];
      this.$slots.default.forEach((item) => {
        if (item.elm.nodeType !== 3) {
          const { label, icon, name } = item.componentOptions.propsData;
          labelList.push({ label, icon, name });
        }
      });
      this.labelList = labelList;
    }
  }
};
</script>

<style lang="scss">
.m-tabs{
  .m-tabs__header{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #c8ebdf;
    .m-tabs__item{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      padding: 0 18px;
      .m-tabs__icon{
        margin-right: 6px;
      }
      &.actived{
        color: #a44cf6;
      }
    }
    .m-tabs__indicator{
      position: absolute;
      height: 44px;
      border-bottom: 2px solid #a44cf6;;
      transition: all .3s;
    }
  }
}

</style>