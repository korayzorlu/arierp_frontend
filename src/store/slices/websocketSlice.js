import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotifications, send_notification, setAlert, setUnreadNotifications } from "./notificationSlice";
import { fetchImportProcess, setImportProgress } from "./processSlice";
import { fetchPartners } from "./partners/partnerSlice";
import { fetchObjects } from "./common/commonSlice";

const initialState = {
    
}

const fetchActions = {
    fetchPartners,
};

export const connectWebsocket = (dispatch,getState) => {
    const wsMain = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/socket/`);

    wsMain.onopen = function() {
        console.log('WebSocket bağlantısı başarıyla kuruldu.');
    };

    wsMain.onerror = function(error) {
        console.error('WebSocket hatası:', error);
        wsMain.close();
    };
    
    wsMain.onclose = function (event) {
        console.log(`Websocket kapatıldı! Kod: ${event.code}`);
        setTimeout(function() {
            connectWebsocket(dispatch, getState);
        }, 1000);
    };

    window.onload = function() {
        wsMain.close();
    };

    window.onbeforeunload = function() {
        wsMain.close();
    };

    wsMain.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const type = data.type
        const message = data.message;
        

        if(type === "send_notification"){
            dispatch(fetchNotifications()).unwrap();
            dispatch(send_notification(message));
            dispatch(setUnreadNotifications(1));
        }else if(type === "send_alert"){
            dispatch(setAlert({status:message.status,text:message.message}));
        }else if(type === "send_import_process_percent"){
            dispatch(setImportProgress({task:message.task,progress:message.progress}));
        }else if(type === "fetch_import_processes"){
            //dispatch(setAlert({status:"success",text:"test başarılı"}));
            dispatch(fetchImportProcess());
            if(message.status === "completed" || message.status === "rejected"){
                // dispatch(fetchObjects(
                //     {
                //         activeCompany:message.activeCompany,
                //         app:"partners",
                //         model:message.model,
                //         params:{
                //             start: 0 * 50,
                //             end: (0 + 1) * 50,
                //             format: 'datatables'
                //         }
                //     }
                // ))

                const actionName = `fetch${message.model}s`;

                if (fetchActions[actionName]) {
                    dispatch(fetchActions[actionName](
                        {
                            activeCompany:getState().organization.activeCompany,
                            params:{
                                start: 0 * 50,
                                end: (0 + 1) * 50,
                                format: 'datatables'
                            }
                        }
                    ));
                }
            }
        };
    
    };

    return wsMain;
}

export const joinWebsocket = createAsyncThunk('websocket/joinWebsocket', async (_, { dispatch,getState }) => {
    connectWebsocket(dispatch,getState);
    return true;
});



const websocketSlice = createSlice({
    name:"websocket",
    initialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder
            //join websocket
            .addCase(joinWebsocket.pending, (state) => {

            })
            .addCase(joinWebsocket.fulfilled, (state,action) => {
            })
            .addCase(joinWebsocket.rejected, (state,action) => {
                
            })

            
                
    }
})


export const {} = websocketSlice.actions;
export default websocketSlice.reducer;