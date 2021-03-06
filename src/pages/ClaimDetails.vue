<template>
  <q-page>
    <q-icon
      v-if="
        !claimSummaryDialog &&
        !lossInfoDialog &&
        !activityLogDialog &&
        !carrierDialog &&
        !editTask &&
        !addSettlement &&
        !addPersonnel &&
        !addMortgageDialog &&
        !addClaimNotes &&
        !claimExpertVendor
      "
      class="icon-top"
      @click="onTopMenuClick"
      name="more_vert"
      color="white"
    />
    <div class="listing-height" id="scroll-bottom">
      <div>
        <ClaimDetail />
      </div>
      <q-list
        bordered
        class="q-mt-xs"
        v-if="userRole != 'estimator' || userRole != 'vendor'"
      >
        <q-expansion-item
          v-model="summaryExpansion"
          group="claimGroup"
          label="   Claim Summary"
          header-class="text-primary"
          @show="claimSummary = true"
        >
          <q-card v-if="claimSummary">
            <q-card-section>
              <ClaimSummary @claimSummaryDialog="onEditClaimSummary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Loss Info"
          header-class="text-primary"
          @show="onShowLossInfo"
        >
          <q-card v-if="lossInfo">
            <q-card-section>
              <UpdateLossInfo @editLossInoDialog="onEditLossInfo" />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label=" Property Damage"
          header-class="text-primary"
          @show="personalProperty = true"
        >
          <q-card v-if="personalProperty">
            <q-card-section> <PersonalProperty /> </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Other Damage Details"
          header-class="text-primary"
          @show="otherDamage = true"
        >
          <q-card v-if="otherDamage">
            <q-card-section> <OtherDamageProperty /> </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Activity Log & Message Archive"
          header-class="text-primary"
          @show="activityLog = true"
        >
          <q-card v-if="activityLog">
            <q-card-section>
              <ActivityLog @ActivityLogDialog="onEditAcitivtyLog" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Carrier & Policy"
          header-class="text-primary"
          @show="insurancePolicy = true"
        >
          <q-card v-if="insurancePolicy">
            <q-card-section>
              <CarrierAndPolicy @editCarrierDialog="onEditCarrier" />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          v-model="taskExpansion"
          group="claimGroup"
          label="Tasks"
          header-class="text-primary"
          @show="claimTask = true"
        >
          <q-card v-if="claimTask">
            <q-card-section>
              <ClaimTask @taskDialog="onEditTask" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Settlements"
          header-class="text-primary"
          @show="settlements = true"
        >
          <q-card v-if="settlements">
            <q-card-section>
              <Settlements
                @onAddSettlement="onAddSettlement"
                @afterAddition="refreshFlag"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Company Personnel"
          header-class="text-primary"
          @show="companyPersonnel = true"
        >
          <q-card v-if="companyPersonnel">
            <q-card-section>
              <ClaimPersonnel @addPersonnel="onAddPersonnelClick" />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Mortgages and Liens"
          header-class="text-primary"
          @show="mortgageAndLiens = true"
        >
          <q-card v-if="mortgageAndLiens">
            <q-card-section>
              <MortgageAndLiens @addMortgage="onAddMortgage" />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Expert Vendor"
          header-class="text-primary"
          @show="expertVendor = true"
        >
          <q-card v-if="expertVendor">
            <q-card-section>
              <ClaimExpertVendor @expertVendorClaim="addExpertVendor" />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Files"
          header-class="text-primary"
          @show="files = true"
        >
          <q-card v-if="files">
            <q-card-section> <ClaimFiles /> </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Proof Of Loss"
          header-class="text-primary"
          @show="proofOfLoss = true"
        >
          <q-card v-if="proofOfLoss">
            <q-card-section> <ProofOfLoss /> </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Notes"
          header-class="text-primary"
          @show="notes = true"
        >
          <q-card v-if="notes">
            <q-card-section>
              <ClaimNotes @claimNoteDailog="onAddNoteClick" />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Estimator Info"
          header-class="text-primary"
          @show="estimatingInfo = true"
        >
          <q-card v-if="estimatingInfo">
            <q-card-section> <ClaimEstimatingInfo /> </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- <q-card-section> <ClaimEstimatingInfo /> </q-card-section> -->
        <!-- <q-card-section> <PropertyInfo /> </q-card-section> -->

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Time Tracking"
          header-class="text-primary"
        >
          <q-card>
            <!-- <q-card-section> <PropertyInfo /> </q-card-section> -->
          </q-card>
        </q-expansion-item>

        <q-separator></q-separator>
        <q-expansion-item
          group="claimGroup"
          label="Claim Ledger"
          header-class="text-primary"
          @show="scrollDown"
          @hide="scrollDown"
        >
          <q-card v-if="claimLedgeInfo">
            <q-card-section>
              <ClaimLedger @scrollAfterCreation="scrollAfterCreation" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>

    <q-dialog
      v-model="editClaimDetails"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      :position="'bottom'"
    >
      <q-card style="width: 350px">
        <q-card-section class="items-center">
          <div
            class="q-pa-md heading-light"
            @click="editClaimNumberDialogOnClick('Claim Number')"
          >
            Edit Claim Number
          </div>
          <div
            class="q-pa-md heading-light"
            @click="editClaimNumberDialogOnClick('Claim Phase')"
          >
            Edit Current Phase
          </div>
          <div class="q-pa-md heading-light" @click="onClickUploadDocument">
            Upload Estimate Documents
          </div>
          <div
            class="q-pa-md heading-light"
            @click="$router.push('/vendor-document')"
          >
            Upload Vendor Documents
          </div>
          <div
            v-if="
              getSelectedClaim.uScopeAssignmentID === '' &&
              !getSelectedClaim.isPhotoIDGenerated
            "
            class="q-pa-md heading-light"
            @click="onManuallyPushAssignmentClick"
          >
            Push claim to photo id app
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- editClaim Number Dialog Box -->
    <q-dialog
      v-model="editClaimNumberDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="width: 350px; height: 370px">
        <q-card-section class="items-center">
          <q-form ref="claimEditForm">
            <div class="text-bold">{{ editDialogName }}</div>
            <div style="height: 250px">
              <div v-if="editDialogName == 'Claim Number'">
                <div class="q-py-md row">
                  <div class="heading-light">Current Claim Number :</div>
                  <div class="q-px-lg">
                    {{
                      getSelectedClaim.policyInfo.claimNumber
                        ? getSelectedClaim.policyInfo.claimNumber
                        : '-'
                    }}
                  </div>
                </div>
                <div class="q-pb-lg row">
                  <div class="heading-light">New Claim Number</div>
                  <div class="q-ml-xl">
                    <q-input
                      class="required"
                      label=" Claim Number"
                      style="width: 130px; height: 20px"
                      v-if="editDialogName == 'Claim Number'"
                      v-model="editInputValue"
                      lazy-rules
                      :rules="[
                        val => (val && val.length > 0) || 'enter  new value'
                      ]"
                    />
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="q-py-md row">
                  <div class="heading-light">Current phase :</div>
                  <div class="q-px-lg">
                    {{
                      getSelectedClaim.status
                        ? getSelectedClaim.status.value
                        : '-'
                    }}
                  </div>
                </div>
                <div class="q-mb-sm">
                  <div class="heading-light">Change Claim phase to :</div>
                  <div class="q-mt-sm">
                    <q-select
                      class="required"
                      filled
                      v-model="claimPhase.value"
                      :options="options"
                      use-input
                      input-debounce="0"
                      option-value="name"
                      option-label="name"
                      behavior="menu"
                      map-options
                      options-dense
                      label="Claim Phases"
                      emit-value
                      @filter="searchFilterBy"
                      @input="setTypes(claimPhase.value)"
                      lazy-rules
                      :rules="[
                        val => (val && val.length > 0) || 'Enter  new value'
                      ]"
                    ></q-select>
                  </div>
                </div>
                <div class="heading-light">Notes</div>
                <textarea
                  rows="5"
                  class="full-width"
                  v-model="notes"
                  style="resize: none; height: 80px"
                ></textarea>
              </div>
            </div>
            <div class="row text-primary justify-end q-mt-lg">
              <div class="q-pa-md" @click="editClaimNumberDialog = false">
                CANCEL
              </div>
              <div
                class="q-pa-md text-bold"
                @click="onClickChange(editDialogName)"
              >
                CHANGE
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import ClaimDetail from 'components/ClaimDetail';
import ClaimSummary from 'src/pages/ClaimSummary';
import UpdateLossInfo from 'src/pages/UpdateLossInfo';
import PersonalProperty from 'src/pages/PersonalProperty';
import ActivityLog from 'src/pages/ActivityLog';
import OtherDamageProperty from 'src/pages/OtherDamageProperty';
import CarrierAndPolicy from 'src/pages/InsurancePolicy';
import ClaimTask from 'src/pages/ClaimTasks';
import Settlements from 'src/pages/Settlements';
import ClaimPersonnel from 'src/pages/Personnel';
import MortgageAndLiens from 'src/pages/mortgage/MortgageAndLiens';
import ClaimExpertVendor from 'src/pages/ExpertVendor';
import ProofOfLoss from 'src/pages/ProofOfLoss';
import ClaimFiles from 'src/pages/ClaimFiles';
import ClaimNotes from 'src/pages/ClaimNotes';
import ClaimLedger from 'src/pages/ClaimLedger';

