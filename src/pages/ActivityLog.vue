<template>
  <div>
    <div>
      <div v-if="log">
        <!-- This is for showing the Property details  -->
        <q-card
          class="q-pa-md q-mt-sm"
          v-for="(logItem, index) in log"
          :key="logItem.name"
        >
          <div class="row q-my-sm">
            <div class="col-10 heading-light">
              {{ dateWithTime(logItem.created) }}
            </div>
            <q-icon
              size="xs"
              name="create"
              color="primary"
              class="col q-pt-xs"
              @click="onClickEdit(index)"
            ></q-icon>
            <q-icon
              class="q-ml-sm"
              name="delete"
              size="sm"
              color="primary"
              :style="logItem.isSystemGen == true ? 'visibility:hidden;' : ''"
              @click="onClickDelete(index)"
            />
          </div>
          <div>{{ logItem.title }}</div>

          <p class="heading-light q-my-sm text-caption" v-if="logItem.detail">
            {{ logItem.detail ? logItem.detail : '-' }}
          </p>
          <p class="heading-light q-my-sm text-caption" v-if="logItem.note">
            {{ logItem.note ? logItem.note : '-' }}
          </p>
          <div class="heading-light q-my-sm">
            Entered by {{ logItem.user.name }}
          </div>
        </q-card>
      </div>
      <div v-else class="q-ma-xl heading-light text-italic">
        There is No activity Log present at this Moment
      </div>
      <div class="row" v-if="log">
        <div class="q-ml-auto q-mt-sm">
          <q-btn
            @click="(addLogDialog = true), $emit('ActivityLogDialog', true)"
            label="Add Log"
            color="primary"
          ></q-btn>
        </div>
      </div>
    </div>

    <!-- This Dialog Box is for adding a new log  -->
    <q-dialog
      v-model="addLogDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          @closeDialog="onClosingaddLogDialog"
          :dialogName="'Add New Log'"
        />

        <div class="mobile-container-page-without-search">
          <q-form ref="activityLogForm" class="form-height">
            <q-input
              v-model="title"
              class="full-width required input-style input-overlay"
              label="Title"
              dense
              borderless
              :rules="[
                val => (val && val.length > 0) || 'Please fill the title    '
              ]"
            />
            <q-input
              v-model="details"
              class="full-width input-style input-overlay"
              borderless
              label="Details"
            /><br />
            <span class="form-heading q-ml-xs">Notes</span>
            <div class="floating-label">
              <q-input
                type="textarea"
                rows="5"
                borderless
                class="full-width input-style input-overlay"
                v-model="notes"
                style="resize: none"
              />
            </div>
          </q-form>
          <div class="row justify-center">
            <q-btn
              label="Save"
              class="single-next-button-style"
              @click="onSaveButtonClick"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
    <!-- This Dialog Box is for editing a new log -->
    <q-dialog
      v-model="editLogDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          @closeDialog="
            (editLogDialog = false), $emit('ActivityLogDialog', false)
          "
          :dialogName="'Edit Log'"
        />

        <div class="mobile-container-page-without-search q-pa-sm">
          <q-form ref="activityEditLogForm" class="form-height">
            <div v-if="isFieldDisable == false">
              <q-input
                v-model="edit.title"
                class="full-width required"
                label="Title"
                :disable="isFieldDisable"
                :rules="[
                  val => (val && val.length > 0) || 'Please fill the title    '
                ]"
              />
            </div>
            <div v-else>
              <div class="heading-light">
                {{ dateWithTime(date) }}
              </div>
              <div class="q-mt-sm">{{ edit.title }}</div>
              <div class="heading-light q-mt-sm">Entered By {{ name }}</div>
            </div>
            <q-input
              v-if="isFieldDisable == false"
              v-model="edit.details"
              class="full-width"
              label="Details"
              :disable="isFieldDisable"
            /><br />
            <span class="heading-light q-pt-sm"> Additional Notes</span>
            <div class="floating-label q-pa-sm">
              <q-input
                rows="5"
                type="textarea"
                class="input-style input-overlay"
                borderless
                v-model="edit.notes"
                style="resize: none"
              />
            </div>
          </q-form>
          <div class="row justify-center">
            <q-btn
              label="Save"
              class="single-next-button-style"
              @click="onEditSaveButtonClick"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteAlertDialog">
      <q-card>
        <DeleteAlert
          @close="deleteAlertDialog = false"
          @onDelete="onDeleteLog"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import CustomBar from 'components/CustomBar';
