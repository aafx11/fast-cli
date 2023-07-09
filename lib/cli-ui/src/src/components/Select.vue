<template>
  <select class="m-select" :placeholder="placeholder">
    <option
      v-for="(item,index) in options" :key="index" class="m-select__option"
      :value="item.value"
    >
      {{ item.label }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.m-select{
  width: 100%;
  height: 32px;
  border: none;
  background: #e0f8ed;
  text-align: center;
  outline: none;
  .m-select__option{
    display: block;
    height: 32px;
    background: white;
  }
}
</style>