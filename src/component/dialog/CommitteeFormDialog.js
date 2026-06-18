import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setComprehensiveWarningNoticeDialog, setDialog, setMessageDialog, setCommitteeFormDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import BasicTable from 'component/table/BasicTable';
import { fetchCommitteeFormInformation, fetchWarningNoticeInformation, fetchWarningNoticeInLease, updateComprehensiveWarningNotice, updateCommitteeForm } from 'store/slices/contracts/contractSlice';
import axios from 'axios';
import TableButton from 'component/button/TableButton';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';

function CommitteeFormDialog(props) {
    const {user,contract,fileUuid,fileContract,edit} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {committeeFormDialog} = useSelector((store) => store.notification);
    const {warningNoticesLoading,warningNoticesInLease,warningNoticesInLeaseCode,committeeFormInformation} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    const [data, setData] = useState({uuid:"",paid_amount:"0,00",deduction_amount:"0,00"})

    useEffect(() => {
        setData(data => ({...data, uuid: committeeFormInformation.uuid}))
    },[committeeFormInformation])

    const handleClose = () => {
        dispatch(setCommitteeFormDialog(false))
    };

    const handleSubmit = async () => {
        await dispatch(updateCommitteeForm({data})).unwrap();
        dispatch(fetchCommitteeFormInformation({activeCompany,uuid:props.partner}));
    }

    const getFile = async () => {
        dispatch(setDialog(false));
        try {
            const response = await axios.post('/risk/get_committee_form/',
                {
                    uuid: props.partner,
                },
                {
                    responseType: "blob",
                    withCredentials: true
                }
            );

            const a = document.createElement("a");
            a.href = URL.createObjectURL(response.data);
            const normalizedName = props.partner_name.toLowerCase().replace(/\s+/g, '_');
            a.download = `${normalizedName}-${props.partner_crm_code}-komite-formu.docx`;
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
        open={committeeFormDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="sm"
        fullWidth
        >
            
            <DialogTitle id="alert-dialog-title">
                Komite Formu Detayı
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri İsmi"}
                        variant='standard'
                        value={committeeFormInformation.partner}
                        disabled={true}
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

export default CommitteeFormDialog
