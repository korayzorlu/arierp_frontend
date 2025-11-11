import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnderReviews, resetUnderReviewsParams, setUnderReviewsParams } from '../../../store/slices/accounting/underReviewSlice';
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
import TrialBalanceContractDetailPanel from '../components/TrialBalanceContractDetailPanel';

function AccountingUnderReviews() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {underReviews,underReviewsCount,underReviewsParams,underReviewsLoading} = useSelector((store) => store.accountingUnderReview);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        dispatch(resetUnderReviewsParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchUnderReviews({activeCompany,params:underReviewsParams}));
        });
    }, [activeCompany,underReviewsParams,dispatch]);

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
                rows={underReviews}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={underReviewsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchUnderReviews({activeCompany,params:underReviewsParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={underReviewsCount}
                setParams={(value) => dispatch(setUnderReviewsParams(value))}
                headerFilters={true}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<TrialBalanceContractDetailPanel uuid={params.row.uuid} trialBalanceContractTBs={params.row.trial_balances.trial_balances}></TrialBalanceContractDetailPanel>)}}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default AccountingUnderReviews
