import localDB, { getCollection } from '@services/dexie';

export async function setMortgages(state, mortgagesData) {
  const mortgagesCollection = await getCollection('activeLeads');
  const mortgages = mortgagesData.map(mortgage => ({
    ...mortgage.attributes,
    id: mortgage.id
  }));
  state.mortgages = mortgages;
  if ((await mortgagesCollection.count()) > 0) {
    await mortgagesCollection.delete([]);
  }
  await localDB.mortgages.bulkAdd(mortgages);
}

export async function setOfflineMortgages(state) {
  state.mortgages = await getCollection('mortgages').toArray();
}

export function setSelectedMortgage(state, mortgage = {}) {
  state.selectedMortgage = {
    id: mortgage.id,
    ...mortgage.attributes
  };
}

export function setMortgagePersonnel(state, mortgage) {
  state.mortgagePersonnel = {
    id: mortgage.id,
    ...mortgage.attributes
  };
}
