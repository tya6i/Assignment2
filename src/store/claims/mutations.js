export function setClaims(state, claims) {
  state.claims = claims;
}

export function setMortgage(state, mortgage) {
  state.mortgage = mortgage;
}

export function setClaim(state, claim) {
  state.claim = {
    id: claim.id,
    ...claim.attributes
  };
}

export function setLog(state, log) {
  state.log = log.map(action => ({
    ...action.attributes,
    id: action.id
  }));
}
export function setClaimNotes(state, claims) {
  state.claimNotes = claims;
}
export function setPersonnel(state, claims) {
  state.personnel = claims;
}
export function setPolicy(state, policy) {
  // state.policy = policy.attributes;
  state.policy = {
    ...policy.attributes
  };
}

export function setLossInfo(state, claims) {
  state.lossInfo = claims;
}

export function setSettlementTypes(state, settlementType) {
  state.settlementType = settlementType.map(action => ({
    value: action.attributes.value,
    id: action.id,
    machineValue: action.attributes.machineValue
  }));
}

export function setSettlements(state, settlement) {
  state.settlement = settlement;
}

export function setClaimTasks(state, claimTasks) {
  state.claimTasks = claimTasks.map(task => ({
    id: task.id,
    ...task.attributes
  }));
}
