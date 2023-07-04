<template>
  <div class="m-modal">
    <div class="m-modal__backdrop" />
    <div class="m-modal__content">
      1
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {

  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.m-modal{
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .m-modal__backdrop{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: hsla(0,0%,100%,.9);
  }
  .m-modal__content{

  }
}
</style>