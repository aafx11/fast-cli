<template>
  <component
    :is="component" :class="['m-button',`m-button-${type}`]" v-bind="$attrs"
    @click.capture="handleClick" @click.capture.native="handleClick"
  >
    <span class="m-button__content">
      <Maker-Icon
        v-if="iconLeft" class="m-button__icon m-button__icon-left"
        :iconname="iconLeft"
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
        :iconname="iconRight"
      ></Maker-Icon>
    </span>
  </component>
</template>

<script>
export default {
  props: {
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

  &-default{
    color: #2c3e50;
    background: 0 0;
    &:hover{
      background: #e8faf2;
    }
  }
  &-primary{
    color: #fff;
    background: #42b983;
    &:hover{
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
    align-items: center;
    .m-button__icon-left{
      margin-right: 6px;
    }
    .m-button__icon-right{
      margin-left: 6px;
    }
  }
}
</style>