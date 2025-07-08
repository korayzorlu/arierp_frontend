import React from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Avatar, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPartnerDialog } from '../../store/slices/notificationSlice';
import Row from '../grid/Row';
import Col from '../grid/Col';
import MessageIcon from '@mui/icons-material/Message';
import { amber } from '@mui/material/colors';

function PartnerDialog(props) {
    const {user} = props;

    const {userInformation} = useSelector((store) => store.auth);
    const {partnerDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setPartnerDialog(false))
    };

    return (
        <MUIDialog
        open={partnerDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Müşteri
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <TextField
                        type="text"
                        size="small"
                        label={"İsim"}
                        variant='standard'
                        value={partnerInformation.name}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"TC/VKN"}
                        variant='standard'
                        value={partnerInformation.tc_vkn_no}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"CRM Kodu"}
                        variant='standard'
                        value={partnerInformation.crm_code}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Adres"}
                        variant='standard'
                        value={partnerInformation.address}
                        disabled={false}
                        multiline
                        rows={2}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Şehir"}
                        variant='standard'
                        value={partnerInformation.city}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Ülke"}
                        variant='standard'
                        value={partnerInformation.country}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Tel"}
                        variant='standard'
                        value={partnerInformation.phone_number}
                        disabled={false}
                        fullWidth
                        />
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default PartnerDialog
