import request from '@api';
import { buildApiData } from '@utils/api';

//API for Getting All Personnel Info
export async function getPersonnelInfo({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/personnel`);

    commit('setPersonnel', data);
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

//API for Editing the Activity logs  editLog

export async function editLog({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.put(
      `/claims/${payload.id}/logs/${payload.logUserId}`,
      buildApiData('claimlogs', payload.data)
    );

    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Activity Log Updated !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'failed to update Activity Log'
    });
  }
}

// API for Adding Company Personnel
export async function addCompanyPersonnel({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/personnel`,
      buildApiData('claimpersonnel', payload.companyData)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Company personnel created !'
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

//API for editing Company Personnel Info
export async function editPersonnel({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/claims/${payload.id}/personnel/${payload.personnelId}`,
      buildApiData('claimpersonnel', payload.companyData)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Personnel updated !'
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

//API for Getting All Claims
export async function getClaims({ commit, dispatch }, params) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/claims', params);
    commit('setClaims', data);
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

export async function getPolicy({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  const { data } = await request.get(`/claims/${id}/policy`);

  try {
    commit('setPolicy', data);
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

//API for getting all Claim notes details
export async function getClaimNotes({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/notes`);

    commit('setClaimNotes', data);
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

//This API is for Adding New Claim Note
export async function addClaimNotes({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/notes`,
      buildApiData('claimnotes', payload.notesData)
    );

    dispatch('setLoading', false);
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to create Note! please try again !'
    });
  }
}

//This API is for Editing the Claim Notes
export async function editClaimNotes({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/claims/${payload.id}/notes/${payload.noteId}`,
      buildApiData('claimnotes', payload.notesData)
    );

    dispatch('setLoading', false);
    return data;
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

//This API is for getting Loss Info Details
export async function getLossInfo({ commit, dispatch }, id) {
  dispatch('setLoading', true);

  try {
    const { data } = await request.get(`/claims/${id}/lossinfo`);

    commit('setLossInfo', data);
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

export async function editInsurancePolicy({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `claims/${payload.id}/policy`,
      buildApiData('claimpolicy', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Insurance & Policy Info has been  Updated !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in updating please try again !.'
    });
    return false;
  }
}

// This API is for Updating Loss Info

export async function updateLossInfo({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/lossinfo`,
      buildApiData('claimloss', payload)
    );

    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Loss Info Updated Successfully !'
    });
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to update loss info! please try again !'
    });
    return false;
  }
}
export async function getLog({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`claims/${id}/logs`);
    commit('setLog', data);
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

export async function updateDamageItem({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/damageinfo/${payload.itemId}`,
      buildApiData('damageinfo', payload)
    );

    dispatch('setLoading', false);
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

export async function getDamageInfo({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`claims/${id}/damageinfo`);
    commit('setDamageInfo', data);
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
export async function getClaimTasks({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`claims/${id}/tasks`);
    commit('setClaimTasks', data);
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

export async function addLog({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/logs`,
      buildApiData('logs', payload.data)
    );
    dispatch('setLoading', false);
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to create log! please try again !'
    });
  }
}

export async function changeSelectedTaskMark({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimId}/tasks/${payload.taskId}/${payload.type}`
    );
    dispatch('setLoading', false);
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to update task! please try again !'
    });
  }
}

export async function getSettlements({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/settlements`);
    commit('setSettlements', data);
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
export async function getSettlementTypes({ commit, dispatch }) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/settlementtypes');
    commit('setSettlementTypes', data);
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
export async function addSettlement({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/settlements`,
      buildApiData('claimsettlements', payload.data)
    );
    dispatch('setLoading', false);
    return data;
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

export async function editSettlement({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/claims/${payload.id}/settlements/${payload.setId}`,
      buildApiData('claimsettlements', payload.data)
    );
    dispatch('setLoading', false);
    return data;
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

export async function deleteClaimSettelment({ commit, dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(
      `/claims/${payload.claimId}/settlements/${payload.settlementId}`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Settlement  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting settlement.'
    });
  }
}
export async function getSingleClaims({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/info`);
    commit('setClaim', data);
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

export async function getClaimVendors({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/vendors`);
    commit('setClaimVendors', data);
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

// This API is for getting Mortgage Info
export async function getMortgage({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/mortgages`);
    commit('setMortgage', data);
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
//This API is for adding a new Mortgage

export async function addMortgage({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/mortgages`,
      buildApiData('claimmortgage', payload.data)
    );
    dispatch('setLoading', false);
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to create Mortgage! please try again !'
    });
  }
}

export async function addSingleVendor({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/vendors`,
      buildApiData('claimvendor', payload.data)
    );
    dispatch('setLoading', false);
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to create expert vendor! please try again !'
    });
  }
}
export async function editClaimNumber({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/setclaimnumber`,
      buildApiData('claims', payload.data)
    );
    dispatch('setLoading', false);
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to update claim Number! please try again !'
    });
  }
}
export async function editClaimPhase({ dispatch, state }, payload) {
  dispatch('setLoading', true);

  try {
    const { data } = await request.post(
      `/claims/${payload.id}/setclaimphase`,
      buildApiData('claims', payload.data)
    );
    dispatch('setLoading', false);
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to update claim Phase! please try again !'
    });
  }
}
export async function getPhases({ commit, dispatch }) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/claimphases');
    commit('setPhases', data);
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
export async function deleteClaimNotes({ commit, dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(`/claims/${payload.id}/notes/${payload.noteId}`);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Notes  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting Notes.'
    });
  }
}
export async function editClaimInfo({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/info`,
      buildApiData('claims', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Claim info updated successfully !'
    });
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to update claim Info! please try again !'
    });
  }
}
export async function addOfficeTask({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/tasks`,
      buildApiData('tasks', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Task Added'
    });
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to add a task please try again !'
    });
  }
}
export async function getOfficeTasks({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/tasks`);
    commit('setOfficeTasks', data);
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

//API for Deleting the Claim Company Personnel Info

export async function deleteClaimPersonnel({ dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(
      `/claims/${payload.claimID}/personnel/${payload.personnelID}`
    );
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
      message: 'Error in deleting Personnel.'
    });
  }
}
export async function deleteClaimVendor({ commit, dispatch }, vendor) {
  dispatch('setLoading', true);
  try {
    await request.del(`/claims/${vendor.claimID}/vendors/${vendor.vendorId}`);
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
      message: 'Error in deleting Vendor.'
    });
  }
}
// API for Set permission to given directory
export async function shareFolderAndFiles({ dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/directories/${payload.id}/setaccess`,
      buildApiData('setaccess', payload.shareData)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'shared !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'failed to share'
    });
  }
}

//API for Delete given document

export async function deleteDocument({ dispatch }, documentID) {
  dispatch('setLoading', true);
  try {
    await request.del(`/documents/${documentID}`);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Document  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting document.'
    });
  }
}
//API for Delete given Directory

export async function deleteDirectory({ dispatch }, id) {
  dispatch('setLoading', true);
  try {
    await request.del(`/directories/${id}`);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Folder  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting folder.'
    });
  }
}

// API is for View list of template types for estimator account only
export async function getTemplates({ commit, dispatch }) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/templatetypes');

    commit('setTemplateTypes', data);
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
// API for Get document for claim.
export async function getClaimEstimateDoc({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/documents/estimate`);
    commit('setClaimDocument', data);
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
// API for Get uploaded photos .
export async function getClaimPhoto({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(
      `/claims/${claimID}/documents/photo_report`
    );

    commit('setClaimPhoto', data);
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

// API for Get claim Sketches .
export async function getClaimSketch({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/documents/sketch`);
    commit('setClaimSketch', data);
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

// API for Get all Additional Documents  .
export async function getAdditionalDocs({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(
      `/claims/${claimID}/documents/additional_doc`
    );
    commit('setAdditionalDocs', data);
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
getEsxDocs;
// API for Get all ESXs Documents .
export async function getEsxDocs({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/documents/esx`);
    commit('setEsxDocs', data);
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

// API for Upload document to claim
export async function uploadClaimDocument({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/documents`,
      payload.formData
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'File Uploaded Successfully!'
    });
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
// API for View claim statistics
export async function getClaimStatistics({ commit, dispatch }) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get('/claimstatistics');
    commit('setClaimStatistics', data);
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
// API for to mark claim as favourite

export async function markClaimFavorite({ dispatch, state }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${claimID}/favourite
`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Claim marked as favourite!'
    });
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

//  API for Mark the claim as unfavourite

export async function markClaimUnFavorite({ dispatch, state }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${claimID}/unfavourite
`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Claim marked as unfavourite!'
    });
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

// API for Complete estimate
export async function completeEstimate({ dispatch, state }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${claimID}/complete-estimate
`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Claim Estimate Completed!'
    });
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

// API for Getting Proof of loss Document
export async function getProofOfLossDoc({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    // const { data } = await request.get(
    //   `/claims/${claimID}/documents/proof_of_loss`
    // );
    const data = {
      attributes: {
        claimID: '608170437c19a0c474b5a34b',
        documents: {
          created: '2021-05-20T08:33:06.91Z',
          updated: '2021-05-20T08:33:06.91Z',
          parentID: '17Pm4os59Lg2t7CW8HThT1vH9hPCd1Bai',
          name: 'LossDoc',
          webViewLink:
            'https://drive.google.com/file/d/1d4AEnSAGjZ79SreWTKZVKgnRwJpx-J8Y/view?usp=drivesdk',
          type: 'photo_report',
          mimeType: ''
        }
      }
    };
    commit('setProofOfLoss', data);
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
