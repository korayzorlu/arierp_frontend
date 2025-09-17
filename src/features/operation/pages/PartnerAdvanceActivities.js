import React, { createRef, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import '../../leasing/pages/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Box, Chip, Grid, TextField, Typography } from '@mui/material';
import { fetchPartnerAdvanceActivities, fetchPartnerAdvanceActivityLeases, setPartnerAdvanceActivitiesLoading, setPartnerAdvanceActivitiesParams } from '../../../store/slices/operation/partnerAdvanceActivitySlice';
import ListTable from '../../../component/table/ListTable';
import ExportDialog from '../../../component/feedback/ExportDialog';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PartnerAdvanceActivityDetailPanel from '../components/PartnerAdvanceActivityDetailPanel';

function randomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function PartnerAdvanceActivites() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {partnerAdvanceActivities,partnerAdvanceActivitiesCount,partnerAdvanceActivitiesParams,partnerAdvanceActivitiesLoading} = useSelector((store) => store.partnerAdvanceActivity);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPartnerAdvanceActivities({activeCompany,params:partnerAdvanceActivitiesParams}));
        });
    }, [activeCompany,partnerAdvanceActivitiesParams,dispatch]);
    


    
    const columns = [
        { field: 'tc_vkn_no', headerName: 'TC/VKN', flex: 2 },
        { field: 'is_third_person', headerName: 'Güvenlik Onayı', flex: 3, renderCell: (params) => (
                params.value === true
                ?
                    params.row.is_reliable_person === true
                    ?
                        <Chip key={params.row.id} variant='contained' color="success" icon={<CheckCircleIcon />} label="Güvenilir" size='small'/>
                    :
                        <Chip key={params.row.id} variant='contained' color="error" icon={<WarningIcon />} label="Kontrol Gerekiyor" size='small'/>
                :
                    null
                
            )
        },
        { field: 'description', headerName: 'Açıklama',flex: 10 },
        { field: 'amount', headerName: 'Tutar', flex: 2, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'processed_amount', headerName: 'İşlenen Tutar', flex: 2, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', flex: 1 },
        { field: 'process_date_date', headerName: 'İşlem Tarihi', flex: 2 },
        { field: 'bank_account_no', headerName: 'Banka Hesap No', flex: 1 },
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTable
                title="Müşteri Avans İşleme Hareketleri"
                rows={partnerAdvanceActivities}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={partnerAdvanceActivitiesLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchPartnerAdvanceActivities({activeCompany,params:partnerAdvanceActivitiesParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                setParams={(value) => dispatch(setPartnerAdvanceActivitiesParams(value))}
                headerFilters={true}
                noDownloadButton
                getRowClassName={(params) => {
                    return `
                        super-app-theme--${
                            params.row.leases
                            ?
                                params.row.leases.length > 0
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
                getDetailPanelContent={(params) => {return(<PartnerAdvanceActivityDetailPanel uuid={params.row.uuid} bank_activity_leases={params.row.leases}></PartnerAdvanceActivityDetailPanel>)}}
                disableVirtualization
                />
            </Grid>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/leasing/export_partner_advance_activities/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setPartnerAdvanceActivitiesLoading(true))}
            finalEvent={() => {dispatch(fetchPartnerAdvanceActivities({activeCompany,params:partnerAdvanceActivitiesParams}));dispatch(setPartnerAdvanceActivitiesLoading(false));}}
            >
            </ExportDialog>
            
        </PanelContent>
    )
}

export default PartnerAdvanceActivites
