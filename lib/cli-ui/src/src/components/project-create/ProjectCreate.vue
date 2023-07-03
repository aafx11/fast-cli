<template>
  <div>
    <button @click="createProject">11</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProjectCreate',
  data() {
    return {

    };
  },
  methods: {
    async createProject() {
      const options = {
        features: ['vue', 'webpack', 'babel', 'router', 'vuex', 'linter'],
        historyMode: true,
        eslintConfig: 'airbnb',
        lintOn: ['save']
      };
      try {
        const hasFileExists = await this.judgeFileExists();
        if (hasFileExists) {
          return;
        }
        const { data: res } = await axios.post('/project/createProject', { options, name: 'test' });
        console.log('res', res);
      } catch (error) {
        console.log('error', error);
      }
    },
    async judgeFileExists(name = 'test') {
      const { data: res } = await axios.get(`/file/fileHasExists`, {
        params: { name }
      });
      console.log('fileHasExists', res);
      return !res.success;
    }
  }
};
</script>

<style>
</style>