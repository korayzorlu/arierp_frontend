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
import { Grid } from '@mui/material';
import ExportDialog from '../../../component/feedback/ExportDialog';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';

function PurchaseDocuments() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {purchaseDocuments,purchaseDocumentsCount,purchaseDocumentsParams,purchaseDocumentsLoading} = useSelector((store) => store.purchaseDocument);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);

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
        { field: 'currency', headerName: 'PB' },
        { field: 'exchange_rate', headerName: 'Kur', type: 'number', renderHeaderFilter: () => null, renderCell: (params) => params.row.lease.vat, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'document_status', headerName: 'Statü', width: 240 },
    ]

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
                        title="Yenile"
                        onClick={() => dispatch(fetchPurchaseDocuments({activeCompany,params:purchaseDocumentsParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                rowCount={purchaseDocumentsCount}
                setParams={(value) => dispatch(setPurchaseDocumentsParams(value))}
                headerFilters={true}
                noDownloadButton
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
