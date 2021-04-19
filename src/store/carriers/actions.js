import request from '@api';
import { buildApiData } from '@utils/api';

export async function getCarriers({ commit, dispatch }, params) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/carriers', params);
    commit('setCarriers', data);
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
export async function addCarrier({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      '/carriers',
      buildApiData('carriers', payload)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Carrier added Successfully!'
    });
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'error'
    });
    return false;
  }
}
//View a single Carrier
export async function getCarrierDetails({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/carriers/${id}`);
    commit('setSelectedCarrier', data);
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
export async function addCarrierPersonnel({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/carriers/${payload.id}/personnel`,
      buildApiData('claimcarrier', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Personnel added Successfully!'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'failed to add company personnel info'
    });
  }
}
