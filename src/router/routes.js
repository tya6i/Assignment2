import { guardMyroute } from '@utils/auth.js';
import { isMobile } from 'src/utils/common';
import { LocalStorage } from 'quasar';

const tokenName = 'access_token';

const routes = [
  {
    path: '',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      // {
      //   path: 'login',
      //   name: 'login',
      //   caseSensitive: true,
      //   component: () => import('pages/Login.vue')
      // },
      {
        path: 'login',
        name: 'login',
        caseSensitive: true,
        component: () => import('pages/Login.vue'),
        beforeEnter: (to, from, next) => {
          let token = LocalStorage.getItem(tokenName);
          if (!token) {
            next();
          } else if (token && to.name == 'login') {
            next('onboarding');
          }
        }
      },
      {
        path: 'signup',
        name: 'signup',
        caseSensitive: true,
        component: () => import('pages/SignupStep1.vue'),
        beforeEnter: (to, from, next) => {
          let token = LocalStorage.getItem(tokenName);
          if (!token) {
            next();
          } else if (
            from.name == 'onboarding' ||
            from.name == 'login' ||
            to.name == 'signup'
          ) {
            next('onboarding');
          }
        }
      },
      {
        path: '/payment',
        name: 'payment',
        caseSensitive: true,
        component: () => import('pages/SignupStep2.vue'),
        beforeEnter: (to, from, next) => {
          let token = LocalStorage.getItem(tokenName);
          if (!token) {
            next();
          } else if (
            from.name == 'onboarding' ||
            from.name == 'login' ||
            to.name == 'payment'
          ) {
            next('onboarding');
          }
        }
      },
      {
        path: 'set-password',
        name: 'set-password',
        caseSensitive: true,
        component: () => import('src/pages/SetPassword.vue')
      },
      {
        path: 'forget-password',
        name: 'forget-password',
        caseSensitive: true,
        component: () => import('src/pages/ForgetPassword.vue')
      },
      {
        path: 'info',
        name: 'info',
        caseSensitive: true,
        component: () => import('pages/Information.vue')
      },
      {
        path: 'notify',
        name: 'notify',
        caseSensitive: true,
        component: () => import('pages/Notification.vue')
      },

      {
        path: 'access-denied',
        name: 'access-denied',
        caseSensitive: true,
        component: () => import('pages/AccessDenied.vue')
      },
      {
        path: 'terms-conditions',
        name: 'terms-conditions',
        caseSensitive: true,
        component: () => import('pages/term.vue')
      },
      {
        path: 'privacy-policy',
        name: 'privacy-policy',
        caseSensitive: true,
        component: () => import('pages/privacyPolicy.vue')
      },
      { path: '', redirect: 'login' }
    ]
  },
  {
    path: '',
    component: () => import('src/layouts/MainLayout.vue'),
    beforeEnter: guardMyroute,
    children: [
      {
        path: 'onboarding',
        name: 'onboarding',
        caseSensitive: true,
        component: () => import('pages/onboard/onBoardStart.vue')
      },
      {
        path: 'onboarding/step1',
        name: 'onboarding',
        caseSensitive: true,
        component: () => import('pages/onboard/onBoardStep1.vue')
      },
      {
        path: 'onboarding/step2',
        name: 'onboarding',
        caseSensitive: true,
        component: () => import('pages/onboard/onBoardStep2.vue')
      },
      {
        path: 'onboarding/step3',
        name: 'onboarding',
        caseSensitive: true,
        component: () => import('pages/onboard/onBoardStep3.vue')
      },
      {
        path: 'onboarding/step4',
        name: 'onboarding',
        caseSensitive: true,
        component: () => import('pages/onboard/onBoardStep4.vue')
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        caseSensitive: true,
        component: () => import('pages/Dashboard.vue'),
        beforeEnter: (to, from, next) => {
          if (isMobile()) {
            next();
          } else {
            next('admin');
          }
        }
      },
      {
        path: 'document-upload',
        name: 'document upload ',
        caseSensitive: true,
        component: () => import('pages/DocumentUpload.vue')
      },
      {
        path: 'vendor-document',
        name: ' upload document ',
        caseSensitive: true,
        component: () => import('pages/VendorDocument.vue')
      },
      {
        path: 'configuration',
        name: 'configuration',
        caseSensitive: true,
        component: () => import('pages/Configuration.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        caseSensitive: true,
        component: () => import('pages/Reports.vue')
      },
      {
        path: 'billing',
        name: 'billing',
        caseSensitive: true,
        component: () => import('pages/Billing.vue')
      },
      {
        path: 'account',
        name: 'account',
        caseSensitive: true,
        component: () => import('pages/Account.vue')
      },
      {
        path: 'payment',
        name: 'payment',
        caseSensitive: true,
        component: () => import('pages/Payment.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        caseSensitive: true,
        component: () => import('pages/Profile.vue')
      },
      {
        path: 'my-plan',
        name: 'my plan',
        caseSensitive: true,
        component: () => import('pages/MyPlan.vue')
      },
      {
        path: 'manage-users',
        name: 'manage users',
        caseSensitive: true,
        component: () => import('pages/ManageUsersNew.vue')
      },
      {
        path: 'add-user',
        name: 'add-user',
        caseSensitive: true,
        component: () => import('pages/AddUser.vue')
      },
      {
        path: 'leads-dashboard',
        name: 'leads dashboard',
        caseSensitive: true,
        component: () => import('pages/LeadsDashboard.vue')
      },

      {
        path: 'leads',
        name: 'Leads',

        caseSensitive: true,
        component: () => import('pages/Leads.vue')
      },
      {
        path: 'claimstats',
        name: 'Dashboard',

        caseSensitive: true,
        component: () => import('pages/ClaimStats.vue')
      },

      {
        path: 'lead-details/:id',
        name: 'lead details',
        caseSensitive: true,
        component: () => import('pages/LeadDetail.vue')
      },

      {
        path: 'add-lead',
        name: 'add new leads',
        caseSensitive: true,
        component: () => import('pages/AddLead.vue')
      },
      {
        path: 'add-lead-details/:id?',
        name: 'add new lead',
        caseSensitive: true,
        component: () => import('pages/AddLeadDetails.vue')
      },
      {
        path: 'edit-lead-details/:id?',
        name: 'edit  lead',
        caseSensitive: true,
        component: () => import('pages/EditLeadDetails.vue')
      },

      {
        path: 'clients',
        name: 'clients',
        caseSensitive: true,
        component: () => import('pages/Clients.vue')
      },
      {
        path: 'view-client/:id',
        name: 'client details',

        caseSensitive: true,
        component: () => import('pages/ClientsDetails.vue')
      },

      {
        path: 'client-details',
        name: 'client info ',
        caseSensitive: true,
        component: () => import('pages/ClientInfo.vue')
      },
      {
        path: 'claim-details',
        name: 'claim details',
        caseSensitive: true,
        component: () => import('pages/ClaimDetails.vue')
      },
      {
        path: 'add-claim/:clientId',
        name: 'Add Claim',
        caseSensitive: true,
        component: () => import('pages/AddClaim.vue')
      },
      {
        path: 'claim-summary',
        name: 'claim summary ',
        caseSensitive: true,
        component: () => import('src/pages/ClaimSummary.vue')
      },
      {
        path: 'claim-tasks/:id',
        name: 'claim tasks ',
        caseSensitive: true,
        component: () => import('src/pages/ClaimTasks.vue')
      },
      {
        path: 'claim-files/:claimId',
        name: 'files ',
        caseSensitive: true,
        component: () => import('pages/ClaimFiles.vue')
      },
      {
        path: 'estimator-info/:claimId',
        name: 'Estimator Info ',
        caseSensitive: true,
        component: () => import('pages/EstimatorInfo.vue')
      },
      {
        path: 'proof-of-loss/:claimId',
        name: 'Proof of Loss ',
        caseSensitive: true,
        component: () => import('pages/ProofOfLoss.vue')
      },
      {
        path: 'pol-document/:claimId',
        name: 'Upload Notarized POL',
        caseSensitive: true,
        component: () => import('pages/ProofOfLossDocument.vue')
      },

      {
        path: 'claim-action-items/:claimId',
        name: 'action items ',
        caseSensitive: true,
        component: () => import('pages/ClaimActionItems.vue')
      },

      {
        path: 'loss-info',
        name: 'loss info ',
        caseSensitive: true,
        component: () => import('src/pages/UpdateLossInfo.vue')
      },
      {
        path: 'client-documents/:directoryId',
        name: 'Documents',
        caseSensitive: true,
        component: () => import('pages/ClientDocuments.vue')
      },
      {
        path: 'property-details',
        name: 'properties and claims ',
        caseSensitive: true,
        component: () => import('pages/PropertyInfo.vue')
      },
      {
        path: 'claim-notes',
        name: 'notes ',
        caseSensitive: true,
        component: () => import('pages/ClaimNotes.vue')
      },
      {
        path: 'note-details',
        name: 'Notes',
        caseSensitive: true,
        component: () => import('pages/Notes.vue')
      },
      {
        path: 'company-personnel',
        name: 'Company Personnel',
        caseSensitive: true,
        component: () => import('src/pages/Personnel.vue')
      },
      {
        path: 'insurance-policy/:id',
        name: 'Insurance Policy ',
        caseSensitive: true,
        component: () => import('pages/InsurancePolicy.vue')
      },

      {
        path: 'settlements',
        name: 'Settlements ',
        caseSensitive: true,
        component: () => import('pages/Settlements.vue')
      },
      {
        path: 'activity-log',
        name: 'Activity Log And Message ',
        caseSensitive: true,
        component: () => import('pages/ActivityLog.vue')
      },
      {
        path: 'personal-property',
        name: 'Personal Property ',
        caseSensitive: true,
        component: () => import('pages/PersonalProperty.vue')
      },
      {
        path: 'other-damage',
        name: 'Other Damage ',
        caseSensitive: true,
        component: () => import('pages/OtherDamageProperty.vue')
      },
      {
        path: 'add-client',
        name: 'create client',
        caseSensitive: true,
        component: () => import('pages/AddClient.vue')
      },
      {
        path: 'vendors',
        name: 'vendors',
        caseSensitive: true,
        component: () => import('src/pages/vendor/Vendors.vue')
      },
      {
        path: 'vendor-details/:id',
        name: 'vendor details',
        caseSensitive: true,
        component: () => import('src/pages/vendor/VendorDetails.vue')
      },
      {
        path: 'vendor-company-info/:id',
        name: 'vendor info',
        caseSensitive: true,
        component: () => import('src/pages/vendor/VendorCompanyInfo.vue')
      },
      {
        path: 'vendor-personnel/:id',
        name: 'personnel',
        caseSensitive: true,
        component: () => import('src/pages/vendor/VendorPersonnel.vue')
      },
      {
        path: 'carriers/:add?',
        name: 'carriers',
        caseSensitive: true,
        component: () => import('pages/carrier/Carriers.vue')
      },
      {
        path: 'carrier-details/:id',
        name: 'carrier details',
        caseSensitive: true,
        component: () => import('src/pages/carrier/CarrierDetails.vue')
      },
      {
        path: 'carrier-company-info/:id',
        name: 'carrier info',
        caseSensitive: true,
        component: () => import('src/pages/carrier/CarrierCompanyInfo.vue')
      },
      {
        path: 'carrier-personnel/:id',
        name: 'carrier',
        caseSensitive: true,
        component: () => import('src/pages/carrier/CarrierPersonnel.vue')
      },

      {
        path: 'claims',
        name: 'open claims',
        caseSensitive: true,
        component: () => import('pages/Claims.vue')
      },
      {
        path: 'edit-profile',
        name: 'User Profile',
        caseSensitive: true,
        component: () => import('pages/UserProfile.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        caseSensitive: true,
        component: () => import('pages/Settings.vue')
      },
      {
        path: 'mortgages/:add?',
        name: 'mortgages',
        caseSensitive: true,
        component: () => import('pages/mortgage/Mortgage.vue')
      },
      {
        path: 'mortgage-liens/:id',
        name: 'mortgage ',
        caseSensitive: true,
        component: () => import('pages/mortgage/MortgageAndLiens.vue')
      },
      {
        path: 'expert-vendor/:id',
        name: 'Expert vendor ',
        caseSensitive: true,
        component: () => import('pages/ExpertVendor.vue')
      },
      {
        path: 'mortgage-details/:id',
        name: 'mortgage details',
        caseSensitive: true,
        component: () => import('src/pages/mortgage/MortgageDetails.vue')
      },
      {
        path: 'offline-claim',
        name: 'claim detail',
        caseSensitive: true,
        component: () => import('src/pages/OfflineClaimTemplate.vue')
      },
      {
        path: 'mortgage-company-info/:id',
        name: 'mortgage info',
        caseSensitive: true,
        component: () => import('src/pages/mortgage/MortgageCompanyInfo.vue')
      },
      {
        path: 'mortgage-personnel/:id',
        name: 'mortgage',
        caseSensitive: true,
        component: () => import('src/pages/mortgage/MortgagePersonnel.vue')
      },
      {
        path: 'inspection-types',
        name: 'type of inspections',
        caseSensitive: true,
        component: () => import('pages/InspectionTypes.vue')
      },
      {
        path: 'preferred',
        caseSensitive: true,
        component: () => import('pages/PreferredDistance.vue')
      },
      {
        path: 'admin',
        name: 'admin',
        caseSensitive: true,
        component: () => import('pages/Admin.vue')
      },
      {
        path: 'account-summary',
        name: 'account-summary',
        caseSensitive: true,
        component: () => import('pages/admin/AccountSummary.vue')
      },
      {
        path: 'automation',
        name: 'automation',
        caseSensitive: true,
        component: () => import('pages/admin/Automation.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];
export default routes;
