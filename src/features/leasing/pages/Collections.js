import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, setCollectionsLoading } from 'store/slices/leasing/collectionSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import CustomTableButton from 'component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from 'store/slices/processSlice';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import 'static/css/Installments.css';
import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
import { Button, Chip, Grid, Stack } from '@mui/material';
import { fetchAccountNos, fetchBankActivities, setBankActivitiesLoading, setBankActivitiesParams } from 'store/slices/leasing/bankActivitySlice';
import ListTable from 'component/table/ListTable';
import DetailPanel from 'features/leasing/components/DetailPanel';
import ExportDialog from 'component/feedback/ExportDialog';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

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
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading,accountNos,accountNosParams} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBankActivities({activeCompany,params:{...bankActivitiesParams,paginate:false}}));
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
        // { field: 'tc_vkn_no', headerName: 'TC/VKN', width: 120 },
        { field: 'name', headerName: 'Gönderen', width: 140,
            renderCell: (params) => (
                
                    // params.value && params.value !== 'None'
                    // ?
                    //     `${params.value} ${params.row.tc_vkn_no}`
                    // :
                    //     null

                    `${params.value !== 'None' ? params.value : ''} ${params.row.tc_vkn_no}`
            ),
        },
        { field: 'third_person_status', headerName: '3. Kişi Durumu', width: 160,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.row.is_third_person
                        ?
                            <Chip variant='contained' color={getStatus(params.value).color} icon={getStatus(params.value).icon} label={getStatus(params.value).label} size='small'/>
                        :
                            null
                    }
                </Stack>
            ),
            renderHeaderFilter: () => null,
        },
        { field: 'description', headerName: 'Açıklama', width: 540 },
        { field: 'amount', headerName: 'Tutar', type: 'number', width: 120, renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'processed_amount', headerName: 'İşlenen Tutar', width: 120, type: 'number', renderHeaderFilter: () => null, renderCell: (params) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.leases.processed_amount)
        },
        { field: 'currency', headerName: 'PB', width: 90 },
        { field: 'process_date_date', headerName: 'İşlem Tarihi', width: 120 },
        { field: 'bank_account_no', headerName: 'Banka Hesap No', width: 160,
            // filterOperators: [
            //     {
            //         label: 'Eşittir',
            //         value: 'is', // Burayı 'is' yapın!
            //         getApplyFilterFn: (filterItem) => {
            //             if (!filterItem.value || filterItem.value === "all") {
            //                 return null;
            //             }
            //             return (params) => params.value === filterItem.value;
            //         },
            //         InputComponent: SelectHeaderFilter,
            //     },
            // ],
            // renderHeaderFilter: (params) => (
            //     <SelectHeaderFilter
            //     {...params}
            //     label="Seç"
            //     externalValue="all"
            //     options={[
            //         { label: "Tümü", value: "all" },
            //         ...accountNos.map((code) => ({ label: code, value: code }))
            //     ]}
            //     />
            // )
        },
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

    const getStatus = (status) => {
        switch (status) {
            case "pending":
                return { color: "warning", icon: <WarningIcon />, label: "Kontrol Edilecek" };
            case "cleared":
                return { color: "success", icon: <CheckIcon />, label: "Temiz" };
            case "flagged":
                return { color: "error", icon: <DoDisturbAltIcon />, label: "Yasaklı" };
            case "need_document":
                return { color: "info", icon: <HourglassBottomIcon />, label: "Belge/Kimlik Gerekli" };
            default:
                return { color: "primary", icon: <CheckIcon />, label: "Bilinmiyor" };
        }
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTable
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
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchBankActivities({activeCompany,params:{...bankActivitiesParams,paginate:false}})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                setParams={(value) => dispatch(setBankActivitiesParams(value))}
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
                getRowHeight={() => 'auto'}
                sx={{
                    [`& .${gridClasses.cell}`]: {
                        py: 1,
                    },
                }}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<DetailPanel uuid={params.row.uuid} bank_activity_leases={params.row.leases.leases}></DetailPanel>)}}
                disableVirtualization
                />
            </Grid>
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/bank_activities_template"
            importURL="/leasing/import_bank_activities/"
            startEvent={() => dispatch(setBankActivitiesLoading(true))}
            finalEvent={() => {dispatch(fetchBankActivities({activeCompany,params:{...bankActivitiesParams,paginate:false}}));dispatch(setBankActivitiesLoading(false));}}
            >

            </ImportDialog>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/leasing/export_bank_activities/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setBankActivitiesLoading(true))}
            finalEvent={() => {dispatch(fetchBankActivities({activeCompany,params:{...bankActivitiesParams,paginate:false}}));dispatch(setBankActivitiesLoading(false));}}
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
