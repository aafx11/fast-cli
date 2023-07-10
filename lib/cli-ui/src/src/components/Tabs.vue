<template>
  <div class="m-tabs">
    <div class="m-tabs__header">
      <div v-for="(item,index) in labelList" :key="index" class="m-tabs__item">
        <Maker-Icon class="m-tabs__icon" :icon-name="item.icon"></Maker-Icon>
        <span>{{ item.label }}</span>
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
      activeName: this.activeName,
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
      labelList: []
    };
  },
  mounted() {
    console.log(this.$slots);
    this.getLabelList();
  },
  methods: {
    getLabelList() {
      const labelList = [];
      this.$slots.default.forEach((item) => {
        console.log('item', item);
        if (item.elm.nodeType !== 3) {
          const { label, icon } = item.componentOptions.propsData;
          labelList.push({ label, icon });
        }
      });
      this.labelList = labelList;
    }
  }
};
</script>

<style lang="scss">
.m-tabs__header{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: #c8ebdf;
  .m-tabs__item{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 18px;
    .m-tabs__icon{
      margin-right: 6px;
    }
  }
}
</style>