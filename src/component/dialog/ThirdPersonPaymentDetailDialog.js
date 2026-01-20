import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setMessageDialog, setSendSMSDialog, setThirdPersonDocumentDialog, setThirdPersonPaymentDetailDialog, setThirdPersonStatusDialog } from 'store/slices/notificationSlice';
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
import { fetchBankAccountTransaction, fetchBankAccountTransactions } from 'store/slices/finance/bankAccountTransactionSlice';
import ThirdPersonPaymentAccordion from 'component/surfaces/ThirdPersonPaymentAccordion';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';

function ThirdPersonPaymentDetailDialog({...props}) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {thirdPersonPaymentDetailDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);
    const {thirdPersonsParams} = useSelector((store) => store.thirdPerson);
    const {bankAccountTransactions,bankAccountTransactionsCount,bankAccountTransactionsParams,bankAccountTransactionsLoading} = useSelector((store) => store.bankAccountTransaction);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setThirdPersonPaymentDetailDialog(false));
    };

    return (
        <MUIDialog
        open={thirdPersonPaymentDetailDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <VisibilityIcon/> Ödeme Detayı
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        {   
                            props.row.finmaks_transactions
                            ?
                                props.row.finmaks_transactions.length > 0
                                ?   
                                    props.row.finmaks_transactions.map((transaction) => (
                                        <ThirdPersonPaymentAccordion obj={transaction}/>
                                    ))
                                :
                                    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                                        <Grid spacing={1} size={{xs:12,sm:12}}>
                                            <Stack spacing={2}>
                                                {/* <AddPartnerNoteAccordion/> */}
                                                <Typography variant='body2' sx={{color:'text.secondary',textAlign:'center'}}>
                                                    <SubtitlesOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></SubtitlesOffIcon>
                                                </Typography>
                                                <Typography variant='body2' sx={{color:'text.secondary',textAlign:'center'}}>
                                                    Ödeme kaydı bulunmamaktadır.
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                            :
                                    null
                                
                        }
                        {/* {
                            props.row.finmaks_transaction
                            ?
                                <>
                                    <Typography color='primary'>
                                        Ödeme Tarihi
                                    </Typography>
                                    <Typography>
                                        {props.row.finmaks_transaction.transaction_date || ""}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Banka
                                    </Typography>
                                    <Typography>
                                        {props.row.finmaks_transaction.bank_name || ""}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Banka Hesabı
                                    </Typography>
                                    <Typography>
                                        {props.row.finmaks_transaction.bank_account_no || ""}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Para Birimi
                                    </Typography>
                                    <Typography>
                                        {props.row.finmaks_transaction.currency || ""}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Tutar
                                    </Typography>
                                    <Typography>
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.row.finmaks_transaction.amount || 0)}
                                    </Typography>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Açıklama
                                    </Typography>
                                    <Typography>
                                        {props.row.finmaks_transaction.explanation_field || ""}
                                    </Typography>
                                </>
                            :
                                null
                        } */}
                        
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Kapat</Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default ThirdPersonPaymentDetailDialog
