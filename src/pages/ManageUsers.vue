<template>
  <q-page>
    <div class="q-pa-md height-without-header">
      <div class="row justify-between">
        <div class="row justify-between text-bold q-ml-auto">
          <q-card flat bordered class="q-pa-sm q-ml-md q-mt-sm"
            >Licenses available-
            {{
              CurrentPlan.paidUsers == -1 ? 'Unlimited' : CurrentPlan.paidUsers
            }}</q-card
          >
          <q-card flat bordered class="q-pa-sm q-ml-md q-mt-sm"
            >Total Users - {{ allUsers.length }}</q-card
          >

          <q-btn
            v-if="
              CurrentPlan.paidUsers > -1 &&
                CurrentPlan.paidUsers <= organization.paidUsers
            "
            color="primary"
            class="q-ml-md q-mt-sm"
            disable
          >
            Add New User
          </q-btn>
          <q-btn
            v-else
            color="primary"
            class="q-ml-md q-mt-sm"
            @click="addUserDialogBox = true"
          >
            Add New User
          </q-btn>
        </div>
      </div>
      <div class="q-mt-sm" style="height: calc(100% - 47px); overflow: auto">
        <table>
          <thead>
            <tr class="text-bold text-h6 text-white" style="height: 30px">
              <th style="width: 15%">Contact Name</th>
              <th style="width: 15%">Email</th>
              <th>Phone</th>
              <th>Member Since</th>
              <th>Roles</th>
              <th>Last Access</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in allUsers">
              <td class="text-center">
                {{
                  user.attributes.contact.fname
                    ? user.attributes.contact.fname
                    : '-'
                }}
                {{ user.attributes.contact.lname }}
              </td>
              <td class="text-primary text-center">
                <span
                  class="clickable"
                  v-if="user.attributes.email"
                  @click="onEmailClick(user.attributes.email, $event)"
                  >{{ user.attributes.email }}</span
                ><span v-else> - </span>
              </td>
              <td class="text-primary text-center">
                <span
                  class="clickable"
                  v-if="
                    user.attributes.contact.phoneNumber &&
                      user.attributes.contact.phoneNumber[0].number
                  "
                  @click="
                    onPhoneNumberClick(
                      user.attributes.contact.phoneNumber[0].number,
                      $event
                    )
                  "
                  >{{
                    showPhoneNumber(
                      user.attributes.contact.phoneNumber[0].number
                    )
                  }}</span
                ><span v-else> - </span>
              </td>
              <td class="text-center">-</td>
              <td class="text-center">
                {{
                  user.attributes.roles ? user.attributes.roles[0].value : '-'
                }}
              </td>
              <td class="text-center">-</td>

              <td class="text-center">-</td>
              <td
                class="text-center"
                v-if="user.attributes.roles[0].machineValue != 'owner'"
              >
                <div>
                  <q-btn-dropdown label="Action" style="width: 100px" outline>
                    <q-list style="width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="viewInfoDialogBoxOpen(user)"
                      >
                        <q-item-section>
                          <q-item-label>View/Edit</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="onItemClick(user.attributes.email)"
                      >
                        <q-item-section>
                          <q-item-label>Reset Password</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="openDialogForRole(user)"
                      >
                        <q-item-section>
                          <q-item-label>Set Role</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <q-dialog v-model="addUserDialogBox">
      <q-card style="max-width: 70vw">
        <q-bar class="row justify-between bg-primary" style="height: 50px">
          <div class="col-4 q-px-xs text-bold text-white">Add User</div>
          <q-btn dense flat icon="close" color="white" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-form ref="addUserForm" class="q-pa-xl">
          <div class="row q-mt-xs justify-between full-width">
            <q-input
              dense
              v-model="users.contact.fname"
              class="q-mx-md col-5 input-extra-padding"
              outlined
              label="First name"
            />

            <q-input
              dense
              v-model="users.contact.lname"
              class="q-mx-md col-5 input-extra-padding"
              outlined
              label="Last name"
            />
            <q-input
              dense
              label="Email"
              v-model="users.email"
              class="q-mx-md col-5 required"
              outlined
              lazy-rules
              :rules="[
                val =>
                  validateEmail(val) ||
                  'You have entered an invalid email address!'
              ]"
            />
            <q-select
              dense
              outlined
              filled
              options-dense
              class="q-mx-md col-5 input-extra-padding required"
              v-model="selectedRole"
              :options="userRole"
              label="Role"
              color="primary"
              options-selected-class="text-deep-orange"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Please enter the user role!'
              ]"
            >
              <template v-slot:option="scope">
                <q-expansion-item
                  expand-separator
                  group="somegroup"
                  :default-opened="hasChild(scope)"
                  header-class="text-weight-bold"
                  :label="scope.opt.label"
                >
                  <!--As per requirement we need to hide  VENDOR role-->
                  <template v-for="child in scope.opt.children">
                    <q-item
                      v-if="child.label != 'Vendor'"
                      :key="child.label"
                      clickable
                      v-ripple
                      v-close-popup
                      @click="selectedRole = child.label"
                      :class="{
                        'bg-light-oragne-1': selectedRole === child.label
                      }"
                    >
                      <q-item-section>
                        <q-item-label
                          v-html="child.label"
                          class="q-ml-md"
                        ></q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-expansion-item>
              </template>
            </q-select>
          </div>
        </q-form>

        <div class="row justify-center">
          <q-btn
            label="submit and Proceed"
            class="single-next-button-style q-mb-md col-6"
            @click="onSubmit"
          />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addNewRoles" :maximized="true">
      <q-card style="width: 50%; max-height: 70%">
        <q-bar class="row justify-between bg-primary" style="height: 50px">
          <div class="col-4 q-px-xs text-bold text-white">Add New role</div>
          <q-btn dense flat icon="close" color="white" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="q-mx-xl q-mt-md text-bold row justify-between">
          <div class="q-ml-xl">All Roles</div>
          <div class="col-3">Roles Granted</div>
        </div>
        <div class="row justify-between">
          <q-card class="extra-padding" style="heigth: 230px; overflow: scroll">
            <div
              class="column"
              v-for="(child, index) in userRole"
              v-if="index < 1"
            >
              <div
                class="clickable q-ma-xs q-mx-sm"
                flat
                bordered
                v-for="(item, ind) in child.children"
                @click="setRoleToMain(item, ind)"
              >
                {{ item.label }}
              </div>
            </div>
          </q-card>
          <div>
            <q-icon name="sync_alt" size="md" style="margin-top: 25vh" />
          </div>
          <q-card class="extra-padding q-mt-xl q-ml-xl">
            <div
              class="q-ma-xs"
              flat
              bordered
              v-for="(item, index) in selected_roles"
            >
              <div class="clickable q-mx-sm row justify-between">
                {{ item.machineValue }}
                <q-icon
                  name="delete"
                  color="primary"
                  size="sm"
                  @click="removeRole(index)"
                />
              </div>
            </div>
          </q-card>
        </div>

        <div class="row justify-center q-mb-md">
          <q-btn
            label="Set Role"
            class="single-next-button-style col-6"
            @click="onSaveChangeRole"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- View/Edit  -->
    <q-dialog v-model="viewInfoDialogBox" :maximized="true">
      <q-card style="max-width: 900px; height: 60vh">
        <q-bar class="row justify-between bg-primary" style="height: 50px">
          <div class="col-4 q-px-xs text-bold text-white">View/Edit</div>
          <q-btn dense flat icon="close" color="white" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card class="q-pa-lg" flat bordered>
          <div class="row justify-between">
            <div class="text-h5">Profile</div>
            <div class="text-h5 cursor-pointer">
              <q-icon name="create" color="primary" @click="onEditClick" />
            </div>
          </div>

          <div class="row q-mt-lg text-bold">
            <div class="col">Name</div>
            <div class="col">Address</div>
            <div class="col">Mobile</div>
            <div class="col">Postal Company Code</div>
          </div>
          <q-separator />
          <div class="row q-mt-xs">
            <div class="col-3 column">
              {{ singleUserData.name ? singleUserData.name : '-' }}
            </div>
            <div class="col-3">
              <div class="q-mr-md" v-if="singleUserData.mailingAddress">
                <div>
                  {{
                    singleUserData.mailingAddress.address1
                      ? singleUserData.mailingAddress.address1
                      : '-'
                  }}
                </div>

                <div
                  v-if="
                    singleUserData.mailingAddress &&
                      singleUserData.mailingAddress.address2
                  "
                >
                  {{ singleUserData.mailingAddress.address2 }}
                </div>
                <div>
                  {{
                    singleUserData.mailingAddress.addressLocality
                      ? singleUserData.mailingAddress.addressLocality
                      : '-'
                  }},{{
                    singleUserData.mailingAddress.addressRegion
                      ? toGetStateShortName(
                          singleUserData.mailingAddress.addressRegion
                        )
                      : '-'
                  }}
                  {{
                    singleUserData.mailingAddress.postalCode
                      ? singleUserData.mailingAddress.postalCode
                      : '-'
                  }}
                </div>
              </div>
            </div>
            <div
              class="col clickLink"
              v-if="
                singleUserData.contact.phoneNumber &&
                  singleUserData.contact.phoneNumber.length
              "
              @click="
                onPhoneNumberClick(
                  singleUserData.contact.phoneNumber[0].number,
                  $event
                )
              "
            >
              {{
                singleUserData.contact.phoneNumber
                  ? showPhoneNumber(
                      singleUserData.contact.phoneNumber[0].number
                    )
                  : '-'
              }}
            </div>
            <div class="col" v-if="singleUserData.mailingAddress">
              {{
                singleUserData.mailingAddress.postalCode
                  ? singleUserData.mailingAddress.postalCode
                  : '-'
              }}
            </div>
          </div>

          <div class="row q-mt-xl text-bold">
            <div class="col">Email</div>
            <div class="col" v-if="singleUserData.photoIDEmail">
              Photo ID Email
            </div>
          </div>
          <q-separator />
          <div class="row q-mt-xs">
            <div
              class="col clickLink"
              @click="onEmailClick(singleUserData.email, $event)"
            >
              {{ singleUserData.email }}
            </div>
            <div
              class="col clickLink"
              v-if="singleUserData.photoIDEmail"
              @click="onEmailClick(singleUserData.photoIDEmail, $event)"
            >
              {{ singleUserData.photoIDEmail }}
            </div>
          </div>
        </q-card>
      </q-card>
    </q-dialog>
    <!-- for editing single user detail -->
    <q-dialog
      v-model="editUserInfoDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="width: 40%; height: 75vh">
        <q-bar class="row justify-between bg-primary" style="height: 50px">
          <div class="q-px-xs text-bold text-white">Edit User Info</div>
          <q-btn dense flat icon="close" color="white" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div style="height: calc(100% - 140px); overflow: auto" class="q-pa-md">
          <q-form ref="addUserForm" class="q-pa-md">
            <div class="q-mt-xs">
              <q-card class="q-mx-md q-pa-sm q-mb-sm">
                <div class="row full-width">
                  <q-input
                    v-model="singleUser.fname"
                    dense
                    class="q-mx-md col-5 input-extra-padding"
                    outlined
                    label="First name"
                  />

                  <q-input
                    dense
                    v-model="singleUser.lname"
                    class="q-mx-md col-5 input-extra-padding"
                    outlined
                    label="Last name"
                  />
                </div>
                <div class="row">
                  <q-select
                    dense
                    v-model="singleUser.contact.type"
                    class="q-mx-md col-5 input-extra-padding"
                    :options="contactTypes"
                    option-value="machineValue"
                    option-label="name"
                    map-options
                    outlined
                    options-dense
                    behavior="menu"
                    label="Type"
                    emit-value
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 0) || 'Please select phone type'
                    ]"
                  />

                  <q-input
                    dense
                    v-model="singleUser.contact.number"
                    outlined
                    class="q-mx-md required col-5 input-extra-padding"
                    label="Phone"
                    mask="(###) ###-####"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && sendPhoneNumber(val).length == 10) ||
                        'Please enter phone number'
                    ]"
                  />
                </div>
                <div class="row">
                  <q-input
                    dense
                    disable
                    v-model="singleUser.email"
                    style=""
                    label="Email"
                    class="q-mx-md col-5 required"
                    outlined
                    lazy-rules
                    :rules="[
                      val =>
                        validateEmail(val) ||
                        'You have entered an invalid email address!'
                    ]"
                  />
                  <div
                    v-if="
                      singleUserData.roles &&
                        singleUserData.roles[0].value == 'Estimator'
                    "
                  >
                    <q-input
                      dense
                      v-model="singleUser.photoIdEmail"
                      style=""
                      label="Photo ID Email"
                      class="q-mx-md col-5"
                      lazy-rules
                      :rules="[
                        val =>
                          validateNonRequiredEmail(val) ||
                          'You have entered an invalid email address!'
                      ]"
                      outlined
                    />
                  </div>
                </div>
              </q-card>
              <q-card class="q-mx-md q-pa-sm">
                <AutoCompleteAddress
                  :id="'AddVendor'"
                  :address="singleUser.mailingAddress"
                  :isDropBoxEnable="false"
                  :isChecksEnable="false"
                  :value="true"
                  :view="'custom'"
                />
              </q-card>
            </div>
          </q-form>
        </div>
        <div class="row justify-center">
          <q-btn
            label="Save"
            size="md"
            style="width: 50%"
            class="single-next-button-style q-my-lg"
            @click="onSaveEditedButton"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AutoCompleteAddress from 'components/AutoCompleteAddress';
