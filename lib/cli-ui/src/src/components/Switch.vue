<template>
  <div
    :class="['m-switch',{selected: value,}]" @click="toggleValue"
  >
    <div class="m-switch__content">
      <Maker-Icon
        v-if="icon"
        :icon-name="icon"
      />
      <span class="m-switch__slot">
        <slot />
      </span>
      <div class="m-switch__wrapper">
        <div class="m-switch__bullet" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    valueModel: {
      get() { return this.value; },
      set(value) { this.$emit('update', value); }
    }
  },
  methods: {
    toggleValue() {
      this.valueModel = !this.valueModel;
    }
  }
};
</script>

<style lang="scss">
.m-switch{
  padding: 16px;
  .m-switch__content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .m-switch__wrapper{
      width: 32px;
      height: 16px;
      margin-left: 8px;
      border-radius: 8px;
      background: #e0f8ed;
      transition: background .3s;
      position: relative;
      padding: 1px;
      box-sizing: border-box;
      cursor: pointer;
      .m-switch__bullet{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #2c3e50;
        transition: margin-left .2s ease-in-out;
      }
    }
  }
  &:hover{
    background: #f5fbf9;
  }
  &.selected{
    background: rgba(66,185,131,.08);
    .m-switch__wrapper{
      background: #42b983;
      .m-switch__bullet{
        margin-left: 16px;
      }
    }
  }
}
</style>