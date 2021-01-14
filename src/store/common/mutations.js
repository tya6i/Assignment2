export function setLoading(state, value) {
  state.showLoading = value;
}

export function setNotification(state, value) {
  state.notification = value;
}
export function setTitles(state, titles) {
  state.titles = titles.map(titles => ({
    title: titles.attributes.machineValue,
    id: titles.id
  }));
}

export function setContactTypes(state, types) {
  state.contactTypes = types.map(type => ({
    name: type.attributes.value,
    machineName: type.attributes.machineValue
  }));
}
