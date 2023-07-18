<template>
  <div
    :class="['m-switch',{selected: value,}]" @click="toggleValue"
  >
    <div class="m-switch__content">
      <Maker-Icon
        v-if="icon"
        :icon-name="icon"
      />
      <span class="m-switch__slot">
        <slot />
      </span>
      <div class="m-switch__wrapper">
        <div class="m-switch__bullet" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    valueModel: {
      get() { return this.value; },
      set(value) { this.$emit('update', value); }
    }
  },
  methods: {
    toggleValue() {
      this.valueModel = !this.valueModel;
    }
  }
};
</script>

<style>

</style>