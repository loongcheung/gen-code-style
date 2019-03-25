interface IStore {
  index: string;
  other: string;
}

interface IApp {
  default: string;
  router: string;
}

export interface IFillContent {
  [JS: string]: any;
  Vue: string;
  Store: IStore;
  main: string;
  App: IApp;
  router: string;
}

const js: string = ``;

const vue = `<template>
</template>
<script>
export default {
};
</script>
<style>
</style>
`;

const app: string = `<template>
<div>
  <keep-alive>
    <router-view />
  </keep-alive>
</div>
</template>
<script>
export default {
};
</script>
<style>
</style>
`;

const router: string = `import Vue from 'vue';
import Router from 'vue-router';
import Index from './view/index';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    name: 'index',
    path: '/',
    component: Index,
    redirect: '/'
  }
];

const router = new Router({
  routes
});

export {
  router
};
`;

const main: string = `import Vue from 'vue';
import App from './App';

new Vue({
  el: '#app',
  render: h => h(App)
});
`;

const store: string = `import Vue from 'vue';
import Vuex from 'vuex';
import { state } from './state';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
`;

const fillContent: IFillContent = {
  JS: 'export default {\n};\n',
  Vue: vue,
  Store: {
    index: store,
    other: 'const {{ exportName }} = {\n};\n\nexport { {{ exportName }} };\n'
  },
  main,
  App: {
    default: vue,
    router: app
  },
  router
};

export default fillContent;
