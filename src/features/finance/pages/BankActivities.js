import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, setCollectionsLoading } from 'store/slices/leasing/collectionSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Grid } from '@mui/material';
import { fetchAccountNos, fetchBankActivities, setBankActivitiesLoading, setBankActivitiesParams } from 'store/slices/leasing/bankActivitySlice';
import BankActivityDetailPanel from 'features/finance/components/BankActivityDetailPanel';
import ExportDialog from 'component/feedback/ExportDialog';

function randomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function BankActivities() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {collections,collectionsCount,collectionsParams,collectionsLoading} = useSelector((store) => store.collection);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading,accountNosParams} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBankActivities({activeCompany,params:{...bankActivitiesParams,created_date_after:'2025-01-01'}}));
            dispatch(fetchAccountNos({activeCompany,params:accountNosParams}));
        });
    }, [activeCompany,bankActivitiesParams,accountNosParams,dispatch]);
    

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


    
    const bankActivityColumns = [
        { field: 'tc_vkn_no', headerName: 'TC/VKN', flex: 2 },
        // { field: 'is_third_person', headerName: 'Güvenlik Onayı', flex: 3, renderCell: (params) => (
        //         params.value === true
        //         ?
        //             params.row.is_reliable_person === true
        //             ?
        //                 <Chip key={params.row.id} variant='contained' color="success" icon={<CheckCircleIcon />} label="Güvenilir" size='small'/>
        //             :
        //                 <Chip key={params.row.id} variant='contained' color="error" icon={<WarningIcon />} label="Kontrol Gerekiyor" size='small'/>
        //         :
        //             null
                
        //     )
        // },
        { field: 'description', headerName: 'Açıklama',flex: 10 },
        { field: 'amount', headerName: 'Tutar', flex: 2, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'processed_amount', headerName: 'İşlenen Tutar', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.leases.processed_amount)
        },
        { field: 'currency', headerName: 'PB', flex: 1 },
        { field: 'process_date_date', headerName: 'İşlem Tarihi', flex: 2 },
        { field: 'bank_account_no', headerName: 'Banka Hesap No', flex: 1 },
    ]

    

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/leasing/delete_all_collections/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Banka Hareketleri"
                rows={bankActivities}
                columns={bankActivityColumns}
                getRowId={(row) => row.uuid}
                loading={bankActivitiesLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchBankActivities({activeCompany,params:{...bankActivitiesParams,created_date_after:'2025-01-01'}})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                setParams={(value) => dispatch(setBankActivitiesParams(value))}
                rowCount={bankActivitiesCount}
                headerFilters={true}
                noDownloadButton
                getRowClassName={(params) => {
                    return `
                        super-app-theme--${
                            params.row.leases.leases
                            ?
                                params.row.leases.leases.length > 0
                                    ?
                                        params.row.is_processed
                                        ?
                                            "processed"
                                        :
                                            "matched"
                                    :
                                        ""
                            : ""
                        }
                    `
                }}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<BankActivityDetailPanel uuid={params.row.uuid} bank_activity_leases={params.row.leases.leases}></BankActivityDetailPanel>)}}
                disableVirtualization
                />
            </Grid>
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/bank_activities_template"
            importURL="/leasing/import_bank_activities/"
            startEvent={() => dispatch(setBankActivitiesLoading(true))}
            finalEvent={() => {dispatch(fetchBankActivities({activeCompany}));dispatch(setBankActivitiesLoading(false));}}
            >

            </ImportDialog>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/leasing/export_bank_activities/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setBankActivitiesLoading(true))}
            finalEvent={() => {dispatch(fetchBankActivities({activeCompany}));dispatch(setBankActivitiesLoading(false));}}
            >
            </ExportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_collections/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setCollectionsLoading(true))}
            finalEvent={() => {dispatch(fetchCollections({activeCompany}));dispatch(setCollectionsLoading(false));}}
            />
            
        </PanelContent>
    )
}

export default BankActivities
