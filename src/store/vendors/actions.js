import request from '@api';
import { buildApiData } from '@utils/api';
import localDB, { getCollection } from '@services/dexie';
import { makeId } from '../leads/actions';

// function is used for getting the list of vendor details,this function is called both in online and offline mode.
export async function getVendors(
  {
    rootState: {
      common: { isOnline }
    },
    commit,
    dispatch
  },
  params
) {
  params == 'hideLoader' ? ' ' : dispatch('setLoading', true);
  if (isOnline) {
    try {
      const { data } = await request.get('/vendors', params);
      const payload = { data: data, params: params };
      commit('setVendors', payload);
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
    commit('setOfflineVendors', params);
    dispatch('setLoading', false);
  }
}
//View a single vendor
export async function getVendorDetails({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    commit('setSelectedVendor', '');
    const { data } = await request.get(`/vendors/${id}`);

    commit('setSelectedVendor', data);

    dispatch('setLoading', false);
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: e.response[0].title
    });
  }
}

// function is used for adding the vendor data, this function is called both in online and offline mode.
export async function addVendor(
  {
    rootState: {
      common: { isOnline }
    },
    dispatch
  },
  payload
) {
  dispatch('setLoading', true);
  if (isOnline) {
    return await dispatch('addVendorRemote', payload);
  } else {
    return await dispatch('addVendorLocal', payload);
  }
}

// function is used for adding the vendor data in the online mode.
export async function addVendorRemote({ commit, dispatch }, payload) {
  try {
    const { data } = await request.post(
      '/vendors',

      buildApiData('users', payload)
    );

    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Vendor Created'
    });
    return data;
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

// function is used for adding the vendor data in the offline mode.
export async function addVendorLocal({ dispatch }, payload) {
  try {
    let vendor = { ...payload, offline: true, id: makeId() };
    await localDB.vendors.add(vendor);
    dispatch('setNotification', {
      type: 'warning',
      message: 'Vendor created in the local database'
    });
    return vendor;
  } catch (e) {
    console.log(e);
  }
}

// function is used for adding the vendor personnel.
export async function addVendorPersonnel({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/vendors/${payload.id}/personnel`,
      buildApiData('vendorpersonnel', payload.data)
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
      message: 'failed to update company personnel info'
    });
  }
}

// function is used for getting the vendor personnel.
export async function getVendorPersonnel({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/vendors/${id}/personnel`);
    commit('setVendorPersonnel', data);
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

// function is used for updating  the vendor personnel details.
export async function editVendorPersonnel({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/vendors/${payload.id}/personnel/${payload.personnelId}`,
      buildApiData('vendorpersonnel', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Personnel  Updated !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'failed to update Personnel'
    });
  }
}

// function is used for deleting the vendor personnel.
export async function deleteVendorPersonnel({ commit, dispatch }, vendor) {
  dispatch('setLoading', true);
  try {
    await request.del(`/vendors/${vendor.id}/personnel/${vendor.personnelId}`);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Personnel  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting personnel.'
    });
  }
}

// function is used for getting the list of vendor industries,this function is called both in online and offline mode.
// export async function getVendorIndustries(
//   {
//     rootState: {
//       common: { isOnline }
//     },
//     commit,
//     dispatch
//   },
//   params
// ) {
//   params == 'hideLoader' ? ' ' : dispatch('setLoading', true);
//   if (isOnline) {
//     try {
//       const { data } = await request.get('/industries');
//       commit('setvendorsIndustries', data);
//       dispatch('setLoading', false);
//     } catch (e) {
//       console.log(e);
//       dispatch('setLoading', false);
//       dispatch('setNotification', {
//         type: 'negative',
//         message: e.response[0].title
//       });
//     }
//   } else {
//     commit('setOfflineVendorIndustries');
//     dispatch('setLoading', false);
//   }
// }

// function is used for deleting the vendor info.
export async function deleteVendorInfo({ commit, dispatch }, vendor) {
  dispatch('setLoading', true);
  try {
    await request.del(`/vendors/${vendor.id}`);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Vendor  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting vendor.'
    });
  }
}

// function is used for updating the vendor info.
export async function editVendorInfo({ dispatch, state }, vendor) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/vendors/${vendor.id}`,
      buildApiData('users', vendor)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Vendor info  Updated !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'failed to update vendor'
    });
  }
}
