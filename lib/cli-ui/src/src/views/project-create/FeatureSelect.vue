<template>
  <div class="feature-select">
    <div>
      <div>{{ feature.message }}</div>
      <div class="feature-select__desc">
        {{ feature.description }}
      </div>
    </div>
    <div>
      <Maker-Select v-model="selectValue" :options="feature.choices" label-key="name" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    feature: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectValue: null
    };
  },
  computed: {

  },
  watch: {
    selectValue: {
      handler(val) {
        this.$emit('update', val);
      }
    }
  },
  mounted() {

  },
  methods: {
    getValue() {
      console.log('feature', this.feature);
    }
  }
};
</script>

<style lang="scss">
.feature-select{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px;
  .feature-select__desc{
    color: rgb(106, 139, 173);
    font-size: 14px;
  }
}
</style>