import ClaimEstimatingInfo from 'src/pages/EstimatorInfo';
import { onEmailClick } from '@utils/clickable';
import { successMessage } from '@utils/validation';
import { constants } from '@utils/constant';
import { getCurrentUser } from '@utils/auth';
export default {
  components: {
    ClaimDetail,
    ClaimSummary,
    UpdateLossInfo,
    PersonalProperty,
    OtherDamageProperty,
    ActivityLog,
    CarrierAndPolicy,
    ClaimTask,
    Settlements,
    ClaimPersonnel,
    MortgageAndLiens,
    ClaimExpertVendor,
    ClaimFiles,
    ProofOfLoss,
    ClaimNotes,
    ClaimLedger,
    ClaimEstimatingInfo
  },
  data() {
    return {
      flag: null,
      claimExpertVendor: '',
      editTask: '',
      addClaimNotes: '',
      addMortgageDialog: '',
      addPersonnel: '',
      addSettlement: '',
      claimSummaryDialog: '',
      carrierDialog: '',
      activityLogDialog: '',
      lossInfoDialog: '',
      estimatingInfo: false,
      claimLedgeInfo: false,
      notes: false,
      proofOfLoss: false,
      files: false,
      expertVendor: false,
      claimSummary: false,
      lossInfo: false,
      personalProperty: false,
      otherDamage: false,
      activityLog: false,
      insurancePolicy: false,
      claimTask: false,
      settlements: false,
      companyPersonnel: false,
      mortgageAndLiens: false,
      options: '',
      rating: 1,
      editClaimDetails: false,
      editClaimNumberDialog: false,
      editDialogName: '',
      editInputValue: '',
      notes: '',
      claimPhase: {
        value: '',
        machineValue: ''
      },
      ClaimDetails: [
        { name: 'Claim Summary' },
        { name: 'Loss Info' },
        { name: 'Property Details' },
        { name: 'Other Damage Details' },
        { name: 'Activity Log & Message Archive' },
        { name: 'Carrier & Policy' },
        { name: 'Tasks' },
        { name: 'Settlements' },
        { name: 'Company Personnel' },
        { name: 'Mortgages and Liens' },
        { name: 'Expert Vendor' },
        { name: 'Files' },
        { name: 'Proof Of Loss' },
        { name: 'Notes' },
        { name: 'Estimator Info' },
        { name: 'MatterPort' },
        { name: 'Time Tracking' },
        { name: 'Claim Ledger' }
      ],
      userRole: '',
      taskExpansion: false,
      summaryExpansion: false
    };
  },

  computed: {
    ...mapGetters([
      'selectedClaimId',
      'getSelectedClaim',
      'phases',
      'notificationRouteTo',
      'photoIdKey'
    ])
  },

  async created() {
    await this.getPhotoIdKeys();
    await this.getSingleClaimDetails(this.selectedClaimId);
    this.getAllConfigurationTableData({ name: 'claim_phases' });
    this.options = this.phases;
    this.userRole = getCurrentUser().attributes.roles[0].machineValue;
    if (this.notificationRouteTo == 'task') {
      this.taskExpansion = true;
      this.claimTask = true;
    } else if (this.notificationRouteTo == 'summary') {
      this.summaryExpansion = true;
      this.claimSummary = true;
    }
    this.setNotificationRouteTo('');
  },
  methods: {
    ...mapActions([
      'getAllConfigurationTableData',
      'getSingleClaimDetails',
      'editClaimNumber',
      'editClaimPhase',
      'getPhases',
      'generatePhotoIdAssignment',
      'getPhotoIdKeys'
    ]),
    ...mapMutations(['setNotificationRouteTo']),
    onEmailClick,
    onShowLossInfo() {
      this.lossInfo = true;
      document.getElementById('scroll-bottom').scrollTo(0, 300);
    },
    successMessage,
    async onManuallyPushAssignmentClick() {
      await this.generatePhotoIdAssignment(this.selectedClaimId);
      this.editClaimDetails = false;
      await this.getSingleClaimDetails(this.selectedClaimId);
    },
    async onTopMenuClick() {
      setTimeout(() => this.getSingleClaimDetails(this.selectedClaimId), 5000),
        (this.editClaimDetails = true);
    },
    scrollAfterCreation() {
      document.getElementById('scroll-bottom').scrollTo(0, 1552);
    },
    async scrollDown() {
      this.claimLedgeInfo = true;
    },
    addExpertVendor(value) {
      this.claimExpertVendor = value;
    },

    onAddNoteClick(value) {
      this.addClaimNotes = value;
    },
    onEditClaimSummary(value) {
      this.claimSummaryDialog = value;
    },
    onAddMortgage(value) {
      this.addMortgageDialog = value;
    },
    onAddPersonnelClick(value) {
      this.addPersonnel = value;
    },
    onAddSettlement(value) {
      this.addSettlement = value;
    },
    refreshFlag(value) {
      this.claimLedgeInfo = false;
    },
    onEditTask(value) {
      this.editTask = value;
    },
    onEditCarrier(value) {
      this.carrierDialog = value;
    },
    onEditAcitivtyLog(value) {
      this.activityLogDialog = value;
    },
    onEditLossInfo(value) {
      this.lossInfoDialog = value;
    },
    onClaimSummaryShow() {
      this.claimSummary = true;
    },
    searchFilterBy(val, update) {
      this.claimPhase.value = null;
      if (val === ' ') {
        update(() => {
          this.options = this.phases;
        });
        return;
      }

      update(() => {
        const search = val.toLowerCase();
        this.options = this.phases.filter(
          v => v.name.toLowerCase().indexOf(search) > -1
        );
      });
    },
    onClickUploadDocument() {
      this.$router.push('/document-upload');
    },
    setTypes(value) {
      const obj = this.phases.find(item => {
        return item.name === value;
      });

      this.claimPhase.machineValue = obj.machineValue;
    },

    async onClickChange(val) {
      const success = await this.$refs.claimEditForm.validate();

      if (success) {
        if (val == 'Claim Number') {
          const payload = {
            id: this.selectedClaimId,
            data: { number: this.editInputValue }
          };
          await this.editClaimNumber(payload);
          this.successMessage(constants.successMessages.CLAIM_EDITED);
        } else {
          const payload = {
            id: this.selectedClaimId,
            data: { phase: this.claimPhase, note: this.notes }
          };
          await this.editClaimPhase(payload);
          this.successMessage(constants.successMessages.CLAIM_PHASE_EDITED);
        }
        await this.getSingleClaimDetails(this.selectedClaimId);
        this.editClaimNumberDialog = false;
      } else {
      }
    },

    editClaimNumberDialogOnClick(value) {
      if (value == 'Claim Number') {
        this.editClaimNumberDialog = true;
        this.editClaimDetails = false;
        this.editDialogName = 'Claim Number';
      } else {
        this.editClaimNumberDialog = true;
        this.editClaimDetails = false;
        this.editDialogName = 'Claim Phase';
      }
    },
    onClickClaimItems(value) {
      switch (value) {
        case 'Claim Summary':
          this.$router.push('/claim-summary');
          break;
        case 'Loss Info':
          this.$router.push('/loss-info');
          break;
        case 'Property Details':
          this.$router.push('/personal-property');
          break;
        case 'Other Damage Details':
          this.$router.push('/other-damage');
          break;
        case 'Settlements':
          this.$router.push('/settlements');
          break;
        case 'Tasks':
          this.$router.push(`/claim-tasks/${this.selectedClaimId}`);
          break;
        case 'Demands And Offers':
          break;
        case 'Activity Log & Message Archive':
          this.$router.push('/activity-log');
          break;
        case 'Company Personnel':
          this.$router.push('/company-personnel');
          break;
        case 'Carrier & Policy':
          this.$router.push(`/insurance-policy/${this.selectedClaimId}`);
          break;
        case 'Mortgages and Liens':
          this.$router.push(`/mortgage-liens/${this.selectedClaimId}`);
          break;
        case 'Expert Vendor':
          this.$router.push(`/expert-vendor/${this.selectedClaimId}`);
          break;

        case 'Estimator Info': {
          this.$router.push(`/estimator-info/${this.selectedClaimId}`);
          break;
        }
        case 'Files':
          this.$router.push({
            path: `/claim-files/${this.selectedClaimId}`
          });
          break;
        case 'Proof Of Loss':
          this.$router.push({ path: `/proof-of-loss/${this.selectedClaimId}` });
          break;
        case 'Notes':
          this.$router.push('/claim-notes');
          break;
        case 'MatterPort':
          break;
        case 'Time Tracking':
          break;
        case 'Claim Ledger':
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
</style>
