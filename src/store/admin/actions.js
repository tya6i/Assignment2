import request from '@api';
import { buildApiData } from '@utils/api';
import localDB, { getCollection } from '@services/dexie';
export async function getActionOverDues({ commit, dispatch }, params) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/actionoverdues?workflowID=${params}`);

    commit('setActionOverDues', data);
    dispatch('setLoading', false);
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].title
    });
  }
}

export async function getActionCompletion({ commit, dispatch }, params) {
  dispatch('setLoading', true);

  try {
    const { data } = await request.get(
      `/actioncompletions?workflowID=${params}`
    );

    commit('setActionCompletion', data);
    dispatch('setLoading', false);
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].title
    });
  }
}
export async function getActionReasons({ commit, dispatch }, params) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/actionreasons?workflowID=${params}`);

    commit('setActionReasons', data);
    dispatch('setLoading', false);
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].title
    });
  }
}

export async function getAllWorkFlow({ commit, dispatch }, params) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/workflows/${params}/actions`);
    commit('setAllWorkFlow', data);
    dispatch('setLoading', false);
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].title
    });
  }
}
export async function addWorkflowAction({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `workflows/${payload.machineValue}/actions`,
      buildApiData('actions', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Workflow action added !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].title
    });
    return false;
  }
}

export async function getWorkflowAction({ commit, dispatch }) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/workflows ');

    commit('setWorkflowAction', data);
    dispatch('setLoading', false);
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].title
    });
  }
}

export async function getOfficeTaskActions({
  rootState: {
    common: { isOnline }
  },
  commit,
  dispatch
}) {
  if (isOnline) {
    dispatch('setLoading', true);
    try {
      const { data } = await request.get(`/workflows/claim_new_claim/actions`);
      commit('setOfficeTaskActions', data);
      dispatch('setLoading', false);
    } catch (e) {
      console.log(e);
      dispatch('setLoading', false);
      dispatch('setNotification', {
        type: 'negative',
        message: e.response[0].title
      });
    }
  } else {
    commit('setOfflineOfficeTaskActions');
    dispatch('setLoading', false);
  }
}
