import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import processReducer from './slices/processSlice';
import sidebarReduce from './slices/sidebarSlice';
import tableReducer from './slices/tableSlice';
import themeReducer from './slices/themeSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import organizationReducer from './slices/organizationSlice';
import sectorReducer from './slices/partners/sectorSlice';
import partnerReducer from './slices/partners/partnerSlice';
import websocketReducer from './slices/websocketSlice';
import dataReducer from './slices/dataSlice';
import accountReducer from './slices/accounting/accountSlice';
import transactionReducer from './slices/accounting/transactionSlice';
import invoiceReducer from './slices/accounting/invoiceSlice';
import paymentReducer from './slices/accounting/paymentSlice';
import settingsReducer from './slices/settings/settingsSlice';
import commonReducer from './slices/common/commonSlice';
import productReducer from './slices/products/productSlice';
import categoryReducer from './slices/products/categorySlice';
import bankaHareketiReducer from './slices/converters/bankaHareketleriSlice';
import bankaTahsilatiReducer from './slices/converters/bankaTahsilatlariSlice';
import bankaTahsilatiOdooReducer from './slices/converters/bankaTahsilatlariOdooSlice';
import contractReducer from './slices/contracts/contractSlice';
import leaseReducer from './slices/leasing/leaseSlice';
import installmentReducer from './slices/leasing/installmentSlice';
import quickQuotationReducer from './slices/quotations/quickQuotationSlice';
import quotationReducer from './slices/quotations/quotationSlice';
import tradeAccountReducer from './slices/trade/tradeAccountSlice';
import ledgerAccountReducer from './slices/ledger/ledgerAccountSlice';
import collectionReducer from './slices/leasing/collectionSlice';
import bankActivityReducer from './slices/leasing/bankActivitySlice';
import riskPartnerReducer from './slices/leasing/riskPartnerSlice';
import tomorrowPartnerReducer from './slices/leasing/tomorrowPartnerSlice';
import todayPartnerReducer from './slices/leasing/todayPartnerSlice';
import yesterdayPartnerReducer from './slices/leasing/yesterdayPartnerSlice';
import projectReducer from './slices/projects/projectSlice';
import purchasePaymentReducer from './slices/purchasing/purchasePaymentSlice';
import purchaseDocumentReducer from './slices/purchasing/purchaseDocumentSlice';
import financeReducer from './slices/finance/financeSlice';
import amountDebitTransactionReducer from './slices/risk/amountDebitTransactionSlice';
import bankAccountReducer from './slices/finance/bankAccountSlice';
import bankAccountTransactionReducer from './slices/finance/bankAccountTransactionSlice';
import partnerAdvanceReducer from './slices/finance/partnerAdvanceSlice';
import blackListPersonReducer from './slices/compliance/blackListPersonSlice';
import scanPartnerReducer from './slices/compliance/scanPartnerSlice';
import contractInSupplier from './slices/operation/contractInSupplierSlice';
import contractInArchive from './slices/operation/contractInArchiveSlice';
import contractInProcess from './slices/operation/contractInProcessSlice';
import partnerAdvanceActivitySlice from './slices/operation/partnerAdvanceActivitySlice';
import partnerAdvanceActivityLeaseSlice from './slices/operation/partnerAdvanceActivityLeaseSlice';
import trialBalanceReducer from './slices/accounting/trialBalanceSlice';
import trialBalanceContractReducer from './slices/accounting/trialBalanceContractSlice';
import underReviewReducer from './slices/risk/underReviewSlice';
import tradeTransactionReducer from './slices/trade/tradeTransactionSlice';
import smsReducer from './slices/communication/smsSlice';
import realEstateReducer from './slices/projects/realEstateSlice';
import parcelReducer from './slices/projects/parcelSlice';
import titleDeedReducer from './slices/projects/titleDeedSlice';
import toBeTransferredReducer from './slices/risk/toBeTransferredSlice';
import thirdPersonReducer from './slices/compliance/thirdPersonSlice';
import accountingUnderReviewReducer from './slices/accounting/underReviewSlice';
import trialBalanceTransactionReducer from './slices/accounting/trialBalanceTransactionSlice';
import bddkReducer from './slices/accounting/bddkSlice';
import pepPartnerReducer from './slices/compliance/pepPartnerSlice';

let navigate;

export const setNavigate = (nav) => {
    navigate = nav;
};

export const store = configureStore({
    reducer:{
        auth: authReducer,
        websocket: websocketReducer,
        subscriptions: subscriptionsReducer,
        organization: organizationReducer,
        data: dataReducer,
        notification: notificationReducer,
        sector: sectorReducer,
        partner: partnerReducer,
        process: processReducer,
        sidebar: sidebarReduce,
        //table: tableReducer,
        theme: themeReducer,
        account: accountReducer,
        settings: settingsReducer,
        common: commonReducer,
        transaction: transactionReducer,
        invoice: invoiceReducer,
        payment: paymentReducer,
        product: productReducer,
        category: categoryReducer,
        contract: contractReducer,
        lease: leaseReducer,
        installment: installmentReducer,
        quickQuotation: quickQuotationReducer,
        quotation: quotationReducer,
        bankaHareketi: bankaHareketiReducer,
        bankaTahsilati: bankaTahsilatiReducer,
        bankaTahsilatiOdoo: bankaTahsilatiOdooReducer,
        tradeAccount: tradeAccountReducer,
        ledgerAccount: ledgerAccountReducer,
        collection: collectionReducer,
        bankActivity: bankActivityReducer,
        riskPartner: riskPartnerReducer,
        tomorrowPartner: tomorrowPartnerReducer,
        todayPartner: todayPartnerReducer,
        yesterdayPartner: yesterdayPartnerReducer,
        project: projectReducer,
        purchasePayment: purchasePaymentReducer,
        purchaseDocument: purchaseDocumentReducer,
        finance: financeReducer,
        amountDebitTransaction: amountDebitTransactionReducer,
        bankAccount: bankAccountReducer,
        bankAccountTransaction: bankAccountTransactionReducer,
        partnerAdvance: partnerAdvanceReducer,
        blackListPerson: blackListPersonReducer,
        scanPartner: scanPartnerReducer,
        contractInSupplier: contractInSupplier,
        contractInArchive: contractInArchive,
        contractInProcess: contractInProcess,
        partnerAdvanceActivity: partnerAdvanceActivitySlice,
        partnerAdvanceActivityLease: partnerAdvanceActivityLeaseSlice,
        trialBalance: trialBalanceReducer,
        trialBalanceContract: trialBalanceContractReducer,
        underReview: underReviewReducer,
        tradeTransaction: tradeTransactionReducer,
        sms: smsReducer,
        realEstate: realEstateReducer,
        parcel: parcelReducer,
        titleDeed: titleDeedReducer,
        toBeTransferred: toBeTransferredReducer,
        thirdPerson: thirdPersonReducer,
        accountingUnderReview: accountingUnderReviewReducer,
        trialBalanceTransaction: trialBalanceTransactionReducer,
        bddk: bddkReducer,
        pepPartner: pepPartnerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: { navigate: (e) => navigate(e) },
          },
        }),
})
