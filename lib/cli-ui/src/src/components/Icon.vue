<template>
  <svg
    class="svg-icon"
    aria-hidden="true"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'IconSvg',
  props: {
    iconname: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName() {
      return `#${this.iconname}`;
    }
  }
};
</script>

<style>
.svg-icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
    overflow: hidden;
}
</style>