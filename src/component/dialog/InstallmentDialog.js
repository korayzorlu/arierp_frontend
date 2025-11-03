import React from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Avatar, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setInstallmentDialog } from '../../store/slices/notificationSlice';
import BasicTable from '../table/BasicTable';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid-premium';

function InstallmentDialog(props) {
    const {lease_id} = props;

    const {dark} = useSelector((store) => store.auth);
    const {installmentDialog} = useSelector((store) => store.notification);
    const {installmentInformation,installmentsLoading,overdueInformation,overduesLoading} = useSelector((store) => store.installment);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setInstallmentDialog(false))
    };

    const userColumns = [
        { field: 'sequency', headerName: 'Sıra No', flex: 1, type: 'number' },
        { field: 'payment_date', headerName: 'Ödeme Tarihi', flex: 1,  type: 'number' },
        { field: 'payment', headerName: 'Ödeme', flex: 1, type: 'number' },
        { field: 'vat', headerName: 'KDV(%)', flex: 1, type: 'number' },
        { field: 'vat_amount', headerName: 'KDV Tutarı', flex: 1, type: 'number' },
        { field: 'amount', headerName: 'Toplam Ödeme', flex: 1, type: 'number' },
        { field: 'currency', headerName: 'Para Birimi', flex: 1,  type: 'number' },
        { field: 'type_display', headerName: 'Ödeme Tipi', flex: 1 },
        //{...GRID_CHECKBOX_SELECTION_COL_DEF, width: 100,},
    ]

    const rows = installmentInformation.map((row) => ({
        ...row,
        showCheckbox: row.overdue_amount > 0,
    }));


    return (
        <MUIDialog
        open={installmentDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="lg"
        fullWidth
        >
            
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <>
                            <BasicTable
                            title={`Kira Planı: ${rows ? rows.length > 0 ? rows[0]["lease"] : "" : ""} | Proje: ${rows ? rows.length > 0 ? rows[0]["project"] : "" : ""}`}
                            rows={rows}
                            columns={userColumns}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick={true}
                            loading={installmentsLoading}
                            noToolbarButtons
                            getRowClassName={(params) => params.row.type !== '1' ? `table-row-${dark ? "cream" : "celticglow"}` : ''}
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

export default InstallmentDialog
