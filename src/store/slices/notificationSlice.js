import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Alert as MDBAlert} from 'mdb-ui-kit';

const initialState = {
    alert:{color:"",icon:"",text:""},
    alertt:{status:"",text:""},
    openAlert:false,
    dialog:false,
    deleteDialog:false,
    importDialog:false,
    exportDialog:false,
    userDialog:false,
    partnerDialog:false,
    installmentDialog:false,
    leaseDialog:false,
    overdueDialog:false,
    addBankActivityLeaseDialog:false,
    addPartnerAdvanceActivityLeaseDialog:false,
    callDialog:false,
    messageDialog:false,
    sendSMSDialog:false,
    contractPaymentDialog:false,
    warningNoticeDialog:false,
    purchaseDocumentDialog:false,
    tradeTransactionDialog:false,
    thirdPersonStatusDialog:false,
    thirdPersonDocumentDialog:false,
    thirdPersonPaymentDetailDialog:false,
    thirdPersonDialog:false,
    finmaksTransactionNameDialog:false,
    changePartnerDialog:false,
    modal:false,
    notifications:[],
    unreadNotifications:0
}

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
    const response = await axios.get(`/notifications/api/notifications`, {withCredentials: true});
    return response.data;
});

export const changeNotifications = createAsyncThunk('notifications/changeNotifications', async () => {
    const response = await axios.put(`/notifications/api/notifications/`,
        {   
            id: 0,
            is_read: true
        },
        {withCredentials: true}
    );
    return response.data;
});

export const readNotifications = createAsyncThunk('notifications/readNotifications', async () => {
    const response = await axios.post(`/notifications/read_notification/`,{withCredentials: true});
    return response.data;
});

const notificationSlice = createSlice({
    name:"notification",
    initialState,
    reducers:{
        setAlert: (state,action) => {
            state.alertt = {status:action.payload.status || "",text:action.payload.text || ""}
            state.openAlert = true;
        },
        setOpenAlert: (state,action) => {
            state.openAlert = action.payload;
        },
        clearAlert: (state,action) => {
            state.alert = "";
        },
        setDialog: (state,action) => {
            state.dialog = action.payload;
        },
        setDeleteDialog: (state,action) => {
            state.deleteDialog = action.payload;
        },
        setImportDialog: (state,action) => {
            state.importDialog = action.payload;
        },
        setExportDialog: (state,action) => {
            state.exportDialog = action.payload;
        },
        setUserDialog: (state,action) => {
            state.userDialog = action.payload;
        },
        setPartnerDialog: (state,action) => {
            state.partnerDialog = action.payload;
        },
        setInstallmentDialog: (state,action) => {
            state.installmentDialog = action.payload;
        },
        setLeaseDialog: (state,action) => {
            state.leaseDialog = action.payload;
        },
        setOverdueDialog: (state,action) => {
            state.overdueDialog = action.payload;
        },
        setAddBankActivityLeaseDialog: (state,action) => {
            state.addBankActivityLeaseDialog = action.payload;
        },
        setAddPartnerAdvanceActivityLeaseDialog: (state,action) => {
            state.addPartnerAdvanceActivityLeaseDialog = action.payload;
        },
        setCallDialog: (state,action) => {
            state.callDialog = action.payload;
        },
        setMessageDialog: (state,action) => {
            state.messageDialog = action.payload;
        },
        setSendSMSDialog: (state,action) => {
            state.sendSMSDialog = action.payload;
        },
        setContractPaymentDialog: (state,action) => {
            state.contractPaymentDialog = action.payload;
        },
        setTradeTransactionDialog: (state,action) => {
            state.tradeTransactionDialog = action.payload;
        },
        setWarningNoticeDialog: (state,action) => {
            state.warningNoticeDialog = action.payload;
        },
        setPurchaseDocumentDialog: (state,action) => {
            state.purchaseDocumentDialog = action.payload;
        },
        setThirdPersonStatusDialog: (state,action) => {
            state.thirdPersonStatusDialog = action.payload;
        },
        setThirdPersonDocumentDialog: (state,action) => {
            state.thirdPersonDocumentDialog = action.payload;
        },
        setThirdPersonPaymentDetailDialog: (state,action) => {
            state.thirdPersonPaymentDetailDialog = action.payload;
        },
        setThirdPersonDialog: (state,action) => {
            state.thirdPersonDialog = action.payload;
        },
        setFinmaksTransactionNameDialog: (state,action) => {
            state.finmaksTransactionNameDialog = action.payload;
        },
        setChangePartnerDialog: (state,action) => {
            state.changePartnerDialog = action.payload;
        },
        setModal: (state,action) => {
            state.modal = action.payload;
        },
        send_notification: (state,action) => {

            
        },
        setUnreadNotifications: (state,action) => {
            state.unreadNotifications = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //fetch websocket
            .addCase(fetchNotifications.pending, (state) => {

            })
            .addCase(fetchNotifications.fulfilled, (state,action) => {
                state.notifications = action.payload;
                state.unreadNotifications = action.payload.filter(item => !item.is_read).length;
            })
            .addCase(fetchNotifications.rejected, (state,action) => {
                
            })
    }
  
})

export const {
    setAlert,
    setOpenAlert,
    clearAler,
    setDialog,
    setDeleteDialog,
    setImportDialog,
    setExportDialog,
    setModal,
    send_notification,
    setUnreadNotifications,
    setUserDialog,
    setPartnerDialog,
    setInstallmentDialog,
    setLeaseDialog,
    setOverdueDialog,
    setAddBankActivityLeaseDialog,
    setAddPartnerAdvanceActivityLeaseDialog,
    setCallDialog,
    setMessageDialog,
    setSendSMSDialog,
    setContractPaymentDialog,
    setTradeTransactionDialog,
    setWarningNoticeDialog,
    setPurchaseDocumentDialog,
    setThirdPersonStatusDialog,
    setThirdPersonDocumentDialog,
    setThirdPersonPaymentDetailDialog,
    setThirdPersonDialog,
    setFinmaksTransactionNameDialog,
    setChangePartnerDialog,
} = notificationSlice.actions;
export default notificationSlice.reducer;