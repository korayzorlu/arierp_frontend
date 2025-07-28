import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTomorrowPartners, setTomorrowPartnersLoading, setTomorrowPartnersParams } from '../../../store/slices/leasing/tomorrowPartnerSlice';
import { setAlert, setCallDialog, setDeleteDialog, setExportDialog, setImportDialog, setMessageDialog, setPartnerDialog, setWarningNoticeDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import { Chip, Grid, IconButton } from '@mui/material';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ListTableServer from '../../../component/table/ListTableServer';
import TomorrowPartnerDetailPanel from '../components/TomorrowPartnerDetailPanel';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import CallDialog from '../components/CallDialog';
import MessageDialog from '../components/MessageDialog';
import FeedIcon from '@mui/icons-material/Feed';
import WarningNoticeDialog from '../components/WarningNoticeDialog';
import { fetchWarningNoticesInLease } from '../../../store/slices/contracts/contractSlice';
import AndroidSwitch from '../../../component/switch/AndroidSwitch';
import StarIcon from '@mui/icons-material/Star';

function TomorrowPartners() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {tomorrowPartners,tomorrowPartnersCount,tomorrowPartnersParams,tomorrowPartnersLoading} = useSelector((store) => store.tomorrowPartner);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();
    
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [biggerThan100SwitchDisabled, setBiggerThan100SwitchDisabled] = useState(false);
    const [biggerThan100SwitchPosition, setBiggerThan100SwitchPosition] = useState(true);

    // useEffect(() => {
    //     dispatch(setTomorrowPartnersParams({bigger_than_100:true}));
    // }, []);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTomorrowPartners({activeCompany,params:tomorrowPartnersParams}));
        });

        
    }, [activeCompany,tomorrowPartnersParams,dispatch]);

    const tomorrowPartnerColumns = [
        { field: 'name', headerName: 'İsim', flex: 4, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {
                        params.row.special
                        ?
                            <Grid container spacing={2}>
                                <Grid size={8}>
                                    {params.value}
                                </Grid>
                                <Grid size={4}>
                                    <Chip key={params.row.id} variant='contained' color="secondary" icon={<StarIcon />} label="Özel" size='small'/>
                                </Grid>
                            </Grid>
                        :
                            params.value
                    }
                    
                </div>
                
            )
        },
        { field: 'tc_vkn_no', headerName: 'TC/VKN', flex: 2 },
        { field: 'crm_code', headerName: 'CRM kodu', flex: 1 },
        { field: 'a', headerName: 'İletişim', flex: 2, renderCell: (params) => (
            <Grid container spacing={1}>
                <Grid size={6} sx={{textAlign: 'center'}}>
                    <IconButton aria-label="delete" onClick={handleCallDialog}>
                        <CallIcon />
                    </IconButton>
                </Grid>
                <Grid size={6} sx={{textAlign: 'center'}}>
                    <IconButton aria-label="delete" onClick={handleMessageDialog}>
                        <MessageIcon />
                    </IconButton>
                </Grid>
            </Grid>
            )
        },
        { field: 's', headerName: 'Statü', flex: 2 },
    ]

    const handleProfileDialog = async (params,event) => {
        if(params.field==="name"){
            await dispatch(fetchPartnerInformation(params.row.crm_code)).unwrap();
            dispatch(setPartnerDialog(true));
        }
    };

    const handleCallDialog = async (params,event) => {
        dispatch(setCallDialog(true));
    };

    const handleMessageDialog = async (params,event) => {
        dispatch(setMessageDialog(true));
    };

    const handleWarningNoticeDialog = async (crm_code) => {
        dispatch(fetchWarningNoticesInLease({activeCompany,partner_crm_code:crm_code}));
        dispatch(setWarningNoticeDialog(true));
    };

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/leasing/delete_all_tomorrow_partners/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const handleChangeSpecialPartners = async (value) => {
        dispatch(setTomorrowPartnersParams({special:value}));
        setSwitchPosition(value);
    };

    const handleChangeBiggerThan100 = async (value) => {
        if(!value){
            dispatch(setTomorrowPartnersParams({bigger_than_100:value,overdue_amount:true}));
        }else{
            dispatch(setTomorrowPartnersParams({bigger_than_100:value,overdue_amount:false}));
        }
        setBiggerThan100SwitchPosition(value);
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Yarın Ödemesi Olan Müşteriler"
                autoHeight
                rows={tomorrowPartners}
                columns={tomorrowPartnerColumns}
                getRowId={(row) => row.id}
                loading={tomorrowPartnersLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="İçe Aktar"
                        onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                        icon={<UploadFileIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchTomorrowPartners({activeCompany,params:tomorrowPartnersParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                customFilters={
                <>  
                    {/* <AndroidSwitch
                    label="100'den Büyük Olanlar"
                    checked={biggerThan100SwitchPosition}
                    onChange={(value) => handleChangeBiggerThan100(value)}
                    disabled={biggerThan100SwitchDisabled}
                    /> */}
                    <AndroidSwitch
                    label="Özel Müşterileri Göster"
                    checked={switchPosition}
                    onChange={(value) => handleChangeSpecialPartners(value)}
                    disabled={switchDisabled}
                    />
                </>
                
            }
                rowCount={tomorrowPartnersCount}
                setParams={(value) => dispatch(setTomorrowPartnersParams(value))}
                onCellClick={handleProfileDialog}
                headerFilters={true}
                noDownloadButton
                disableRowSelectionOnClick={true}
                //apiRef={apiRef}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));dispatch(fetchTomorrowPartners({activeCompany,params:tomorrowPartnersParams}));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<TomorrowPartnerDetailPanel uuid={params.row.uuid} tomorrowPartnerLeases={params.row.leases}></TomorrowPartnerDetailPanel>)}}
                />
            </Grid>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_tomorrow_partners/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setTomorrowPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchTomorrowPartners({activeCompany,params:tomorrowPartnersParams}));dispatch(setTomorrowPartnersLoading(false));}}
            />
            <CallDialog/>
            <MessageDialog/>
            <WarningNoticeDialog/>
        </PanelContent>
    )
}

export default TomorrowPartners
