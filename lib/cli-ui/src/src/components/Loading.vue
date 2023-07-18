<template>
  <div v-show="show" class="m-loading">
    <div class="m-loading__wrap"></div>
    <div class="m-loading__content">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
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

<style lang="scss">
.m-loading{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  z-index: 1;
  .m-loading__wrap{
    width: 25px;
    height: 25px;
    border: 3px solid #f7f7f7;
    border-top-color: #43b983;
    border-radius: 100%;
    animation: circle infinite 0.75s linear;
  }
}

@keyframes circle {
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>