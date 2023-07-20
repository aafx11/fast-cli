<template>
  <Maker-Switch :value="feature.checked">
    <div>
      <div>{{ feature.name }}</div>
      <div style="display: flex;">
        <span class="feature-item__desc">{{ feature.description }}</span>
        <a
          v-show="feature.link" class="view-details" target="_blank"
          :href="feature.link"
        >
          <Maker-Icon icon-name="icon-fenxiang"></Maker-Icon>
          <span>查看详情</span>
        </a>
      </div>
    </div>
  </Maker-Switch>
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

    };
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
.feature-item__desc{
  color: rgb(106, 139, 173);
  font-size: 14px;
}
</style>