import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setComprehensiveWarningNoticeDialog, setDialog, setMessageDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import BasicTable from 'component/table/BasicTable';
import { fetchWarningNoticeInformation, fetchWarningNoticeInLease } from 'store/slices/contracts/contractSlice';
import axios from 'axios';
import TableButton from 'component/button/TableButton';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';

function ComprehensiveWarningNoticeDialog(props) {
    const {user,contract,fileUuid,fileContract} = props;

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

    const columns = [
        { field: 'partner_name', headerName: 'Müşteri', flex: 4 },
        { field: 'contract_code', headerName: 'Sözleşme No', flex: 1 },
        { field: 'process_start_date', headerName: 'İhtar Tarihi', flex: 2 },
        { field: 'service_date', headerName: 'Tebliğ Tarihi', flex: 2 },
        { field: 'official_cancellation_date', headerName: 'Öngörülen Fesih Tarihi', flex: 2 },
        { field: 'termination_days', headerName: 'Fesihe Kalan Gün Sayısı', flex: 1 },
        { field: 'debit_amount', headerName: 'İhtar Borcu', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'paid', headerName: 'Ödenen Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'diff', headerName: 'Kalan Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'state', headerName: 'Durum', flex: 1 },
    ]

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
                <Button variant='contained' color="opposite" onClick={handleClose}>Kaydet</Button>
                <Button color="neutral" onClick={handleClose}>Kapat</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default ComprehensiveWarningNoticeDialog
