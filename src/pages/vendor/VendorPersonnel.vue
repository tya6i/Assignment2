<template>
  <q-page>
    <div class="row" v-if="!addPersonnelDialog">
      <q-btn
        size="sm"
        name="create"
        class="add-icon"
        flat
        @click="addPersonnelDialog = true"
        ><img src="~assets/add.svg"
      /></q-btn>
    </div>
    <div class="mobile-container-page">
      <div class="q-pa-sm">
        <div class="text-bold text-h6 q-mt-sm q-ml-md">
          {{ selectedVendor.name ? selectedVendor.name : '-' }}
        </div>
        <div v-if="vendorPersonnel.personnel">
          <div
            class="q-mt-sm"
            v-for="(personnel, index) in vendorPersonnel.personnel"
          >
            <q-card class="q-ma-sm q-pa-sm">
              <div class="text-bold text-capitalize q-mt-xs row">
                <div class="col-10">
                  {{ personnel.fname }} {{ personnel.lname }}
                </div>
                <q-icon
                  size="xs"
                  name="create "
                  color="primary"
                  class="q-my-auto col"
                  @click="onEdit(index)"
                ></q-icon>

                <q-icon
                  class="q-my-auto"
                  name="delete"
                  size="sm"
                  color="primary"
                  @click="onDelete(index)"
                />
              </div>
              <div class="row q-mt-sm">
                <div class="heading-light col-3">Address Details</div>
                <div class="col-7" v-if="personnel.address">
                  {{
                    personnel.address.address1
                      ? personnel.address.address1
                      : '-'
                  }}
                  <div v-if="personnel.address && personnel.address.address2">
                    {{ personnel.address.address2 }}
                  </div>
                  <div>
                    {{
                      personnel.address.addressLocality
                        ? personnel.address.addressLocality
                        : '-'
                    }}
                    ,
                    {{
                      personnel.address.addressRegion
                        ? toGetStateShortName(personnel.address.addressRegion)
                        : '-'
                    }}

                    {{
                      personnel.address.postalCode
                        ? personnel.address.postalCode
                        : '-'
                    }}
                    <q-icon
                      name="place"
                      color="primary"
                      @click="sendMap(personnel.address)"
                      style="position: absolute; right: 20px"
                      size="sm"
                    ></q-icon>
                  </div>
                </div>
              </div>
              <div class="row q-mt-sm" v-if="personnel.email">
                <span class="heading-light col-3"> Email </span>
                <span
                  class="q-ml-none col clickLink"
                  @click="onEmailClick(personnel.email, $event)"
                >
                  {{ personnel.email ? personnel.email : '-' }}</span
                >
              </div>
              <div class="row">
                <div class="heading-light col-3">Phone Number</div>
                <div class="q-mt-xs col-6 q-ml-none">
                  <div class="row" v-for="phone in personnel.phoneNumber">
                    <div class="col-3" v-if="phone.number">
                      {{ phone.type ? phone.type : '-' }}
                    </div>
                    <div
                      class="clickLink"
                      @click="onPhoneNumberClick(phone.number, $event)"
                    >
                      {{ phone.number ? phone.number : '-' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row q-mt-sm q-mb-sm">
                <span class="heading-light col-3"> Notes: </span>
                <span class="q-ml-none col" v-if="personnel.note">
                  {{ personnel.note ? personnel.note : '-' }}</span
                >
              </div>
              <div class="row q-mt-sm q-mb-sm">
                <span class="heading-light col-3"> Role: </span>
                <span class="q-ml-none col" v-if="personnel.role">
                  {{ personnel.role.value ? personnel.role.value : '-' }}</span
                >
              </div>
            </q-card>
          </div>
        </div>
        <div v-else class="full-height full-width">
          <div class="absolute-center">
            <div style="color: #666666; width: 110%">
              You haven't added a Personnel yet.
            </div>
            <img
              class="q-mx-lg q-pt-sm"
              src="~assets/add.svg"
              alt="add_icon"
              @click="addPersonnelDialog = true"
              width="130px"
              height="100px"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Add Personnel Dialog -->
    <q-dialog
      v-model="addPersonnelDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          :dialogName="'Add Personnel'"
          @closeDialog="addPersonnelDialog = false"
        />
        <div class="mobile-container-page">
          <q-form ref="vendorPersonnelForm">
            <q-card class="q-ma-md q-pa-md q-mt-sm">
              <q-select
                class="required"
                dense
                v-model="honorific.value"
                :options="titles"
                option-value="value"
                option-label="value"
                map-options
                options-dense
                behavior="menu"
                @input="setTitleName(honorific)"
                emit-value
                label="Title"
              />
              <q-input
                dense
                v-model="personnel.fname"
                class="required"
                label="First Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Please fill the first name'
                ]"
              />
              <q-input
                dense
                v-model="personnel.lname"
                class="required"
                label="Last Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Please fill the last name'
                ]"
              />
              <q-input
                dense
                v-model="personnel.departmentName"
                label="Organization / Department Name"
              />
              <q-input
                dense
                v-model="personnel.email"
                input
                class="required"
                type="email"
                novalidate="true"
                label="Email"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Please fill the email'
                ]"
              />

              <div>
                <q-select
                  v-model="personnel.role.value"
                  dense
                  class="full-width"
                  use-input
                  input-debounce="0"
                  option-label="name"
                  label="Default Roles"
                  :options="options"
                  option-value="name"
                  @input="setClaimRoles"
                  @filter="searchFilterBy"
                  behavior="menu"
                  options-dense
                  emit-value
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-black">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </q-card>
            <q-card class="q-ma-md q-pa-md q-mt-sm"
              ><span class="text-bold">Address Details</span>
              <!-- code is not currently implemented -->

              <AutoCompleteAddress
                :id="'PersonnelInfo'"
                :address="personnel.address"
                :isDropBoxEnable="false"
                :isChecksEnable="false"
                :value="true"
                :view="'mobile'"
              />
            </q-card>
            <q-card class="q-ma-md q-pa-md q-mt-sm">
              <div>
                <div
                  class="row justify-between"
                  v-for="(addPhone, index) in personnel.phoneNumber"
                  v-if="index >= 0"
                >
                  <q-select
                    dense
                    v-model="personnel.phoneNumber[index].type"
                    class="col-5"
                    label="Type"
                    :options="contactTypes"
                    option-value="machineValue"
                    option-label="name"
                    map-options
                    options-dense
                    emit-value
                  />
                  <q-input
                    dense
                    v-model.number="personnel.phoneNumber[index].number"
                    label="Phone"
                    class="col-6"
                    mask="(###) ###-####"
                  />
                </div>
                <div class="row">
                  <q-btn
                    outline
                    class="q-mt-sm"
                    @click="addAnotherContact"
                    color="primary"
                    label="Add"
                    style="margin-right: auto"
                  />

                  <q-btn
                    v-if="personnel.phoneNumber.length > 1"
                    outline
                    @click="RemoveAnotherContact"
                    class="q-mt-sm"
                    color="primary"
                    label="Remove"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="q-ma-md q-pa-md q-mt-xs">
              <div class="form-heading q-mt-sm q-mb-sm">Notes</div>
              <div class="floating-label">
                <textarea
                  rows="3"
                  class="full-width"
                  v-model="personnel.notes"
                  style="resize: none"
                  placeholder="Take notes here..."
                />
              </div>
            </q-card>
          </q-form>
        </div>
        <q-btn
          @click="onSave"
          label="Add Personnel"
          color="primary"
          class="button-width-90 q-mt-lg"
          size="'xl'"
        />
      </q-card>
    </q-dialog>
    <!-- Edit Personnel Dialog -->
    <q-dialog
      v-model="editPersonnelDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          :dialogName="'Edit Personnel'"
          @closeDialog="editPersonnelDialog = false"
        />
        <div class="mobile-container-page">
          <q-form ref="EditPersonnelForm">
            <q-card class="q-ma-md q-pa-md q-mt-sm">
              <q-select
                class="required"
                dense
                v-model="honorific.value"
                :options="titles"
                option-value="value"
                option-label="value"
                map-options
                options-dense
                behavior="menu"
                @input="setTitleName(honorific)"
                emit-value
                label="Title"
              />
              <q-input
                dense
                class="required"
                v-model="personnel.fname"
                label="First Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Please fill the first name'
                ]"
              />
              <q-input
                dense
                class="required"
                v-model="personnel.lname"
                label="Last Name"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Please fill the last name'
                ]"
              />
              <q-input
                dense
                v-model="personnel.departmentName"
                label="Organization / Department Name"
              />
              <q-input
                dense
                class="required"
                v-model="personnel.email"
                input
                type="email"
                novalidate="true"
                label="Email"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'Please fill the email'
                ]"
              />
              <div>
                <q-select
                  v-model="personnel.role.value"
                  dense
                  class="full-width"
                  use-input
                  input-debounce="0"
                  option-label="name"
                  label="Default Roles"
                  :options="options"
                  option-value="name"
                  @input="setClaimRoles"
                  @filter="searchFilterBy"
                  behavior="menu"
                  options-dense
                  emit-value
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-black">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </q-card>
            <q-card class="q-ma-md q-pa-md q-mt-sm"
              ><span class="text-bold">Address Details</span>
              <!-- code is not currently implemented -->

              <AutoCompleteAddress
                :id="'PersonnelInfoEdit'"
                :address="personnel.address"
                :isDropBoxEnable="false"
                :isChecksEnable="false"
                :value="true"
                :view="'mobile'"
              />
            </q-card>
            <q-card class="q-ma-md q-pa-md q-mt-sm">
              <div>
                <div
                  class="row justify-between"
                  v-for="(addPhone, index) in personnel.phoneNumber"
                  v-if="index >= 0"
                >
                  <q-select
                    dense
                    v-model="personnel.phoneNumber[index].type"
                    class="col-5"
                    label="Type"
                    :options="contactTypes"
                    option-value="machineValue"
                    option-label="name"
                    map-options
                    options-dense
                    emit-value
                  />
                  <q-input
                    dense
                    v-model.number="personnel.phoneNumber[index].number"
                    label="Phone"
                    class="col-6"
                    mask="(###) ###-####"
                  />
                </div>
                <div class="row">
                  <q-btn
                    outline
                    class="q-mt-sm"
                    @click="addAnotherContact"
                    color="primary"
                    label="Add"
                    style="margin-right: auto"
                  />

                  <q-btn
                    v-if="personnel.phoneNumber.length > 1"
                    outline
                    @click="RemoveAnotherContact"
                    class="q-mt-sm"
                    color="primary"
                    label="Remove"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="q-ma-md q-pa-md q-mt-xs">
              <div class="form-heading q-mt-sm q-mb-sm">Notes</div>
              <div class="floating-label">
                <textarea
                  rows="3"
                  class="full-width"
                  v-model="personnel.notes"
                  style="resize: none"
                  placeholder="Take notes here..."
                />
              </div>
            </q-card>
          </q-form>
        </div>
        <q-btn
          @click="onEditSave"
          label="Save"
          class="single-next-button-style q-mt-lg"
          size="'xl'"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CustomBar from 'components/CustomBar';
