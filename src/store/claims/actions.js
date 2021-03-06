import request from '@api';
import { buildApiData } from '@utils/api';
import localDB, { getCollection } from '@services/dexie';
import { dataURItoBlob } from '../common/actions';
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

// function is used to get claim account details.
export async function getAccountDetails({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/accounts`);

    commit('setAccountDetails', data);
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

// function is used to get the list of all payment.
export async function getAllPayment({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/payments`);

    commit('setAllPayment', data);
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
// function is used to get the list of all expenses.
export async function getAllExpenses({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/expenses`);

    commit('setAllExpenses', data);
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
// function is used to get the list of all Disbursements.
export async function getAllDisbursements({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/disbursements`);

    commit('setAllDisbursements', data);
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

// function is used to add new Disbursement.
export async function createDisbursement({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/disbursements`,
      buildApiData('claimdisbursements', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Successfully Added Disbursements !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to Add Disbursements'
    });
    return false;
  }
}

// function is used to create new payment.
export async function addPayment({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/payments`,
      buildApiData('claimpayments', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Successfully Added Payment !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to Add Payment'
    });
    return false;
  }
}

// function is used for adding the expenses for the claim.
export async function addExpenses({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/expenses`,
      buildApiData('claimexpenses', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Successfully Added Expenses !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Failed to Add Expenses'
    });
    return false;
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
export async function getClaims(
  {
    rootState: {
      common: { isOnline }
    },
    commit,
    dispatch
  },
  params
) {
  params == 'hideLoader' ? '' : dispatch('setLoading', true);

  if (isOnline) {
    try {
      const { data } = await request.get('/claims', params);
      const payload = { data: data, params: params };

      commit('setClaims', payload);
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
    commit('setOfflineClaims', params);
    dispatch('setLoading', false);
  }
}

// function is used to get the list of all policy for the selected claim.
export async function getPolicy({ commit, dispatch }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${id}/policy`);
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

// function is used to edit the selected claim policy details.
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

// function is used to get the list of logs for selected claims.
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

// function is used to update the damage info of the selected claim.
export async function updateDamageItem({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.id}/damageinfo/${payload.itemId}`,
      buildApiData('damageinfo', payload)
    );

    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Property info updated Successfully!'
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

//  function is used to get the list of all the damage item of the selected claim.
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

// function is used to get the list of selected claim task , this service is both for online and offline.
export async function getClaimTasks(
  {
    rootState: {
      common: { isOnline }
    },
    commit,
    dispatch
  },
  id
) {
  dispatch('setLoading', true);
  try {
    if (isOnline) {
      const { data } = await request.get(`claims/${id}/tasks`);
      commit('setClaimTasks', data);
    } else {
      // here the offline mode is used to store the task details in the local database.
      const data = await localDB.tasks.toArray();
      const demo = data.find(task => {
        return task.id === id;
      });
      return demo;
    }

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

// function is used for adding the claim logs.
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

// this function is used to add the selected claim task as "Completed"  or "Uncompleted".
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

// function is used to get the list of cliam settlements.
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
// function is used to get the settlements type.
export async function getSettlementTypes({ commit, dispatch }) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(
      '/config-data?viewAll=true&type=settlement_types'
    );
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

// function is used to add the new settlement.
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

// this function is used for updating the details of selected settlements.
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

//this function is used to delete the settlements of selected claim.
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
// this function is used to get the details of the selected claim , this service is used for both the online and offline mode.
export async function getSingleClaims(
  {
    rootState: {
      claims: { claims },
      common: { isOnline }
    },
    commit,
    dispatch
  },
  id
) {
  try {
    if (isOnline) {
      commit('setClaim', {});
      const { data } = await request.get(`/claims/${id}/info`);
      commit('setClaim', data);
    } else {
      // for the offline mode we used to store all the claim details in local db.
      const data = await localDB.claims.toArray();

      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].id == id) {
          var demo = data[i];
          break;
        }
      }

      dispatch('setLoading', false);

      return demo;
    }
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

// function is used to get the list of vendors of the selected claim.
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

// function is use to add the vendor in the claim .
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

// function is used for the edit the claim number.
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

// function is used for the updating the claim phase.
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

// function is used to get the list of claim phase.
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
// function is used to delete the claim notes.
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

// function is used to update the claim info details.
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

// function is used to add the office task.
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

// function is used to get the list of office task of the selected claim.
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

// function is used to delete the expense of the selected claim .
export async function deleteExpenses({ dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(
      `/claims/${payload.claimID}/expenses/${payload.expenseID}`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Expense  Deleted !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting Expense.'
    });
  }
}
// function is used to edit the expense detail of the selected claim.
export async function editExpenses({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/claims/${payload.id}/expenses/${payload.expenseID}`,
      buildApiData('claimexpenses', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Expense  Updated !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'failed to update Expense'
    });
    return false;
  }
}
// function is used to update the payment detail of the selected claim.
export async function editPayment({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.patch(
      `/claims/${payload.id}/payments/${payload.paymentID}`,
      buildApiData('claimpayments', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Payment  Updated !'
    });
    return true;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'failed to update Payment'
    });
  }
}
// function is used to delete the selected Disbursement.
export async function deleteSingleDisbursement({ dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(
      `/claims/${payload.claimID}/disbursements/${payload.paymentId}`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Disbursements  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting Disbursements.'
    });
  }
}
// function is used to delete the single payment.
export async function deleteSinglePayment({ dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(
      `/claims/${payload.claimID}/payments/${payload.paymentId}`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Expense  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting Expense.'
    });
  }
}
// function is used to delete the selected vendor in the claim .
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

