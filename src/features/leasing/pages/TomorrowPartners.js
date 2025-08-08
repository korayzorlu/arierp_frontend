import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTomorrowPartners, setTomorrowPartnersLoading, setTomorrowPartnersParams } from '../../../store/slices/leasing/tomorrowPartnerSlice';
import { setAlert, setCallDialog, setDeleteDialog, setExportDialog, setImportDialog, setMessageDialog, setPartnerDialog, setWarningNoticeDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import { Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
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
import ExportDialog from '../../../component/feedback/ExportDialog';

function TomorrowPartners() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {tomorrowPartners,tomorrowPartnersCount,tomorrowPartnersParams,tomorrowPartnersLoading} = useSelector((store) => store.tomorrowPartner);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();
    
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [specialSwitchPosition, setSpecialSwitchPosition] = useState(false);
    const [barterSwitchPosition, setBarterSwitchPosition] = useState(false);
    const [virmanSwitchPosition, setVirmanSwitchPosition] = useState(false);
    const [biggerThan100SwitchDisabled, setBiggerThan100SwitchDisabled] = useState(false);
    const [biggerThan100SwitchPosition, setBiggerThan100SwitchPosition] = useState(true);
    const [project, setProject] = useState("kizilbuk")

    // useEffect(() => {
    //     dispatch(setTomorrowPartnersParams({bigger_than_100:true}));
    // }, []);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTomorrowPartners({activeCompany,params:{...tomorrowPartnersParams,project}}));
        });

        
    }, [activeCompany,tomorrowPartnersParams,dispatch]);

    const tomorrowPartnerColumns = [
        { field: 'name', headerName: 'İsim', flex: 4, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            {params.value}
                        </Grid>
                        <Grid size={4}>
                            {
                                params.row.special
                                ?
                                <Chip key={params.row.id} variant='outlined' color="neutral" icon={<StarIcon />} label="Özel" size='small'/>
                                :
                                null
                            }
                            {
                                params.row.barter
                                ?
                                <Chip key={params.row.id} variant='outlined' color="neutral" icon={<StarIcon />} label="Barter" size='small'/>
                                :
                                null
                            }
                            {
                                params.row.virman
                                ?
                                <Chip key={params.row.id} variant='outlined' color="neutral" icon={<StarIcon />} label="Virman" size='small'/>
                                :
                                null
                            }
                        </Grid>
                    </Grid>
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
        dispatch(setTomorrowPartnersParams({special:value,barter:false,virman:false}));
        setSpecialSwitchPosition(value);
        setBarterSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeBarterPartners = async (value) => {
        dispatch(setTomorrowPartnersParams({barter:value,special:false,virman:false}));
        setBarterSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeVirmanPartners = async (value) => {
        dispatch(setTomorrowPartnersParams({virman:value,special:false,barter:false}));
        setVirmanSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setBarterSwitchPosition(false);
    };

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setTomorrowPartnersParams({project:newValue}));
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
                customFiltersLeft={
                    <>
                        <FormControl sx={{mr: 2}}>
                            <InputLabel id="demo-simple-select-label">Proje</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            size='small'
                            value={project}
                            label="Proje"
                            onChange={(e) => changeProject(e.target.value)}
                            >
                                <MenuItem value='kizilbuk'>KIZILBÜK</MenuItem>
                                <MenuItem value='1202'>SİNPAŞ GYO</MenuItem>
                                <MenuItem value='28974'>KASABA</MenuItem>
                                <MenuItem value='6548'>SERVET</MenuItem>
                                <MenuItem value='diger'>Diğer</MenuItem>
                            </Select>
                        </FormControl>
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
                    label="Virman Göster"
                    checked={virmanSwitchPosition}
                    onChange={(value) => handleChangeVirmanPartners(value)}
                    />
                    <AndroidSwitch
                    label="Barter Göster"
                    checked={barterSwitchPosition}
                    onChange={(value) => handleChangeBarterPartners(value)}
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
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/leasing/export_tomorrow_partners/"
            startEvent={() => dispatch(setTomorrowPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchTomorrowPartners({activeCompany,params:{...tomorrowPartnersParams,project}}));dispatch(setTomorrowPartnersLoading(false));}}
            project={project}
            />
            <CallDialog/>
            <MessageDialog/>
            <WarningNoticeDialog/>
        </PanelContent>
    )
}

export default TomorrowPartners
