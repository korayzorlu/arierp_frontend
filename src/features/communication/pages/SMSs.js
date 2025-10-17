import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchSMSs, setSMSsParams } from '../../../store/slices/communication/smsSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';

function SMSs() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchSMSs({activeCompany,params:smssParams}));
        });
    }, [activeCompany,smssParams,dispatch]);

    const columns = [
        { field: 'partner', headerName: 'Müşteri', width: 400 },
        { field: 'phone_number', headerName: 'Tel. No.', flex: 2 },
        
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Gönderilen SMS'ler"
                rows={smss}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={smssLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchSMSs({activeCompany,params:smssParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={smssCount}
                setParams={(value) => dispatch(setSMSsParams(value))}
                headerFilters={true}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default SMSs
