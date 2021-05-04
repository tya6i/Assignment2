import request from '@api';
import { buildApiData } from '@utils/api';
export async function getActiveLeadsList(
  { commit, dispatch },
  searchString = ''
) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/leads', { name: searchString });
    commit('setActiveLeads', data);
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
export async function getArchivedLeadsList({ commit, dispatch }, searchString) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/leads', {
      name: searchString,
      archive: true
    });
    commit('setArchivedLeads', data);
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
export async function addLeadToArchiveList({ commit, dispatch }, leadId) {
  dispatch('setLoading', true);
  try {
    await request.del(`/leads/${leadId}`);
    commit('moveActiveToArchive', leadId);
    dispatch('setLoading', false);
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in archiving lead.'
    });
  }
}

export async function addLeads({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      '/leads',
      buildApiData('leads', payload)
    );

    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Lead Created'
    });
    this.$router.push('/leads');
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].detail
    });
    return false;
  }
}

export async function getLeadDetails({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/leads/${id}`);
    commit('setSelectedLead', data);
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

export async function editLeadDetails({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/leads/${payload.id}`,
      buildApiData('claims', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Lead Info Updated Successfully!'
    });
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to update Lead Info! please try again !'
    });
  }
}
