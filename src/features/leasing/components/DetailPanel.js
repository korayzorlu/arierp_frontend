import { Box, IconButton } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react'
import ListTable from '../../../component/table/ListTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOverdueInformation, setLeaseOverdues, setLeasesLoading, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import { setAddBankActivityLeaseDialog, setAlert, setContractPaymentDialog, setImportDialog, setInstallmentDialog, setOverdueDialog, setPartnerDialog } from '../../../store/slices/notificationSlice';
import { fetchInstallmentInformation, setInstallmentsLoading } from '../../../store/slices/leasing/installmentSlice';
import { updateLeaseflexAutomationBankActivityLeases } from '../../../store/slices/leasing/collectionSlice';
import { setIsProgress } from '../../../store/slices/processSlice';
import axios from 'axios';
import CustomTableButton from '../../../component/table/CustomTableButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { fetchBankActivities, fetchBankActivity, fetchBankActivityLeases, setBankActivitiesLoading } from '../../../store/slices/leasing/bankActivitySlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import AddBankActivityLeaseDialog from '../../../component/feedback/AddBankActivityLeaseDialog';
import ContractPaymentDialog from './ContractPaymentDialog';
import { fetchContractPaymentsInLease, setContractPaymentsInLeaseCode, setContractPaymentsParams } from '../../../store/slices/contracts/contractSlice';
import PaidIcon from '@mui/icons-material/Paid';
import OverdueDialog from '../../../component/dialog/OverdueDialog';
import OverdueDetailDetailPanel from './OverdueDetailPanel';
import { amountFormatter, parseLocalizedAmount } from '../../../utils/floatUtils';

