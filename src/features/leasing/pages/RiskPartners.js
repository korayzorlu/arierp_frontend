import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRiskPartners, setRiskPartnersLoading, setRiskPartnersParams } from '../../../store/slices/leasing/riskPartnerSlice';
import { setAlert, setCallDialog, setDeleteDialog, setExportDialog, setImportDialog, setMessageDialog, setPartnerDialog, setWarningNoticeDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import { Chip, FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, NativeSelect, Select, TextField } from '@mui/material';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ListTableServer from '../../../component/table/ListTableServer';
import RiskPartnerDetailPanel from '../components/RiskPartnerDetailPanel';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExportDialog from '../../../component/feedback/ExportDialog';

function RiskPartners() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {riskPartners,riskPartnersCount,riskPartnersParams,riskPartnersLoading} = useSelector((store) => store.riskPartner);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [specialSwitchPosition, setSpecialSwitchPosition] = useState(false);
    const [barterSwitchPosition, setBarterSwitchPosition] = useState(false);
    const [virmanSwitchPosition, setVirmanSwitchPosition] = useState(false);
    const [biggerThan100SwitchDisabled, setBiggerThan100SwitchDisabled] = useState(false);
    const [biggerThan100SwitchPosition, setBiggerThan100SwitchPosition] = useState(true);
    const [projectOpen, setProjectOpen] = useState(false)
    const [project, setProject] = useState("KIZILBÜK")

    // useEffect(() => {
    //     dispatch(setRiskPartnersParams({bigger_than_100:true}));
    // }, []);



    useEffect(() => {
        startTransition(() => {
            dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams}));
        });

        
    }, [activeCompany,riskPartnersParams,dispatch]);

    const riskPartnerColumns = [
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
        { field: 'max_overdue_days', headerName: 'Maks. Gecikme Günü', flex: 2, type: 'number', renderHeaderFilter: () => null,
            // valueOptions: [
            //     { value: '0', label: '30 Günü Geçmeyenler' },
            //     { value: '30', label: '30 Günü Geçenler' },    
            // ],
            cellClassName: (params) => {
                if (params.value <= 30){
                    return 'bg-yellow'
                } else if (params.value > 30 && params.value <= 60){
                    return 'bg-orange'
                } else if (params.value > 60 && params.value <= 90){
                    return 'bg-light-red'
                } else if (params.value > 90){
                    return 'bg-dark-red'
                }
            }
        },
        { field: 'total_overdue_amount', headerName: 'Toplam Gecikme Tutarı', flex: 2, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'a', headerName: 'İletişim', flex: 2, renderHeaderFilter: () => null, renderCell: (params) => (
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

    const handleChangeSpecialPartners = async (value) => {
        dispatch(setRiskPartnersParams({special:value,barter:false,virman:false}));
        setSpecialSwitchPosition(value);
        setBarterSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeBarterPartners = async (value) => {
        dispatch(setRiskPartnersParams({barter:value,special:false,virman:false}));
        setBarterSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeVirmanPartners = async (value) => {
        dispatch(setRiskPartnersParams({virman:value,special:false,barter:false}));
        setVirmanSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setBarterSwitchPosition(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    const changeProject = (databaseTerm) => {
        setProject(databaseTerm);
        dispatch(setRiskPartnersLoading(true));
        setProjectOpen(false);
    };

    const handleChangeBiggerThan100 = async (value) => {
        if(!value){
            dispatch(setRiskPartnersParams({bigger_than_100:value,overdue_amount:true}));
        }else{
            dispatch(setRiskPartnersParams({bigger_than_100:value,overdue_amount:false}));
        }
        setBiggerThan100SwitchPosition(value);
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Gecikmesi Olan Müşteriler"
                autoHeight
                rows={riskPartners}
                columns={riskPartnerColumns}
                getRowId={(row) => row.id}
                loading={riskPartnersLoading}
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
                        onClick={() => dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams})).unwrap()}
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
                            value='kizilbuk'
                            label="Age"
                            onChange={(value) => changeProject(value)}
                            >
                            <MenuItem value='1202'>KIZILBÜK</MenuItem>
                            {/* <MenuItem value='1202'>SİNPAŞ GYO</MenuItem> */}
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
                    {/* <AndroidSwitch
                    label="Özel Müşterileri Göster"
                    checked={specialSwitchPosition}
                    onChange={(value) => handleChangeSpecialPartners(value)}
                    /> */}
                </>
                
            }
                rowCount={riskPartnersCount}
                setParams={(value) => dispatch(setRiskPartnersParams(value))}
                onCellClick={handleProfileDialog}
                headerFilters={true}
                noDownloadButton
                //sortModel={[{ field: 'overdue_days', sort: 'desc' }]}
                disableRowSelectionOnClick={true}
                //apiRef={apiRef}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams}));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<RiskPartnerDetailPanel uuid={params.row.uuid} riskPartnerLeases={params.row.leases}></RiskPartnerDetailPanel>)}}
                />
            </Grid>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_risk_partners/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setRiskPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams}));dispatch(setRiskPartnersLoading(false));}}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/leasing/export_risk_partners/"
            startEvent={() => dispatch(setRiskPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchRiskPartners({activeCompany}));dispatch(setRiskPartnersLoading(false));}}
            />
            <CallDialog/>
            <MessageDialog/>
        </PanelContent>
    )
}

export default RiskPartners
