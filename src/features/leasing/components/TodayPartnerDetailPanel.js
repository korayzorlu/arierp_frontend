import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import { setContractPaymentDialog, setInstallmentDialog, setPartnerDialog } from '../../../store/slices/notificationSlice';
import { fetchInstallmentInformation, setInstallmentsLoading } from '../../../store/slices/leasing/installmentSlice';
import { Box, IconButton } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { fetchContractPaymentsInLease } from '../../../store/slices/contracts/contractSlice';
import PaidIcon from '@mui/icons-material/Paid';
import ContractPaymentDialog from './ContractPaymentDialog';

function TodayPartnerDetailPanel(props) {
    const {uuid, todayPartnerLeases} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {contractPaymentsParams} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [data, setData] = useState({})
    const [selectedRows, setSelectedRows] = useState([]);
    const isFirstSelection = useRef(true);

    useEffect(() => {
        let allSelectedRows = [];
        if (apiRef.current) {
            const tableRows = apiRef.current.getAllRowIds().map((id) => apiRef.current.getRow(id))
            const overdueRowIds = []
            tableRows.forEach((tableRow) => {
                if (tableRow.leaseflex_automation){
                    overdueRowIds.push(tableRow.id)
                }
            })
            
            if(overdueRowIds.length > 0){
                apiRef.current.selectRows(overdueRowIds,true,true);
                const map = apiRef.current.getSelectedRows();
                map.forEach((row) => allSelectedRows.push(row));
            }else {
                isFirstSelection.current = false;
            }
        }
    }, [])

    const columns = [
        { field: 'code', headerName: 'Kira Planı', flex:2, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'contract', headerName: 'Sözleşme', flex:2 },
        { field: 'project', headerName: 'Proje', flex:6 },
        { field: 'block', headerName: 'Blok', flex:2 },
        { field: 'unit', headerName: 'Bağımsız Bölüm', flex:2 },
        { field: '', headerName: 'Tahsilatlar', flex:2, renderCell: (params) => (
                <IconButton aria-label='back' onClick={()=>{dispatch(fetchContractPaymentsInLease({activeCompany,contract_code:params.row.contract}));dispatch(setContractPaymentDialog(true))}}>
                    <PaidIcon/>
                </IconButton>
                
            )
        },
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', flex:2, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            }
        },
        { field: 'currency', headerName: 'PB', flex:1 },
        { field: 'overdue_days', headerName: 'Gecikme Süresi', flex:2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => (
                params.row.overdue_amount > 0
                ?
                    params.value >= 0
                    ?
                        `${params.value} gün`
                    :
                        null
                :
                    null
                
            )
        },
        { field: 'lease_status', headerName: 'Statü', flex:2 },
    ]

    const handleProfileDialog = async (params,event) => {
        if(params.field==="partner"){
            await dispatch(fetchPartnerInformation(params.row.partner_crm_code)).unwrap();
            dispatch(setPartnerDialog(true));
        }else if(params.field==="code"){
            dispatch(setInstallmentsLoading(true));
            await dispatch(fetchInstallmentInformation(params.row.code)).unwrap();
            dispatch(setInstallmentDialog(true));
            dispatch(setInstallmentsLoading(false));
        };
    };

    return (
        <Box sx={{ pt: 2, pb: 2, pl: 8, pr: 8 }}>
            <ListTable
            title={todayPartnerLeases.length > 1 ? `${todayPartnerLeases[0].partner} - ${todayPartnerLeases[0].partner_tc} Kira Planları` : ""}
            height="auto"
            autoHeight
            rows={todayPartnerLeases}
            columns={columns}
            getRowId={(row) => row ? row.id : 0}
            loading={leasesLoading}
            setParams={(value) => dispatch(setLeasesParams(value))}
            onCellClick={handleProfileDialog}
            showCellVerticalBorder
            showColumnVerticalBorder
            outline
            noToolbarButtons
            getRowClassName={(params) => `super-app-theme--${params.row.is_today > 0 ? "today" : ""}`}
            //noAllSelect
            //rowSelectionModel={selectedRows}
            //keepNonExistentRowsSelected
            //isRowSelected={(row) => row.overdue_amount > 0}
            //hideFooter
            noPagination
            apiRef={apiRef}
            initialState={{
                aggregation: {
                    model: {
                        overdue_amount: 'sum',
                    },
                },
            }}
            />
            <ContractPaymentDialog/>
        </Box>
    )
}

export default TodayPartnerDetailPanel
