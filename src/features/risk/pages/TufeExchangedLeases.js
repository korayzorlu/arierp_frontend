import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTufeExchangedLeases, setTufeExchangedLeasesLoading, setTufeExchangedLeasesParams } from 'store/slices/leasing/riskPartnerSlice';
import { setDeleteDialog, setExportDialog, setImportDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Chip, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import { cellProgress } from 'component/progress/CellProgress';

function TufeExchangedLeases() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {tufeExchangedLeases,tufeExchangedLeasesCount,tufeExchangedLeasesParams,tufeExchangedLeasesLoading} = useSelector((store) => store.riskPartner);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("kizilbuk")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTufeExchangedLeases({activeCompany,params:{...tufeExchangedLeasesParams,project}}));
        });
    }, [activeCompany,tufeExchangedLeasesParams,dispatch]);

    const columns = [
        { field: 'code', headerName: 'Kira Planı Kodu', width:120, editable: true, renderCell: (params) => (
                <Link
                to={`/leasing/update/${params.row.id}/${params.row.contract_id}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'contract', headerName: 'Sözleşme Kodu' },
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
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', width:160 },
        { field: 'activation_date', headerName: 'Aktifleştirme Tarihi', renderHeaderFilter: () => null },
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
        { field: 'paid_rate', headerName: 'Ödeme Oranı', width:120, type: 'number', renderHeaderFilter: () => null, renderCell: cellProgress },
        { field: 'overdue_amount', headerName: 'Geciken Tutar', width:120, type: 'number', renderHeaderFilter: () => null, 
            renderCell: (params) =>  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
        },
        { field: 'tufeli_geciken', headerName: 'Tüfeli Geciken Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            renderCell: (params) =>  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
        },
        { field: 'tufe_amount', headerName: 'Tüfe Tutarı', width:160, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.row.geciken_usd > 0 ? 'bg-red' : '';
            },
            renderCell: (params) =>  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
        },
        { field: 'tufe_rate', headerName: 'Tüfe Oranı', width:160, type: 'number', renderHeaderFilter: () => null, renderCell: cellProgress
        },
        { field: 'tufe_endeks', headerName: 'Söz. Birim Endeksi', width:160, type: 'number', renderHeaderFilter: () => null,
            renderCell: (params) =>  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
        },
        //{ field: 'currency', headerName: 'PB', width:90 },
        { field: 'status', headerName: 'Alt Statü', width:120 },
        { field: 'lease_status', headerName: 'Statü', width:120 },
    ]

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setTufeExchangedLeasesParams({project:newValue}));
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Tüfe Değerleme Kayıpları Listesi"
            rows={tufeExchangedLeases}
            columns={columns}
            getRowId={(row) => row.id}
            loading={tufeExchangedLeasesLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/leasing/export_active_leases/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchTufeExchangedLeases({activeCompany,params:{...tufeExchangedLeasesParams,project}})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            customFiltersLeft={
                <>
                    <FormControl sx={{mr: 2}}>
                        <InputLabel id="demo-simple-select-label">Proje</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size='small'
                        value={project}
                        label="Proje"
                        onChange={(e) => changeProject(e.target.value)}
                        disabled={tufeExchangedLeasesLoading}
                        >
                            <MenuItem value='kizilbuk'>KIZILBÜK</MenuItem>
                            <MenuItem value='sinpas'>SİNPAŞ GYO</MenuItem>
                            <MenuItem value='kasaba'>KASABA</MenuItem>
                            <MenuItem value='servet'>SERVET</MenuItem>
                            <MenuItem value='diger'>Diğer</MenuItem>
                        </Select>
                    </FormControl>
                </>
            }
            rowCount={tufeExchangedLeasesCount}
            setParams={(value) => dispatch(setTufeExchangedLeasesParams(value))}
            headerFilters={true}
            noDownloadButton
            apiRef={apiRef}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setTufeExchangedLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchTufeExchangedLeases({activeCompany,params:tufeExchangedLeasesParams}));dispatch(setTufeExchangedLeasesLoading(false));}}
            status={status}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/tufeExchangedLeases_template"
            importURL="/leasing/import_tufeExchangedLeases/"
            startEvent={() => dispatch(setTufeExchangedLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchTufeExchangedLeases({activeCompany}));dispatch(setTufeExchangedLeasesLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_tufeExchangedLeases/"
            selectedItems={apiRef.current ? apiRef.current.getSelectedRows().values() : []}
            startEvent={() => dispatch(setTufeExchangedLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchTufeExchangedLeases({activeCompany}));dispatch(setTufeExchangedLeasesLoading(false));}}
            />
        </PanelContent>
    )
}

export default TufeExchangedLeases
