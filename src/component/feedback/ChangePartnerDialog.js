import React, { act, startTransition, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setChangePartnerDialog, setImportDialog } from '../../store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import Row from '../grid/Row';
import Col from '../grid/Col';
import StarIcon from '@mui/icons-material/Star';
import ListTableServer from '../table/ListTableServer';
import CustomTableButton from '../table/CustomTableButton';
import { fetchImportProcess } from '../../store/slices/processSlice';
import { fetchPartners, resetPartnersParams, setPartnersParams } from '../../store/slices/partners/partnerSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGridApiRef } from '@mui/x-data-grid';
import { updateLeaseflexAutomationBankActivityLeases } from '../../store/slices/leasing/collectionSlice';
import { fetchBankActivities, updateBankActivityLeases } from '../../store/slices/leasing/bankActivitySlice';
import { changePartner } from 'store/slices/leasing/leaseSlice';

function ChangePartnerDialog(props) {
    const {children,submitURL,startEvent,finalEvent,closeEvent,uuid} = props;
    const {dark} = useSelector((store) => store.auth);
    const {changePartnerDialog} = useSelector((store) => store.notification);
    const {partners,partnersCount,partnersParams,partnersLoading} = useSelector((store) => store.partner);
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apiRef = useGridApiRef();
    const isFirstSelection = useRef(true);
    const previousSelectedRows = useRef(new Set());

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileText, setSelectedFileText] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentSelection, setCurrentSelection] = useState(new Set())
    
    useEffect(() => {
        dispatch(resetPartnersParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            //dispatch(resetPartnersParams());
            dispatch(fetchPartners({activeCompany,params:partnersParams}));
        });
    }, [activeCompany,partnersParams,dispatch]);

    const columns = [
        { field: 'name', headerName: 'İsim', flex: 6, editable: true, renderCell: (params) => (
                params.row.partner_special
                ?
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            {params.value}
                        </Grid>
                        <Grid size={4}>
                            <Chip key={params.row.id} variant='outlined' color="neutral" icon={<StarIcon />} label="Özel" size='small'/>
                        </Grid>
                    </Grid>
                :
                    params.value
            )
        },
        { field: 'customerCode', headerName: 'Müşteri Kodu', flex: 1},
        { field: 'crmCode', headerName: 'CRM Kodu', flex: 1},
        { field: 'tcVknNo', headerName: 'TC/VKN No', flex: 2 },
        { field: 'country_name', headerName: 'Ülke', flex: 1 },
        { field: 'city_name', headerName: 'Şehir', flex: 1 },
    ]

    const handleClose = () => {
        dispatch(setChangePartnerDialog(false));
        if(closeEvent){
            closeEvent();
        };
    };

    const handleSelectionChange = () => {
        const currentSelection = new Set(apiRef.current.getSelectedRows().keys());
    };

    const handleSubmit = () => {
        dispatch(changePartner({data:{uuid}}))

        dispatch(setChangePartnerDialog(false));
    };

    return (
        <MUIDialog
        open={changePartnerDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        maxWidth="xl"
        >
            <DialogTitle id="alert-dialog-title">
                Müşteri seç ve kira planlarını getir
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" component="div">
                    <ListTableServer
                    title="Partner Listesi"
                    height="80vh"
                    rows={partners}
                    columns={columns}
                    getRowId={(row) => row.uuid}
                    loading={partnersLoading}
                    customButtons={
                        <>  
                            <CustomTableButton
                            title="Yenile"
                            onClick={() => dispatch(fetchPartners({activeCompany,params:partnersParams})).unwrap()}
                            icon={<RefreshIcon fontSize="small"/>}
                            />
                        </>
                    }
                    rowCount={partnersCount}
                    checkboxSelection={true}
                    disableRowSelectionOnClick={true}
                    setParams={(value) => dispatch(setPartnersParams(value))}
                    noAllSelect
                    disableMultipleRowSelection
                    apiRef={apiRef}
                    headerFilters
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="contained" color="error" size='small' onClick={handleClose}>Vazgeç</Button>
                <Button variant="contained" color="primary" size='small' onClick={handleSubmit} autoFocus>Gönder</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default ChangePartnerDialog
