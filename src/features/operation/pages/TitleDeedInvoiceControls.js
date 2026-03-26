import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTitleDeedInvoiceControls, setTitleDeedInvoiceControlsLoading, setTitleDeedInvoiceControlsParams } from 'store/slices/operation/titleDeedInvoiceControlSlice';
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
import { Chip, Grid, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchProjects } from 'store/slices/leasing/leaseSlice';
import { gridClasses } from '@mui/x-data-grid-premium';

function TitleDeedInvoiceControls() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {titleDeedInvoiceControls,titleDeedInvoiceControlsCount,titleDeedInvoiceControlsParams,titleDeedInvoiceControlsLoading} = useSelector((store) => store.titleDeedInvoiceControl);
    const {projectsParams,projects } = useSelector((store) => store.lease);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:{...titleDeedInvoiceControlsParams,project}}));
            dispatch(fetchProjects({activeCompany,params:projectsParams}));
        });
    }, [activeCompany,titleDeedInvoiceControlsParams,dispatch]);

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
        { field: 'is_title_deed_delivered', headerName: 'Tapu Durumu',
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
        { field: 'invoices', headerName: 'Fatura Durumu',
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
        { field: 'purchase_documents', headerName: 'Satıcı Fatura Durumu',
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
    ]

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
        </PanelContent>
    )
}

export default TitleDeedInvoiceControls
