export default function() {
  return {
    converted: 'Converted',
    isShowConvertButton: '',
    activeLeads: [],
    leadStatic: {},
    archivedLeads: [],
    selectedLead: {
      id: '',
      isOrganization: false,
      organizationName: '',
      primaryContact: {
        honorific: {
          id: '',
          value: '',
          machineValue: ''
        },
        fname: '',
        lname: '',
        email: '',
        phoneNumber: [
          {
            type: '',
            number: ''
          }
        ]
      },
      causeOfLoss: {
        id: '',
        value: '',
        machineValue: ''
      },
      lastVisted: '',
      visited: [],
      lossLocation: {
        addressCountry: '',
        addressLocality: '',
        addressRegion: '',
        postOfficeBoxNumber: '',
        postalCode: '',
        streetAddress: ''
      },
      lossDesc: '',
      dateOfLoss: '',

      carrier: {
        id: '',
        value: ''
      },
      policyNumber: '',
      isAutomaticScheduling: false,
      notes: ''
    }
  };
}
