<template>
  <div>
    <div>
      <q-card
        class="text-primary q-pa-md"
        flat
        bordered
        @click="onClickAddAnotherProperty"
        >+ Add Another Property</q-card
      >

      <div class>
        <div v-if="setClientProperty.length">
          <q-card
            class="q-my-sm"
            flat
            bordered
            v-for="(i, index) in setClientProperty.length"
            :key="setClientProperty.id"
          >
            <div v-if="setClientProperty">
              <div class="row q-ma-sm">
                <div
                  class="col-4 bg-red q-mb-xl q-mt-md"
                  style="border-radius: 8px"
                >
                  <q-img
                    alt="Claimguru"
                    src="~assets/logo.png"
                    spinner-color="white"
                    style="height: auto; max-width: 120px"
                  ></q-img>
                </div>
                <div class="col-5 q-ml-lg q-mt-xs q-pa-sm">
                  <div class="heading-light">Property Name</div>
                  <div>
                    {{
                      setClientProperty[i - 1].attributes.name
                        ? setClientProperty[i - 1].attributes.name
                        : '-'
                    }}
                  </div>
                  <div>
                    {{
                      setClientProperty[i - 1].attributes.address1
                        ? setClientProperty[i - 1].attributes.address1
                        : '-'
                    }}
                  </div>
                  <div
                    v-if="
                      setClientProperty[i - 1].attributes &&
                      setClientProperty[i - 1].attributes.address2
                    "
                  >
                    {{ setClientProperty[i - 1].attributes.address2 }}
                  </div>
                  <div>
                    {{
                      setClientProperty[i - 1].attributes.addressLocality
                        ? setClientProperty[i - 1].attributes.addressLocality
                        : '-'
                    }}
                    ,
                    {{
                      setClientProperty[i - 1].attributes.addressRegion
                        ? toGetStateShortName(
                            setClientProperty[i - 1].attributes.addressRegion
                          )
                        : '-'
                    }}
                    {{
                      setClientProperty[i - 1].attributes.postalCode
                        ? setClientProperty[i - 1].attributes.postalCode
                        : '-'
                    }}
                  </div>

                  <div>
                    <div class="heading-light">
                      {{
                        setClientProperty[i - 1].attributes.openClaims
                          ? setClientProperty[i - 1].attributes.openClaims
                          : '0'
                      }}
                      - Open Claim
                    </div>
                  </div>
                </div>
                <div class="q-mt-sm">
                  <q-icon
                    size="sm"
                    name="create"
                    color="primary"
                    class="q-ml-sm q-mt-xs"
                    @click="editPropertyAddress(index)"
                  ></q-icon>
                  <q-icon
                    size="sm"
                    name="delete"
                    color="primary"
                    class="q-mt-xs"
                    @click="onDeleteProperty(index)"
                  />
                </div>
              </div>

              <div
                class="q-mt-sm"
                v-for="claim in setClientProperty[i - 1].attributes.claims"
                :key="claim.id"
              >
                <div class="row q-mx-md">
                  <div class="heading-light col-4 q-mx-xs">Claim Number:</div>
                  <div class="row justify-between q-ml-lg col-6">
                    <div @click="onClickClaimNumber(claim)" class="click-link">
                      {{ claim.number ? claim.number : '-' }}
                    </div>
                  </div>
                </div>
                <!-- badge -->
                <div>
                  <q-badge
                    class="q-px-lg q-mx-md"
                    style="background-color: #eca74c"
                    >{{ claim.status ? claim.status : '-' }}</q-badge
                  >
                </div>
                <!-- pointer3 -->
                <div class="row q-ma-md">
                  <div class="col-5 heading-light">Insurane Carrier</div>
                  <div class="q-ml-xs">
                    {{ claim.carrier ? claim.carrier.value : '-' }}
                  </div>
                </div>
                <div class="row q-ma-md">
                  <div class="col-5 heading-light">Date of Loss</div>
                  <div v-if="claim.lossDate" class="q-ml-xs">
                    {{ dateToShow(claim.lossDate) }}
                  </div>
                  <div v-else>-</div>
                </div>
                <div class="row q-ma-md">
                  <div class="col-5 heading-light">Policy Number</div>
                  <div class="q-ml-xs">
                    {{ claim.policyNumber ? claim.policyNumber : '-' }}
                  </div>
                </div>
                <div class="row q-ma-md">
                  <div class="col-5 heading-light">Cause Of Loss</div>
                  <div class="col-6 q-ml-xs">
                    {{ claim.lossCause ? claim.lossCause.value : '' }} -
                    {{ claim.lossCause ? claim.lossCause.desc : '' }}
                  </div>
                </div>

                <q-separator />
              </div>
            </div>
            <!-- Add Claim -->
            <div>
              <q-card
                class="text-primary q-ma-md q-pa-md"
                flat
                bordered
                @click="
                  $router.push(`/add-claim/${setClientProperty[i - 1].id}`)
                "
                >+ Add Another Claim to this property</q-card
              >
            </div>
          </q-card>
        </div>
        <div v-else class="full-height full-width column">
          <div class="column absolute-center">
            <div style="color: #666666,align-items: center">
              You haven't added a property yet.
            </div>

            <img
              class="q-mx-lg q-pt-sm"
              src="~assets/add.svg"
              alt="add_icon"
              width="130px"
              height="100px"
              @click="addNewPropertyDialog = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- This Dialog Box is for adding a new property  -->
    <q-dialog
      v-model="addNewPropertyDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          @closeDialog="addNewPropertyDialog = false"
          :dialogName="'Add New Property'"
        />
        <div class="mobile-container-page-without-search">
          <q-form ref="propertyAddressForm" class="form-height">
            <q-input
              dense
              class="input-style"
              v-model="propertyName"
              label=" Property Name"
              borderless
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) || 'Please fill the property name'
              ]"
            />
            <q-select
              dense
              class="required input-style"
              borderless
              v-model="property.id"
              option-value="id"
              option-label="name"
              map-options
              options-dense
              behavior="menu"
              emit-value
              :options="propertyTypes"
              @input="setTypes(propertyTypes, property)"
              label="Property Type"
              :rules="[
                val =>
                  (val && val.length > 0) || 'Please select the property type'
              ]"
            />
            <q-input
              dense
              class="full-width required input-style"
              v-model="propertyDescription"
              label=" Description"
              borderless
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) ||
                  'Please fill the property Description'
              ]"
            />
            <div class="q-mx-sm">
              <AutoCompleteAddress
                :id="'PropertyInfo'"
                :address="propertyAddressDetails"
                :isDropBoxEnable="false"
                :isChecksEnable="true"
                :isAsteriskMark="true"
                :value="true"
                :view="'mobile'"
              />
            </div>
          </q-form>
          <div class="row q-mt-lg justify-center">
            <q-btn
              label="Save"
              class="single-next-button-style"
              @click="onSaveButtonClick"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Delete Alert Dialog -->

    <q-dialog v-model="deleteAlertDialog">
      <q-card>
        <DeleteAlert
          @close="deleteAlertDialog = false"
          @onDelete="deletePropertyAddress"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import CustomBar from 'components/CustomBar';
