<template>
  <svg
    class="svg-icon"
    aria-hidden="true"
  >
    <use :xlink:href="useIconName" />
  </svg>
</template>

<script>
export default {
  name: 'IconSvg',
  props: {
    iconName: {
      type: String,
      required: true
    }
  },
  computed: {
    useIconName() {
      return `#${this.iconName}`;
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