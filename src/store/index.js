import Vue from 'vue';
import Vuex from 'vuex';

import leads from './leads';
import vendors from './vendors';
import common from './common';
import clients from './clients';
import user from './user';
import settings from './settings';
import admin from './admin';
Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      leads,
      common,
      user,
      vendors,
      clients,
      settings,
      admin
    }

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEV
  });

  return Store;
}