import AutoCompleteAddress from 'components/AutoCompleteAddress';
import DeleteAlert from 'components/DeleteAlert';
import moment from 'moment';
import { toGetStateShortName } from '@utils/common';
import { dateToShow } from '@utils/date';
import { successMessage } from '@utils/validation';
import { constants } from '@utils/constant';

export default {
  name: 'PropertyInfo',

  data() {
    return {
      valueIndex: '',
      deleteAlertDialog: false,
      isEdit: '',
      propertyId: '',
      propertyAddressDetails: {
        houseNumber: '',
        addressCountry: '',
        addressRegion: '',
        addressLocality: '',
        postalCode: '',
        address1: '',
        address2: '',
        postOfficeBoxNumber: '4',
        dropBox: {
          info: '',
          isPresent: false
        }
      },
      addNewPropertyDialog: false,
      propertyName: '',
      propertyDescription: '',
      property: {
        value: '',
        id: '',
        machineValue: ''
      }
    };
  },

  components: { CustomBar, AutoCompleteAddress, DeleteAlert },
  created() {
    if (!this.selectedClientId) {
      this.$router.push('/clients');
    }
    this.getSingleClientDetails(this.selectedClientId);

    this.getSingleClientProperty(this.selectedClientId);
  },
  computed: {
    ...mapGetters([
      'setClientProperty',
      'selectedClientId',
      'propertyTypes',
      'selectedClientId',
      'selectedClaimId',
      'editSelectedClient'
    ]),
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY');
      }
    }
  },
  methods: {
    ...mapActions([
      'getSingleClientProperty',
      'addPropertyAddress',
      'getAllConfigurationTableData',
      'getSingleClientDetails',
      'editedPropertyAddress',
      'deletedPropertyAddress'
    ]),
    toGetStateShortName,
    ...mapMutations(['setSelectedClaimId']),
    onClickClaimNumber(claim) {
      this.setSelectedClaimId(claim.id);

      this.$router.push('/claim-details');
    },
    onDeleteProperty(index) {
      this.deleteAlertDialog = true;
      this.valueIndex = index;
    },
    dateToShow,
    setTypes(types, data) {
      const obj = types.find(item => {
        return item.id === data.id;
      });

      data.machineValue = obj.machineValue;
      data.value = obj.name;
    },

    // Deleting Property Address

    async deletePropertyAddress() {
      const payload = {
        id: this.selectedClientId,
        propertyId: this.setClientProperty[this.valueIndex].id
      };

      await this.deletedPropertyAddress(payload);
      await this.getSingleClientProperty(this.selectedClientId);
    },
    // Editing Property Address
    editPropertyAddress(index) {
      this.isEdit = true;
      this.getAllConfigurationTableData({ name: 'property_types' });
      this.propertyId = this.setClientProperty[index].id
        ? this.setClientProperty[index].id
        : '';

      this.propertyName = this.setClientProperty[index].attributes.name
        ? this.setClientProperty[index].attributes.name
        : '';
      this.propertyDescription =
        this.setClientProperty[index].attributes.propertyDesc;
      this.property = this.setClientProperty[index].attributes.propertyType
        ? this.setClientProperty[index].attributes.propertyType
        : '';
      this.propertyAddressDetails.houseNumber = this.setClientProperty[index]
        .attributes.houseNumber
        ? this.setClientProperty[index].attributes.houseNumber
        : '';
      this.propertyAddressDetails.addressCountry = this.setClientProperty[index]
        .attributes.addressCountry
        ? this.setClientProperty[index].attributes.addressCountry
        : '';

      this.propertyAddressDetails.addressLocality = this.setClientProperty[
        index
      ].attributes.addressLocality
        ? this.setClientProperty[index].attributes.addressLocality
        : '';
      this.propertyAddressDetails.addressRegion = this.setClientProperty[index]
        .attributes.addressRegion
        ? this.setClientProperty[index].attributes.addressRegion
        : '';
      this.propertyAddressDetails.postalCode = this.setClientProperty[index]
        .attributes.postalCode
        ? this.setClientProperty[index].attributes.postalCode
        : '';
      this.propertyAddressDetails.address1 = this.setClientProperty[index]
        .attributes.address1
        ? this.setClientProperty[index].attributes.address1
        : '';
      this.propertyAddressDetails.address2 = this.setClientProperty[index]
        .attributes.address2
        ? this.setClientProperty[index].attributes.address2
        : '';
      this.addNewPropertyDialog = true;
    },

    onClickAddAnotherProperty() {
      this.isEdit = false;
      this.propertyAddressDetails = {
        houseNumber: '',
        addressCountry: '',
        addressRegion: '',
        addressLocality: '',
        postalCode: '',
        address1: '',
        address2: '',
        postOfficeBoxNumber: '4',
        dropBox: {
          info: '',
          isPresent: false
        }
      };
      this.propertyName = '';
      this.propertyDescription = '';
      this.property = {
        value: '',
        id: '',
        machineValue: ''
      };
      this.addNewPropertyDialog = true;
      this.getAllConfigurationTableData({ name: 'property_types' });
    },

    async onSaveButtonClick() {
      let success = true;
      success = await this.$refs.propertyAddressForm.validate();
      if (success) {
        const payload = {
          id: this.selectedClientId,
          propertyId: this.propertyId,
          clientData: {
            name: this.propertyName,
            addressCountry: this.propertyAddressDetails.addressCountry,
            addressLocality: this.propertyAddressDetails.addressLocality,
            addressRegion: this.propertyAddressDetails.addressRegion,
            postalCode: this.propertyAddressDetails.postalCode,
            address1: this.propertyAddressDetails.address1,
            address2: this.propertyAddressDetails.address2,
            houseNumber: this.propertyAddressDetails.houseNumber,
            propertyType: this.property,
            PropertyDesc: this.propertyDescription
          }
        };
        if (this.isEdit == false) {
          await this.addPropertyAddress(payload);
          this.successMessage(constants.successMessages.PROPERTY_ADDRESS);
        } else {
          await this.editedPropertyAddress(payload);
          this.successMessage(constants.successMessages.EDIT_PROPERTY_ADDRESS);
        }

        this.addNewPropertyDialog = false;
        this.propertyName = '';
        this.propertyAddressDetails.addressLocality = '';
        this.propertyAddressDetails.addressRegion = '';
        this.propertyAddressDetails.postalCode = '';
        this.propertyAddressDetails.address1 = '';
        this.propertyAddressDetails.address2 = '';
        this.propertyAddressDetails.houseNumber = '';
        this.property.id = '';
        this.property.value = '';
        this.property.machineValue = '';

        this.getSingleClientProperty(this.selectedClientId);
        this.$router.push('/view-client/' + this.selectedClientId);
      }
    },
    successMessage
  }
};
</script>

<style lang="scss">
.form-height {
  height: calc(100vh - 150px);
  overflow: auto;
  margin: 10px;
}
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
</style>
