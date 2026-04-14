import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTitleDeedInvoiceControls, setTitleDeedInvoiceControlsLoading, setTitleDeedInvoiceControlsParams } from 'store/slices/operation/titleDeedInvoiceControlSlice';
import { setDeleteDialog, setExportDialog, setImportDialog, setLeaseNoteDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import 'static/css/Installments.css';
import { ToolbarButton, useGridApiRef } from '@mui/x-data-grid-premium';
import { Badge, badgeClasses, Chip, Divider, Grid, IconButton, Stack, styled } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchLeaseInformation, fetchLeaseNotes, fetchProjects } from 'store/slices/leasing/leaseSlice';
import { gridClasses } from '@mui/x-data-grid-premium';
import LeaseNoteDialog from 'component/dialog/LeaseNoteDialog';
import TableButton from 'component/button/TableButton';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import WarningIcon from '@mui/icons-material/Warning';
import ColumnHeaderWarningButton from 'component/table/header/ColumnHeaderWarningButton';
import CustomColumnHeader from 'component/table/header/CustomColumnHeader';

function TitleDeedInvoiceControls() {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {titleDeedInvoiceControls,titleDeedInvoiceControlsCount,titleDeedInvoiceControlsParams,titleDeedInvoiceControlsLoading,titleDeedInvoiceControlsWarnings} = useSelector((store) => store.titleDeedInvoiceControl);
    const {projectsParams,projects,leaseNotesParams } = useSelector((store) => store.lease);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [columnHeaderCustomButtons, setColumnHeaderCustomButtons] = useState([]);

    const fetchData = async () => {
        await dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:{...titleDeedInvoiceControlsParams,project}})).unwrap();
        await dispatch(fetchProjects({activeCompany,params:projectsParams})).unwrap();
        setColumnHeaderCustomButtons([
            { field: 'ari_bbsn', nullCount: titleDeedInvoiceControls.filter((item) => !item.ari_bbsn).length }
        ])
    }

    useEffect(() => {
        startTransition(() => {
            fetchData();
        });
    }, [activeCompany,titleDeedInvoiceControlsParams,dispatch]);

    const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
        top: -12px;
        right: 0;
    }
    `;

    const columns = [
        { field: 'code', headerName: 'Kira Planı Kodu', width:120, editable: true, renderCell: (params) => (
                <Link
                to={`/leasing/update/${params.row.uuid}/${params.row.contract_id}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'old_leases', headerName: 'Versiyon Geçmişi', width:120, renderCell: (params) => (
                params.value.map((item) => (
                    <Stack key={item.id} spacing={1}>
                        {item.code}
                    </Stack>

                ))
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
        //{ field: 'quotation', headerName: 'Teklif No' },
        //{ field: 'kof', headerName: 'KOF No' },
        //{ field: 'item', headerName: 'Proje', width:280 },
        { field: 'vendor', headerName: 'Satıcı', width:220 },
        { field: 'item', headerName: 'Proje', width: 220,
            renderCell: (params) => (
                params.row.item.name
            ),
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { label: "Tümü", value: "all" },
                    ...projects.map((item) => ({ label: item.item__stock_name, value: item.item__uuid }))
                ]}
                />
            )
        },
        { field: 'block', headerName: 'Blok' },
        { field: 'unit', headerName: 'Bağımsız Bölüm' },
        { field: 'ari_bbsn', headerName: 'BBSN', width:140, renderHeader: () => (<CustomColumnHeader label="BBSN" warnings={titleDeedInvoiceControlsWarnings.filter(w => w.field === 'ari_bbsn')} />),},
        { field: 'crm_bbsn', headerName: 'CRM BBSN', width:140 },
        //{ field: 'vade', headerName: 'Vade', type: 'number' },
        //{ field: 'vat', headerName: 'KDV(%)', type: 'number' },
        //{ field: 'musteri_baz_maliyet', headerName: 'Müşteri Baz Maliyet', type: 'number'},
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', width:160, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            },
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
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
        // { field: 'lease_status_update_date', headerName: 'Statü Güncelleme Tarihi', width:180 },
        { field: 'is_delivery', headerName: 'Teslim Durumu', width:140,
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'teslim_edildi', label: 'Teslim Edildi' },
                    { value: 'teslim_edilmedi', label: 'Teslim Edilmedi' },
                ]}
                changeValue={(newValue) => setStatus(newValue)}
                />
            )
        },
        { field: 'is_title_deed_delivered', headerName: 'Tapu Durumu', width:140,
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'verildi', label: 'Verildi' },
                    { value: 'verilmedi', label: 'Verilmedi' },
                ]}
                changeValue={(newValue) => setStatus(newValue)}
                />
            )
        },
        { field: 'invoices', headerName: 'Fatura Durumu', width:160,
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'kesildi', label: 'Kesildi' },
                    { value: 'fatura_yok', label: 'Fatura Yok' },
                ]}
                changeValue={(newValue) => setStatus(newValue)}
                />
            )
        },
        { field: 'purchase_documents', headerName: 'Satıcı Fatura Durumu', width:160,
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'kesildi', label: 'Kesildi' },
                    { value: 'fatura_yok', label: 'Fatura Yok' },
                ]}
                changeValue={(newValue) => setStatus(newValue)}
                />
            )
        },
        { field: 'purchase_document_amount', headerName: 'Satıcı Fatura Tutarı', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'purchase_documents_currency', headerName: 'PB', width:160, renderHeaderFilter: () => null },
        { field: 'partner_notes', headerName: '', width: 180, renderHeaderFilter: () => null, renderCell: (params) => (
            <Stack direction="row" spacing={4} sx={{alignItems: "center",height:'100%',}}>
                <Grid container spacing={1} sx={{width:'100%'}}>
                    <Grid size={{xs:8, sm:8}}>
                        <TableButton
                        text="Notlar"
                        color="celticglow"
                        icon={<NoteAltIcon/>}
                        onClick={()=>{handleLeaseNoteDialog({lease_id:params.row.uuid})}}
                        />
                    </Grid>
                    <Grid size={{xs:4, sm:4}}>
                        <Badge badgeContent={params.row.lease_note_count} color={dark ? 'frostedbirch' : 'silvercoin'}></Badge>
                    </Grid>
                </Grid>
                    
            </Stack>
            )
        },
    ]

    const handleLeaseNoteDialog = async ({lease_id}) => {
        await dispatch(fetchLeaseNotes({activeCompany,params:{...leaseNotesParams,lease_id}})).unwrap();
        await dispatch(fetchLeaseInformation({lease_id})).unwrap();
        dispatch(setLeaseNoteDialog(true));
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Tapu Fatura Kontrol Kira Planı Listesi"
            rows={titleDeedInvoiceControls}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={titleDeedInvoiceControlsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/operation/export_title_deed_invoice_controls/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:titleDeedInvoiceControlsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={titleDeedInvoiceControlsCount}
            // checkboxSelection
            setParams={(value) => dispatch(setTitleDeedInvoiceControlsParams(value))}
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            noDownloadButton
            apiRef={apiRef}
            autoRowHeight
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
            }}
            initialState={{
                pinnedColumns: {left: ['code']}
            }}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setTitleDeedInvoiceControlsLoading(true))}
            finalEvent={() => {dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:titleDeedInvoiceControlsParams}));dispatch(setTitleDeedInvoiceControlsLoading(false));}}
            status={status}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/operation/titleDeedInvoiceControls_template"
            importURL="/operation/import_titleDeedInvoiceControls/"
            startEvent={() => dispatch(setTitleDeedInvoiceControlsLoading(true))}
            finalEvent={() => {dispatch(fetchTitleDeedInvoiceControls({activeCompany}));dispatch(setTitleDeedInvoiceControlsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/operation/delete_titleDeedInvoiceControls/"
            selectedItems={apiRef.current ? apiRef.current.getSelectedRows().values() : []}
            startEvent={() => dispatch(setTitleDeedInvoiceControlsLoading(true))}
            finalEvent={() => {dispatch(fetchTitleDeedInvoiceControls({activeCompany}));dispatch(setTitleDeedInvoiceControlsLoading(false));}}
            />
            <LeaseNoteDialog/>
        </PanelContent>
    )
}

export default TitleDeedInvoiceControls
