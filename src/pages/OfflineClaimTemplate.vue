<template>
  <div>
    <q-card class="q-pa-sm input-style input-overlay col-5">
      <div class="text-bold q-mt-sm q-ml-sm">Template Type</div>

      <q-select
        dense
        v-model="templatetype.value"
        option-value="name"
        option-label="value"
        map-options
        options-dense
        behavior="menu"
        emit-value
        :options="templateOptions"
        @input="setTypes(templatetype.value)"
        label="List of Templates"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Please fill the template']"
      />

      <div class="full-width column items-center q-mb-md">
        <q-btn
          v-if="templatetype.value"
          color="primary"
          size="'xl'"
          class="button-width-90 text-capitalize"
          label="Generate Claim Document"
          @click="onClickGenerateDocument"
        />
      </div>
      <!-- This is for showing generated signed document -->

      <div
        v-if="this.FinalDocumentObject && this.FinalDocumentObject.document"
        class="q-pa-md"
      >
        <q-icon
          name="picture_as_pdf"
          size="sm"
          color="primary"
          class="q-ml-md"
        />
        <span class="q-pl-md cursor-pointer">
          <a @click="showSignedDocument()">
            {{ this.claim.client.fname }}_claim_{{
              templatetype.value.value
            }}_signed</a
          >
        </span>
      </div>
    </q-card>

    <!-- PA Signature Pad Dialog  -->
    <q-dialog
      v-model="paSignaturePadDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          dialogName="Public Adjuster Signature"
          @closeDialog="paSignaturePadDialog = false"
        />

        <VueSignaturePad
          @signData="paSignData"
          :finalSignature="false"
          @skipSignature="
            (paSignaturePadDialog = false), (insuredSignaturePadDialog = true)
          "
        />
      </q-card>
    </q-dialog>

    <!-- Insured Signature Pad Dialog -->
    <q-dialog
      v-model="insuredSignaturePadDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          dialogName="Insured Signature"
          @closeDialog="insuredSignaturePadDialog = false"
        />

        <VueSignaturePad
          @signData="insuredSignData"
          :finalSignature="false"
          @skipSignature="
            (insuredSignaturePadDialog = false),
              (coInsuredSignatureDialog = true)
          "
        />
      </q-card>
    </q-dialog>

    <!-- Co Insured Signature Pad Dialog -->

    <q-dialog
      v-model="coInsuredSignatureDialog"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <CustomBar
          dialogName="Co Insured Signature"
          @closeDialog="coInsuredSignatureDialog = false"
        />

        <VueSignaturePad
          @signData="coInsuredSignData"
          :finalSignature="true"
          @skipSignature="coInsuredSignatureDialog = false"
        />
      </q-card>
    </q-dialog>

    <!-- Display contract document -->
    <q-dialog
      v-model="displayContractDocument"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <CustomBar
        dialogName="Document"
        @closeDialog="displayContractDocument = false"
      />
      <q-card class="">
        <q-card-section
          class="q-pa-sm"
          style="width: 2480px; overflow: scroll; height: 88%"
        >
          <div v-html="finalDocumentString"></div>
        </q-card-section>
        <q-card-actions class="" v-if="showSignBtn">
          <q-btn
            color="primary"
            label="Sign Document"
            @click="onSignButtonClick('pa_sign')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import VueSignaturePad from 'components/VueSignaturePad';
import CustomBar from 'components/CustomBar';
import { getBase64 } from '@utils/common';
import { dateToShow } from '@utils/date';
import localDB, { getCollection } from '@services/dexie';
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from '@capacitor/core';

