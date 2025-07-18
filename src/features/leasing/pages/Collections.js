import React, { createRef, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, resetCollectionsParams, setCollectionsLoading, setCollectionsParams } from '../../../store/slices/leasing/collectionSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog, setInstallmentDialog, setPartnerDialog, setUserDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AndroidSwitch from '../../../component/switch/AndroidSwitch';
import './Installments.css';
import { useGridApiRef, useKeepGroupedColumnsHidden } from '@mui/x-data-grid-premium';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { fetchLeases, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { fetchUserInformation } from '../../../store/slices/authSlice';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import { fetchInstallmentInformation, setInstallmentsLoading } from '../../../store/slices/leasing/installmentSlice';
import { fetchBankActivities, fetchBankActivityLeases, setBankActivitiesLoading, setBankActivitiesParams } from '../../../store/slices/leasing/bankActivitySlice';
import ListTable from '../../../component/table/ListTable';
import BasicTable from '../../../component/table/BasicTable';
import DetailPanel from '../components/DetailPanel';
import ExportDialog from '../../../component/feedback/ExportDialog';
import DownloadIcon from '@mui/icons-material/Download';

function randomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function Collections() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {collections,collectionsCount,collectionsParams,collectionsLoading} = useSelector((store) => store.collection);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [selectedItemsPerRow, setSelectedItemsPerRow] = useState({});
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [selectedPartnerCrmCode, setSelectedPartnerCrmCode] = useState(null);
    const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = useState(new Set());

    useEffect(() => {
        startTransition(() => {
            //dispatch(fetchCollections({activeCompany,params:collectionsParams})).unwrap();
            //dispatch(fetchLeases({activeCompany,params:{...leasesParams,leaseflex_automation:true,ordering:"contract__partner__tc_vkn_no"}}));
            dispatch(fetchBankActivities({activeCompany}));
        });

        
    }, [activeCompany,collectionsParams,leasesParams,dispatch]);

    

    // useEffect(() => {
    //     if (bankActivities.length) {
    //         bankActivities.forEach((activity) => {
    //             if (activity.leases.length) {
    //                 activity.leases.forEach((leases) => {
    //                     if (leases.overdue_amount > 0) {
    //                         setSelectedItems(apiRef.current.getPropagatedRowSelectionModel({type: "include", ids: Set([leases.id])}));
    //                         apiRef.current.selectRow(leases.id, true);
    //                     }
    //                 })
    //             }
    //         });
    //     }
    // }, [bankActivities])
    

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

    const bankActivityColumns = [
        { field: 'tc_vkn_no', headerName: 'TC/VKN', flex: 2 },
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'description', headerName: 'Açıklama',flex: 10 },
        { field: 'amount', headerName: 'Tutar', flex: 2, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', flex: 1 },
        { field: 'process_date', headerName: 'İşlem Tarihi', flex: 2 },
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
                <ListTable
                title="Banka Hareketleri"
                //autoHeight
                rows={bankActivities}
                columns={bankActivityColumns}
                getRowId={(row) => row.uuid}
                loading={bankActivitiesLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="İçe Aktar"
                        onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                        icon={<UploadFileIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchBankActivities({activeCompany,params:bankActivitiesParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                setParams={(value) => dispatch(setBankActivitiesParams(value))}
                headerFilters={true}
                noDownloadButton
                getRowClassName={(params) => `super-app-theme--${params.row.leases ? params.row.leases.length > 0 ? "matched" : "" : ""}`}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<DetailPanel uuid={params.row.uuid} bank_activity_leases={params.row.leases}></DetailPanel>)}}
                />
                {/* <Grid size={{xs:12,sm:6}}>
                    <ListTable
                    title="Banka Hareketleri"
                    autoHeight
                    rows={bankActivities}
                    columns={bankActivityColumns}
                    getRowId={(row) => row.uuid}
                    loading={bankActivitiesLoading}
                    customButtons={
                        <>
                            <CustomTableButton
                            title="İçe Aktar"
                            onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                            icon={<UploadFileIcon fontSize="small"/>}
                            />
                            <CustomTableButton
                            title="Yenile"
                            onClick={() => dispatch(fetchBankActivities({activeCompany,params:bankActivitiesParams})).unwrap()}
                            icon={<RefreshIcon fontSize="small"/>}
                            />
                        </>
                    }
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setSelectedItems(newRowSelectionModel);
                    }}
                    rowCount={bankActivitiesCount}
                    setParams={(value) => dispatch(setBankActivitiesParams(value))}
                    headerFilters={true}
                    />
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <ListTable
                    title="Kira Planları Listesi"
                    autoHeight
                    rows={leases}
                    columns={columns}
                    getRowId={(row) => row.uuid}
                    loading={leasesLoading}
                    customButtons={
                        <>  

                            <CustomTableButton
                            title="Yenile"
                            onClick={() => dispatch(fetchCollections({activeCompany,params:collectionsParams})).unwrap()}
                            icon={<RefreshIcon fontSize="small"/>}
                            />

                            
                        </>
                    }
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setSelectedItems(newRowSelectionModel);
                    }}
                    rowCount={leasesCount}
                    setParams={(value) => dispatch(setLeasesParams(value))}
                    headerFilters={true}
                    onCellClick={handleProfileDialog}
                    />
                </Grid> */}
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

export default Collections
