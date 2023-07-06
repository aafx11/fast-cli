<template>
  <div class="m-input" @click="focus">
    <div class="m-input__content">
      <Maker-Icon
        v-if="iconLeft" class="m-input__icon m-input__icon-left"
        :icon-name="iconLeft"
      ></Maker-Icon>
      <slot name="left"></slot>
      <div class="input-wrapper">
        <component
          :is="type === 'textarea' ? type : 'input'" ref="input" class="input"
          :type="type" :value.prop="valueModel" :placeholder="placeholder"
          v-bind="$attrs" v-on="$listeners"
          @input="valueModel = $event.currentTarget.value"
        />
        <input
          v-if="suggestion"
          class="input m-input-suggestion"
          :value="suggestion"
          disabled
        >
      </div>
      <slot name="right"></slot>
      <Maker-Icon
        v-if="iconRight" class="m-input__icon m-input__icon-right"
        :icon-name="iconRight"
      ></Maker-Icon>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value', // 绑定的props属性，这里是'nameFromFather'
    event: 'update' // 触发父组件中v-model绑定的属性发生改变的方法，名称自取
  },
  props: {
    iconLeft: {
      type: String,
      default: null,
    },
    iconRight: {
      type: String,
      default: null,
    },
    suggestion: {
      type: [String, Number],
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    value: {
      type: [String, Number],
      default: ''
    },
  },
  data() {
    return {};
  },
  computed: {
    valueModel: {
      get() { return this.value; },
      set(value) { this.$emit('update', value); },
    },
  },
  methods: {
    focus() {
      const inputRef = this.$refs.input;
      inputRef.focus();
    },
  }
};
</script>

<style lang="scss">
.m-input{
  .m-input__content{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e0f8ed;
    border-radius: 3px;
    .input{
      display: block;
      height: 42px;
      border: none;
      outline: none;
    }
    .m-input__icon{
      width: 20px;
      height: 20px;
      &.m-input__icon-left{
        margin-right: 10px;
      }
      &.m-input__icon-right{
        margin-left: 10px;
      }
    }
  }
}
</style>