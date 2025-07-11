import { Box } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react'
import ListTable from '../../../component/table/ListTable';
import { useDispatch, useSelector } from 'react-redux';
import { setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import { setInstallmentDialog, setPartnerDialog } from '../../../store/slices/notificationSlice';
import { fetchInstallmentInformation, setInstallmentsLoading } from '../../../store/slices/leasing/installmentSlice';
import { updateLeaseflexAutomationLease, updateLeaseflexAutomationLeases } from '../../../store/slices/leasing/collectionSlice';

function DetailPanel(props) {
    const {uuid,bank_activity_leases} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {collections,collectionsCount,collectionsParams,collectionsLoading} = useSelector((store) => store.collection);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);

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

    useEffect(() => {
        //dispatch(updateLeaseflexAutomationLease({data}));
    }, [])

    

    const columns = [
        { field: 'code', headerName: 'Kira Planı', flex:2, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'contract', headerName: 'Sözleşme', flex:2 },
        // { field: 'partner', headerName: 'Müşteri', width:280, renderCell: (params) => (
        //         <div style={{ cursor: 'pointer' }}>
        //             {params.value}
        //         </div>
        //     ),
        // },
        //{ field: 'partner_tc', headerName: 'Müşteri TC/VKN', width:160 },
        //{ field: 'activation_date', headerName: 'Aktifleştirme Tarihi', renderHeaderFilter: () => null },
        //{ field: 'quotation', headerName: 'Teklif No' },
        //{ field: 'kof', headerName: 'KOF No' },
        { field: 'project', headerName: 'Proje', flex:6 },
        { field: 'block', headerName: 'Blok', flex:2 },
        { field: 'unit', headerName: 'Bağımsız Bölüm', flex:2 },
        //{ field: 'vade', headerName: 'Vade', type: 'number' },
        //{ field: 'vat', headerName: 'KDV(%)', type: 'number' },
        //{ field: 'musteri_baz_maliyet', headerName: 'Müşteri Baz Maliyet', type: 'number'},
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', flex:2, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            }
        },
        { field: 'currency', headerName: 'PB' },
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
        { field: 'collection_status', headerName: 'Statü', flex:2 },
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

    const previousSelectedRows = useRef(new Set());

    const handleSelectionChange = () => {
       // console.log(Array.from(apiRef.current.getSelectedRows().values()))
        const currentSelection = new Set(apiRef.current.getSelectedRows().keys());

        if (isFirstSelection.current) {
            isFirstSelection.current = false;
            previousSelectedRows.current = currentSelection;
            return;
        }

        const added = [...currentSelection].filter(id => !previousSelectedRows.current.has(id));
        const removed = [...previousSelectedRows.current].filter(id => !currentSelection.has(id));

        if (added.length > 0) {
            console.log('Seçilen:', added);
            dispatch(updateLeaseflexAutomationLeases({data:{uuids:added,select:true}}))
        }
        if (removed.length > 0) {
            console.log('Seçimi kaldırılan:', removed);
            dispatch(updateLeaseflexAutomationLeases({data:{uuids:removed,select:false}}))
        }

        previousSelectedRows.current = currentSelection;
    };
    
    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };


    return (
        <Box sx={{ pt: 2, pb: 2, pl: 8, pr: 8 }}>
            <ListTable
            title={bank_activity_leases.length > 1 ? `${bank_activity_leases[0].partner} - ${bank_activity_leases[0].partner_tc} Kira Planları` : ""}
            height="auto"
            autoHeight
            rows={bank_activity_leases}
            columns={columns}
            getRowId={(row) => row ? row.id : 0}
            loading={leasesLoading}
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
            //keepNonExistentRowsSelected
            //isRowSelected={(row) => row.overdue_amount > 0}
            //hideFooter
            noPagination
            apiRef={apiRef}
            />
        </Box>
    )
}

export default DetailPanel