import { toGetStateShortName } from '@utils/common';
import AutoCompleteAddress from 'components/AutoCompleteAddress';
import { onEmailClick, onPhoneNumberClick, sendMap } from '@utils/clickable';

export default {
  components: {
    CustomBar,
    AutoCompleteAddress
  },
  data() {
    return {
      options: [],
      id: '',
      name: '',
      addPersonnelDialog: false,
      editPersonnelDialog: false,
      addAditionalPhoneNumberToggle: false,
      honorific: {
        id: '602a5eaa312a2b57ac2b00ad',
        value: 'Mr.',
        machineValue: 'mr_'
      },
      personnel: {
        role: { value: null, id: '', machineValue: '' },
        fname: '',
        lname: '',
        departmentName: '',
        address: {
          houseNumber: '',
          addressCountry: '',
          addressLocality: '',
          addressRegion: '',
          postOfficeBoxNumber: '',
          postalCode: '',
          address1: '',
          address2: '',
          dropBox: {
            info: '',
            isPresent: false
          }
        },
        phoneNumber: [
          {
            type: 'main',
            number: ''
          }
        ],
        email: '',
        defaultRoles: [
          'Manager',
          'Personnel',
          'Technical Architect',
          'Tester',
          'Engineer',
          'Plumber'
        ],
        notes: ''
      }
    };
  },
  computed: {
    ...mapGetters([
      'contactTypes',
      'titles',
      'vendorPersonnel',
      'defaultRoles',
      'selectedVendor',
      'claimRoles'
    ])
  },
  created() {
    this.getVendorDetails(this.$route.params.id);
    this.getVendorPersonnel(this.$route.params.id);
    this.getAllConfigurationTableData({ name: 'phone_types' });
    this.getAllConfigurationTableData({ name: 'honorifics' });
    this.getClaimRoles();
  },
  methods: {
    ...mapActions([
      'getAllConfigurationTableData',
      'addVendorPersonnel',
      'getVendorPersonnel',
      'getVendorDetails',
      'editVendorPersonnel',
      'deleteVendorPersonnel',
      'getClaimRoles'
    ]),
    toGetStateShortName,
    searchFilterBy(val, update) {
      this.personnel.role.value = null;
      if (val === ' ') {
        update(() => {
          this.options = this.claimRoles;
        });
        return;
      }

      update(() => {
        const search = val.toLowerCase();
        this.options = this.claimRoles.filter(
          v => v.name.toLowerCase().indexOf(search) > -1
        );
      });
    },
    setClaimRoles() {
      const selectedName = this.personnel.role.value;
      const result = this.claimRoles.find(obj => {
        return obj.name === selectedName;
      });

      this.personnel.role.value = result.name;

      this.personnel.role.id = result.id;

      this.personnel.role.machineValue = result.machineValue;
    },
    onEdit(index) {
      this.editPersonnelDialog = true;
      this.personnel.fname = this.vendorPersonnel.personnel[index].fname;
      this.personnel.lname = this.vendorPersonnel.personnel[index].lname;
      this.personnel.email = this.vendorPersonnel.personnel[index].email;
      this.personnel.address = this.vendorPersonnel.personnel[index].address;
      this.personnel.notes = this.vendorPersonnel.personnel[index].note;
      this.personnel.phoneNumber =
        this.vendorPersonnel.personnel[index].phoneNumber;
      this.personnel.role.value =
        this.vendorPersonnel.personnel[index].role.value;
      this.personnel.role.machineValue =
        this.vendorPersonnel.personnel[index].role.machineValue;
      this.id = this.vendorPersonnel.personnel[index].id;
    },
    async onEditSave() {
      const success = await this.$refs.EditPersonnelForm.validate();
      if (success) {
        const payload = {
          id: this.$route.params.id,
          personnelId: this.id,
          data: {
            personnel: {
              honorific: {
                id: this.honorific.id,
                value: this.honorific.value,
                machineValue: this.honorific.machineValue
              },
              fname: this.personnel.fname,
              lname: this.personnel.lname,
              email: this.personnel.email,
              phoneNumber: this.personnel.phoneNumber,
              role: {
                value: this.personnel.role.value,
                machineValue: this.personnel.role.machineValue
              },

              address: {
                ...this.personnel.address
              },
              note: this.personnel.notes
            }
          }
        };
        if (!this.personnel.role.id) {
          delete payload.data.personnel.role;
        }
        await this.editVendorPersonnel(payload);
        this.getVendorPersonnel(this.$route.params.id);
        this.editPersonnelDialog = false;
      }
    },
    async onDelete(index) {
      const vendor = {
        id: this.$route.params.id,
        personnelId: this.vendorPersonnel.personnel[index].id
      };
      await this.deleteVendorPersonnel(vendor);
      this.getVendorPersonnel(this.$route.params.id);
    },
    // For adding multiple Contact Numbers in ClientInfo
    addAnotherContact() {
      let len = this.personnel.phoneNumber.length;
      if (this.personnel.phoneNumber[len - 1].number.length == 14) {
        this.personnel.phoneNumber.push({
          type: '',
          number: ''
        });
      } else {
        this.$q.notify({
          message: 'Please fill the above contact first',
          position: 'top',
          type: 'negative'
        });
      }
    },
    RemoveAnotherContact() {
      this.personnel.phoneNumber.pop();
    },
    onEmailClick,
    onPhoneNumberClick,
    sendMap,

    setTitleName() {
      const title = this.titles.find(obj => {
        return obj.value === this.honorific.value;
      });

      this.honorific.id = title.id;

      this.honorific.machineValue = title.machineValue;
    },

    async onSave() {
      const success = await this.$refs.vendorPersonnelForm.validate();
      if (success) {
        const payload = {
          id: this.$route.params.id,
          data: {
            personnel: {
              honorific: {
                id: this.honorific.id,
                value: this.honorific.value,
                machineValue: this.honorific.machineValue
              },
              fname: this.personnel.fname,
              lname: this.personnel.lname,
              email: this.personnel.email,
              phoneNumber: this.personnel.phoneNumber,
              role: {
                value: this.personnel.role.value,
                machineValue: this.personnel.role.machineValue
              },
              address: {
                ...this.personnel.address
              },
              note: this.personnel.notes
            }
          }
        };
        if (!this.personnel.role.id) {
          delete payload.data.personnel.role;
        }
        await this.addVendorPersonnel(payload);
        this.addPersonnelDialog = false;
        this.getVendorPersonnel(this.$route.params.id);
        this.personnel.fname = '';
        this.personnel.lname = '';
        this.personnel.email = '';
        this.personnel.address.houseNumber = '';
        this.personnel.address.addressCountry = '';
        this.personnel.address.addressLocality = '';
        this.personnel.address.addressRegion = '';
        this.personnel.address.address1 = '';
        this.personnel.address.address2 = '';
        this.personnel.address.postalCode = '';
        this.personnel.notes = '';
        this.personnel.departmentName = '';
        this.personnel.phoneNumber = [{ type: 'main', number: '' }];
        this.personnel.role.id = '';
        this.personnel.role.value = '';
        this.personnel.role.machineValue = '';
      }
    }
  }
};
</script>
