<template>
  <!-- mobile-container-page listing-height -->
  <div>
    <q-page
      class="q-pt-lg bg-white"
      style="border-radius: 0 0 40px 40px"
      padding
    >
      <div
        class="column justify-around cardHeight"
        style="border-radius: 0 0 40px 40px"
      >
        <div class="row col-4 justify-around dashboard-row">
          <div
            class="column col iconBackground items-center"
            @click="onClickNewLead"
            style=""
          >
            <q-icon class="col self-center gridIcon">
              <q-img src="~assets/leads.svg" height="80px" contain />
            </q-icon>

            <div
              class="
                column
                justify-end
                text-white text-center text-weight-medium text-subtitle1
                IconText
              "
            >
              LEADS
            </div>
          </div>

          <div
            class="column col iconBackground items-center"
            @click="$router.push('/clients')"
          >
            <q-icon class="col self-center gridIcon">
              <q-img
                src="~assets/clients_dashboard.svg"
                height="80px"
                contain
              />
            </q-icon>

            <div
              class="
                column
                justify-end
                text-white text-center text-weight-medium text-subtitle1
                IconText
              "
            >
              CLIENTS
            </div>
          </div>
        </div>
        <div class="row col-4 justify-around dashboard-row">
          <div
            class="column col iconBackground items-center"
            @click="$router.push('/vendors')"
          >
            <q-icon class="col self-center gridIcon">
              <q-img src="~assets/vendor.svg" height="80px" contain />
            </q-icon>

            <div
              class="
                column
                justify-end
                text-white text-center text-weight-medium text-subtitle1
                IconText
              "
            >
              VENDORS
            </div>
          </div>

          <div
            class="column col iconBackground items-center"
            @click="$router.push('/claims')"
          >
            <q-icon class="col self-center gridIcon">
              <q-img src="~assets/claims.svg" height="80px" contain />
            </q-icon>

            <div
              class="
                column
                justify-end
                text-white text-center text-weight-medium text-subtitle1
                IconText
              "
            >
              CLAIMS
            </div>
          </div>
        </div>
        <div class="row col-4 justify-around dashboard-row">
          <div
            class="column col iconBackground items-center"
            @click="selectClaimDialog = true"
          >
            <q-icon class="col self-center gridIcon">
              <q-img src="~assets/scan_dashboard.svg" height="95px" contain />
            </q-icon>

            <div
              class="
                column
                justify-end
                text-white text-center text-weight-medium text-subtitle1
                scanIconText
              "
            >
              <div class="col scanText text-subtitle2">SCAN</div>

              <div class="col">UPLOAD</div>
            </div>
          </div>

          <div
            class="column col iconBackground items-center"
            @click="toCameraDialogBox()"
          >
            <q-icon class="col self-center mobileIcon">
              <q-img src="~assets/camera_dashboard.svg" height="95px" contain />
            </q-icon>

            <div
              class="
                column
                justify-end
                text-white text-center text-weight-medium text-subtitle1
                IconText
              "
            >
              CAMERA
            </div>
          </div>
        </div>
      </div>
      <!-- footer -->
      <!-- <div class="row justify-center footer-shadow"></div> -->

      <!-- Select Claim Dialog -->
      <q-dialog
        v-model="selectClaimDialog"
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card>
          <CustomBar
            :dialogName="'Select Claim'"
            @closeDialog="selectClaimDialog = false"
          />
          <div
            class="mobile-container-page-without-search q-pt-sm q-mt-xs"
            v-if="claims.length"
          >
            <div>
              <div class="clients-list" v-for="claim in claims" :key="claim.id">
                <div class="client-list-item">
                  <div class="row form-heading q-pb-md">
                    <div class="col-10" @click="onClickingOnClaim(claim)">
                      {{ claim.client.fname }}
                      {{ claim.client.lname }}
                    </div>
                  </div>
                  <div @click="onClickingOnClaim(claim)">
                    <div class="row">
                      <div class="col-3">Carrier</div>
                      <div>
                        {{
                          claim.carrier
                            ? claim.carrier.value
                              ? claim.carrier.value
                              : ''
                            : '-'
                        }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-3">Claim No.</div>
                      <div>
                        {{ claim.number ? claim.number : '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="full-height full-width column">
            <div class="column absolute-center">
              <div style="color: #666666,align-items: center">
                You haven't added a Claim yet.
              </div>
            </div>
          </div>
        </q-card>
      </q-dialog>
      <!-- dialog box for add button-->
      <q-dialog
        v-model="openDialog"
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down"
        :position="'bottom'"
      >
        <AddOptions />
      </q-dialog>
      <q-dialog v-model="cameraDialogBox">
        <q-card class="no-margin col-12" style="width: 100%">
          <q-card-section>
            <div class="row justify-center">
              <div
                class="q-mr-lg column items-center"
                @click="toRedirectTOPhotoIdApp()"
              >
                <!-- PhotoId App Icon used here-->
                <q-icon size="xl">
                  <q-img src="../assets/photo_ID_app.png" color="primary" />
                </q-icon>
                <div class="text-black">Photo ID App</div>
              </div>
              <div
                @click="toOpenCameraClaimListing"
                class="q-ml-lg column items-center"
              >
                <q-icon name="photo_camera" size="xl"></q-icon>
                <div class="text-balck">Camera</div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none"> </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
    <q-footer
      style="
        background-color: #8f8f8f;
        padding-top: 8px;
        padding-bottom: env(safe-area-inset-bottom);
      "
    >
      <img
        src="~assets/header_shadow.png"
        class="absolute"
        style="
          width: 90%;
          height: 50px;
          margin-top: -22px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        "
      />
      <div
        class="row justify-between q-pt-xs"
        style="max-width: 95%; margin: 0 auto"
      >
        <div class="col-3 text-center column align-top">
          <img
            src="~assets/profile.svg"
            height=" 50px"
            @click="$router.push('/edit-profile')"
          />
          <div class="text-center text-white text-caption">PROFILE</div>
        </div>
        <div
          @click="$router.push('/reports')"
          class="col-3 text-center column align-top"
        >
          <img src="~assets/report_dashboard_icon.svg" height=" 50px" />

          <div class="text-center text-white text-caption">REPORTS</div>
        </div>
        <div class="col-3 text-center column align-top">
          <img
            class=""
            src="~assets/stats.svg"
            height=" 50px"
            @click="$router.push('/claimstats')"
          />
          <div class="text-center text-white text-caption">CLAIMS STATS</div>
        </div>
        <div class="col-3 text-center column align-top">
          <img
            class=""
            src="~assets/dashboard_add.svg"
            height=" 50px"
            @click="onClickAddUpIcon()"
          />
          <div class="text-center text-white text-caption">ADD</div>
        </div>
      </div>
    </q-footer>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { dateToShow } from '@utils/date';
import CustomBar from 'components/CustomBar';
import 'firebase/auth';
import AddOptions from 'components/AddOptions';
import { Device } from '@capacitor/core';
import { getCurrentUser } from '@utils/auth';
export default {
  components: { CustomBar, AddOptions },
  data() {
    return {
      selectClaimDialog: false,
      isClickable: false,
      openDialog: false,
      cameraDialogBox: false,
      params: {
        favourite: '',
        hideLoader: false
      },
      searchText: '',
      estimatorParams: {
        role: 'estimator',
        hideLoader: false
      }
    };
  },
  created() {
    // if user login first time  we are calling all the APIs so that we can save data in Local Database which we are needed while creating client,lead and claim

    this.getAllConfigurationTableData({
      name: 'client_types',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'phone_types',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'honorifics',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'loss_causes',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'inspections',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'industries',
      loaders: 'hideLoader'
    });
    //estimator  have no permission to these APIs
    const userRole = getCurrentUser().attributes.roles[0].machineValue;

    if (
      userRole != 'estimator' &&
      userRole != 'vendor' &&
      userRole != 'sales'
    ) {
      this.getVendors('hideLoader');
      this.getMortgages('hideLoader');
      let params = {
        limit: 0,
        offset: 0
      };
      //here we are calling this api to store data in local db.
      this.getCarriers(params);
      this.getMortgages(params);
    }

    this.getAllConfigurationTableData({
      name: 'property_types',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'policy_types',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'policy_categories',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'claim_reasons',
      loaders: 'hideLoader'
    });
    this.getAllConfigurationTableData({
      name: 'claim_severities',
      loaders: 'hideLoader'
    });
    this.getClaimRoles('hideLoader');
    this.getAllUsers('hideLoader');
    this.getPaidUsers('hideLoader');

    this.getOfficeTaskActions('hideLoader');
    this.getRoles('hideLoader');
    this.getEstimators(this.estimatorParams);

    //this API is for offline clients
    const payload = {
      limit: 0,
      offset: 0
    };
    this.getClients(payload);
    this.getClaims();
    this.getAllConfigurationTableData({ name: 'template_types' });
    this.getAllTemplate();
  },
  methods: {
    ...mapActions([
      'getRoles',
      'getOfficeTaskActions',
      'getEstimators',
      'getMortgages',
      'getPaidUsers',
      'getClaimRoles',
      'getAllUsers',
      'getAllConfigurationTableData',
      'getVendors',
      'getClients',
      'getActiveLeadsList',
      'getClaims',
      'getArchivedLeadsList',
      'getAllTemplate',
      'getCarriers'
    ]),
    // this function is use for the opening and closing of dialog box that show photoId App and Camera option feature.
    toCameraDialogBox() {
      this.cameraDialogBox = !this.cameraDialogBox;
    },
    toOpenCameraClaimListing() {
      this.selectClaimDialog = true;
      this.setCameraIcon('true');
    },
    onClickAddUpIcon() {
      this.openDialog = true;
    },
    ...mapMutations([
      'setSelectedClaimId',
      'setConvertedLead',
      'setCameraIcon'
    ]),
    //this function is used to redirect to the photoID App .
    async toRedirectTOPhotoIdApp() {
      const info = await Device.getInfo();

      const devicePlatform = info.operatingSystem;

      // routing to different locations based on the devices
      if (devicePlatform == 'android') {
        window.location =
          'https://play.google.com/store/apps/details?id=com.uscope.photoid&hl=en_IN&gl=US';
      } else if (devicePlatform == 'web') {
        window.location = 'https://photoidapp.net/';
      } else {
        window.location =
          'https://apps.apple.com/us/app/photo-id/id1277608552?ls=1';
      }
    },

    onClickNewLead() {
      this.$store.commit('setShowConvertButton', true);
      this.$router.push('/leads');
      const payload = {
        new: '',
        status: ''
      };
      this.setConvertedLead('Active');
      this.getActiveLeadsList(payload);
      this.getArchivedLeadsList();
    },

    dateToShow,
    openClaimDetail(value) {
      this.setSelectedClaimId(value.id);
      this.$router.push('/claim-details');
    },
    /* ******************This Function is not used anywhere anymore********************* */

    onOpenClaimsClick() {
      this.$router.push('/claims');
      const params = {
        status: 'open'
      };
      this.getClaims(params);
    },
    onClientsClick() {
      this.$router.push('/clients');
      this.getClients();
    },
    onClickNewClaims() {
      this.$router.push('/claims');
      const params = {
        new: true
      };
      this.getClaims(params);
    },
    onClickNewLeads() {
      this.$router.push('/leads');
      const params = {
        new: true
      };
      this.getActiveLeadsList(params);
    },
    onClickClaimRecentActivity() {
      this.$router.push('/claims');
      const params = {
        recent_activity: true
      };
      this.getClaims(params);
    },
    onOpenClientsClick() {
      this.$router.push('/clients');
      const params = {
        status: 'open'
      };
      this.getClients(params);
    },
    onClickingOnClaim(claim) {
      this.setSelectedClaimId(claim.id);
      this.$router.push('/vendor-document');
    },
    pageStyle(offset) {
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration

      // this is actually what the default style-fn does in Quasar
      console.log(offset);
      return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
    }
  },
  computed: {
    ...mapGetters(['claimStatic', 'leadStatic', 'clientStatic', 'claims'])
  }
};
</script>
<style lang="scss">
.footer-shadow {
  border: 0.1em solid #000000;
  width: 60%;
  margin-left: 20%;
  box-shadow: 0 -4px 6px 0.02em #000000, 0 -5px 7px 0.02em #000000;
}
.text {
  text-align: center;
  margin: 5px auto 0 auto;
  line-height: 10px;
  max-width: 90%;
  color: white;
  font-weight: bold;
}

.box {
  height: calc(20vh);
  width: 150px;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 20px 20px 30px 30px;
}

.left {
  height: calc(22vh);
  width: 160px;
  box-shadow: 5px 0 5px -5px #333;
  background-color: $primary;
}

.all {
  background-color: black;
  clip-path: ellipse(40% 100% at 50% 100%);
}
.text-style {
  text-align: center;
  font-size: 18px;
  margin-top: 25px;
  font-weight: bold;
}

.iconBackground {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('~assets/dashboard_tile.png');

  @media only screen and (max-width: 767px) {
    max-width: 150px !important;
    height: 175px;
  }
  @media only screen and (max-height: 736px) {
    height: 150px;
  }
}

.gridRow {
  margin-bottom: 20px;
}
.gridIcon {
  font-size: 5rem;
}
.mobileIcon {
  font-size: 3rem;
}
.IconText {
  margin-bottom: 20px;
}
.scanIconText {
  margin-bottom: 10px;
}
.scanText {
  margin-bottom: -10px;
}

@media only screen and (min-height: 700px) {
  .cardHeight {
    height: 74.2vh;
  }
  .gridRow {
    margin-bottom: 24px;
  }
  .gridIcon {
    font-size: 5rem;
  }
  .mobileIcon {
    font-size: 4rem;
  }
  .scanIconText {
    margin-bottom: 15px;
  }
}
@media only screen and (min-height: 800px) {
  .cardHeight {
    height: 75vh;
  }
  .gridRow {
    margin-bottom: 45px;
  }
  .gridIcon {
    font-size: 6rem;
  }
  .mobileIcon {
    font-size: 5rem;
  }
  .IconText {
    margin-bottom: 30px;
  }
  .scanIconText {
    margin-bottom: 25px;
  }
}
@media only screen and (min-height: 1000px) {
  .cardHeight {
    height: 80vh;
  }
  .gridRow {
    margin-bottom: 65px;
  }
  .gridIcon {
    font-size: 8rem;
    margin-bottom: 10px;
  }
  .mobileIcon {
    font-size: 6rem;
    margin-bottom: 20px;
  }

  .gridRowContainer {
    height: 180px !important;
  }
  .IconText {
    margin-bottom: 40px;
    font-size: 25px;
  }
  .scanIconText {
    margin-bottom: 35px;
    font-size: 25px;
  }
  .scanText {
    margin-bottom: 0;
  }
}
@media only screen and (min-height: 1300px) {
  .cardHeight {
    height: 85vh;
  }
  .gridRow {
    margin-bottom: 65px;
  }
  .gridIcon {
    font-size: 12rem;
    margin-bottom: 20px;
  }
  .mobileIcon {
    font-size: 8rem;
    margin-bottom: 20px;
  }

  .gridRowContainer {
    height: 180px !important;
  }
  .IconText {
    margin-bottom: 60px;
    font-size: 35px;
  }
  .scanIconText {
    margin-bottom: 50px;
    font-size: 35px;
  }
  .scanText {
    margin-bottom: 10px;
  }
}
.cardHeight {
  min-height: 450px;
  height: 100%;
  @media only screen and (min-width: 768px) {
    height: 75vh;
  }
}
</style>
