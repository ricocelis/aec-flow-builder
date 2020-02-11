require('es6-promise').polyfill();
window.axios = require('axios');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import Vue from 'vue';
import App from './App.vue';
import store from './store';

import { Checkbox, Radio } from 'vue-checkbox-radio';
Vue.component('checkbox', Checkbox);
Vue.component('radio', Radio);

import VTooltip from 'v-tooltip';
Vue.use(VTooltip);

// event bus
const EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')