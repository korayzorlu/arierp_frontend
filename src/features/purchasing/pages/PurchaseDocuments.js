import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchaseDocuments, resetPurchaseDocumentsParams, setPurchaseDocumentsLoading, setPurchaseDocumentsParams } from '../../../store/slices/purchasing/purchaseDocumentSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import ListTable from '../../../component/table/ListTable';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import ExportDialog from '../../../component/feedback/ExportDialog';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import PurchaseDocumentDetailPanel from '../components/PurchaseDocumentDetailPanel';
import CustomColumnHeader from 'component/table/header/CustomColumnHeader';

function PurchaseDocuments() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {purchaseDocuments,purchaseDocumentsCount,purchaseDocumentsParams,purchaseDocumentsLoading,purchaseDocumentsInfo} = useSelector((store) => store.purchaseDocument);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPurchaseDocuments({activeCompany,params:purchaseDocumentsParams}));
        });
    }, [activeCompany,purchaseDocumentsParams,dispatch]);

    const columns = [
        { field: 'contract', headerName: 'Sözleşme No', renderCell: (params) => params.row.lease.contract },
        { field: 'lease_code', headerName: 'Kira Planı', renderCell: (params) => params.row.lease.code },
        { field: 'partner', headerName: 'Müşteri', width: 240 },
        { field: 'vendor', headerName: 'Satıcı', width: 240 },
        { field: 'crm_satici', headerName: 'CRM Satıcı', width: 240 },
        { field: 'lease_bbsn', headerName: 'BBSN', width: 160, renderCell: (params) => params.row.lease.bbsn },
        { field: 'document_number', headerName: 'Döküman Numarası', width: 140 },
        { field: 'document_date', headerName: 'Döküman Tarihi', width: 140, renderHeaderFilter: () => null },
        { field: 'amount', headerName: 'Toplam Tutar', width: 140, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.vat, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'vat_amount', headerName: 'KDV Toplam', width: 140, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.vat, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_amount', headerName: 'Genel Toplam', width: 140, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.vat, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'crm_amount', headerName: "IFS'ten Gelen Tutar", width: 140, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.crm_invoice_total_amount, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB' },
        { field: 'agreement', headerName: 'Mutabakat (TRY)', width:220, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value),
            renderHeader: () => (<CustomColumnHeader label="Mutabakat (TRY)" info={purchaseDocumentsInfo.filter(i => i.field === 'agreement')} />)
        },
        { field: 'is_agreement', headerName: 'Mutabakat Durumu', width: 180,
            cellClassName: (params) => {return params.value === "Mutabakat Yok" ? 'bg-red' : '';},
        },
        { field: 'exchange_rate', headerName: 'Kur', type: 'number', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.vat, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'document_status', headerName: 'Statü', width: 240 },
    ]

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setPurchaseDocumentsParams({project:newValue}));
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Satın Alma Belgeleri"
                rows={purchaseDocuments}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={purchaseDocumentsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchPurchaseDocuments({activeCompany,params:purchaseDocumentsParams})).unwrap()}
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
                            disabled={purchaseDocumentsLoading}
                            >
                                <MenuItem value='all'>TÜMÜ</MenuItem>
                                <MenuItem value='kizilbuk'>KIZILBÜK</MenuItem>
                                <MenuItem value='sinpas'>SİNPAŞ GYO</MenuItem>
                                <MenuItem value='kasaba'>KASABA</MenuItem>
                                <MenuItem value='servet'>SERVET</MenuItem>
                                <MenuItem value='diger'>DİĞER</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                }
                rowCount={purchaseDocumentsCount}
                setParams={(value) => dispatch(setPurchaseDocumentsParams(value))}
                headerFilters={true}
                noDownloadButton
                initialState={{
                    pinnedColumns: {left: ['contract','lease_code']}
                }}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<PurchaseDocumentDetailPanel uuid={params.row.uuid} rows={params.row.purchase_document_items.purchase_document_items}></PurchaseDocumentDetailPanel>)}}
                />
            </Grid>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/purchasing/export_purchase_documents/"
            startEvent={() => dispatch(setPurchaseDocumentsLoading(true))}
            finalEvent={() => {dispatch(fetchPurchaseDocuments({activeCompany,params:purchaseDocumentsParams}));dispatch(setPurchaseDocumentsLoading(false));}}
            />
        </PanelContent>
    )
}

export default PurchaseDocuments
