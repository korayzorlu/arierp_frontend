import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerminatedLeases, setTerminatedLeasesLoading, setTerminatedLeasesParams } from 'store/slices/leasing/riskPartnerSlice';
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
import PartnerNoteDialog from 'component/dialog/PartnerNoteDialog';

function TerminatedLeases() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {terminatedLeases,terminatedLeasesCount,terminatedLeasesParams,terminatedLeasesLoading} = useSelector((store) => store.riskPartner);

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
            dispatch(fetchTerminatedLeases({activeCompany,params:{...terminatedLeasesParams,project}}));
        });
    }, [activeCompany,terminatedLeasesParams,dispatch]);

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
        { field: 'status', headerName: 'Alt Statü', width:120 },
        { field: 'lease_status', headerName: 'Statü', width:120 },
        { field: 'terminated_date', headerName: 'Fesih Tarihi', width:120 },
        { field: 'last_refund_date', headerName: 'Son İade Tarihi', width:120 },
        { field: 'refund', headerName: 'İade Edilecek Tutar', width: 140, type: 'number', renderHeaderFilter: () => null, 
            renderCell: (params) =>  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value.amount)
        },
        { field: 'r', headerName: 'PB', flex: 2, renderCell: (params) => params.row.refund.currency },
    ]

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setTerminatedLeasesParams({project:newValue}));
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Feshedilen Kira Planları İade Listesi"
            rows={terminatedLeases}
            columns={columns}
            getRowId={(row) => row.id}
            loading={terminatedLeasesLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/leasing/export_active_leases/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchTerminatedLeases({activeCompany,params:terminatedLeasesParams})).unwrap()}
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
                        disabled={terminatedLeasesLoading}
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
            rowCount={terminatedLeasesCount}
            setParams={(value) => dispatch(setTerminatedLeasesParams(value))}
            headerFilters={true}
            noDownloadButton
            apiRef={apiRef}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setTerminatedLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchTerminatedLeases({activeCompany,params:terminatedLeasesParams}));dispatch(setTerminatedLeasesLoading(false));}}
            status={status}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/terminatedLeases_template"
            importURL="/leasing/import_terminatedLeases/"
            startEvent={() => dispatch(setTerminatedLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchTerminatedLeases({activeCompany}));dispatch(setTerminatedLeasesLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_terminatedLeases/"
            selectedItems={apiRef.current ? apiRef.current.getSelectedRows().values() : []}
            startEvent={() => dispatch(setTerminatedLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchTerminatedLeases({activeCompany}));dispatch(setTerminatedLeasesLoading(false));}}
            />
        </PanelContent>
    )
}

export default TerminatedLeases