function DetailPanel(props) {
    const {uuid,bank_activity_leases,onOpen} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});
    const isFirstSelection = useRef(true);

    const [data, setData] = useState({leases:[]})
    const [selectedRows, setSelectedRows] = useState([]);
    

     const fetchData = async () => {
        const response = await dispatch(fetchBankActivity({activeCompany,params:{uuid}})).unwrap();
        setData(response);
        
        
    };

    useEffect(() => {
        fetchData();
        
        
    }, [activeCompany])


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
        
    }, [data.leases])

    const columns = [
        { field: 'code', headerName: 'Kira Planı', flex:2, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'contract', headerName: 'Sözleşme', flex:1.5 },
        { field: 'project', headerName: 'Proje', flex:2, renderCell: (params) => (
            params.value
            ?
                params.value.includes("KIZILBÜK")
                ?
                    "KIZILBÜK"
                :
                    params.value
            :
                ""
        )

        },
        { field: 'block', headerName: 'Blok', flex:2 },
        { field: 'unit', headerName: 'Bağımsız Bölüm', flex:2 },
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', flex:2, type: 'number',
            renderHeaderFilter: () => null,
            cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            }
        },
        { field: 'processed_amount', headerName: 'işlenen Tutar', flex:2, editable: true, preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                //const value = parseFloat(params.props.value);
                const convertedValue = parseLocalizedAmount(params.props.value)
                const isValid = Number.isFinite(convertedValue);
                return { ...params.props, value: isValid ? convertedValue : 0, error: 0 }
            
            },
            valueFormatter: (value) => {
                if (value === null || value === undefined) {
                    return ''; // boş göster
                }
                const convertedValue = parseLocalizedAmount(value);
                //return  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(convertedValue);
                return Number(convertedValue);
            }
                
            
        },
        { field: '', headerName: 'Tahsilatlar', flex:2, renderCell: (params) => (
                <IconButton aria-label='back' onClick={()=>{dispatch(fetchContractPaymentsInLease({activeCompany,contract_code:params.row.contract}));dispatch(setContractPaymentDialog(true))}}>
                    <PaidIcon/>
                </IconButton>
                
            )
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
        { field: 'next_payment', headerName: 'Gelecek Ödeme', flex:2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'collection_status', headerName: 'Statü', flex:2 },
    ]

    const handleProfileDialog = async (params,event) => {
        if (event) {
            event.stopPropagation();
        }
        if(params.field==="partner"){
            await dispatch(fetchPartnerInformation(params.row.partner_crm_code)).unwrap();
            dispatch(setPartnerDialog(true));
        }else if(params.field==="code"){
            dispatch(setInstallmentsLoading(true));
            await dispatch(fetchInstallmentInformation(params.row.code)).unwrap();
            dispatch(setInstallmentDialog(true));
            dispatch(setInstallmentsLoading(false));
        }
    };

    const previousSelectedRows = useRef(new Set());

    const handleSelectionChange = () => {
        const currentSelection = new Set(apiRef.current.getSelectedRows().keys());

        if (isFirstSelection.current) {
            isFirstSelection.current = false;
            previousSelectedRows.current = currentSelection;
            return;
        }

        const added = [...currentSelection].filter(id => !previousSelectedRows.current.has(id));
        const removed = [...previousSelectedRows.current].filter(id => !currentSelection.has(id));

        if (added.length > 0) {
            dispatch(updateLeaseflexAutomationBankActivityLeases({activeCompany,data:{uuids:added,select:true}}))
        }
        if (removed.length > 0) {
            dispatch(updateLeaseflexAutomationBankActivityLeases({activeCompany,data:{uuids:removed,select:false}}))
        }

        previousSelectedRows.current = currentSelection;
    };
    
    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    const handleProcessRowUpdate = async (newRow,oldRow) => {
        const convertedValue = parseLocalizedAmount(newRow.processed_amount)
        try {
            if (!Number.isFinite(convertedValue)) {
                throw new Error("Geçersiz sayı değeri");
            }

            try {
                const response = await axios.post(`/leasing/update_bank_activity_lease_processed_amount/`,
                    {
                        uuid: newRow.id,
                        amount: convertedValue
                    },
                    { 
                        withCredentials: true
                    },
                );
                dispatch(setAlert({status:response.data.status,text:response.data.message}))
            } catch (error) {
                if(error.response.data){
                    dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
                }else{
                    dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
                };
                return null
            } 


            const updatedRow = { ...newRow, isUpdated: true };

            return updatedRow;
        } catch (error) {
            return {
                ...oldRow,
                processed_amount: oldRow.processed_amount
            };
        } 
    };


    return (
        <Box sx={{ pt: 2, pb: 2, pl: 8, pr: 8 }}>
            <ListTable
            title={data.leases.length > 1 ? `${data.leases[0].partner} - ${data.leases[0].partner_tc} Kira Planları` : ""}
            height="auto"
            autoHeight
            rows={data.leases}
            columns={columns}
            getRowId={(row) => row ? row.id : 0}
            specialButtons={
                    <>
                        <CustomTableButton
                        title="Yeni"
                        onClick={() => {dispatch(setAddBankActivityLeaseDialog(true));}}
                        icon={<AddBoxIcon fontSize="small"/>}
                        />
                    </>
                }
            setParams={(value) => dispatch(setLeasesParams(value))}
            onCellClick={handleProfileDialog}
            showCellVerticalBorder
            showColumnVerticalBorder
            outline
            noToolbarButtons
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            //noAllSelect
            checkboxSelection={true}
            disableRowSelectionOnClick={true}
            onRowSelectionModelChange={handleSelectionChange}
            //rowSelectionModel={selectedRows}
            keepNonExistentRowsSelected
            //isRowSelected={(row) => row.overdue_amount > 0}
            //hideFooter
            noPagination
            apiRef={apiRef}
            initialState={{
                aggregation: {
                    model: {
                        overdue_amount: 'sum',
                        processed_amount: 'sum',
                        next_payment: 'sum',
                    },
                },
            }}
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={(error) => console.log(error)}
            //cellFontSize="12px"
            getDetailPanelHeight={() => "auto"}
            getDetailPanelContent={(params) => {return(<OverdueDetailDetailPanel leaseOverdues={params.row.overdues}></OverdueDetailDetailPanel>)}}
            />
            <AddBankActivityLeaseDialog
            handleClose={() => dispatch(setAddBankActivityLeaseDialog(false))}
            submitURL="/leasing/add_bank_activity_lease"
            startEvent={() => dispatch(setBankActivitiesLoading(true))}
            finalEvent={() => {/*dispatch(fetchBankActivities({activeCompany}));*/dispatch(setBankActivitiesLoading(false));}}
            uuid={uuid}
            />
            <ContractPaymentDialog/>
            
        </Box>
    )
}

export default DetailPanel