import moment from 'moment';
import DeleteAlert from 'components/DeleteAlert';
import { successMessage } from '@utils/validation';
import { constants } from '@utils/constant';
import { dateWithTime } from '@utils/date';
import ClaimDetail from 'components/ClaimDetail';
export default {
  name: 'ActivityLog',
  components: { CustomBar, ClaimDetail, DeleteAlert },
  data() {
    return {
      valueIndex: '',
      deleteAlertDialog: false,
      name: '',
      date: '',
      isFieldDisable: true,
      title: '',
      details: '',
      addLogDialog: false,
      editLogDialog: false,
      edit: {
        title: '',
        details: '',
        notes: ''
      },

      logId: '',
      notes: ''
    };
  },

  async created() {
    if (this.selectedClaimId) {
      await this.getLog(this.selectedClaimId);
    } else {
      this.$router.push('/clients');
    }
  },

  computed: {
    ...mapGetters(['selectedClaimId', 'log']),

    formatDate(value) {
      if (value) {
        return moment(String(value)).format('MM/DD/YYYY');
      }
    }
  },
  methods: {
    ...mapActions([
      'getSingleClaimDetails',
      'getLog',
      'addLog',
      'editLog',
      'deleteActivityLogt'
    ]),
    ...mapMutations(['setSelectedClaimId', 'setLog']),
    // Edit Function
    onClickEdit(index) {
      this.date = this.log[index].created;
      this.name = this.log[index].user.name;
      this.edit.title = this.log[index].title;
      this.edit.title = this.log[index].title;
      this.edit.details = this.log[index].detail;

      this.edit.notes = this.log[index].note;
      this.editLogDialog = true;
      this.$emit('ActivityLogDialog', true);
      this.logId = this.log[index].id;

      if (this.log[index].isSystemGen == true) {
        this.isFieldDisable = true;
      } else {
        this.isFieldDisable = false;
      }
    },
    onClickDelete(index) {
      this.deleteAlertDialog = true;
      this.valueIndex = index;
    },
    async onDeleteLog() {
      const payload = {
        claimID: this.selectedClaimId,
        logId: this.log[this.valueIndex].id
      };
      await this.deleteActivityLogt(payload);
      this.getLog(this.selectedClaimId);
    },
    dateWithTime,
    //  Save Function
    async onSaveButtonClick() {
      let success = true;
      success = await this.$refs.activityLogForm.validate();
      if (success) {
        const payload = {
          id: this.selectedClaimId,
          data: {
            title: this.title,
            detail: this.details,
            note: this.notes
          }
        };
        await this.addLog(payload);
        this.successMessage(constants.successMessages.LOGS);
        this.getLog(this.selectedClaimId);

        this.onClosingaddLogDialog();
      }
    },
    //Function when we update the details
    async onEditSaveButtonClick() {
      let success = true;
      success = await this.$refs.activityEditLogForm.validate();
      if (success) {
        const payload = {
          id: this.selectedClaimId,
          logUserId: this.logId,
          data: {
            title: this.edit.title,
            detail: this.edit.details,
            note: this.edit.notes
          }
        };

        await this.editLog(payload);
        this.editLogDialog = false;
        await this.getLog(this.selectedClaimId);
      }
    },
    successMessage,

    onClosingaddLogDialog() {
      this.addLogDialog = false;
      this.title = '';
      this.details = '';
      this.notes = '';
      this.$emit('ActivityLogDialog', false);
    }
  }
};
</script>

<style lang="scss">
.form-height {
  height: calc(100vh - 145px);
  overflow: auto;
  margin: 10px;
}
.actions-div {
  display: flex;
  border-bottom: 1px solid #0000001f;
  align-items: center;
}
</style>
