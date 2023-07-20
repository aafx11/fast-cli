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
            <Maker-Select v-model="formData.packageManager" :options="packageManagerOptions" />
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
        <div class="project-create__detail" style="max-width: 1200px;">
          <Feature-Item
            v-for="(item,index) in getPrompt('features').choices"
            :key="index" :feature="item" @click.native="clickFeatureItem(item)"
          ></Feature-Item>
        </div>
      </Maker-Tabs-Pane>
      <Maker-Tabs-Pane label="配置" name="setting" icon="icon-lvzhou_shebeipeizhi">
        <div class="project-create__detail" style="max-width: 1200px;">
          <!-- <button @click="getFeature">
            feature
          </button> -->
          <component
            :is="getComponent(item)" v-for="(item,index) in options" ref="feature"
            :key="index" :feature="item" @click.native="clickFeatureItem(item)"
          ></component>
        </div>
      </Maker-Tabs-Pane>
    </Maker-Tabs>
    <div class="project-create__footer">
      <div v-show="activeName === 'detail'" class="project-create__footer-btn">
        <Maker-Button size="large" icon-left="icon-close">
          取消
        </Maker-Button>
        <Maker-Button
          type="primary" size="large" icon-right="icon-direction-right"
          :disabled="!formData.projectName" @click="togglePage(1)"
        >
          下一步
        </Maker-Button>
      </div>
      <div v-show="activeName === 'preset'">
        <Maker-Button size="large" icon-left="icon-direction-left" @click="togglePage(-1)">
          上一步
        </Maker-Button>
        <Maker-Button
          v-show="!['__manual__','remote'].includes(formData.preset)" type="primary" size="large"
          icon-left="icon-select-bold" :disabled="!formData.preset" @click="createProject"
        >
          创建项目
        </Maker-Button>
        <Maker-Button
          v-show="['__manual__','remote'].includes(formData.preset)" type="primary" size="large"
          icon-right="icon-direction-right" :disabled="!formData.preset" @click="togglePage(1)"
        >
          下一步
        </Maker-Button>
      </div>
      <div v-show="activeName === 'feature'">
        <Maker-Button size="large" icon-left="icon-direction-left" @click="togglePage(-1)">
          上一步
        </Maker-Button>
        <Maker-Button
          type="primary" size="large" icon-right="icon-direction-right"
          @click="togglePage(1)"
        >
          下一步
        </Maker-Button>
      </div>
      <div v-show="activeName === 'setting'">
        <Maker-Button size="large" icon-left="icon-direction-left" @click="togglePage(-1)">
          上一步
        </Maker-Button>
        <Maker-Button
          type="primary" size="large" icon-left="icon-select-bold"
          @click="createProject"
        >
          创建项目
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
    <Maker-Loading :show="showLoading" text="项目创建中..."></Maker-Loading>
  </div>
</template>

<script>
import axios from 'axios';
import FeatureItem from './FeatureItem.vue';
import FeatureSelect from './FeatureSelect.vue';
import FeatureCheckbox from './FeatureCheckbox.vue';

export default {
  name: 'ProjectCreate',
  components: {
    FeatureItem,
    FeatureSelect,
    FeatureCheckbox
  },
  data() {
    return {
      activeName: 'detail',
      detailList: ['detail', 'preset', 'feature', 'setting'],
      preset: [],
      formData: {
        projectName: '',
        packageManager: null,
        preset: null,
        features: []
      },
      options: [],
      packageManagerOptions: [
        { label: 'npm', value: 'npm' },
        { label: 'yarn', value: 'yarn' },
      ],
      showTipModal: false,
      showRemoteModal: false,
      showLoading: false,
    };
  },
  computed: {
    getPrompt() {
      return (name) => this.preset.find((item) => item.name === name) || { choices: [] };
    },
    getComponent() {
      return (item) => {
        const map = {
          confirm: 'FeatureItem',
          list: 'FeatureSelect',
          checkbox: 'FeatureCheckbox'
        };
        return map[item.type];
      };
    },
  },
  created() {
    this.getPreset();
  },
  methods: {
    getFeature() {
      this.$refs.feature.forEach((instance) => {
        console.log('instance', instance);
        if (instance.getValue) {
          console.log(instance.getValue());
        }
      });
      console.log(this.$refs.feature);
    },
    async createProject() {
      this.showLoading = true;
      console.log('options', this.formData);
      // const options = {
      //   features: ['vue', 'webpack', 'babel', 'router', 'vuex', 'linter'],
      //   historyMode: true,
      //   eslintConfig: 'airbnb',
      //   lintOn: ['save']
      // };
      try {
        const { data: res } = await axios.post('/project/createProject', { options: this.formData });
        console.log('res', res);
        if (!res.success && res.code === 409) {
          return;
        }
        if (res.success) {
          this.formData = this.$options.data.call(this).formData;
          this.activeName = 'detail';
          this.showLoading = false;
        }
      } catch (error) {
        console.log('error', error);
        this.showLoading = false;
      }
    },
    async getSetting() {
      const { data: res } = await axios.post('/preset/getSetting', { options: this.formData });
      console.log('getSetting', res);
      if (res.success) {
        this.options = res.data;
      }
    },
    closeTipModal() {
      this.showTipModal = false;
    },
    clickCoverBtn() {

    },
    clickFeatureItem(item) {
      this.$set(item, 'checked', !item.checked);
    },
    getFeatures() {
      const features = [];
      this.preset.find((item) => item.name === 'features').choices.forEach((ele) => {
        if (ele.checked) {
          features.push(ele.value);
        }
      });
      console.log('features', features);
      return features;
    },
    togglePage(step) {
      const detailList = this.detailList;
      this.activeName = detailList[detailList.findIndex((item) => item === this.activeName) + step];
      if (this.activeName === 'setting') {
        this.formData.features = this.getFeatures();
        this.getSetting();
      }
    },
    async getPreset() {
      const { data: res } = await axios.get('/preset/getPreset');
      console.log('getPreset', res);
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
      .view-details{
        padding: 0 4px 0 2px;
        color: #42b983;
        cursor: pointer;
        &:hover{
          color: #fff;
          background: #42b983;
        }
      }
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