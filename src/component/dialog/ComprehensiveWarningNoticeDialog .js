import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setComprehensiveWarningNoticeDialog, setDialog, setMessageDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import BasicTable from 'component/table/BasicTable';
import { fetchComprehensiveWarningNoticeInformation, fetchWarningNoticeInformation, fetchWarningNoticeInLease, updateComprehensiveWarningNotice } from 'store/slices/contracts/contractSlice';
import axios from 'axios';
import TableButton from 'component/button/TableButton';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';

function ComprehensiveWarningNoticeDialog(props) {
    const {user,contract,fileUuid,fileContract,edit} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {comprehensiveWarningNoticeDialog} = useSelector((store) => store.notification);
    const {warningNoticesLoading,warningNoticesInLease,warningNoticesInLeaseCode,comprehensiveWarningNoticeInformation} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    const [data, setData] = useState({uuid:"",service_date:""})

    useEffect(() => {
        setData(data => ({...data, uuid: comprehensiveWarningNoticeInformation.uuid, service_date: comprehensiveWarningNoticeInformation.service_date}))
    },[comprehensiveWarningNoticeInformation])

    const handleClose = () => {
        dispatch(setComprehensiveWarningNoticeDialog(false))
    };

    const handleSubmit = async () => {
        await dispatch(updateComprehensiveWarningNotice({data})).unwrap();
        dispatch(fetchComprehensiveWarningNoticeInformation({activeCompany,contract:fileContract}));
    }

    const getFile = async (uuid,contract) => {
        dispatch(setDialog(false));
        try {
            const response = await axios.post('/risk/get_warning_notice/',
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

    return (
        <MUIDialog
        open={comprehensiveWarningNoticeDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            
            <DialogTitle id="alert-dialog-title">
                İhtar Detayı
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri İsmi"}
                        variant='standard'
                        value={comprehensiveWarningNoticeInformation.partner}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Sözleşme No"}
                        variant='standard'
                        value={comprehensiveWarningNoticeInformation.contract}
                        disabled={false}
                        fullWidth
                        />
                        {
                            edit
                            ?
                                <TextField
                                type="text"
                                size="small"
                                label={"Tebliğ Tarihi"}
                                placeholder='GG.AA.YYYY formatında tarih giriniz.'
                                variant='standard'
                                value={data.service_date}
                                onChange={(e) => handleChangeField("service_date",e.target.value)}
                                disabled={false}
                                fullWidth
                                />
                            :
                                <TextField
                                type="text"
                                size="small"
                                label={"Tebliğ Tarihi"}
                                variant='standard'
                                value={comprehensiveWarningNoticeInformation.service_date}
                                disabled={false}
                                fullWidth
                                />
                        }
                        
                        <TextField
                        type="text"
                        size="small"
                        label={"Öngörülen Fesih Tarihi"}
                        variant='standard'
                        value={comprehensiveWarningNoticeInformation.official_cancellation_date}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Fesihe Kalan Gün Sayısı"}
                        variant='standard'
                        value={comprehensiveWarningNoticeInformation.termination_days}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"İhtar Borcu"}
                        variant='standard'
                        value={`${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(comprehensiveWarningNoticeInformation.debit_amount)} ${comprehensiveWarningNoticeInformation.currency}`}
                        disabled={false}
                        fullWidth
                        />
                        {/* <TextField
                        type="text"
                        size="small"
                        label={"Dosya"}
                        variant='standard'
                        value={
                            <TableButton
                            text="İndir"
                            icon={<DownloadIcon/>}
                            onClick={() => getFile(fileUuid,fileContract)}
                            />
                        }
                        disabled={false}
                        fullWidth
                        /> */}
                        
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

export default ComprehensiveWarningNoticeDialog
