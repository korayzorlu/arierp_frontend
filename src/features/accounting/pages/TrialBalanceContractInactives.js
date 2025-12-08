


import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
import React, { startTransition, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrialBalanceContracts, resetTrialBalanceContractsParams, setTrialBalanceContractsParams } from '../../../store/slices/accounting/trialBalanceContractSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Chip, FormControl, Grid, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import TrialBalanceContractDetailPanel from '../components/TrialBalanceContractDetailPanel';

function TrialBalanceContractInactives() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {trialBalanceContracts,trialBalanceContractsCount,trialBalanceContractsParams,trialBalanceContractsLoading} = useSelector((store) => store.trialBalanceContract);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    
    const [filter, setFilter] = useState({lease_status: 'inactive', is_correct: false})

    useEffect(() => {
        dispatch(resetTrialBalanceContractsParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTrialBalanceContracts({activeCompany,params:{...trialBalanceContractsParams,lease_status: filter.lease_status, is_correct: filter.is_correct}}));
        });
    }, [activeCompany,trialBalanceContractsParams,dispatch]);

    const changeProject = (newValue) => {
        setFilter({lease_status: newValue, is_correct: false});
        dispatch(setTrialBalanceContractsParams({lease_status: newValue, is_correct: false}));
    };

    const columns = [
        { field: 'code', headerName: 'Sözleşme No', width: 120 },
        { field: 'trial_balances', headerName: 'Hesap Kodları', width: 400,
            renderCell: (params) => (
                
                    
                        params.value.trial_balances.map((tb) => (
                            <Chip key={tb.id} label={tb.main_account_code} color={dark ? 'cream' : 'ari'} size="small" sx={{mr: 0.5, mb: 0.5}} />
                        ))
                    
                    
              
                
            )
        },
        { field: 'partner', headerName: 'Müşteri', flex: 1 },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', width: 120 },
        { field: 'lease_status', headerName: 'Statü', width: 120 },
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Sözleşme Mizanları Listesi"
                rows={trialBalanceContracts}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={trialBalanceContractsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchTrialBalanceContracts({activeCompany,params:{...trialBalanceContractsParams,lease_status: filter.lease_status, is_correct: filter.is_correct}})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                customFiltersLeft={
                    <>
                        <FormControl sx={{mr: 2}}>
                            <InputLabel id="demo-simple-select-label">Statü</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            size='small'
                            value={filter.lease_status}
                            label="Proje"
                            onChange={(e) => changeProject(e.target.value)}
                            disabled={trialBalanceContractsLoading}
                            >
                                <MenuItem value='inactive'>Tümü</MenuItem>
                                <MenuItem value='devredildi'>Devredildi</MenuItem>
                                <MenuItem value='feshedildi'>Feshedildi</MenuItem>
                                {/* <MenuItem value='durduruldu'>Durduruldu</MenuItem> */}
                            </Select>
                        </FormControl>
                    </>
                }
                autoRowHeight
                sx={{
                    [`& .${gridClasses.cell}`]: {
                        py: 1,
                    },
                }}
                rowCount={trialBalanceContractsCount}
                setParams={(value) => dispatch(setTrialBalanceContractsParams(value))}
                headerFilters={true}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<TrialBalanceContractDetailPanel uuid={params.row.uuid} trialBalanceContractTBs={params.row.trial_balances.trial_balances}></TrialBalanceContractDetailPanel>)}}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default TrialBalanceContractInactives
