<template>
  <div class="m-header">
    <div class="m-header__title">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.m-header{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: #c8ebdf;
  .m-header__title{
    padding: 16px;
    font-size: 24px;
  }
}
</style>