export async function getTemplates(
  {
    rootState: {
      common: { isOnline }
    },
    commit,
    dispatch
  },
  params
) {
  if (isOnline) {
    params == 'hideLoader' ? '' : dispatch('setLoading', true);
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
  } else {
    commit('setOfflineTemplatesTypes');
  }
  dispatch('setLoading', false);
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
export async function getVendorDocument({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/documents/vendor`);

    commit('setVendorDocument', data);
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
export async function uploadOfflineDocument({ dispatch, state }, document) {
  if (document.signed_document) {
    let formData = new FormData();
    const str2blob = txt => new Blob([txt]);
    let blob = str2blob(document.signed_document);
    formData.append('file', blob);
    formData.append('type', document.template_type);
    formData.append('convertToPDF', true);

    let payload = {
      id: document.claimId,
      formData: formData
    };
    await dispatch('uploadMultipleDocument', payload).then(res => {});
  }

  if (document.pa_sign) {
    let formData1 = new FormData();
    let blobData = await dataURItoBlob(document.pa_sign);

    formData1.append('file', blobData);
    formData1.append('type', 'pa_signature');
    formData1.append('convertToPDF', false);
    let payload = {
      id: document.claimId,
      formData: formData1
    };
    await dispatch('uploadMultipleDocument', payload);
  }

  if (document.insured_sign) {
    let formData1 = new FormData();
    let blobData = await dataURItoBlob(document.pa_sign);

    formData1.append('file', blobData);
    formData1.append('type', 'insured_signature');
    formData1.append('convertToPDF', false);
    let payload = {
      id: document.claimId,
      formData: formData1
    };
    await dispatch('uploadMultipleDocument', payload);
  }
  if (document.co_insured_sign) {
    let formData1 = new FormData();
    let blobData = await dataURItoBlob(document.pa_sign);

    formData1.append('file', blobData);
    formData1.append('type', 'coinsured_signature');
    formData1.append('convertToPDF', false);
    let payload = {
      id: document.claimId,
      formData: formData1
    };
    await dispatch('uploadMultipleDocument', payload);
  }

  await localDB.contractDocument.delete(document.id);

  dispatch('setNotification', {
    type: 'positive',
    message: 'File Uploaded Successfully!'
  });
}

// function is used for adding document in the claim .
export async function uploadMultipleDocument({ dispatch }, payload) {
  try {
    dispatch('setLoading', true);
    const { data } = await request.post(
      `/claims/${payload.id}/documents`,
      payload.formData
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
//API for upload document in offline mode

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

// function is used to adding vendor documents.
export async function uploadVendorDocument({ dispatch }, payload) {
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

export async function markClaimFavourite({ dispatch, state }, claimID) {
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

export async function markClaimUnFavourite({ dispatch, state }, claimID) {
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
export async function completeEstimate({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/complete-estimate
`,
      buildApiData('complete-estimate', payload.data)
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

// function is used for the  deleting the selected claim document.
export async function deleteClaimDocument({ commit, dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(
      `/claims/${payload.claimID}/documents/${payload.driveID}`
    );
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

// API for Getting Proof of loss Document
export async function getProofOfLossDoc({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/documents/pol`);
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

// API for Approve Proof of loss doc

export async function approveProofOfLoss({ dispatch, state }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${claimID}/approve-pol
`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Approved!'
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

// API forRegenerate Proof of loss doc

export async function regenerateProofOfLoss({ dispatch, state }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${claimID}/regenerate-pol
`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Regenerated successfully!'
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

// API for Get estimator info for claim
export async function getEstimateInfo({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/estimators`);
    commit('setEstimator', data);
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

// function is used to add rhe claim estimator details inside the selected claim .
export async function addClaimEstimator({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/estimators
`,
      buildApiData('claimestimator', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Estimator added successfully!'
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

// API for Get POL document for claim.
export async function getClaimPOLDocument({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(
      `/claims/${claimID}/documents/pol_notarized`
    );
    commit('setPOLClaimDocument', data);
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

//  API for Send Proof of loss doc
export async function sendPOLToCarrier({ dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/send-pol
`,
      buildApiData('', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Send successfully!'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'no personnel has been assigned to carrier'
    });
    return false;
  }
}
// API for Generate PhotoID report
export async function generatePhotoReport({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/generate-photo-report
    `,
      buildApiData('', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Report Generated'
    });
    return data;
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);

    return false;
  }
}

// function is used to delete the activity log.
export async function deleteActivityLogt({ commit, dispatch }, payload) {
  dispatch('setLoading', true);
  try {
    await request.del(`/claims/${payload.claimID}/logs/${payload.logId}`);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Log  Deleted !'
    });
  } catch (e) {
    console.log(e);
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'negative',
      message: 'Error in deleting log.'
    });
  }
}

// function is used to mark a task as completed in a selected claim.
export async function taskComplete({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/tasks/${payload.taskId}/complete
`,
      buildApiData('claimtask', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Task Completed successfully!'
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

// function is used to mark task as uncompleted.
export async function taskUncomplete({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/tasks/${payload.taskId}/uncomplete
`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Task Uncompleted successfully!'
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
// API for Generating Claim Document

export async function generateClaimDoc({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/generate-claim-document
`,
      buildApiData('claim-document', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Claim document generated successfully!'
    });
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
// Fetch all actors related to this claim
export async function getAllActorToClaim({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/actors`);

    commit('setAllActors', data);
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
//API for Sign Document

export async function signDocuments({ dispatch, state }, payload) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${payload.claimID}/sign-docs
`,
      buildApiData('docs-signature', payload.data)
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message:
        'Document has been sent successfully please come back once user signs the document!'
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

// API for Fetching documents signing status

export async function getSignedDocument({ commit, dispatch }, claimID) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.get(`/claims/${claimID}/sign-docs`);

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
//API for Generating photoID assignment
export async function generatePhotoIdAssignment({ dispatch, state }, id) {
  dispatch('setLoading', true);
  try {
    const { data } = await request.post(
      `/claims/${id}/generate-photoid-assignment
`
    );
    dispatch('setLoading', false);
    dispatch('setNotification', {
      type: 'positive',
      message: 'Assignment push initiated successfully'
    });
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
