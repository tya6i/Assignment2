<template>
  <q-page>
    <q-icon
      class="q-mr-sm add-icon"
      @click="menuItemDialog = true"
      name="more_vert"
      color="white"
      size="sm"
      v-if="userRole == 'estimator' || userRole == 'vendor'"
    />

    <div
      :class="{
        'mobile-container-page': userRole == 'estimator' || userRole == 'vendor'
      }"
    >
      <div class="row q-ml-lg">
        <div v-if="userRole == 'estimator' || userRole == 'vendor'">
          <ClaimDetail />
        </div>
      </div>

      <q-separator
        v-if="userRole == 'estimator' || userRole == 'vendor'"
        class="q-mt-sm q-mb-sm"
      />
      <div
        :class="{ 'q-ml-lg': userRole == 'estimator' || userRole == 'vendor' }"
      >
        <div class="form-heading row">
          Claim Summary
          <q-icon
            v-if="userRole != 'estimator' && userRole != 'vendor'"
            class="q-ml-auto"
            name="edit"
            size="xs"
            color="primary"
            @click="onEditClaimSummary"
          />
        </div>
        <div class="q-mt-md row">
          <div class="heading-light q-mt-none col-xs-4">File Number</div>
          <div class="column q-ml-lg">
            {{
              getSelectedClaim.fileNumber ? getSelectedClaim.fileNumber : '-'
            }}
          </div>
        </div>

        <div class="q-mt-md row">
          <div class="heading-light q-mt-none col-xs-4">Claim Number</div>
          <div class="column q-ml-lg">
            {{ getSelectedClaim.number ? getSelectedClaim.number : '-' }}
          </div>
        </div>

        <div class="q-mt-md row">
          <div class="heading-light q-mt-none col-xs-4">Claim Reason</div>
          <div class="column q-ml-lg" v-if="getSelectedClaim.lossInfo">
            {{
              getSelectedClaim.lossInfo.claimReason
                ? getSelectedClaim.lossInfo.claimReason.value
                : '-'
            }}
          </div>
        </div>
        <div class="q-mt-md row" v-if="userRole != 'vendor'">
          <div class="heading-light q-mt-none col-xs-4">Claim Fees</div>
          <div class="column q-ml-lg" v-if="getSelectedClaim.contractInfo">
            <div
              class="col"
              v-if="getSelectedClaim.contractInfo.fees.type == 'dollar'"
            >
              {{
                getSelectedClaim.contractInfo.fees.rate
                  ? '$' + ' ' + getSelectedClaim.contractInfo.fees.rate
                  : '-'
              }}
            </div>
            <div
              class="col"
              v-else-if="getSelectedClaim.contractInfo.fees.type == 'update'"
            >
              {{
                getSelectedClaim.contractInfo.fees.rate
                  ? getSelectedClaim.contractInfo.fees.rate + ' /hour'
                  : '-'
              }}
            </div>
            <div class="col" v-else>
              {{
                getSelectedClaim.contractInfo.fees.rate
                  ? getSelectedClaim.contractInfo.fees.rate + ' %'
                  : '-'
              }}
            </div>
          </div>
        </div>

        <div class="q-mt-md row" v-if="userRole != 'vendor'">
          <div class="heading-light q-mt-none col-xs-4">Date of Contract</div>
          <div class="column q-ml-lg" v-if="getSelectedClaim.contractInfo">
            {{ dateToShow(getSelectedClaim.contractInfo.date) }}
          </div>
          <div v-else class="q-ml-md">MM/DD/YYYY</div>
        </div>
        <div class="q-mt-md row" v-if="userRole != 'vendor'">
          <div class="heading-light q-mt-none col-xs-4">Date of Notified</div>
          <div class="column q-ml-lg" v-if="getSelectedClaim.created">
            {{ dateToShow(getSelectedClaim.created) }}
          </div>
          <div v-else class="q-ml-md">MM/DD/YYYY</div>
        </div>
        <div class="q-mt-md row" v-if="userRole != 'vendor'">
          <div class="heading-light q-mt-none col-xs-4">Open Since</div>
          <div class="column q-ml-lg">
            {{ getSelectedClaim.sinceOpen ? getSelectedClaim.sinceOpen : '-' }}
          </div>
        </div>
        <div class="q-mt-md row" v-if="userRole != 'vendor'">
          <div class="heading-light q-mt-none col-xs-4">Loss Since</div>
          <div class="column q-ml-lg">
            {{ getSelectedClaim.sinceLoss ? getSelectedClaim.sinceLoss : '-' }}
          </div>
        </div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />

      <div v-if="userRole != 'vendor'">
        <div
          :class="{
            'q-ml-lg': userRole == 'estimator' || userRole == 'vendor'
          }"
        ></div>
        <q-separator class="q-mt-sm q-mb-sm" />
      </div>

      <div v-if="userRole != 'vendor'">
        <div :class="{ 'q-ml-lg': userRole == 'estimator' }">
          <div class="row justify-between">
            <div class="form-heading q-mt-xs">Loss Details</div>
            <div>
              <q-icon
                name="create"
                color="primary"
                class="col"
                size="xs"
                v-if="userRole != 'estimator' && userRole != 'vendor'"
                @click="onEditLossDetails()"
              ></q-icon>
            </div>
          </div>

          <div class="" v-if="getSelectedClaim.lossInfo">
            <div class="q-mt-md row">
              <div class="heading-light q-mt-none col-xs-4">
                Date & Time of Loss
              </div>
              <div class="column q-ml-lg">
                {{ dateToShow(getSelectedClaim.lossInfo.date) }}
              </div>
            </div>

            <div class="q-mt-md row">
              <div class="heading-light q-mt-none col-xs-4">
                Estimated Loss Amount
              </div>
              <div class="column q-ml-lg">
                {{
                  getSelectedClaim.lossInfo.estimatedLossAmt
                    ? '$' + ' ' + getSelectedClaim.lossInfo.estimatedLossAmt
                    : '-'
                }}
              </div>
            </div>

            <div class="row q-mt-sm">
              <span class="heading-light col-4">
                Property Value at Time of Loss
              </span>
              <span class="q-ml-lg col" v-if="getSelectedClaim.lossInfo">
                {{
                  getSelectedClaim.lossInfo.propertyValue
                    ? '$' + ' ' + getSelectedClaim.lossInfo.propertyValue
                    : '-'
                }}
              </span>
            </div>

            <div class="row q-mt-sm">
              <span class="heading-light col-4"> Loss Description </span>
              <span class="q-ml-lg col" v-if="getSelectedClaim.lossInfo">
                {{
                  getSelectedClaim.lossInfo.desc
                    ? getSelectedClaim.lossInfo.desc
                    : '-'
                }}
              </span>
            </div>
          </div>
        </div>
        <q-separator class="q-mt-sm q-mb-sm" />
      </div>
      <div v-if="userRole != 'vendor'">
        <div
          :class="{
            'q-ml-lg': userRole == 'estimator' || userRole == 'vendor'
          }"
        >
          <div v-for="(phase, index) in getSelectedClaim.phases" :key="index">
            <div class="row justify-between">
              <div class="q-mt-sm form-heading">Claim Timeline</div>
              <q-icon
                v-if="userRole != 'estimator'"
                name="create"
                color="primary"
                class="q-mr-xs"
                size="xs"
                @click="onClickEditClaimTimeline(index)"
              ></q-icon>
            </div>

            <div>
              <div class="row">
                <div class="col-2">
                  <q-avatar
                    class="q-ma-sm"
                    size="50px"
                    style="background-color: #eca74c"
                    font-size="14px"
                    text-color="white"
                  >
                    <span>
                      {{
                        getSelectedClaim.phases[index].created
                          ? getSelectedClaim.phases[index].created
                          : '-' | moment('D MMM')
                      }}</span
                    >
                  </q-avatar>
                </div>
                <div class="col row q-ml-lg q-mt-sm">
                  <div class="col-10">
                    <span class="text-bold">
                      {{
                        getSelectedClaim.phases[index].value
                          ? getSelectedClaim.phases[index].value
                          : '-'
                      }}</span
                    >
                  </div>
                  <div class="q-mb-xl heading-light">
                    Phase changed to
                    {{
                      getSelectedClaim.phases[index].value
                        ? getSelectedClaim.phases[index].value
                        : '-'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Claim Summary -->
    <q-dialog
      v-model="claimSummary"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          @closeDialog="
            (claimSummary = false), $emit('claimSummaryDialog', false)
          "
          :dialogName="'Edit Claim Summary'"
        />
        <div class="q-ma-sm mobile-container-page">
          <q-card class="q-mx-sm q-pa-sm q-pt-sm">
            <div class="q-px-sm">
              <q-input
                class="full-width q-mt-md input-style input-overlay"
                v-model="fileNumber"
                borderless
                label="File Number"
              />

              <!-- <q-input
                class="q-py-sm"
                v-model.number="contractInfo.fees.rate"
                label="Claim Fee(%)"
              /> -->
              <div class="row q-mt-sm">
                <q-btn-toggle
                  v-model="contractInfo.fees.type"
                  push
                  glossy
                  toggle-color="primary"
                  :options="[
                    { label: '$', value: 'dollar' },
                    { label: '%', value: 'percentage' },
                    { value: 'update', icon: 'update' }
                  ]"
                />
              </div>
              <div class="row" style="align-items: center">
                <q-input
                  class="full-width input-style"
                  borderless
                  mask="#.#"
                  type="number"
                  v-model.number="contractInfo.fees.rate"
                  label="Claim Fee Rate"
                  label-color="primary"
                  style="width: 50%"
                  ><template
                    v-slot:prepend
                    v-if="contractInfo.fees.type == 'dollar'"
                  >
                    <q-icon name="$" color="primary" class="q-mb-sm"></q-icon>
                  </template>

                  <template
                    v-slot:append
                    v-else-if="contractInfo.fees.type == 'percentage'"
                  >
                    <q-icon name="%" color="primary"></q-icon>
                  </template>
                  <template v-slot:append v-else>
                    <span class="form-heading text-primary">/hour</span>
                  </template></q-input
                >
              </div>
              <q-input
                class="input-style"
                v-model="policyInfo.carrierNotifyDate"
                label="Date Notified"
                borderless
                disable
              />

              <q-select
                class="input-style full-width"
                behavior="menu"
                borderless
                v-model="lossInfo.reasonClaim.value"
                option-value="name"
                option-label="name"
                map-options
                use-input
                input-debounce="0"
                emit-value
                :options="claimReasonOptions"
                @input="setClaimReasons(claimReasons, lossInfo.reasonClaim)"
                @filter="searchFilterBy"
                label="Reason for Claim"
              />
            </div>
          </q-card>
          <q-card class="q-pa-sm q-mt-md q-mx-sm">
            <div class="q-px-sm">
              <q-input
                class="input-style full-width"
                borderless
                v-model="policyInfo.dateOfFirstContact"
                label="Date of First Contact"
                disable
              />
            </div>
          </q-card>
        </div>
        <div class="row justify-center">
          <q-btn
            label="Save"
            class="single-next-button-style"
            @click="onSaveButtonClick('claimSummary')"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Loss Detail dialog -->
    <q-dialog
      v-model="lossDetailsBox"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          @closeDialog="
            (lossDetailsBox = false), $emit('claimSummaryDialog', false)
          "
          :dialogName="'Edit Loss Details'"
        />
        <div class="q-ma-sm mobile-container-page">
          <q-card class="q-mx-sm">
            <div class="q-pa-md">
              <q-input
                v-if="userRole != 'estimator' && userRole != 'vendor'"
                borderless
                dense
                class="input-style input-overlay"
                v-model="lossInfo.dateOfLoss"
                mask="##/##/####"
                label="MM/DD/YYYY"
                :rules="[val => dateLiesBetween(val)]"
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    size="sm"
                    color="primary"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      ref="qDateProxy2"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="lossInfo.dateOfLoss"
                        @input="() => $refs.qDateProxy2.hide()"
                        mask="MM/DD/YYYY"
                        :options="lossDateOption"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                v-if="userRole != 'estimator' && userRole != 'vendor'"
                dense
                v-model="lossInfo.cause.id"
                behavior="menu"
                class="required q-py-md input-style input-overlay"
                option-value="id"
                borderless
                option-label="name"
                map-options
                options-dense
                emit-value
                :options="lossCauses"
                @input="setTypes(lossInfo.cause.id)"
                label="Loss Cause"
                :rules="[
                  val =>
                    (val && val.length > 0) ||
                    'Please select the reason for claim'
                ]"
              />
              <div class="row" style="align-items: center">
                <span class="form-heading">Estimated Loss Amount</span>
                <q-input
                  mask="#.#"
                  type="number"
                  v-model.number="lossInfo.estimatedLossAmt"
                  placeholder="Estimated Loss Amount"
                  style="margin-left: auto; width: 50%"
                  prefix="$"
                  class="input-extra-padding input-style input-overlay"
                  borderless
                />
              </div>
              <div class="row" style="align-items: center">
                <span class="form-heading">Property Loss Amount</span>
                <q-input
                  mask="#.#"
                  type="number"
                  v-model.number="lossInfo.propertyValue"
                  placeholder="Property Loss Amount"
                  style="margin-left: auto; width: 50%"
                  prefix="$"
                  class="input-extra-padding input-style input-overlay"
                  borderless
                />
              </div>
              <span class="form-heading">Loss Description </span>
              <q-input
                rows="5"
                required
                type="textarea"
                borderless
                class="full-width input-extra-padding input-style input-overlay"
                v-model="lossInfo.desc"
                style="resize: none"
              />
              <div
                class="row q-mt-sm"
                v-if="userRole != 'estimator' && userRole != 'vendor'"
              >
                <div>FEMA Claim</div>
                <q-toggle class="q-ml-auto" v-model="isFemaClaim" />
              </div>
              <div
                class="row"
                v-if="userRole != 'estimator' && userRole != 'vendor'"
              >
                <div>Property is not habitable</div>
                <q-toggle class="q-ml-auto" v-model="isHabitable" />
              </div>
            </div>
          </q-card>
        </div>
        <div class="row justify-center">
          <q-btn
            label="Save"
            class="single-next-button-style"
            @click="onSaveButtonClick('lossDetailsBox')"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- Timeline Dialog -->
    <q-dialog
      v-model="editClaimTimeline"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          @closeDialog="
            (editClaimTimeline = false), $emit('claimSummaryDialog', false)
          "
          :dialogName="'Edit Claim Timeline'"
        />
        <div class="q-ma-sm mobile-container-page">
          <q-card class="q-mx-sm">
            <div class="q-px-md">
              <div class="row">
                <div class="q-mt-md heading-light">Phase</div>
                <div class="q-pa-md text-bold">{{ claimPhase.value }}</div>
              </div>

              <q-input
                class="q-px-md q-py-sm input-style input-overlay"
                borderless
                v-model="claimPhase.created"
                mask="##/##/####"
                label="Date"
              >
                <template v-slot:append>
                  <q-icon
                    name="event"
                    size="sm"
                    color="primary"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      ref="qDateProxy2"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="claimPhase.created"
                        @input="() => $refs.qDateProxy2.hide()"
                        mask="MM/DD/YYYY"
                        :options="lossDateOption"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <div class="q-mt-md">Notes</div>
              <div class="q-pb-md">
                <q-input
                  type="textarea"
                  rows="6"
                  required
                  class="input-style input-overlay"
                  borderless
                  v-model="claimPhase.notes"
                  style="resize: none"
                />
              </div>
            </div>
          </q-card>
        </div>
        <div class="row justify-center">
          <q-btn
            label="Save"
            class="single-next-button-style"
            @click="onSaveButtonClick('editClaimTimeline')"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- Claim Summary Menu Item -->
    <q-dialog
      v-model="menuItemDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      :position="'bottom'"
    >
      <q-card style="width: 350px">
        <q-card-section class="items-center">
          <div
            v-if="userRole == 'estimator'"
            class="q-pa-md heading-light"
            @click="onClickUploadDocument('estimate')"
          >
            Upload Estimate Documents
          </div>
          <div
            v-if="userRole == 'vendor'"
            class="q-pa-md heading-light"
            @click="onClickUploadDocument('vendor')"
          >
            Upload Vendor Documents
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CustomBar from 'components/CustomBar';
import ClaimDetail from 'components/ClaimDetail';
import moment from 'moment';
import { validateDate } from '@utils/validation';
import { date } from 'quasar';
import { dateToShow, dateToSend } from '@utils/date';
import { getCurrentUser } from '@utils/auth';
export default {
  name: 'ClaimSummary',
  components: { CustomBar, ClaimDetail },
  data() {
    return {
      estimatorDocument: '',
      vendorDocument: '',
      policyDate: {
        policyEffectiveDate: '',
        policyExpireDate: ''
      },
      menuItemDialog: false,
      claimReasonOptions: [],
      phase: '',
      rating: 1,

      editClaimTimeline: false,
      claimSummary: false,
      lossDetailsBox: false,
      isFemaClaim: false,
      isHabitable: false,

      claimPhase: {
        value: '',
        created: '',
        notes: ''
      },

      lossInfo: {
        dateOfLoss: '',
        desc: '',
        reason: {
          id: '',
          machineValue: '',
          value: ''
        },
        reasonClaim: {
          id: '',
          value: '',
          machineValue: ''
        },
        cause: {
          id: '',
          value: '',
          machineValue: ''
        },
        estimatedLossAmt: '',
        propertyValue: ''
      },
      contractInfo: {
        fees: {
          rate: '',
          type: ''
        }
      },
      fileNumber: '',
      policyInfo: {
        sourceOfClaim: '',
        contractDetails: '',
        dateOfFirstContact: '',
        timeOfFirstContact: '',
        carrierNotifyDate: '',
        number: '',
        isClaimFiled: true,
        isForcedPlaced: true,
        priorPayment: 1234.09,
        limitReason: 'reason for limits or denial',
        effectiveDate: '2020-09-24T11:18:06Z',
        expirationDate: '2020-09-24T11:18:06Z'
      }
    };
  },

  computed: {
    ...mapGetters([
      'getSelectedClaim',
      'setClientProperty',
      'selectedClaimId',
      'lossCauses',
      'claimReasons',
      'pageAccess'
    ]),
    formatDate(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY');
      }
    }
  },

  async created() {
    this.getAccess();
    this.pageAccess.find(obj => {
      if (obj == 'esti_docs' || obj == 'vendor_docs') {
        this.estimatorDocument = obj;
        this.vendorDocument = obj;
      }
    });
    this.userRole = getCurrentUser().attributes.roles[0].machineValue;
    this.fileNumber = this.getSelectedClaim.fileNumber;

    this.policyInfo.carrierNotifyDate =
      this.getSelectedClaim.lossInfo && this.getSelectedClaim.created
        ? dateToShow(this.getSelectedClaim.created)
        : '-';

    await this.getSingleClaimDetails(this.selectedClaimId).then(() => {
      this.policyDate.policyEffectiveDate =
        this.getSelectedClaim.lossInfo &&
        this.getSelectedClaim.policyInfo.effectiveDate
          ? dateToShow(this.getSelectedClaim.lossInfo)
          : '-';
      this.policyDate.policyExpireDate =
        this.getSelectedClaim.lossInfo &&
        this.getSelectedClaim.policyInfo.expirationDate
          ? this.getSelectedClaim.policyInfo.expirationDate
          : '-';
    });
  },
  methods: {
    ...mapActions([
      'getSingleClaimDetails',
      'getAllConfigurationTableData',
      'editClaimInfo',
      'updateClaimTimeline',
      'getAccess'
    ]),
    dateToShow,
    validateDate,
    onEditLossDetails() {
      this.lossDetailsBox = true;
      this.getAllConfigurationTableData({ name: 'loss_causes' });
      this.$emit('claimSummaryDialog', true);
      if (this.getSelectedClaim.lossInfo) {
        this.isHabitable = this.getSelectedClaim.lossInfo.isHabitable
          ? this.getSelectedClaim.lossInfo.isHabitable
          : false;
        this.isFemaClaim = this.getSelectedClaim.lossInfo.isFEMA
          ? this.getSelectedClaim.lossInfo.isFEMA
          : false;
        this.lossInfo.desc = this.getSelectedClaim.lossInfo.desc
          ? this.getSelectedClaim.lossInfo.desc
          : '';
        this.lossInfo.estimatedLossAmt = this.getSelectedClaim.lossInfo
          .estimatedLossAmt
          ? this.getSelectedClaim.lossInfo.estimatedLossAmt
          : null;
        this.lossInfo.propertyValue = this.getSelectedClaim.lossInfo
          .propertyValue
          ? this.getSelectedClaim.lossInfo.propertyValue
          : null;
        if (this.getSelectedClaim.lossInfo.cause) {
          this.lossInfo.cause.id = this.getSelectedClaim.lossInfo.cause.id;
          this.lossInfo.cause.value =
            this.getSelectedClaim.lossInfo.cause.value;
          this.lossInfo.cause.machineValue =
            this.getSelectedClaim.lossInfo.cause.machineValue;
        }
        if (this.getSelectedClaim.lossInfo.date) {
          this.lossInfo.dateOfLoss = dateToShow(
            this.getSelectedClaim.lossInfo.date
          );
        }
      }
    },

    onClickEditClaimTimeline(index) {
      this.claimPhase.notes = this.getSelectedClaim.phases[index].value;
      this.claimPhase.created = dateToShow(
        this.getSelectedClaim.phases[index].created
      );
      this.phase = this.getSelectedClaim.phases[index].value;
      this.$emit('claimSummaryDialog', true);
      this.editClaimTimeline = true;
    },
    dateLiesBetween(val) {
      if (validateDate(val)) {
        if (Date.parse(val) < Date.parse(this.policyDate.policyEffectiveDate)) {
          return 'Date is before policy effective date';
        } else if (
          Date.parse(val) > Date.parse(this.policyDate.policyExpireDate)
        ) {
          return 'Date is after policy expiry date';
        } else {
          return true;
        }
      } else {
        return 'Invalid date';
      }
    },
    onEditClaimSummary() {
      this.getAllConfigurationTableData({ name: 'claim_reasons' });
      this.getAllConfigurationTableData({ name: 'loss_causes' });
      this.claimSummary = true;
      this.$emit('claimSummaryDialog', true);
      if (this.getSelectedClaim.lossInfo.claimReason) {
        this.lossInfo.reasonClaim.id =
          this.getSelectedClaim.lossInfo.claimReason.id;
        this.lossInfo.reasonClaim.value =
          this.getSelectedClaim.lossInfo.claimReason.value;
        this.lossInfo.reasonClaim.machineValue =
          this.getSelectedClaim.lossInfo.claimReason.machineValue;
      }

      this.policyInfo.dateOfFirstContact = dateToShow(
        this.getSelectedClaim.contractInfo.dateOfFirstContact
      );
      if (
        this.getSelectedClaim.contractInfo.fees &&
        this.getSelectedClaim.contractInfo.fees.rate
      ) {
        this.contractInfo.fees.rate =
          this.getSelectedClaim.contractInfo.fees.rate;
      }

      this.contractInfo.fees.type =
        this.getSelectedClaim.contractInfo.fees &&
        this.getSelectedClaim.contractInfo.fees.type
          ? this.getSelectedClaim.contractInfo.fees.type
          : '';
    },
    searchFilterBy(val, update) {
      this.lossInfo.reasonClaim.id = null;
      if (val === ' ') {
        update(() => {
          this.claimReasonOptions = this.claimReasons;
        });
        return;
      }

      update(() => {
        const search = val.toLowerCase();
        this.claimReasonOptions = this.claimReasons.filter(
          v => v.name.toLowerCase().indexOf(search) > -1
        );
      });
    },
    setTypes(types, data) {
      const obj = types.find(item => {
        return item.id === data.id;
      });

      data.machineValue = obj.machineValue;
      data.value = obj.name;
    },
    setClaimReasons(types, data) {
      const obj = types.find(item => {
        return item.value === data.name;
      });

      data.machineValue = obj.machineValue;
      data.id = obj.name;
    },

    async onSaveButtonClick(value) {
      if (value == 'claimSummary') {
        let payload = {
          id: this.selectedClaimId,
          data: {
            fileNumber: this.fileNumber,
            contractInfo: this.contractInfo,
            policyInfo: this.policyInfo,
            lossInfo: {
              claimReason: {
                id: this.lossInfo.reasonClaim.id,
                value: this.lossInfo.reasonClaim.value,
                machineValue: this.lossInfo.reasonClaim.machineValue
              }
            }
          }
        };
        await this.editClaimInfo(payload);
      } else if (value == 'editClaimTimeline') {
        let payload = {
          id: this.selectedClaimId,
          phase: this.phase,
          data: {
            phase: {
              note: this.claimPhase.notes,
              created: dateToSend(this.claimPhase.created)
            }
          }
        };
        await this.updateClaimTimeline(payload);
        await this.getSingleClaimDetails(this.selectedClaimId);
        this.editClaimTimeline = false;
      } else {
        let payload = {
          id: this.selectedClaimId,
          data: { lossInfo: this.lossInfo }
        };
        if (!this.lossInfo.estimatedLossAmt && !this.lossInfo.propertyValue) {
          delete payload.data.lossInfo.estimatedLossAmt;
          delete payload.data.lossInfo.propertyValue;
        }
        await this.editClaimInfo(payload);
      }
      await this.getSingleClaimDetails(this.selectedClaimId);
      this[value] = false;
      this.$emit('claimSummaryDialog', false);
    },
    lossDateOption(dateopn) {
      if (
        date.formatDate(Date.now(), 'YYYY/MM/DD') <
        date.formatDate(this.policyDate.policyExpireDate, 'YYYY/MM/DD')
      ) {
        return (
          dateopn >=
            date.formatDate(
              this.policyDate.policyEffectiveDate,
              'YYYY/MM/DD'
            ) && dateopn <= date.formatDate(Date.now(), 'YYYY/MM/DD')
        );
      } else {
        return (
          dateopn >=
            date.formatDate(
              this.policyDate.policyEffectiveDate,
              'YYYY/MM/DD'
            ) &&
          dateopn <=
            date.formatDate(this.policyDate.policyExpireDate, 'YYYY/MM/DD')
        );
      }
    },
    setTypes(data) {
      const obj = this.lossCauses.find(item => {
        return item.id === data;
      });
      this.lossInfo.cause.id = obj.id;
      this.lossInfo.cause.machineValue = obj.machineValue;
      this.lossInfo.cause.value = obj.name;
    },
    onClickUploadDocument(value) {
      if (value == 'estimate') {
        this.$router.push('/document-upload');
      } else {
        this.$router.push('/vendor-document');
      }
    }
  }
};
</script>
