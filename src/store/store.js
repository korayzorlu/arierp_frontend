import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import processReducer from './slices/processSlice';
import sidebarReduce from './slices/sidebarSlice';
import tableReducer from './slices/tableSlice';
import themeReducer from './slices/themeSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import organizationReducer from './slices/organizationSlice';
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
        bankaHareketi: bankaHareketiReducer,
        bankaTahsilati: bankaTahsilatiReducer,
        bankaTahsilatiOdoo: bankaTahsilatiOdooReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: { navigate: (e) => navigate(e) },
          },
        }),
})
