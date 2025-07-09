import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, resetCollectionsParams, setCollectionsLoading, setCollectionsParams } from '../../../store/slices/leasing/collectionSlice';
import { setAlert, setDeleteDialog, setImportDialog, setInstallmentDialog, setPartnerDialog, setUserDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
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
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Grid, TextField, Typography } from '@mui/material';
import { fetchLeases, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { fetchUserInformation } from '../../../store/slices/authSlice';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import { fetchInstallmentInformation, setInstallmentsLoading } from '../../../store/slices/leasing/installmentSlice';
import { fetchBankActivities, setBankActivitiesLoading, setBankActivitiesParams } from '../../../store/slices/leasing/bankActivitySlice';


function Collections() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {collections,collectionsCount,collectionsParams,collectionsLoading} = useSelector((store) => store.collection);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [selectedPartnerCrmCode, setSelectedPartnerCrmCode] = useState(null);

    useEffect(() => {
        startTransition(() => {
            //dispatch(fetchCollections({activeCompany,params:collectionsParams})).unwrap();
            dispatch(fetchLeases({activeCompany,params:{...leasesParams,leaseflex_automation:true}}));
            dispatch(fetchBankActivities({activeCompany,params:bankActivitiesParams}));
        });
    }, [activeCompany,collectionsParams,leasesParams,dispatch]);

    const columns = [
        { field: 'code', headerName: 'Kira Planı Kodu', width:120, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'contract', headerName: 'Sözleşme Kodu' },
        { field: 'partner', headerName: 'Müşteri', width:280, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', width:160 },
        { field: 'activation_date', headerName: 'Aktifleştirme Tarihi', renderHeaderFilter: () => null },
        //{ field: 'quotation', headerName: 'Teklif No' },
        //{ field: 'kof', headerName: 'KOF No' },
        { field: 'project', headerName: 'Proje', width:280 },
        { field: 'block', headerName: 'Blok' },
        { field: 'unit', headerName: 'Bağımsız Bölüm' },
        //{ field: 'vade', headerName: 'Vade', type: 'number' },
        //{ field: 'vat', headerName: 'KDV(%)', type: 'number' },
        //{ field: 'musteri_baz_maliyet', headerName: 'Müşteri Baz Maliyet', type: 'number'},
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', width:160, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            }
        },
        { field: 'currency', headerName: 'PB' },
        { field: 'overdue_days', headerName: 'Gecikme Süresi', width:120, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => (
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
        { field: 'collection_status', headerName: 'Statü', width:120 },
    ]

    const bankActivityColumns = [
        { field: 'process_date', headerName: 'İşlem Tarihi' },
        { field: 'amount', headerName: 'Tutar' },
        { field: 'currency', headerName: 'PB' },
        { field: 'description', headerName: 'Açıklama',width: 240 },
        { field: 'tc_vkn_no', headerName: 'TC/VKN' },
        { field: 'receipt_no', headerName: 'Dekont No' },
        { field: 'bank', headerName: 'Banka' },
        { field: 'bank_account_no', headerName: 'Banka Hesap No' },
    ]

    const columnsWithRenderHeaderFilter = columns.map(col => {
        if (col.renderHeaderFilter) {
            return {
            ...col,
            renderHeaderFilter: (params) => {
                return col.renderHeaderFilter({
                ...params,
                inputRef: createRef(),
                apiRef: apiRef,
                });
            },
            };
        }
        return col;
    });

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

    const handleChangeOverdue = async (value) => {
        dispatch(setCollectionsParams({overdue_amount:value}));
        setSwitchPosition(value);
    };

    const handleProfileDialog = async (params,event) => {
        console.log(params)
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
        <PanelContent>
            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <ListTableServer
                    title="Banka Hareketleri"
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
                    apiRef={apiRef}
                    />
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <ListTableServer
                    title="Kira Planları Listesi"
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
                    apiRef={apiRef}
                    onCellClick={handleProfileDialog}
                    />
                </Grid>
            </Grid>
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/bank_activities_template"
            importURL="/leasing/import_bank_activities/"
            startEvent={() => dispatch(setBankActivitiesLoading(true))}
            finalEvent={() => {dispatch(fetchBankActivities({activeCompany}));dispatch(setBankActivitiesLoading(false));}}
            >

            </ImportDialog>
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
