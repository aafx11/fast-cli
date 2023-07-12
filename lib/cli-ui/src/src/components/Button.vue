<template>
  <component
    :is="component" :class="['m-button',`m-button-${type}`,`m-button-${size}`,{
      'm-button-disabled':disabled
    }]" v-bind="$attrs"
    :disabled="disabled" @click.capture="handleClick" @click.capture.native="handleClick"
  >
    <span class="m-button__content">
      <Maker-Icon
        v-if="iconLeft" class="m-button__icon m-button__icon-left"
        :icon-name="iconLeft"
      ></Maker-Icon>
      <span class="m-button__default-slot">
        <slot>{{ label }}</slot>
      </span>
      <div
        v-if="tag"
        class="m-button__tag-wrapper"
      >
        <div class="m-button__tag">{{ tag }}</div>
      </div>
      <Maker-Icon
        v-if="iconRight" class="m-button__icon m-button__icon-right"
        :icon-name="iconRight"
      ></Maker-Icon>
    </span>
  </component>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    iconLeft: {
      type: String,
      default: null,
    },
    iconRight: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingSecondary: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'default',
    },
    tag: {
      type: [Number, String],
      default: null,
    },
    size: {
      type: String,
      default: 'small'
    },
  },
  data() {
    return {};
  },
  computed: {
    component() {
      if (this.$attrs.to) {
        return 'router-link';
      } if (this.$attrs.href) {
        return 'a';
      }
      return 'button';
    },
  },
  mounted() {

  },
  methods: {
    handleClick(event) {
      if (this.ghost) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      } else {
        this.$emit('click', event);
      }
    },
  }
};
</script>

<style lang="scss">
.m-button{
  position: relative;
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  padding: 0 14px;
  border: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 16px;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  border-radius: 3px;
  &-large{
    min-width: 190px;
    height: 44px;
    font-size: 16px;
  }
  &-disabled{
    background-color: #42b883;
    opacity: 0.5;
  }
  &-default{
    color: #2c3e50;
    background: #e0f8ed;
    &:hover{
      background: #e8faf2;
    }
  }
  &-primary{
    color: #fff;
    background: #42b983;
    &:hover:not(.m-button-disabled){
      background: #70cca2;
    }
  }
  &-danger{
    color: #fff;
    background: #e83030;
    &:hover{
      background: #ee6464;
    }
  }
  &__content{
    display: flex;
    justify-content: center;
    align-items: center;
    .m-button__icon-left{
      margin-right: 6px;
    }
    .m-button__icon-right{
      margin-left: 6px;
    }
    .m-button__default-slot{
    }
  }
}
</style>