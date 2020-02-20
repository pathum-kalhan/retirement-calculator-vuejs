import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueApexCharts from 'vue-apexcharts';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.component('apexchart', VueApexCharts);
Vue.use(Vuelidate);
Vue.use(VueApexCharts);
Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
