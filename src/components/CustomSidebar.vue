<template>
  <q-page class="poppinsFont min-height max-width">
    <div>
      <div class="dFlex justify-between lg-hide xl-hide md-hide">
        <div
          v-if="$route.name == 'onboarding'"
          style="background-color: #f9e7d8"
        >
          <q-img
            size="1em"
            src="~assets/Logo.svg"
            class="LogoSize"
            @click="clickedLogo"
          />
        </div>
        <div class="justify-end pr-20">
          <div class="row justify-end dFlex" style="cursor: pointer">
            <div class="avatarContainer">
              <img src="~assets/default-profile.svg" class="avatarImage" />
            </div>
            <q-img src="~assets/Icondown.svg" class="dropdowLogo" />
          </div>
          <q-popup-proxy
            ref="logoutProxy"
            class="bannerContainer"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-banner class="bg-white">
              <div class="userDetailContainer">
                <p class="userEmail">{{ user.email }}</p>
                <p class="companyName">{{ organization.name }}</p>
              </div>
              <div class="logoutContainer" @click="logout()">
                <h6 class="logoutText">Log Out</h6>
                <q-img src="~assets/LogOutIcon.svg" class="logoutLogo" />
              </div>
            </q-banner>
          </q-popup-proxy>
        </div>
      </div>
      <q-separator
        class="md-hide lg-hide xl-hide"
        style="background-color: #f9dfc8; margin-left: -14px"
      />
      <div class="ml-32 mt-34">
        <div
          class="Account-setup-text"
          :style="
            step == 0 || step == 1 || step == 2
              ? 'display: block;'
              : (step == 3 || step == 4) && width < 1024
              ? 'display: block;'
              : 'display:none;'
          "
        >
          Account Setup
        </div>
        <!-- custom stepper -->
        <div class="column q-mt-43">
          <div class="col">
            <div class="row">
              <!-- <q-icon
                name="adjust"
                color="primary"
                size="md"
              /> -->

              <!-- <q-img size="1em" src="~assets/_StepIconWithBorder.svg" v-if="step == 1" class="step1Logon" /> -->
              <q-icon
                name="adjust"
                color="primary"
                v-if="step == 0"
                size="md"
              />
              <div class="stepWorking" v-if="step == 1">
                <img
                  size="1em"
                  src="~assets/_Step-icon-base.svg"
                  class="stepClass"
                />
              </div>
              <div v-if="step == 2 || step == 3 || step == 4">
                <q-img
                  size="1em"
                  src="~assets/_Step1done.svg"
                  class="step1Logon"
                />
              </div>

              <div class="stepLabelContainer">
                <div class="Step-text">Step 1</div>
                <div class="Step-Subtext">Add Your Company Details</div>
              </div>
            </div>
            <div
              class="q-ml-md height-40px"
              style="border-left: 2px solid #ef5926; margin-top: -14px"
            ></div>
          </div>
          <div class="col">
            <div class="row">
              <q-icon
                name="adjust"
                color="primary"
                v-if="step == 1 || step == 0"
                size="md"
              />
              <!-- <q-img size="1em" src="~assets/_StepIconWithBorder.svg" v-if="step == 2" class="step1Logon" /> -->
              <div class="stepWorking" v-if="step == 2">
                <img
                  size="1em"
                  src="~assets/_Step-icon-base.svg"
                  class="stepWorking"
                />
              </div>
              <div v-if="step == 3 || step == 4">
                <q-img
                  size="1em"
                  src="~assets/_Step1done.svg"
                  class="step1Logon"
                />
              </div>

              <div class="stepLabelContainer">
                <div class="Step-text">Step 2</div>
                <div class="Step-Subtext">Connect With Google Drive</div>
              </div>
            </div>
            <div
              class="q-ml-md height-40px"
              style="border-left: 2px solid #ef5926; margin-top: -14px"
            ></div>
          </div>
          <div class="col">
            <div class="row">
              <q-icon
                name="adjust"
                color="primary"
                size="md"
                v-if="step == 0 || step == 1 || step == 2"
              />
              <div class="stepWorking" v-if="step == 3">
                <img
                  size="1em"
                  src="~assets/_Step-icon-base.svg"
                  class="stepWorking"
                />
              </div>
              <div v-if="step == 4">
                <q-img
                  size="1em"
                  src="~assets/_Step1done.svg"
                  class="step1Logon"
                />
              </div>
              <div class="stepLabelContainer">
                <div class="Step-text">Step 3</div>
                <div class="Step-Subtext">
                  Add PhotoID Account Details
                  <span v-if="width >= 1223 || (width > 767 && width < 1024)"
                    >(optional)</span
                  >
                </div>
                <div
                  class="Step-Subtext"
                  v-if="(width > 1023 && width < 1223) || width < 768"
                >
                  (optional)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row" v-if="$route.name == 'onboarding'">
        <div
          class="sm-hide xs-hide text-footer q-py-38"
          style="background-color: #f9e7d8; margin-left: 0px !important"
        >
          <span style="color: #0c0c0c"> © ClaimGuru</span>
          <span class="q-px-sm" style="color: #0c0c0c">{{ CurrentYear }}</span>
        </div>
        <div class=" col-lg-9 col-xl-8 bg-white"></div>
      </div> -->
  </q-page>
