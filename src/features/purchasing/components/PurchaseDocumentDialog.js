import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPurchaseDocumentDialog } from '../../../store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, Stack } from '@mui/material';
import BasicTable from '../../../component/table/BasicTable';
import { fetchPurchaseDocumentsInPurchasePayment } from '../../../store/slices/purchasing/purchaseDocumentSlice';

function PurchaseDocumentDialog(props) {
    const {activeCompany} = useSelector((store) => store.organization);
    const {purchaseDocumentDialog} = useSelector((store) => store.notification);
    const {purchaseDocumentsLoading,purchaseDocumentsInPurchasePayment,purchaseDocumentsInPurchasePaymentCode} = useSelector((store) => store.purchaseDocument);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPurchaseDocumentsInPurchasePayment({activeCompany,purchaseDocumentsInPurchasePaymentCode}));
    }, [])
 
    const handleClose = () => {
        dispatch(setPurchaseDocumentDialog(false))
    };

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
        <MUIDialog
        open={purchaseDocumentDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xl"
        fullWidth
        >
            
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <>
                            <BasicTable
                            title="Satın Alma Belgeleri"
                            rows={purchaseDocumentsInPurchasePayment}
                            columns={columns}
                            getRowId={(row) => row.uuid}
                            disableRowSelectionOnClick={true}
                            loading={purchaseDocumentsLoading}
                            // initialState={{
                            //     aggregation: {
                            //         model: {
                            //             debit_amount: 'sum',
                            //             credit_amount: 'sum',
                            //             local_debit_amount: 'sum',
                            //             local_credit_amount: 'sum',
                            //         },
                            //     },
                            // }}
                            />
                        </>
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default PurchaseDocumentDialog
