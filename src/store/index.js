import Vue from 'vue';
import Vuex from 'vuex';
import productsModule from './products';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading: false,
  },
  actions: {
    updateLoading(context, payload) {
      context.commit('LOADING', payload);
    },
  },
  mutations: {
    LOADING(state, payload) {
      state.isLoading = payload;
    },
  },
  modules: {
    productsModule,
  },
});
