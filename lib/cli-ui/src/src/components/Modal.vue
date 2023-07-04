<template>
  <div class="m-modal">
    <div class="m-modal__backdrop" />
    <div class="m-modal__content">
      <div class="m-modal__header">
        <slot name="header">
          <div
            v-if="title"
            class="m-modal__title"
          >
            {{ title }}
          </div>
        </slot>
      </div>
      <div class="m-modal__body">
        <slot />
      </div>
      <div class="m-modal__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    locked: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: null,
    },
  },
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
    position: relative;
    max-width: 500px;
    min-width: 400px;
    border-radius: 6px;
    box-shadow: 0 20px 60px rgba(0,0,0,.1);
    .m-modal__header{
      padding: 24px;
      .m-modal__title{
        color: #2c3e50;
        font-size: 18px;
      }
    }
  }
}
</style>