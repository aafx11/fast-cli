<template>
  <div class="project-create">
    <Maker-Header title="创建新项目"></Maker-Header>
    <Maker-Tabs class="project-create__tabs" :active-name="activeName">
      <Maker-Tabs-Pane label="详情" name="detail" icon="icon-xiangqingbeifen">
        <div class="project-create__detail">
          <Maker-Form-Field title="项目名">
            <Maker-Input
              v-model="formData.projectName" class="big app-name" placeholder="输入项目名"
              icon-left="icon-folder-close"
            />
          </Maker-Form-Field>
          <Maker-Form-Field title="包管理器">
            <Maker-Select
              v-model="formData.packageManager" :options="packageManagerOptions"
              placeholder="输入项目名" icon-left="icon-folder-close" class="big app-name"
            />
          </Maker-Form-Field>
        </div>
      </Maker-Tabs-Pane>
      <Maker-Tabs-Pane label="预设" name="preset" icon="icon-gou">
        <div class="project-create__detail" style="max-width: 1200px;">
          <Maker-Radio
            v-for="(item,index) in getPrompt('preset').choices" :key="index"
            v-model="formData.preset" :label="item.value" @input="onRadioInput"
          >
            <div>{{ item.title }}</div>
            <div>{{ item.desc }}</div>
          </Maker-Radio>
        </div>
      </Maker-Tabs-Pane>
      <Maker-Tabs-Pane label="功能" name="feature" icon="icon-gongnenglan-xitonggongneng">
        <div>789</div>
      </Maker-Tabs-Pane>
    </Maker-Tabs>
    <div class="project-create__footer">
      <div class="project-create__footer-btn">
        <Maker-Button v-show="activeName === 'detail'" size="large" icon-left="icon-close">
          取消
        </Maker-Button>
        <Maker-Button
          v-show="activeName !== 'detail'" size="large" icon-left="icon-direction-left"
          @click="clickBack"
        >
          上一步
        </Maker-Button>
        <Maker-Button
          type="primary" size="large" icon-right="icon-direction-right"
          :disabled="!formData.projectName" @click="clickNext"
        >
          下一步
        </Maker-Button>
      </div>
    </div>
    <Maker-Modal v-show="showTipModal" title="提示" @close="closeTipModal">
      <div>目标文件已存在,是否覆盖文件</div>
      <div slot="footer" class="actions end">
        <Maker-Button label="取消" @click="closeTipModal"></Maker-Button>
        <Maker-Button label="覆盖" type="danger" @click="clickCoverBtn"></Maker-Button>
      </div>
    </Maker-Modal>
    <Maker-Modal v-show="showRemoteModal" title="配置远程预设" @close="closeRemoteModal">
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
      detailList: ['detail', 'preset', 'feature'],
      preset: [],
      formData: {
        projectName: '',
        packageManager: null,
        preset: null
      },
      packageManagerOptions: [
        { label: 'npm', value: 'npm' },
        { label: 'yarn', value: 'yarn' },
      ],
      showTipModal: false,
    };
  },
  computed: {
    getPrompt() {
      return (name) => this.preset.find((item) => item.name === name) || { choices: [] };
    }
  },
  created() {
    this.getPreset();
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
    closeTipModal() {
      this.showTipModal = false;
    },
    clickCoverBtn() {

    },
    clickBack() {
      const detailList = this.detailList;
      this.activeName = detailList[detailList.findIndex((item) => item === this.activeName) - 1];
    },
    clickNext() {
      if (this.activeName === 'detail') {
        if (!this.formData.projectName) {
          return;
        }
        this.activeName = 'preset';
      }
    },
    async getPreset() {
      const { data: res } = await axios.get('/preset/getPreset');
      console.log(res);
      if (res.success) {
        // eslint-disable-next-line no-control-regex
        const regex = /\x1B\[33m(.*?)\x1B\[39m/;
        res.data[0].choices.forEach((item) => {
          const match = item.name.match(regex);
          item.desc = match ? match[1] : '手动配置项目';
          item.title = item.value === '__manual__' ? '手动' : item.value;
        });
        res.data[0].choices.push({
          title: '远程预设',
          desc: '从 git 仓库拉取预设',
          value: 'remote'
        });
        this.preset = res.data;
      }
    },
    closeRemoteModal() {
      this.showRemoteModal = false;
    },
    onRadioInput(label) {
      if (label === 'remote') {
        this.showRemoteModal = true;
      }
    },
  }
};
</script>

<style lang="scss">
.project-create{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  .project-create__tabs{
    flex: 1;
    width: 100%;
    .m-tabs-pane__content{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .project-create__detail{
      width: 100%;
      max-width: 400px;
      margin-top: 42px;
    }
  }
  .project-create__footer{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
  }
}

</style>