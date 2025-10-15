import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchasePayments, resetPurchasePaymentsParams, setPurchasePaymentsLoading, setPurchasePaymentsParams } from '../../../store/slices/purchasing/purchasePaymentSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog, setPurchaseDocumentDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import ListTable from '../../../component/table/ListTable';
import { Grid } from '@mui/material';
import ExportDialog from '../../../component/feedback/ExportDialog';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchPurchaseDocumentsInPurchasePayment } from '../../../store/slices/purchasing/purchaseDocumentSlice';
import PurchaseDocumentDialog from '../components/PurchaseDocumentDialog';

function PurchasePayments() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {purchasePayments,purchasePaymentsCount,purchasePaymentsParams,purchasePaymentsLoading} = useSelector((store) => store.purchasePayment);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPurchasePayments({activeCompany,params:purchasePaymentsParams}));
        });
    }, [activeCompany,purchasePaymentsParams,dispatch]);

    const columns = [
        { field: 'contract', headerName: 'Sözleşme No', renderCell: (params) => params.row.lease.contract },
        { field: 'lease_code', headerName: 'Kira Planı', renderCell: (params) => params.row.lease.code },
        { field: 'partner', headerName: 'Müşteri', width: 280, renderCell: (params) => params.row.lease.partner },
        { field: 'currency', headerName: 'PB', renderCell: (params) => params.row.lease.currency },
        { field: 'vendor', headerName: 'Satıcı', width: 280, renderCell: (params) => params.row.lease.vendor },
        { field: 'project', headerName: 'Proje', width: 140, renderCell: (params) => params.row.lease.project },
        { field: 'activation_date', headerName: 'Aktivasyon Tarihi', renderCell: (params) => params.row.lease.activation_date },
        { field: 'contract_date', headerName: 'Söz. Tarihi', renderCell: (params) => params.row.lease.contract_date },
        { field: 'lease_status', headerName: 'Ana Statü', renderCell: (params) => params.row.lease.lease_status },
        { field: 'status', headerName: 'Alt Statü', renderCell: (params) => params.row.lease.status },
        { field: 'vat', headerName: 'KDV (%)', type: 'number', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.vat, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_contract_amount', headerName: 'Toplam Sözleşme Bedeli', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'updated_amount', headerName: 'KDV Farkı Eklenmiş Bedel', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'before_total_payment', headerName: 'Ödeme Toplam Öncesi', type: 'number', cellClassName: () => 'bg-cream', headerClassName: () => 'bg-cream',
            renderHeaderFilter: () => null, valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'after_total_payment', headerName: 'Toplam Ödeme Sonrası', type: 'number', renderHeaderFilter: () => null, cellClassName: () => 'bg-cream', headerClassName: (params) => 'bg-cream',
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'managing_expense', headerName: 'Yönetim Gideri (Kdv Dahil)', type: 'number', renderHeaderFilter: () => null, cellClassName: () => 'bg-cream', headerClassName: (params) => 'bg-cream',
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'lease_payment_amount', headerName: 'Kira Tahsilat Tutarı', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_vendor_payment', headerName: 'Satıcı Ödemeleri Toplam Tutarı', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'vendor_payment_with_report_date', headerName: 'Rapor Tarihi İtibariyle Ödenecek Satıcı Tutarı', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'talimat', headerName: 'Talimat', type: 'number', renderHeaderFilter: () => null, cellClassName: () => 'bg-cream-dark', headerClassName: () => 'bg-cream-dark',
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'diff', headerName: 'Fark', type: 'number', renderHeaderFilter: () => null, cellClassName: () => 'bg-cream-dark', headerClassName: () => 'bg-cream-dark',
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'temerrut', headerName: 'Temerrüt', type: 'number', renderHeaderFilter: () => null, cellClassName: () => 'bg-cream-dark', headerClassName: () => 'bg-cream-dark',
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'next_payment', headerName: 'Sonraki Ödeme', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'purchasing', headerName: 'Satın Alma', type: 'number', renderHeaderFilter: () => null },
        { field: 'bbsn', headerName: 'BBSN', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.bbsn },
        { field: 'total_purchase_document_amount', headerName: 'Toplam Fatura Tutarı', width: 140, type: 'number', renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)}
                </div>
            ), renderHeaderFilter: () => null 
        },
        { field: 'is_tufe', headerName: 'Tüfeli mi?', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.is_tufe },
    ]

    const handleProfileDialog = async (params,event) => {
        console.log(params)
        if (event) {
            event.stopPropagation();
        }
        if(params.field==="total_purchase_document_amount"){
            dispatch(fetchPurchaseDocumentsInPurchasePayment({activeCompany,lease_code:params.row.lease.code}));
            dispatch(setPurchaseDocumentDialog(true))
        }
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Satıcı Ödemeleri"
                rows={purchasePayments}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={purchasePaymentsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchPurchasePayments({activeCompany,params:purchasePaymentsParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                rowCount={purchasePaymentsCount}
                setParams={(value) => dispatch(setPurchasePaymentsParams(value))}
                headerFilters={true}
                noDownloadButton
                onCellClick={handleProfileDialog}
                />
            </Grid>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/purchasing/export_purchase_payments/"
            startEvent={() => dispatch(setPurchasePaymentsLoading(true))}
            finalEvent={() => {dispatch(fetchPurchasePayments({activeCompany,params:purchasePaymentsParams}));dispatch(setPurchasePaymentsLoading(false));}}
            />
            <PurchaseDocumentDialog/>
        </PanelContent>
    )
}

export default PurchasePayments
