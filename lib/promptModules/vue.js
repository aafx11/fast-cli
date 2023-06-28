module.exports = (api) => {
  api.injectPrompt({
    name: 'vueVersion',
    message: 'Choose a version of Vue.js that you want to start the project with',
    type: 'list',
    choices: [
      {
        name: '3.x',
        value: '3',
      },
      {
        name: '2.x',
        value: '2',
      },
    ],
    default: '3',
  });
};