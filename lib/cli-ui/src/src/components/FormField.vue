<template>
  <div class="m-form-field">
    <div class="m-form-field__wrapper">
      <div class="m-form-field__title">
        <slot name="title">
          <span>
            {{ title }}
          </span>
        </slot>
      </div>
      <div class="m-form-field__content">
        <slot></slot>
      </div>
      <div class="m-form-field__subtitle">
        <VueIcon v-if="subtitleIcon" :icon-name="subtitleIcon" />
        <slot name="subtitle">
          <span>{{ subtitle }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: undefined,
    },
    subtitle: {
      type: String,
      default: undefined,
    },
    subtitleIcon: {
      type: String,
      default: undefined,
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
.m-form-field{
  .m-form-field__wrapper{
    display: flex;
    flex-direction: column;
    color:rgb(44, 62, 80);
    .m-form-field__title{

    }
    .m-form-field__subtitle{
      font-size: 14px;
    }
  }
}
</style>