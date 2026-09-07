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
import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
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
    const {terminatedLeases,terminatedLeasesCount,terminatedLeasesParams,terminatedLeasesLoading,terminatedLeaseProjects} = useSelector((store) => store.riskPartner);

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
            dispatch(fetchTerminatedLeases({activeCompany,params:terminatedLeasesParams}));
        });
    }, [activeCompany,terminatedLeasesParams,dispatch]);

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
                    ...[...new Set(terminatedLeaseProjects.map((item) => item.item__stock_name))].map((name) => ({ label: name, value: name }))
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
        { field: 'terminated_date', headerName: 'Fesih Tarihi', width:120, type:'date',
            valueGetter: (value) => {
                if (!value) return null;
                const [day, month, year] = value.split('.');
                return new Date(year, month - 1, day);
            }
         },
        { field: 'last_refund_date', headerName: 'Son İade Tarihi', width:120, type:'date',
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
            rowCount={terminatedLeasesCount}
            setParams={(value) => dispatch(setTerminatedLeasesParams(value))}
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
