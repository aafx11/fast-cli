<template>
  <div class="m-tabs-pane">
    <dir v-show="activeName === name">
      <slot></slot>
    </dir>
  </div>
</template>

<script>
export default {
  inject: ['activeName'],
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: undefined
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    };
  },
  mounted() {
  },
};
</script>

<style>

</style>