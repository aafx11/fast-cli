<template>
  <div class="feature-checkbox">
    <div class="feature-checkbox__label">
      {{ feature.message }}
    </div>
    <div class="feature-checkbox__list">
      <Maker-Switch
        v-for="(item,index) in feature.choices" :key="index"
        v-model="checkBoxValue[index]"
      >
        {{ item.name }}
      </Maker-Switch>
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
      checkBoxValue: []
    };
  },
  computed: {

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
.feature-checkbox{
  padding-top: 16px;
  padding-left: 16px;
  .feature-checkbox__label{

  }
  .feature-checkbox__list{
    .m-switch{
      padding: 3px;
      .m-switch__content{
        justify-content: flex-start;
        .m-switch__slot{
          order:1;
        }
        .m-switch__wrapper{
          margin-left: 0;
          margin-right: 8px;
        }
      }
    }

  }
}
</style>