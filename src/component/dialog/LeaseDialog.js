import React from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Avatar, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setContractPaymentDialog, setInstallmentDialog, setLeaseDialog } from '../../store/slices/notificationSlice';
import BasicTable from '../table/BasicTable';
import PaidIcon from '@mui/icons-material/Paid';
import { fetchContractPaymentsInLease } from '../../store/slices/contracts/contractSlice';
import { cellProgress } from '../progress/CellProgress';

function LeaseDialog(props) {
    const {lease_id} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {userInformation} = useSelector((store) => store.auth);
    const {leaseDialog} = useSelector((store) => store.notification);
    const {leaseInformation,leasesLoading} = useSelector((store) => store.lease);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setLeaseDialog(false))
    };

    const columns = [
        { field: 'code', headerName: 'Kira Planı', flex:2, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'contract', headerName: 'Sözleşme', flex:2 },
        { field: 'project', headerName: 'Proje', flex:6 },
        { field: 'block', headerName: 'Blok', flex:2 },
        { field: 'unit', headerName: 'Bağımsız Bölüm', flex:2 },
        { field: '', headerName: 'Tahsilatlar', flex:2, renderCell: (params) => (
                <IconButton aria-label='back' onClick={()=>{dispatch(fetchContractPaymentsInLease({activeCompany,contract_code:params.row.contract}));dispatch(setContractPaymentDialog(true))}}>
                    <PaidIcon/>
                </IconButton>
                
            )
        },
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', flex:2, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            }
        },
        { field: 'temerrut_amount', headerName: 'Temerrüt Tutarı', flex:2, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            }
        },
        { field: 'currency', headerName: 'PB', flex:1 },
        { field: 'overdue_days', headerName: 'Gecikme Süresi', flex:2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => (
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
        { field: 'paid_rate', headerName: 'Oran', flex:2, type: 'number', renderCell: cellProgress },
        { field: 'is_kdv_diff', headerName: 'KDV Durumu', flex:2, renderCell: (params) => (
                params.value
                ?
                    "Kdv Farkı Var"
                :
                    ""
                
            ),
            cellClassName: (params) => {
                return params.value ? 'bg-orange' : '';
            }
        },
        { field: 'lease_status', headerName: 'Statü', flex:2 },
    ]


    return (
        <MUIDialog
        open={leaseDialog}
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
                            title="Gecikemede Olan Kira Planları"
                            rows={leaseInformation}
                            columns={columns}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick={true}
                            loading={leasesLoading}
                            noToolbarButtons
                            //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
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

export default LeaseDialog
