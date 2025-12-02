import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setFinmaksTransactionNameDialog, setMessageDialog, setSendSMSDialog, setThirdPersonDocumentDialog, setThirdPersonPaymentDetailDialog, setThirdPersonStatusDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';
import { fetchThirdPersons, setThirdPersonsLoading, updateThirdPersonStatus } from 'store/slices/compliance/thirdPersonSlice';
import RuleIcon from '@mui/icons-material/Rule';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VissuallyHiddenInput from 'component/input/VissuallyHiddenInput';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fetchBankAccountTransaction, fetchBankAccountTransactions, updateBankAccountTransaction, updateBankAccountTransactionName } from 'store/slices/finance/bankAccountTransactionSlice';
import WarningIcon from '@mui/icons-material/Warning';
import { addBankActivity } from 'store/slices/finance/bankAccountTransactionSlice';
import { update } from 'lodash';

function FinmaksTransactionNameDialog({...props}) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {finmaksTransactionNameDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);
    const {thirdPersonsParams} = useSelector((store) => store.thirdPerson);
    const {bankAccountTransactions,bankAccountTransactionsCount,bankAccountTransactionsParams,bankAccountTransactionsLoading} = useSelector((store) => store.bankAccountTransaction);

    const dispatch = useDispatch();

    const [name, setName] = useState('');

    const handleClose = () => {
        dispatch(setFinmaksTransactionNameDialog(false));
    };

    const handleSubmit = async () => {
        if (props.startEvent) {
            props.startEvent();
        };
        
        await dispatch(updateBankAccountTransactionName({activeCompany,data:{id: props.row.uuid,name}})).unwrap();

        dispatch(addBankActivity({data:props.row}));
        dispatch(updateBankAccountTransaction({transaction_id: props.row.transaction_id}));

        dispatch(setFinmaksTransactionNameDialog(false));
    };

    return (
        <MUIDialog
        open={finmaksTransactionNameDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <WarningIcon/> İsim Bilgisi Gerekli
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <Typography variant='body1'>
                            İlgili banka hareketinin tahsilat işlemi için Finmaks'ta tanımlı bir gönderen ismi bilgisi gerekmektedir. Aşağıdaki bilgileri kontrol ederek isim bilgisini ilgili alana girebilir ve Gönder butonu ile tahsilat işleme ekranına gönderebilirsiniz.</Typography>
                        {
                            props.row
                            ?
                                <>
                                    <Typography color='primary'>
                                        Ödeme Tarihi
                                    </Typography>
                                    <Typography>
                                        {props.row.transaction_date || ""}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Banka Hesabı
                                    </Typography>
                                    <Typography>
                                        {props.row.bank_name || ""} - {props.row.bank_account_no || ""}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Tutar
                                    </Typography>
                                    <Typography>
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.row.amount || 0)} {props.row.currency || ""}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Açıklama
                                    </Typography>
                                    <Typography>
                                        {props.row.explanation_field || ""}
                                    </Typography>
                                    <Divider/>
                                </>
                            :
                                null
                        }
                        <TextField
                        size="small"
                        label={"Gönderen İsmi"}
                        variant='outlined'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        />
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Kapat</Button>
                <Button variant="contained" color="opposite" onClick={handleSubmit} autoFocus>Gönder</Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default FinmaksTransactionNameDialog
