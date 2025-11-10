import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrialBalanceContracts, resetTrialBalanceContractsParams, setTrialBalanceContractsParams } from '../../../store/slices/accounting/trialBalanceContractSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Chip, Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';

function TrialBalanceContracts() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {trialBalanceContracts,trialBalanceContractsCount,trialBalanceContractsParams,trialBalanceContractsLoading} = useSelector((store) => store.trialBalanceContract);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        dispatch(resetTrialBalanceContractsParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTrialBalanceContracts({activeCompany,params:trialBalanceContractsParams}));
        });
    }, [activeCompany,trialBalanceContractsParams,dispatch]);

    const columns = [
        { field: 'code', headerName: 'Sözleşme No', flex: 1 },
        { field: 'partner', headerName: 'Müşteri', flex: 2 },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', flex: 1 },
        
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Mizan Listesi"
                rows={trialBalanceContracts}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={trialBalanceContractsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchTrialBalanceContracts({activeCompany,params:trialBalanceContractsParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={trialBalanceContractsCount}
                setParams={(value) => dispatch(setTrialBalanceContractsParams(value))}
                headerFilters={true}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default TrialBalanceContracts