</template>

<script>
import {
  removeToken,
  removeCurrentUser,
  removeFCMToken,
  getCurrentUser,
  getFCMToken
} from '@utils/auth';
import { removeFirebaseToken } from '@utils/firebase';
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      user: {},
      width: window.innerWidth
    };
  },
  props: {
    step: String
  },
  computed: {
    ...mapGetters(['userName', 'organization']),
    CurrentYear() {
      const d = new Date();
      let year = d.getFullYear();
      return year;
    }
  },
  methods: {
    ...mapActions(['deletePushNotificationToken', 'getOrganization']),
    async logout() {
      if (this.getFCMToken()) {
        await this.deletePushNotificationToken(this.getFCMToken());
        await this.removeFCMToken();
      }
      await this.removeFirebaseToken();

      this.removeToken();
      this.removeCurrentUser();
      location.reload();
    },
    clickedLogo() {
      window.location.href = 'https://claimguru.cilalabs.dev/';
    },
    removeToken,
    removeCurrentUser,
    removeFCMToken,
    removeFirebaseToken,
    getCurrentUser,
    getFCMToken,
    onResize(e) {
      this.width = window.innerWidth;
    }
  },
  async created() {
    await this.getOrganization();
    if (this.getCurrentUser().attributes) {
      this.user = getCurrentUser().attributes;
    }
    window.addEventListener('resize', this.onResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
  }
};
</script>

<style lang="scss" scoped>
.q-banner {
  border: 2px solid #e8e9ec;
  border-radius: 20px !important;
  top: 70px !important;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}
.userDetailContainer {
  margin: 16px 39px 16px 16px;
  color: #667085;
  font-weight: 500;
  .userEmail {
    font-size: 12px;
    line-height: 18px;
    margin: 0px;
  }
  .companyName {
    font-size: 10px;
    line-height: 15px;
    margin-top: 4px;
  }
}
.logoutContainer {
  display: flex;
  justify-content: space-between;
  border-top: 2px solid #ccc;
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  padding-top: 8px;
  cursor: pointer;

  .logoutText {
    margin: 0px;
    padding: 0px;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #152141;
  }
  .logoutLogo {
    height: 15px;
    width: 15px;
    margin-top: 5px;
  }
}

.poppinsFont {
  font-family: poppins;
}
.step1Logon {
  width: 32px !important;
  height: 32px !important;
}
.LogoSize {
  width: 151px;
  height: 51px;
  margin-left: 15px;
  margin-top: 15px;
}
.avatarContainer {
  width: 40px !important;
  height: 40px !important;
  .avatarImage {
    max-width: 100%;
  }
}

