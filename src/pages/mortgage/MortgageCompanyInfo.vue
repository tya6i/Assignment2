<template>
  <div>
    <div class="q-my-auto row">
      <q-icon
        :style="
          selectedMortgage.isEditable == false ? 'visibility:hidden;' : ''
        "
        size="xs"
        name="create "
        color="primary"
        class="q-ml-auto"
        @click="onEdit"
      ></q-icon>

      <q-icon
        :style="
          selectedMortgage.isEditable == false ? 'visibility:hidden;' : ''
        "
        class="q-my-auto"
        name="delete"
        size="xs"
        color="primary"
        @click="onClickDelete"
      />
    </div>
    <div class="row">
      <span class="heading-light col-4" v-if="selectedMortgage.address"
        >Address Details</span
      >

      <span class="col-7 q-ml-md" v-if="selectedMortgage.address">
        {{
          selectedMortgage.address.address1
            ? selectedMortgage.address.address1
            : '-'
        }}
        <div
          v-if="selectedMortgage.address && selectedMortgage.address.address2"
        >
          {{ selectedMortgage.address.address2 }}
        </div>
        <div>
          {{
            selectedMortgage.address.addressLocality
              ? selectedMortgage.address.addressLocality
              : '-'
          }}
          ,
          {{
            selectedMortgage.address.addressRegion
              ? toGetStateShortName(selectedMortgage.address.addressRegion)
              : '-'
          }}
          {{
            selectedMortgage.address.postalCode
              ? selectedMortgage.address.postalCode
              : '-'
          }}
          <q-icon
            name="place"
            color="primary"
            @click="sendMap(selectedMortgage.address)"
            class="edit-icon"
          ></q-icon>
        </div>
      </span>
    </div>
    <div class="row q-mt-sm" v-if="selectedMortgage.email">
      <span class="heading-light q-mt-none col-xs-4">Company Email</span>
      <span
        class="q-ml-md col clickLink"
        @click="onEmailClick(selectedMortgage.email, $event)"
        >{{ selectedMortgage.email ? selectedMortgage.email : '-' }}</span
      >
    </div>
    <div class="row q-mt-sm" v-for="phone in selectedMortgage.phoneNumber">
      <span class="heading-light q-mt-none col-xs-4">Company Number</span>
      <span class="col q-ml-md" v-if="phone && phone.type">
        {{ phone.type }} :
        <span
          class="clickLink"
          @click="onPhoneNumberClick(phone.number, $event)"
          >{{ phone.number ? showPhoneNumber(phone.number) : '-' }}</span
        >
      </span>
    </div>

    <div
      class="q-mt-sm row"
      v-if="
        selectedMortgage.contact &&
        (selectedMortgage.contact.fname ||
          selectedMortgage.contact.email ||
          selectedMortgage.contact.phoneNumber[0].number)
      "
    >
      <div class="heading-light q-mt-none col-xs-4">Contact Info</div>
      <div class="column q-ml-md">
        {{ selectedMortgage ? selectedMortgage.contact.fname : '-' }}
        {{ selectedMortgage ? selectedMortgage.contact.lname : '-' }}
        <div
          class="clickLink"
          @click="onEmailClick(selectedMortgage.contact.email, $event)"
        >
          {{ selectedMortgage ? selectedMortgage.contact.email : '-' }}
        </div>
        <div
          v-if="selectedMortgage.contact.phoneNumber"
          class="clickLink"
          @click="
            onPhoneNumberClick(
              selectedMortgage.contact.phoneNumber[0].number,
              $event
            )
          "
        >
          {{
            selectedMortgage
              ? showPhoneNumber(selectedMortgage.contact.phoneNumber[0].number)
              : '-'
          }}
        </div>
      </div>
    </div>
    <div
      class="row q-mt-sm"
      v-if="selectedMortgage.info && selectedMortgage.info.website"
    >
      <span class="heading-light col-4">Website</span>
      <span class="q-ml-md col">
        {{
          selectedMortgage.info.website ? selectedMortgage.info.website : '-'
        }}
      </span>
    </div>

    <div
      class="row q-mt-sm"
      v-if="selectedMortgage.info && selectedMortgage.info.notes"
    >
      <span class="heading-light col-4">Notes</span>
      <span class="q-ml-md col">
        {{ selectedMortgage.info.notes ? selectedMortgage.info.notes : '-' }}
      </span>
    </div>

    <q-dialog
      v-model="addMortgageDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <AddMortgage
          @closeDialog="closeAddMortgageDialog"
          :componentName="constants.industries.MORTGAGE"
          :isEdit="true"
        />
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteAlertDialog">
      <q-card>
        <DeleteAlert
          @close="deleteAlertDialog = false"
          @onDelete="onDeleteMortgage"
        />
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import {
  onEmailClick,
  onPhoneNumberClick,
  sendMap,
  sendPhoneNumber,
  showPhoneNumber
} from '@utils/clickable';
import AddMortgage from 'components/AddMortgage';
import { constants } from '@utils/constant';
import { toGetStateShortName } from '@utils/common';
import DeleteAlert from 'components/DeleteAlert';
export default {
  name: 'Mortgage',
  components: { AddMortgage, DeleteAlert },
  data() {
    return {
      deleteAlertDialog: false,
      addMortgageDialog: false,
      constants: constants
    };
  },
  computed: {
    ...mapGetters(['selectedMortgage'])
  },

  methods: {
    ...mapActions([
      'getMortgageDetails',
      'deleteMortgageInfo',
      'editMortgageInfo'
    ]),
    sendMap,
    onEmailClick,
    onPhoneNumberClick,
    showPhoneNumber,
    sendPhoneNumber,
    toGetStateShortName,
    closeAddMortgageDialog(e) {
      this.addMortgageDialog = false;
    },
    onClickDelete() {
      this.deleteAlertDialog = true;
    },
    async onDeleteMortgage() {
      const mortgage = {
        id: this.$route.params.id
      };
      await this.deleteMortgageInfo(mortgage);
      this.$router.push('/mortgages');
    },
    onEdit() {
      this.addMortgageDialog = true;
    }
  }
};
</script>