import { toGetStateShortName } from '@utils/common';
import { validateEmail, validateNonRequiredEmail } from '@utils/validation';
import {
  onEmailClick,
  onPhoneNumberClick,
  sendPhoneNumber,
  showPhoneNumber
} from '@utils/clickable';
import 'firebase/auth';
import firebase from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { successMessage } from '@utils/validation';
import { errorMessage } from '@utils/validation';
import { constants } from '@utils/constant';

export default {
  name: 'Manage-User',
  components: { AutoCompleteAddress },

  data() {
    return {
      CurrentPlan: [],
      currentRoles: [],
      selected_roles: [],
      editUserInfoDialog: false,
      userId: '',
      singleUserID: '',

      singleUser: {
        fname: '',
        lname: '',
        contact: {
          type: 'main',
          number: ''
        },
        email: '',
        photoIdEmail: '',
        roles: [],
        mailingAddress: {
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
        }
      },
      singleUserData: {
        contact: {
          phoneNumber: []
        }
      },
      newRole: '',
      addNewRoles: false,
      viewInfoDialogBox: false,
      OnboardingStatus: { isCompleted: true },
      isShowRemoveButton: false,
      userRole: [
        {
          label: 'Paid',
          children: []
        },
        {
          label: 'Unpaid',
          children: []
        }
      ],
      optionsRole: ['Manager', 'Staff'],
      typeOfUser: ['User', 'Office Staff', 'Sales'],
      selectedRole: '',
      users: {
        type: 'user',
        contact: {
          fname: '',
          lname: ''
        },
        email: '',
        roles: [{ value: '', machineValue: '', isPaid: '' }]
      },
      options: [
        'View/Edit',
        'Reset Password',
        'Change/Modify Plan',
        'Remove',
        'Inactive'
      ],
      addUserDialogBox: false,
      searchText: '',
      name: 'Himanshu',
      bussiness: 'Bussiness-1',
      contactNo: +909098987,
      date: '20/02/1998',
      roles: 'Super Admin',
      lastAccess: '20/01/2020 ',
      status: 'Active',
      constants: constants
    };
  },
  computed: {
    ...mapGetters(['contactTypes', 'allUsers', 'roleTypes', 'organization'])
  },

  async created() {
    this.getAllUsers();

    this.getRoles().then(async () => {
      this.roleTypes.forEach(val => {
        if (val.isPaid) {
          this.userRole[0].children.push({
            label: val.name,
            value: val.machineValue,
            isPaid: true
          });
        } else {
          this.userRole[1].children.push({
            label: val.name,
            value: val.machineValue,
            isPaid: false
          });
        }
      });
    });
    this.getAllConfigurationTableData({ name: 'phone_types' });
    await this.getOrganization();
    this.CurrentPlan = this.organization.plan;
  },

  watch: {
    selectedRole(newVal, oldVal) {
      if (newVal) {
        var user = this.roleTypes.find(o => o.name === newVal);
        this.users.roles[0].value = user.name;
        this.users.roles[0].machineValue = user.machineValue;
        this.users.roles[0].isPaid = user.isPaid;
      }
    }
  },

  methods: {
    validateEmail,
    validateNonRequiredEmail,
    ...mapActions([
      'addUser',
      'setOnboard',
      'getAllUsers',
      'getRoles',
      'getAllConfigurationTableData',
      'editUserInfo',
      'setSingleRole',
      'getOrganization'
    ]),

    successMessage,
    errorMessage,
    onEmailClick,
    toGetStateShortName,
    showPhoneNumber,
    sendPhoneNumber,
    onPhoneNumberClick,
    openDialogForRole(existingRoles) {
      this.singleUserID = existingRoles.id;
      this.selected_roles = existingRoles.attributes.roles;
      this.addNewRoles = true;
    },
    onSaveChangeRole() {
      const payload = {
        id: this.singleUserID,
        data: {
          roles: this.selected_roles
        }
      };
      this.setSingleRole(payload);
      this.selected_roles = [];
      this.addNewRoles = false;
    },
    removeRole(index) {
      this.selected_roles.splice(index, 1);
    },
    // this is for showing the data of single selected user
    viewInfoDialogBoxOpen(value) {
      this.userId = value.id;
      this.singleUserData = value.attributes;
      this.viewInfoDialogBox = true;
    },
    setRoleToMain(value, index) {
      this.selected_roles.forEach(val => {
        this.currentRoles = val.machineValue;
      });
      let present = this.currentRoles.includes(value.value);

      if (present) {
      } else {
        this.selected_roles.push({
          value: value.label,
          machineValue: value.value,
          isPaid: value.isPaid
        });
      }
    },
    async onSaveEditedButton() {
      const success = await this.$refs.addUserForm.validate();
      if (success) {
        this.editUserInfoDialog = false;
        const payload = {
          id: this.userId,
          data: {
            contact: {
              fname: this.singleUser.fname,
              lname: this.singleUser.lname,
              phoneNumber: [
                {
                  type: this.singleUser.contact.type,
                  number: sendPhoneNumber(this.singleUser.contact.number)
                }
              ]
            },
            email: this.singleUser.email,
            photoIDEmail: this.singleUser.photoIdEmail,
            role: this.singleUser.roles,
            mailingAddress: this.singleUser.mailingAddress
          }
        };

        await this.editUserInfo(payload);
        this.getAllUsers();

        this.singleUser.mailingAddress = {
          houseNumber: '',
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
        };
      }
    },
    // This is for Editing of the selected  user data
    onEditClick() {
      this.singleUser.fname = this.singleUserData.contact.fname;
      this.singleUser.lname = this.singleUserData.contact.lname;

      this.singleUser.contact.type =
        this.singleUserData && this.singleUserData.contact.phoneNumber
          ? this.singleUserData.contact.phoneNumber[0].type
          : '';
      this.singleUser.contact.number =
        this.singleUserData && this.singleUserData.contact.phoneNumber
          ? showPhoneNumber(this.singleUserData.contact.phoneNumber[0].number)
          : '';

      this.singleUser.email = this.singleUserData.email;
      if (this.singleUserData.roles[0].value == 'Estimator') {
        this.singleUser.photoIdEmail = this.singleUserData.photoIDEmail;
      }

      if (this.singleUserData.mailingAddress) {
        this.singleUser.mailingAddress.addressRegion = this.singleUserData
          .mailingAddress.addressRegion
          ? this.singleUserData.mailingAddress.addressRegion
          : '';
        this.singleUser.mailingAddress.addressLocality = this.singleUserData
          .mailingAddress.addressLocality
          ? this.singleUserData.mailingAddress.addressLocality
          : '';
        this.singleUser.mailingAddress.houseNumber = this.singleUserData
          .mailingAddress.houseNumber
          ? this.singleUserData.mailingAddress.houseNumber
          : '';
        this.singleUser.mailingAddress.address1 = this.singleUserData
          .mailingAddress.address1
          ? this.singleUserData.mailingAddress.address1
          : '';
        this.singleUser.mailingAddress.address2 = this.singleUserData
          .mailingAddress.address2
          ? this.singleUserData.mailingAddress.address2
          : '';
        this.singleUser.mailingAddress.postalCode = this.singleUserData
          .mailingAddress.postalCode
          ? this.singleUserData.mailingAddress.postalCode
          : '';
      }
      this.viewInfoDialogBox = false;
      this.editUserInfoDialog = true;
    },
    //this is important dont remove this function
    onItemClick(email) {
      const auth = firebase.auth();
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          this.successMessage(constants.successMessages.FORGOT_PASSWORD);
        })
        .catch(error => {
          this.errorMessage(error.message);
        });
    },

    async onSubmit() {
      const success = await this.$refs.addUserForm.validate();

      if (success) {
        await this.addUser(this.users);
        await this.getAllUsers();
        this.addUserDialogBox = false;
        this.users = {
          type: 'user',
          contact: {
            fname: '',
            lname: ''
          },
          email: '',
          roles: [{ value: '', machineValue: '', isPaid: '' }]
        };
        this.selectedRole = '';
      }
    },

    getLabel(scope) {
      return scope.label;
    },

    hasChild(scope) {
      return scope.opt.children.some(c => c.label === this.selectedRole);
    }
  }
};
</script>
<style lang="scss">
tr:nth-child(even) {
  background-color: $grey-3 !important;
}

table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
}
table {
  border-collapse: collapse;
  width: 99.9%;
}
th {
  background: $primary;
}
td {
  padding: 8px 16px;
  border: 1px solid #ccc;
}
div.extra-padding {
  width: 30%;
  height: 400px;
  overflow: scroll;
  margin: 5%;
}
</style>