.stepWorking {
  width: 32px !important;
  height: 32px !important;
  // border: 2px solid #EF5926;
  border-radius: 50%;
  .stepClass {
    max-width: 100%;
    border-radius: 50%;
  }
}
.q-page-container {
  margin: 0 auto !important;
  max-width: 120rem;
}
.min-height {
  @media (min-width: 1024px) {
    height: calc(100vh - 215px);
  }
}

.stepLabelContainer {
  margin-left: 16px;
}
.inside-text {
  border-bottom: px solid #e5e5e5 !important;
}
.mt-43 {
  margin-top: 43px;
}
.mb-15 {
  margin-bottom: 15px;
}
.mx-15 {
  margin-left: 0px;
  margin-right: 0px;
}
.image-h-216 {
  height: 216px;
}
.mt-120 {
  margin-top: 120px;
}
.px-15 {
  padding-left: 0px;
  padding-right: 0px;
}
.image-w-252 {
  width: 252px;
}
.mx-40 {
  margin-left: 102px;
  margin-right: 70px;
}
.SubTextfontSize {
  color: #667085;
  font-size: 14px;
  margin-top: 5px;
  line-height: 20px;
  // max-width: 517px;
  padding-left: 40px;
  padding-right: 40px;
}
.input-subtitle1 {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: #101828;
}
.dFlex {
  display: flex;
}
.Account-setup-text {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  display: flex;
  align-items: center;
  color: #0c0c0c;

  @media (max-width: 1024px) {
    line-height: 24px;
    font-size: 20px;
  }
}
.q-px-32 {
  padding-left: 40px;
}
.pr-50 {
  padding-right: 50px;
}
.mt-60 {
  margin-top: 60px;
}
.dropdowLogo {
  margin-top: 18px;
  width: 10px;
  height: 7px;
  margin-left: 5px;
  background-size: auto !important;
}
.StartButton {
  margin-top: 43px;
  margin-bottom: 43px;
  width: 153px;
  height: 50px;
  font-family: 'Poppins-semiBold';
  background: #ef5926;
  font-style: normal;
  box-shadow: none !important;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: #ffffff;
}
.Next-button {
  width: 118px;
  height: 50px;
}
.GoHome-btn {
  width: 177px;
  height: 50px;
  background: #ef5926;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-bottom: 100px;
}
.overflowhidden {
  overflow-x: hidden;
}
.setup-success-text {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #101828;
  letter-spacing: 00.15px;
  margin-top: 43px;
}
.setup-success-SubText {
  margin-top: 6px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #667085;
  letter-spacing: 00.15px;
}
.onBoardLogo {
  width: 322px;
  height: 189px;
}
.Step-text {
  font-family: 'poppins-medium';
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
}
.letter-spacing-75 {
  letter-spacing: 0.75px;
}
.letter-spacing-15 {
  letter-spacing: 0.15px;
}
.Step-Subtext {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #6e6e6e;
  letter-spacing: 0.15px;
  padding-right: 10px;
}
.seperator-color {
  background-color: #f7f7f7;
  height: 2px;
}
.mb-30 {
  margin-bottom: 00px;
}
.coonectWithgoogle {
  width: 331px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #0c0c0c;
  box-sizing: border-box;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: #0c0c0c;
}
.text-5 {
  font-size: 20px;
  color: #0c0c0c;
  letter-spacing: 0.75px;
}
.mt-50 {
  margin-top: 27px;
}
.mt-30 {
  margin-top: 30px;
}
.text-subtitle1 {
  margin-bottom: 6px;
}
.connectWithGoogle {
  width: 331px !important;
  height: 40px !important;
  background: #ffffff !important;
  border: 1px solid #0c0c0c !important;
  box-sizing: border-box !important;
  border-radius: 8px !important;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  align-items: flex-start;
  /* identical to box height, or 150% */
  display: flex;
  // align-items: center;
}
.mt-24 {
  margin-top: 24px;
}
.inside-text {
  font-family: 'Poppins';
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 16px !important;
  line-height: 24px !important;
  align-items: center !important;
  color: #8a90a0 !important;
}
.input-size {
  width: 390px;
  height: 44px;
}
.text-footer {
  font-weight: 400;
  color: #667085;
  font-size: 14px;
}
.border-top {
  border-top: 0px;
}
::v-deep .q-layout__section--marginal {
  background-color: white;
  border-top: none;
}
::v-deep .q-btn__wrapper:before {
  box-shadow: none;
}
::v-deep .q-field__messages {
  line-height: 4px;
}
::v-deep .absolute-full {
  background-size: auto;
}
::v-deep .absolute-full {
  background-size: inherit !important;
}
.q-pl-32 {
  padding-left: 15px;
}
.ml-31 {
  padding-left: 16px !important;
}
.q-pb-18 {
  padding-bottom: 18px;
}
.text-subtitle2 {
  color: #667085;
  line-height: 20px !important;
  font-size: 14px;
}
.mt-333 {
  margin-top: 333px;
}
.height-40px {
  height: 46px;
}
.pl-62 {
  padding-left: 2px;
}
.pr-110 {
  padding-right: 50;
}
.mt-404 {
  margin-top: 404px;
}
.Back-Btn {
  width: 101px !important;
  height: 50px !important;
  border-radius: 10px !important;
  padding: 10px, 30px, 10px, 30px !important;
  border: 2px solid #ef5926;
  background: #ffffff;
  color: #ef5926 !important;
  font-weight: 500 !important;
  font-size: 16px !important;
  align-items: flex-start;
}
.Next-Btn {
  width: 118px !important;
  height: 50px !important;
  border-radius: 10px !important;
  padding: 8px, 20px, 8px, 20px !important;
  background: rgba(239, 89, 38, 0.5);
  color: #ffffff !important;
  font-weight: 500 !important;
  font-size: 16px !important;
}
.completeSetup-Btn {
  width: 175px !important;
  height: 50px !important;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  background: #ef5926;
  border-radius: 10px;
}
.photoId-Text {
  margin-top: 31px;
  font-weight: 600;
  font-size: 24px;
  color: #101828;
  letter-spacing: 0.75px;
}
.Bottom-border {
  border-bottom: 2px #f9dfc8 !important;
  transform: rotate(-0.15deg);
}
.Bottom-photoId-text {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #667085;
  letter-spacing: 0.15px;
}
.text-subheading {
  letter-spacing: 00.15px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #101828;
}
.photoId-Inputtext {
  font-weight: 500 !important;
  font-size: 16px !important;
  line-height: 24px !important;
  display: flex;
  align-items: center;
  color: #8a90a0 !important;
}

@media (min-width: 1024px) {
  .ml-32 {
    margin-left: 32px;
  }
  .mt-34 {
    margin-top: 34px;
  }
  .height-40px {
    height: 46px;
  }
  .q-mt-43 {
    margin-top: 34px;
  }
  .pr-20 {
    padding-right: 38px;
  }
  .border-top {
    border-top: 1px solid #e5e5e5;
    margin-left: -50px;
    margin-right: -50px;
  }
  .max-width {
    max-width: 480px;
  }
}
/* Small devices (portrait tablets and large phones, 600px and up) */
@media (max-width: 1024px) {
  .ml-32 {
    margin-left: 15px;
  }
  .pr-20 {
    padding-right: 20px;
    padding-top: 15px;
  }
  .pr-15 {
    padding-left: 15px;
    padding-top: 15px;
  }
  .mt-34 {
    margin-top: 28px;
    margin-bottom: 30px;
  }

  .height-40px {
    height: 24px;
  }
  .q-mt-43 {
    margin-top: 24px;
  }
}
</style>
