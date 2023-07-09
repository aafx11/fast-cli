<template>
  <div class="project-create">
    <Maker-Header title="创建新项目"></Maker-Header>
    <Maker-Tabs class="project-create__tabs" :active-name="activeName">
      <Maker-Tabs-Pane label="详情" name="detail">
        <div>123</div>
      </Maker-Tabs-Pane>
      <Maker-Tabs-Pane label="预设" name="preset">
        <div>789</div>
      </Maker-Tabs-Pane>
    </Maker-Tabs>
    <div class="project-create__detail">
      <Maker-Form-Field title="项目名">
        <Maker-Input
          v-model="formData.projectName" placeholder="输入项目名" icon-left="icon-folder-close"
          class="big app-name"
        />
      </Maker-Form-Field>
      <Maker-Form-Field title="包管理器">
        <Maker-Select
          v-model="formData.packageManager" :options="packageManagerOptions"
          placeholder="输入项目名" icon-left="icon-folder-close" class="big app-name"
        />
      </Maker-Form-Field>
      <button @click="aaa">
        1
      </button>
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
      activeName: 'detail',
      formData: {
        projectName: '',
        packageManager: null
      },
      packageManagerOptions: [
        { label: 'npm', value: 'npm' },
        { label: 'yarn', value: 'yarn' },
      ],
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

<style lang="scss">
.project-create{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  .project-create__tabs{
    width: 100%;
  }
  .project-create__detail{
    flex: 1;
    width: 100%;
    max-width: 400px;
    margin-top: 42px;
  }
}

</style>