<template>
  <div :class="['m-radio',{'m-radio-selected':label === value}]" @click="clickRadio">
    <div class="m-radio__wrapper">
      <div class="m-radio__round">
        <div class="m-radio__round-inner"></div>
      </div>
      <div class="m-radio__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: [String, Number],
      default: undefined
    },
    label: {
      type: [String, Number],
      default: undefined
    },
  },
  methods: {
    clickRadio() {
      this.$emit('input', this.label);
    }
  }
};
</script>

<style lang="scss">
.m-radio{
  padding: 16px;
  cursor: pointer;
  &.m-radio-selected{
    background-color: rgba(66,185,131,.08);
    .m-radio__round-inner{
      width: 100%;
      height: 100%;
      background-color: #42b983;
      border-radius: 50%;
    }
  }
  &:hover{
    background-color: rgba(66,185,131,.05);
  }
  .m-radio__wrapper{
    display: flex;
    align-items: center;
    .m-radio__round{
      width: 18px;
      height: 18px;
      padding: 3px;
      margin-right: 15px;
      border: 2px solid black;
      border-radius: 50%;
      box-sizing: border-box;
    }
  }
}
</style>