<template>
  <div>
    <button @click="createProject">
      11
    </button>
    <Modal title="提示">
      <div>123</div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios';
// import Modal from '../../components/Modal.vue';

export default {
  name: 'ProjectCreate',
  // components: { Modal },
  data() {
    return {
      // Modal
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
        const { data: res } = await axios.post('/project/createProject', { options, name: 'test' });
        console.log('res', res);
        if (!res.success && res.code === 409) {
          return;
        }
      } catch (error) {
        console.log('error', error);
      }
    },
  }
};
</script>

<style>
</style>