const { Filesystem } = Plugins;
export default {
  components: { CustomBar, VueSignaturePad },
  data() {
    return {
      insuredSignaturePadDialog: false,
      coInsuredSignatureDialog: false,
      pdfDailog: false,
      signedPdfDailog: false,
      signedDocument: '',
      FinalDocumentObject: {},
      claim: '',
      pa_signature: '',
      insured_signature: '',
      co_insured_signature: '',
      documentId: '',
      signImage: '',
      contractDocumentDialog: false,
      paSignaturePadDialog: false,
      finalDocumentString: '',
      contractDocument: '',
      tokenArray: [],
      document: '',
      displayContractDocument: false,
      templatetype: { value: '', machineValue: '' },
      showSignBtn: false
    };
  },

  async created() {
    this.claim = await this.getSingleClaims(this.selectedClaimId);
    await this.getAllConfigurationTableData({ name: 'template_types' });

    // await this.getPersonnelInfo(this.selectedClaimId);

    const offlineClientData = await this.getSingleClientDetails(
      this.claim.client.id
    );
    // Token Mappings
    this.tokens = [
      //Carrier Tokens
      {
        key: '{{.Carrier.Name}}',
        value: this.claim.policyInfo?.carrier?.value
      },
      {
        key: '{{.Carrier.Email}}',
        value: this.claim.policyInfo?.carrier?.email
      },

      //Client Tokens
      { key: '{{.Client.Email}}', value: this.claim.client.email },
      { key: '{{.Client.Name}}', value: this.claim.client.fname },
      {
        key: '{{.Client.PhoneNumber.Number}}',
        value: offlineClientData.insuredInfo?.primary.phoneNumber[0]?.number
      },
      { key: '{{.Client.Fax.Number}}', value: '' },
      { key: '{{.Client.Cell.Number}}', value: '' },
      {
        key: '{{.Client.Address.Address1}}',
        value: offlineClientData.insuredInfo?.mailingAddress?.address1
      },
      {
        key: '{{.Client.Address.Address2}}',
        value: offlineClientData.insuredInfo?.mailingAddress?.address2
      },
      {
        key: '{{.Client.Address.AddressRegion}}',
        value: offlineClientData.insuredInfo?.mailingAddress?.addressRegion
      },
      {
        key: '{{.Client.Address.PostalCode}}',
        value: offlineClientData.insuredInfo?.mailingAddress?.postalCode
      },
      {
        key: '{{.Client.Address.AddressCountry}}',
        value: offlineClientData.insuredInfo?.mailingAddress?.addressCountry
      },
      {
        key: '{{.Client.Address.AddressLocality}}',
        value: offlineClientData.insuredInfo?.mailingAddress?.addressLocality
      },

      // Claim Tokens
      { key: '{{.Claim.Notes}}', value: '' },
      {
        key: '{{.Claim.Number}}',
        value: this.claim.number ? this.claim.number : ''
      },
      {
        key: '{{.Claim.Client.Name}}',
        value: this.claim.client?.fname ? this.claim.client?.fname : ''
      },
      {
        key: '{{.Claim.FileNumber}}',
        value: this.claim.fileNumber ? this.claim.fileNumber : ''
      },
      {
        key: '{{.Claim.Status.Value}}',
        value: this.claim.status?.value ? this.claim.status?.value : ''
      },
      { key: '{{.Claim.CurrentPhase.Value}}', value: '' },
      { key: '{{.Claim.NetClaimed}}', value: '' },
      { key: '{{.Claim.TotalReplCost}}', value: '' },
      { key: '{{.Claim.InitialOffer}}', value: '' },
      { key: '{{.Claim.TotalPayment}}', value: '' },
      { key: '{{.Claim.ClientExpense}}', value: '' },
      { key: '{{.Claim.CompanyExpense}}', value: '' },
      { key: '{{.Claim.CombinedExpense}}', value: '' },

      // Adjuster Tokens

      {
        key: '{{.Adjuster.Name}}',
        value:
          this.claim.personnel &&
          this.claim.personnel[0] &&
          this.claim.personnel[0].name
            ? this.claim.personnel[0].name
            : ''
      },
      { key: '{{.Adjuster.Email}}', value: '' },
      { key: '{{.Adjuster.LicenseNo}}', value: '' },
      { key: '{{.Adjuster.PhoneNumber.Number}}', value: '' },
      { key: '{{.Adjuster.Fax.Number}}', value: '' },
      { key: '{{.Adjuster.Cell.Number}}', value: '' },
      { key: '{{.Adjuster.Address.Address1}}', value: '' },
      { key: '{{.Adjuster.Address.Address2}}', value: '' },
      { key: '{{.Adjuster.Address.AddressRegion}}', value: '' },
      { key: '{{.Adjuster.Address.PostalCode}}', value: '' },
      { key: '{{.Adjuster.Address.AddressCountry}}', value: '' },
      { key: '{{.Adjuster.Address.AddressLocality}}', value: '' },

      // Claim Property Tokens
      { key: '{{.Claim.LossInfo.Property.Name}}', value: '' },
      { key: '{{.Claim.LossInfo.Property.PropertyType.Value}}', value: '' },
      { key: '{{.Claim.LossInfo.Property.PropertyDesc}}', value: '' },
      {
        key: '{{.Claim.LossInfo.ClaimReason.Value}}',
        value: this.claim.lossInfo?.claimReason?.value
          ? this.claim.lossInfo?.claimReason?.value
          : ''
      },
      { key: '{{localTZ .Claim.LossInfo.Date}}', value: '' },

      {
        key: '{{.Claim.LossInfo.Date}}',
        value: this.claim.lossInfo?.date
          ? dateToShow(this.claim.lossInfo?.date)
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Cause.Value}}',
        value: this.claim.lossInfo.cause?.value
          ? this.claim.lossInfo.cause?.value
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Cause.Desc}}',
        value: this.claim.lossInfo.cause?.desc
          ? this.claim.lossInfo.cause?.desc
          : ''
      },

      {
        key: '{{.Claim.LossInfo.IsFEMA}}',
        value: this.claim.lossInfo.isFEMA ? this.claim.lossInfo.isFEMA : ''
      },
      {
        key: '{{.Claim.LossInfo.EmergencyName}}',
        value: this.claim.lossInfo.emergencyName
          ? this.claim.lossInfo.emergencyName
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Desc}}',
        value: this.claim.lossInfo.desc ? this.claim.lossInfo.desc : ''
      },
      {
        key: '{{.Claim.LossInfo.IsHabitable}}',
        value: this.claim.lossInfo.isHabitable
          ? this.claim.lossInfo.isHabitable
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Serverity.Value}}',
        value: this.claim.lossInfo.serverity?.value
          ? this.claim.lossInfo.serverity?.value
          : ''
      },
      {
        key: '{{.Claim.LossInfo.IsPPIF}}',
        value: this.claim.lossInfo?.isPPIF ? this.claim.lossInfo?.isPPIF : ''
      },
      {
        key: '{{.Claim.LossInfo.IsNeedPPIF}}',
        value: this.claim.lossInfo.isNeedPPIF
          ? this.claim.lossInfo.isNeedPPIF
          : ''
      },
      {
        key: '{{.Claim.LossInfo.HasHomeMortgage}}',
        value: this.claim.lossInfo.hasHomeMortgage
          ? this.claim.lossInfo.hasHomeMortgage
          : ''
      },
      {
        key: '{{.Claim.LossInfo.IsEmergency}}',
        value: this.claim.lossInfo.isEmergency
          ? this.claim.lossInfo.isEmergency
          : ''
      },
      { key: '{{.Claim.LossInfo.EstimatedLossAmt}}', value: '' },
      { key: '{{.Claim.LossInfo.PropertyValue}}', value: '' },

      {
        key: '{{.Claim.LossInfo.Property.Address1}}',
        value: this.claim.lossInfo.property?.address1
          ? this.claim.lossInfo.property?.address1
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Property.Address2}}',
        value: this.claim.lossInfo.property?.address2
          ? this.claim.lossInfo.property?.address2
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Property.AddressRegion}}',
        value: this.claim.lossInfo.property?.addressRegion
          ? this.claim.lossInfo.property?.addressRegion
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Property.PostalCode}}',
        value: this.claim.lossInfo.property?.postalCode
          ? this.claim.lossInfo.property?.postalCode
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Property.AddressCountry}}',
        value: this.claim.lossInfo.property?.addressCountry
          ? this.claim.lossInfo.property?.addressCountry
          : ''
      },
      {
        key: '{{.Claim.LossInfo.Property.AddressLocality}}',
        value: this.claim.lossInfo.property?.addressLocality
          ? this.claim.lossInfo.property?.addressLocality
          : ''
      },

      // Policy Info Tokens
      {
        key: '{{.Claim.PolicyInfo.Number}}',
        value: this.claim.policyInfo?.number ? this.claim.policyInfo.number : ''
      },
      {
        key: '{{.Claim.PolicyInfo.IsClaimFiled}}',
        value: this.claim.policyInfo?.isClaimFiled
          ? this.claim.policyInfo.isClaimFiled
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.IsForcedPlaced}}',
        value: this.claim.policyInfo?.isForcedPlaced
          ? this.claim.policyInfo.isForcedPlaced
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.Category.Value}}',
        value: this.claim.policyInfo?.category?.value
          ? this.claim.policyInfo.category.value
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.Type.Value}}',
        value: this.claim.policyInfo?.type?.value
          ? this.claim.policyInfo.type.value
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.LimitCoverage.Dwelling}}',
        value: this.claim.policyInfo?.limitCoverage.dwelling
      },
      {
        key: '{{.Claim.PolicyInfo.LimitCoverage.OtherStructure}}',
        value: this.claim.policyInfo?.limitCoverage?.otherStructure
          ? this.claim.policyInfo.limitCoverage?.otherStructure
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.LimitCoverage.Content}}',
        value: this.claim.policyInfo?.limitCoverage?.content
          ? this.claim.policyInfo.limitCoverage?.content
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.LimitCoverage.LossOfUse}}',
        value: this.claim.policyInfo?.limitCoverage?.lossOfUse
          ? this.claim.policyInfo.limitCoverage?.lossOfUse
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.DeductibleAmount}}',
        value: this.claim.policyInfo?.deductibleAmount
          ? this.claim.policyInfo.deductibleAmount
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.Depreciation}}',
        value: this.claim.policyInfo?.depreciation
          ? this.claim.policyInfo.depreciation
          : ''
      },

      {
        key: '{{.Claim.PolicyInfo.Declaration.IsDeclared}}',
        value: this.claim.policyInfo?.declaration?.isDeclared
          ? this.claim.policyInfo.declaration.isDeclared
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.Declaration.FileInfo.ID}}',
        value: this.claim.policyInfo?.declaration?.fileInfo?.id
          ? this.claim.policyInfo.declaration?.fileInfo.id
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.Declaration.FileInfo.Value}}',
        value: this.claim.policyInfo?.declaration?.fileInfo?.value
          ? this.claim.policyInfo.declaration?.fileInfo?.value
          : ''
      },
      {
        key: '{{.Claim.PolicyInfo.PriorPayment}}',
        value: this.claim.policyInfo?.priorPayment
          ? this.claim.policyInfo.priorPayment
          : ''
      },

      {
        key: '{{.Claim.PolicyInfo.LimitReason}}',
        value: this.claim.policyInfo?.limitReason
          ? this.claim.policyInfo.limitReason
          : ''
      },

      {
        key: '{{.Claim.PolicyInfo.HasAppraisalClause}}',
        value: ''
      },

      {
        key: '{{.Claim.PolicyInfo.TotalAmount}}',
        value: ''
      },

      {
        key: '{{.Claim.PolicyInfo.Ordinance}}',
        value: ''
      },

      {
        key: '{{.Claim.PolicyInfo.DebrisRemoval}}',
        value: ''
      },

      {
        key: '{{.Claim.PolicyInfo.Mold}}',
        value: ''
      },

      {
        key: '{{localTZ .Claim.PolicyInfo.EffectiveDate}}',
        value: this.claim.policyInfo?.effectiveDate
          ? dateToShow(this.claim.policyInfo.effectiveDate)
          : ''
      },
      {
        key: '{{localTZ .Claim.PolicyInfo.ExpirationDate}}',
        value: this.claim.policyInfo?.expirationDate
          ? dateToShow(this.claim.policyInfo.expirationDate)
          : ''
      },

      //   Claim Mortgage tokens

      {
        key: '{{.ClaimMortgage.Name}}',
        value:
          this.claim.mortgageInfo && this.claim.mortgageInfo[0]?.value
            ? this.claim.mortgageInfo[0]?.value
            : ''
      },
      {
        key: '{{.ClaimMortgage.Email}}',
        value:
          this.claim.mortgageInfo && this.claim.mortgageInfo[0]?.email
            ? this.claim.mortgageInfo[0].email
            : ''
      },
      {
        key: '{{.ClaimMortgage.Phone.Number}}',
        value:
          this.claim.mortgageInfo && this.claim.mortgageInfo[0]?.phone
            ? this.claim.mortgageInfo[0]?.phone
            : ''
      },
      {
        key: '{{.ClaimMortgage.Address.AddressCountry}}',
        value:
          this.claim.mortgageInfo &&
          this.claim.mortgageInfo[0]?.address?.addressCountry
            ? this.claim.mortgageInfo[0]?.address?.addressCountry
            : ''
      },
      {
        key: '{{.ClaimMortgage.Address.AddressLocality}}',
        value: ''
      },
      {
        key: '{{.ClaimMortgage.Address.AddressRegion}}',
        value:
          this.claim.mortgageInfo &&
          this.claim.mortgageInfo[0]?.address?.addressLocality
            ? this.claim.mortgageInfo[0]?.address?.addressLocality
            : ''
      },
      {
        key: '{{.ClaimMortgage.Address.PostalCode}}',
        value:
          this.claim.mortgageInfo &&
          this.claim.mortgageInfo[0]?.address?.postalCode
            ? this.claim.mortgageInfo[0]?.address?.postalCode
            : ''
      },
      {
        key: '{{.ClaimMortgage.Address.Address1}}',
        value:
          this.claim.mortgageInfo &&
          this.claim.mortgageInfo[0]?.address?.address1
            ? this.claim.mortgageInfo[0]?.address?.address1
            : ''
      },
      {
        key: '{{.ClaimMortgage.Address.Address2}}',
        value:
          this.claim.mortgageInfo &&
          this.claim.mortgageInfo[0]?.address?.address2
            ? this.claim.mortgageInfo[0]?.address?.address2
            : ''
      },
      {
        key: '{{.ClaimMortgage.Address.HouseNumber}}',
        value:
          this.claim.mortgageInfo &&
          this.claim.mortgageInfo[0]?.address?.houseNumber
            ? this.claim.mortgageInfo[0]?.address?.houseNumber
            : ''
      },
      {
        key: '{{.ClaimMortgage.LoanNumber}}',
        value:
          this.claim.mortgageInfo && this.claim.mortgageInfo[0]?.loanNumber
            ? this.claim.mortgageInfo[0]?.loanNumber
            : ''
      },
      {
        key: '{{.ClaimMortgage.AccountNumber}}',
        value:
          this.claim.mortgageInfo && this.claim.mortgageInfo[0]?.accountNumber
            ? this.claim.mortgageInfo[0]?.accountNumber
            : ''
      },
      {
        key: '{{.ClaimMortgage.Note}}',
        value:
          this.claim.mortgageInfo && this.claim.mortgageInfo[0]?.notes
            ? this.claim.mortgageInfo[0]?.notes
            : ''
      },

      // Claim Estimator tokens
      {
        key: '{{.ClaimEstimator.Name}}',
        value: this.claim.estimatingInformation?.name
          ? this.claim.estimatingInformation?.name
          : ''
      },
      {
        key: '{{.ClaimEstimator.Fname}}',
        value: ''
      },
      { key: '{{.ClaimEstimator.Lname}}', value: '' },
      {
        key: '{{.ClaimEstimator.Phone.Number}}',
        value: this.claim.estimatingInformation?.phone?.number
          ? this.claim.estimatingInformation.phone.number
          : ''
      },
      { key: '{{.ClaimEstimator.Fax.Number}}', value: '' },
      { key: '{{.ClaimEstimator.Cell.Number}}', value: '' },
      {
        key: '{{.ClaimEstimator.Email}}',
        value: this.claim.estimatingInformation?.email
          ? this.claim.estimatingInformation?.email
          : ''
      },
      {
        key: '{{.ClaimEstimator.ScopeTimeNeeded}}',
        value: this.claim.estimatingInformation?.scopeTimeNeededInHours
          ? this.claim.estimatingInformation.scopeTimeNeededInHours
          : ''
      },
      {
        key: '{{.ClaimEstimator.NotesToEstimator}}',
        value: this.claim.estimatingInformation?.notesToEstimator
          ? this.claim.estimatingInformation?.notesToEstimator
          : ''
      },

      //Claim Vednor Tokens

      {
        key: '{{.ClaimVendor.Name}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          ?.value
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor.value
          : ''
      },
      {
        key: '{{.ClaimVendor.IsAlreadyHired}}',
        value: this.claim.expertVendorInformation?.alreadyHired
          ? this.claim.expertVendorInformation.alreadyHired
          : ''
      },
      { key: '{{.ClaimVendor.ExpertNotes}}', value: '' },
      {
        key: '{{.ClaimVendor.Email}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          ?.email
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor.email
          : ''
      },
      {
        key: '{{.ClaimVendor.Phone.Number}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          ?.phone
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor.phone
          : ''
      },
      { key: '{{.ClaimVendor.Fax.Number}}', value: '' },
      { key: '{{.ClaimVendor.Cell.Number}}', value: '' },
      {
        key: '{{.ClaimVendor.Address.AddressCountry}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          .mailingAddress?.addressCountry
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor
              .mailingAddress.addressCountry
          : ''
      },
      {
        key: '{{.ClaimVendor.Address.AddressLocality}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          .mailingAddress?.AddressLocality
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor
              .mailingAddress.AddressLocality
          : ''
      },
      {
        key: '{{.ClaimVendor.Address.AddressRegion}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          .mailingAddress?.AddressRegion
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor
              .mailingAddress.AddressRegion
          : ''
      },
      {
        key: '{{.ClaimVendor.Address.PostalCode}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          .mailingAddress?.PostalCode
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor
              .mailingAddress.PostalCode
          : ''
      },
      { key: '{{.ClaimVendor.Address.Address1}}', value: '' },
      { key: '{{.ClaimVendor.Address.Address2}}', value: '' },
      {
        key: '{{.ClaimVendor.Address.HouseNumber}}',
        value: this.claim.expertVendorInformation?.isHiredVendor[0]?.vendor
          .mailingAddress?.HouseNumber
          ? this.claim.expertVendorInformation.isHiredVendor[0].vendor
              .mailingAddress.HouseNumber
          : ''
      },

      // Claim Contarct Info Tokens
      {
        key: '{{localTZ .Claim.ContractInfo.Date}}',
        value: this.claim.contractInfo?.date
          ? dateToShow(this.claim.contractInfo.date)
          : ''
      },
      {
        key: '{{.Claim.ContractInfo.Fees.Type}}',
        value: this.claim.contractInfo?.fees?.type
          ? this.claim.contractInfo.fees.type
          : ''
      },
      {
        key: '{{.Claim.ContractInfo.Fees.Rate}}',
        value: this.claim.contractInfo?.fees?.rate
          ? this.claim.contractInfo.fees.rate
          : ''
      },
      {
        key: '{{localTZ .Claim.ContractInfo.DateOfFirstContact}}',
        value: this.claim.contractInfo?.dateOfFirstContact
          ? dateToShow(this.claim.contractInfo.dateOfFirstContact)
          : ''
      },
      {
        key: '{{.Claim.ContractInfo.Source.Type}}',
        value: this.claim.contractInfo?.source?.type
          ? this.claim.contractInfo.source.type
          : ''
      },
      {
        key: '{{.Claim.ContractInfo.Source.Detail}}',
        value: this.claim.contractInfo?.source?.detail
          ? this.claim.contractInfo.source.detail
          : ''
      },

      //  Claim Carrier Tokens

      { key: '{{.ClaimCarrier.NAICCode}}', value: '' },
      {
        key: '{{.ClaimCarrier.Name}}',
        value: this.claim.policyInfo?.carrier?.value
          ? this.claim.policyInfo.carrier.value
          : ''
      },
      {
        key: '{{.ClaimCarrier.Phone.Number}}',
        value: this.claim.policyInfo?.carrier?.phone
          ? this.claim.policyInfo.carrier.phone
          : ''
      },
      { key: '{{.ClaimCarrier.Fax.Number}}', value: '' },
      { key: '{{.ClaimCarrier.Cell.Number}}', value: '' },
      {
        key: '{{.ClaimCarrier.Address.AddressCountry}}',
        value: this.claim.policyInfo?.carrier?.address?.addressCountry
          ? this.claim.policyInfo.carrier.address.addressCountry
          : ''
      },
      {
        key: '{{.ClaimCarrier.Address.AddressLocality}}',
        value: this.claim.policyInfo?.carrier?.address?.addressLocality
          ? this.claim.policyInfo.carrier.address.addressLocality
          : ''
      },
      {
        key: '{{.ClaimCarrier.Address.AddressRegion}}',
        value: this.claim.policyInfo?.carrier?.address?.addressRegion
          ? this.claim.policyInfo.carrier.address.addressRegion
          : ''
      },
      {
        key: '{{.ClaimCarrier.Address.PostalCode}}',
        value: this.claim.policyInfo?.carrier?.address?.postalCode
          ? this.claim.policyInfo.carrier.address.postalCode
          : ''
      },
      {
        key: '{{.ClaimCarrier.Address.Address1}}',
        value: this.claim.policyInfo?.carrier?.address?.address1
          ? this.claim.policyInfo.carrier.address.address1
          : ''
      },
      {
        key: '{{.ClaimCarrier.Address.Address2}}',
        value: this.claim.policyInfo?.carrier?.address?.address2
          ? this.claim.policyInfo.carrier.address.address2
          : ''
      },
      {
        key: '{{.ClaimCarrier.Address.HouseNumber}}',
        value: this.claim.policyInfo?.carrier?.address?.houseNumber
          ? this.claim.policyInfo.carrier.address.houseNumber
          : ''
      }
    ];
    var docObj = this.signedContractDocument.find(
      o => o.claimID === this.selectedClaimId
    );
    this.FinalDocumentObject = docObj;
  },

  methods: {
    ...mapActions([
      'getAllConfigurationTableData',
      'addTemplateLocal',
      'getPersonnelInfo',
      'getSingleClientDetails',
      'getSingleClaims'
    ]),
    ...mapMutations(['setContractDocument']),
    getBase64,
    dateToShow,
    async setTypes(value) {
      const obj = this.templateOptions.find(item => {
        return item.value === value.value;
      });

      this.templatetype.machineValue = obj.machineValue;

      const result = this.templates.find(template => {
        return template.name.machineValue === this.templatetype.machineValue;
      });

      this.tokenReplacement(result.name.value);
    },

    tokenReplacement(tokenString) {
      //Regex for getting the all tokens from the String

      var regex = /\{{(.*?)\}}/g;
      var match;

      while ((match = regex.exec(tokenString)) != null) {
        if (!this.tokenArray.includes(match[0])) {
          this.tokenArray.push(match[0]);
        }
      }

      var testString = tokenString.replace(/\u200B/g, '');
      this.tokenArray.forEach(token => {
        let result = this.tokens.find(o => o.key === token);

        if (result && result.value) {
          testString = testString.replaceAll(token, result.value);
        } else {
          testString = testString.replaceAll(token, '');
        }
      });

      this.finalDocumentString = testString;
    },

    async convertHtmlToPdf(documentString, documentType) {
      if (documentType !== 'signedDocument') {
        const intialContract = {
          claimId: this.selectedClaimId,
          document: documentString,
          template_type: this.templatetype.machineValue
        };
        var response = await this.addTemplateLocal(intialContract);
        this.documentId = response.id;
        this.document = '';
        this.showSignBtn = true;
        this.displayContractDocument = true;
      } else {
        const signedContract = {
          signed_document: documentString
        };
        await localDB.contractDocument.update(this.documentId, signedContract);

        this.setContractDocument({
          claimID: this.selectedClaimId,
          document: documentString
        });
        this.FinalDocumentObject = {
          claimID: this.selectedClaimId,
          document: documentString
        };

        this.signedDocument = documentString;
        this.showSignBtn = false;
        this.displayContractDocument = true;
      }
    },

    async onClickGenerateDocument() {
      this.convertHtmlToPdf(this.finalDocumentString);
    },
    async onSavingDocument() {
      this.pdfDailog = false;
      this.contractDocumentDialog = false;
      this.coInsuredSignatureDialog = false;

      const contractDocument = await localDB.contractDocument
        .where({ id: this.documentId })
        .toArray();

      this.pa_signature = contractDocument[0].pa_sign;
      this.insured_signature = contractDocument[0].insured_sign;
      this.co_insured_signature = contractDocument[0].co_insured_sign;

      // Adding  Sign Tokens with the Value
      if (this.pa_signature) {
        this.tokens.push({
          key: '{{.Signature.PA}}',
          value:
            "<img src=' " + this.pa_signature + " ' width='200' height='70'/> "
        });
      }
      if (this.co_insured_signature) {
        this.tokens.push({
          key: '{{.Signature.Coinsured}}',
          value:
            "<img src=' " +
            this.co_insured_signature +
            " ' width='200' height='70'/> "
        });
      }
      if (this.insured_signature) {
        this.tokens.push({
          key: '{{.Signature.Insured}}',
          value:
            "<img src=' " +
            this.insured_signature +
            " ' width='200' height='70'/> "
        });
      }

      const result = this.templates.find(template => {
        return template.name.machineValue === this.templatetype.machineValue;
      });

      this.tokenReplacement(result.name.value);
      this.convertHtmlToPdf(this.finalDocumentString, 'signedDocument');
    },

    onSignButtonClick(tokenValue) {
      this.signTokenValue = tokenValue;
      this.displayContractDocument = false;
      this.paSignaturePadDialog = true;
    },
    //This function is used for accepting the values that are coming from signature pad component

    async paSignData(data) {
      this.paSignaturePadDialog = false;
      this.insuredSignaturePadDialog = true;

      const payload = {
        pa_sign: data
      };

      await localDB.contractDocument.update(this.documentId, payload);
    },
    async insuredSignData(data) {
      this.insuredSignaturePadDialog = false;

      this.coInsuredSignatureDialog = true;

      const payload = {
        insured_sign: data
      };
      await localDB.contractDocument.update(this.documentId, payload);
    },
    async coInsuredSignData(data) {
      this.coInsuredSignatureDialog = false;

      const payload = {
        co_insured_sign: data
      };

      await localDB.contractDocument.update(this.documentId, payload);
      this.onSavingDocument();
    },
    showSignedDocument() {
      this.finalDocumentString = this.FinalDocumentObject.document;
      this.showSignBtn = false;
      this.displayContractDocument = true;
    }
  },

  computed: {
    ...mapGetters([
      'templates',
      'templateOptions',
      'signedContractDocument',
      'personnel',
      'editSelectedClient',
      'selectedClaimId'
    ])
  }
};
</script>
<style lang="scss"></style>
