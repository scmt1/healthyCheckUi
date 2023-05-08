const context = require.context("./commons", true, /\.vue$/);

const install = (app) => {
  context.keys().forEach((key) => {
    const name = (key.match(/(?<=\/)\w+(?=.vue)/) || [])[0];
    app.component(name, context(key).default);
  });
};

export default install;
