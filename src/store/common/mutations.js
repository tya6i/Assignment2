export function setLoading(state, value) {
  state.showLoading = value;
}

export function setNotification(state, value) {
  state.notification = value;
}

export function setContactTypes(state, types) {
  state.contactTypes = types.map(type => ({ ...type.attributes, id: type.id }));
}
