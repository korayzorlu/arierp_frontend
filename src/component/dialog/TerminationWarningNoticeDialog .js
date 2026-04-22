import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setComprehensiveWarningNoticeDialog, setDialog, setMessageDialog, setTerminationWarningNoticeDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import BasicTable from 'component/table/BasicTable';
import { fetchTerminationWarningNoticeInformation, fetchWarningNoticeInformation, fetchWarningNoticeInLease, updateComprehensiveWarningNotice, updateTerminationWarningNotice } from 'store/slices/contracts/contractSlice';
import axios from 'axios';
import TableButton from 'component/button/TableButton';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';

function TerminationWarningNoticeDialog(props) {
    const {user,contract,fileUuid,fileContract,edit} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {terminationWarningNoticeDialog} = useSelector((store) => store.notification);
    const {warningNoticesLoading,warningNoticesInLease,warningNoticesInLeaseCode,terminationWarningNoticeInformation} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    const [data, setData] = useState({uuid:"",paid_amount:"0,00",deduction_amount:"0,00"})
    

    useEffect(() => {
        setData(data => ({...data, uuid: terminationWarningNoticeInformation.uuid, paid_amount: terminationWarningNoticeInformation.paid_amount, deduction_amount: terminationWarningNoticeInformation.deduction_amount}))
    },[terminationWarningNoticeInformation])

    const handleClose = () => {
        dispatch(setTerminationWarningNoticeDialog(false))
    };

    const handleSubmit = async () => {
        await dispatch(updateTerminationWarningNotice({data})).unwrap();
        dispatch(fetchTerminationWarningNoticeInformation({activeCompany,contract:fileContract}));
    }

    const getFile = async (uuid,contract) => {
        dispatch(setDialog(false));
        try {
            const response = await axios.post('/risk/get_termination_warning_notice/',
                {
                    uuid: uuid,
                },
                {
                    responseType: "blob",
                    withCredentials: true
                }
            );
            console.log(response.headers)
            const a = document.createElement("a");
            a.href = URL.createObjectURL(response.data);
            a.download = `${contract}.docx`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            dispatch(setAlert({status:'error',text:error.message}));
        } finally {

        }
    };

    

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    const handleNumberInput = (value) => {
        // Only allow numbers and single decimal point
        //return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        return value.replace(/[^0-9,]/g, '').replace(/(,.*),/g, '$1');
    };

    return (
        <MUIDialog
        open={terminationWarningNoticeDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            
            <DialogTitle id="alert-dialog-title">
                Fesih İhtarı Detayı
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri İsmi"}
                        variant='standard'
                        value={terminationWarningNoticeInformation.partner}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Sözleşme No"}
                        variant='standard'
                        value={terminationWarningNoticeInformation.contract}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"PB"}
                        variant='standard'
                        value={terminationWarningNoticeInformation.currency}
                        disabled={false}
                        fullWidth
                        />
                        {
                            edit
                            ?
                                <TextField
                                type="text"
                                size="small"
                                label={"Müşteri Ödemeleri Toplamı"}
                                variant='standard'
                                value={data.paid_amount}
                                onChange={(e) => handleChangeField("paid_amount", handleNumberInput(e.target.value))}
                                disabled={false}
                                fullWidth
                                inputProps={{inputMode: 'decimal'}}
                                />
                            :
                                <TextField
                                type="text"
                                size="small"
                                label={"Müşteri Ödemeleri Toplamı"}
                                variant='standard'
                                value={terminationWarningNoticeInformation.paid_amount}
                                disabled={false}
                                fullWidth
                                />
                        }
                        {
                            edit
                            ?
                                <TextField
                                type="text"
                                size="small"
                                label={"Kesinti Toplamı"}
                                variant='standard'
                                value={data.deduction_amount}
                                onChange={(e) => handleChangeField("deduction_amount", handleNumberInput(e.target.value))}
                                disabled={false}
                                fullWidth
                                inputProps={{inputMode: 'decimal'}}
                                />
                            :
                                <TextField
                                type="text"
                                size="small"
                                label={"Kesinti Toplamı"}
                                variant='standard'
                                value={terminationWarningNoticeInformation.deduction_amount}
                                disabled={false}
                                fullWidth
                                />
                        }
                        
                        <TextField
                        type="text"
                        size="small"
                        label={"İade Tutarı"}
                        variant='standard'
                        value={terminationWarningNoticeInformation.total_amount}
                        disabled={false}
                        fullWidth
                        />
                        
                    </Stack>
                    <Stack spacing={2} sx={{mt:2}} justifyContent="center">
                        <Grid container spacing={2} justifyContent="center">
                            <Grid size={{xs:12,sm:4}}>
                                <TableButton
                                text="İndir"
                                icon={<DownloadIcon/>}
                                onClick={() => getFile(fileUuid,fileContract)}
                                fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                {
                    edit
                    ?
                        <Button variant='contained' color="opposite" onClick={handleSubmit}>Kaydet</Button>
                    :
                        null
                }
                <Button color="neutral" onClick={handleClose}>Kapat</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default TerminationWarningNoticeDialog
