<template>
  <div>
    <div>
      <button @click="aaa">
        1
      </button>
      <Maker-Form-Field>
        <Maker-Input
          v-model="formData.projectName" placeholder="输入项目名" icon-left="icon-folder-close"
          class="big app-name"
        />
      </Maker-Form-Field>
    </div>
    <Maker-Modal v-show="showTipModal" title="提示" @close="closeTipModal">
      <div>目标文件已存在,是否覆盖文件</div>
      <div slot="footer" class="actions end">
        <Maker-Button label="取消" @click="closeTipModal"></Maker-Button>
        <Maker-Button label="覆盖" type="danger" @click="clickCoverBtn"></Maker-Button>
      </div>
    </Maker-Modal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProjectCreate',
  data() {
    return {
      formData: {
        projectName: ''
      },
      showTipModal: false,

    };
  },
  methods: {
    aaa() {
      console.log(this.formData.projectName);
    },
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
    closeTipModal() {
      this.showTipModal = false;
    },
    clickCoverBtn() {

    },
  }
};
</script>

<style>
</style>