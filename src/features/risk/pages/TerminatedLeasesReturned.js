import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerminatedLeasesReturned, setTerminatedLeasesReturnedLoading, setTerminatedLeasesReturnedParams, updateTerminatedDate } from 'store/slices/leasing/riskPartnerSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog, setPartnerNoteDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import 'static/css/Installments.css';
import { gridClasses, GridRowEditStopReasons, useGridApiRef } from '@mui/x-data-grid-premium';
import { Badge, Chip, FormControl, Grid, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import PartnerNoteDialog from 'component/dialog/PartnerNoteDialog';
import TableButton from 'component/button/TableButton';
import { NoteAltIcon } from 'icons';
import { fetchPartnerInformation, fetchPartnerNotes } from 'store/slices/partners/partnerSlice';

function TerminatedLeasesReturned() {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {terminatedLeasesReturned,terminatedLeasesReturnedCount,terminatedLeasesReturnedParams,terminatedLeasesReturnedLoading,terminatedLeaseReturnedProjects} = useSelector((store) => store.riskPartner);
    const {partnerNotesParams} = useSelector((store) => store.riskPartner);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTerminatedLeasesReturned({activeCompany,params:terminatedLeasesReturnedParams}));
        });
    }, [activeCompany,terminatedLeasesReturnedParams,dispatch]);

    const handlePartnerNoteDialog = async ({partner_id,crm_code}) => {
        await dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id}})).unwrap();
        await dispatch(fetchPartnerInformation(crm_code)).unwrap();
        dispatch(setPartnerNoteDialog(true));
    };

    const columns = [
        { field: 'code', headerName: 'Kira Planı Kodu', width:120, editable: true, renderCell: (params) => (
                <Link
                to={`/leasing/update/${params.row.id}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'contract', headerName: 'Sözleşme' },
        { field: 'partner', headerName: 'Müşteri', width:280, renderCell: (params) => (
                params.row.partner_special
                ?
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            {params.value}
                        </Grid>
                        <Grid size={4}>
                            <Chip key={params.row.id} variant='outlined' color="neutral" icon={<StarIcon />} label="Özel" size='small'/>
                        </Grid>
                    </Grid>
                :
                    params.value
            )
        },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', width:120 },
        { field: 'item', headerName: 'Proje', width: 360,
            renderCell: (params) => (
                params.row.item?.name
            ),
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                isServer
                multiple
                options={[
                    //...projects.map((item) => ({ label: item.item__stock_name, value: item.item__uuid }))
                    ...[...new Set(terminatedLeaseReturnedProjects.map((item) => item.item__stock_name))].map((name) => ({ label: name, value: name }))
                ]}
                />
            )
        },
        { field: 'activation_date', headerName: 'Aktifleştirme Tarihi', renderHeaderFilter: () => null },
        { field: 'status', headerName: 'Alt Statü', width:120 },
        { field: 'lease_status', headerName: 'Statü', width:120,
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'aktiflestirildi', label: 'Aktifleştirildi' },
                    { value: 'baskasina_transfer_edildi', label: 'Başkasına Transfer Edildi' },
                    { value: 'devredildi', label: 'Devredildi' },
                    { value: 'durduruldu', label: 'Durduruldu' },
                    { value: 'envantere_alindi', label: 'Envantere Alındı' },
                    { value: 'feshedildi', label: 'Feshedildi' },
                    { value: 'iptal_edildi', label: 'İptal Edildi' },
                    { value: 'kanuni_takibe_alindi', label: 'Kanuni Takibe Alındı' },
                    { value: 'para_birimi_degisti', label: 'Para Birimi Değişti' },
                    { value: 'pert', label: 'Pert' },
                    { value: 'planlandi', label: 'Planlandı' },
                    { value: 'revize_edildi', label: 'Revize Edildi' },
                ].sort((a, b) => a.label.localeCompare(b.label, 'tr'))}
                changeValue={(newValue) => setStatus(newValue)}
                />
            )
        },
        { field: 'terminated_date', headerName: 'Fesih Tarihi', width:120
            // valueGetter: (value) => {
            //     if (!value) return null;
            //     const [day, month, year] = value.split('.');
            //     return new Date(year, month - 1, day);
            // }
         },
        { field: 'refund_date', headerName: 'İade Tarihi', width:120, type:'date',
            valueGetter: (value) => {
                if (!value) return null;
                const [day, month, year] = value.split('.');
                return new Date(year, month - 1, day);
            }
        },
        { field: 'refund', headerName: 'İade Edilecek Tutar', width: 140, type: 'number', renderHeaderFilter: () => null, 
            renderCell: (params) =>  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value.amount)
        },
        { field: 'r', headerName: 'PB', width: 90, renderCell: (params) => params.row.refund.currency },
        { field: 'partner_notes', headerName: '', width: 180, renderHeaderFilter: () => null, renderCell: (params) => (
            <Stack direction="row" spacing={4} sx={{alignItems: "center",height:'100%',}}>
                <Grid container spacing={1} sx={{width:'100%'}}>
                    <Grid size={{xs:8, sm:8}}>
                        <TableButton
                        text="Notlar"
                        color="celticglow"
                        icon={<NoteAltIcon/>}
                        onClick={()=>{handlePartnerNoteDialog({partner_id:params.row.partner_id,crm_code:params.row.partner_crm_code})}}
                        />
                    </Grid>
                    <Grid size={{xs:4, sm:4}}>
                        <Badge badgeContent={params.row.partner_note_count} color={dark ? 'frostedbirch' : 'silvercoin'}></Badge>
                    </Grid>
                </Grid>
                    
            </Stack>
            )
        },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Fesih İadesi Yapılan Kira Planları Listesi"
            rows={terminatedLeasesReturned}
            columns={columns}
            getRowId={(row) => row.id}
            loading={terminatedLeasesReturnedLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/risk/export_terminated_leases_returned/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchTerminatedLeasesReturned({activeCompany,params:terminatedLeasesReturnedParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={terminatedLeasesReturnedCount}
            setParams={(value) => dispatch(setTerminatedLeasesReturnedParams(value))}
            editMode="row"
            headerFilters={true}
            noDownloadButton
            apiRef={apiRef}
            autoRowHeight
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
            }}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setTerminatedLeasesReturnedLoading(true))}
            finalEvent={() => {dispatch(fetchTerminatedLeasesReturned({activeCompany,params:terminatedLeasesReturnedParams}));dispatch(setTerminatedLeasesReturnedLoading(false));}}
            status={status}
            />
            <PartnerNoteDialog/>
        </PanelContent>
    )
}

export default TerminatedLeasesReturned
