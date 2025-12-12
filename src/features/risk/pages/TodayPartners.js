import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodayPartners, setTodayPartnersLoading, setTodayPartnersParams } from 'store/slices/leasing/todayPartnerSlice';
import { setAlert, setCallDialog, setDeleteDialog, setExportDialog, setImportDialog, setMessageDialog, setPartnerDialog, setSendSMSDialog, setWarningNoticeDialog } from 'store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from 'component/panel/PanelContent';
import { Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, useTheme } from '@mui/material';
import CustomTableButton from 'component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from 'store/slices/processSlice';
import DeleteDialog from 'component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ListTableServer from 'component/table/ListTableServer';
import TodayPartnerDetailPanel from 'features/risk/components/TodayPartnerDetailPanel';
import { fetchPartnerInformation } from 'store/slices/partners/partnerSlice';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import CallDialog from 'component/dialog/CallDialog';
import MessageDialog from 'component/dialog/MessageDialog';
import FeedIcon from '@mui/icons-material/Feed';
import WarningNoticeDialog from 'component/dialog/WarningNoticeDialog';
import { fetchWarningNoticesInLease } from 'store/slices/contracts/contractSlice';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import StarIcon from '@mui/icons-material/Star';
import ExportDialog from 'component/feedback/ExportDialog';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import { setRiskPartnersLoading } from 'store/slices/leasing/riskPartnerSlice';
import { checkSMS, fetchSMSs } from 'store/slices/communication/smsSlice';
import SmsIcon from '@mui/icons-material/Sms';
import SendSMSDialog from 'component/dialog/SendSMSDialog';

function TodayPartners() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {todayPartners,todayPartnersCount,todayPartnersParams,todayPartnersLoading} = useSelector((store) => store.todayPartner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

    const dispatch = useDispatch();
    const theme = useTheme();

    const [isPending, startTransition] = useTransition();
    
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [specialSwitchPosition, setSpecialSwitchPosition] = useState(false);
    const [barterSwitchPosition, setBarterSwitchPosition] = useState(false);
    const [virmanSwitchPosition, setVirmanSwitchPosition] = useState(false);
    const [biggerThan100SwitchDisabled, setBiggerThan100SwitchDisabled] = useState(false);
    const [biggerThan100SwitchPosition, setBiggerThan100SwitchPosition] = useState(true);
    const [project, setProject] = useState("kizilbuk")
    const [exportURL, setExportURL] = useState("")

    // useEffect(() => {
    //     dispatch(setTodayPartnersParams({bigger_than_100:true}));
    // }, []);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTodayPartners({activeCompany,params:{...todayPartnersParams,project}}));
        });

        
    }, [activeCompany,todayPartnersParams,dispatch]);

    const todayPartnerColumns = [
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
        { field: 'is_commercial', headerName: 'Müşteri Türü', flex: 1.5, renderCell: (params) => (
            <Grid container spacing={1}>
                <Grid size={12} sx={{textAlign: 'center'}}>
                    {
                        params.value
                        ?
                            <Chip key={params.row.id} variant='contained' color="ari" label="Ticari" size='small'/>
                        :
                            <Chip key={params.row.id} variant='contained' color="primary" label="Tüketici" size='small'/>
                    }
                </Grid>
            </Grid>
                // params.value
                // ?
                //     <Grid container spacing={1} sx={{color: theme.palette.error.main}}>
                //         <Grid size={12} sx={{textAlign: 'center'}}>
                //             Ticari
                //         </Grid>
                //     </Grid>
                // :
                //     <Grid container spacing={1} sx={{ color: theme.palette.primary.main}}>
                //         <Grid size={12} sx={{textAlign: 'center'}}>
                //             Tüketici
                //         </Grid>
                //     </Grid>
            
            ),
            renderHeaderFilter: (params) => (
            <SelectHeaderFilter
            {...params}
            label="Müşteri Türü"
            externalValue="all"
            options={[
                { value: 'all', label: 'Tümü' },
                { value: 'true', label: 'Ticari' },
                { value: 'false', label: 'Tüketici' },
            ]}
            />
        )
        },
        { field: 'a', headerName: 'İletişim', flex: 2, renderHeaderFilter: () => null, renderCell: (params) => (
            <Grid container spacing={1}>
                <Grid size={6} sx={{textAlign: 'center'}}>
                    <IconButton aria-label="delete" onClick={handleCallDialog}>
                        <CallIcon />
                    </IconButton>
                </Grid>
                <Grid size={6} sx={{textAlign: 'center'}}>
                    <IconButton aria-label="delete" onClick={() => handleMessageDialog({partner_id:params.row.id,crm_code:params.row.crm_code})}>
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

    const handleMessageDialog = async ({partner_id,crm_code}) => {
        dispatch(setRiskPartnersLoading(true));
        await dispatch(checkSMS({data:{uuid:partner_id}})).unwrap();
        await dispatch(fetchSMSs({activeCompany,params:{...smssParams,partner_id,status:"0"}})).unwrap();
        await dispatch(fetchPartnerInformation(crm_code)).unwrap();
        dispatch(setMessageDialog(true));
        dispatch(setRiskPartnersLoading(false));
        
    };

    const handleWarningNoticeDialog = async (crm_code) => {
        dispatch(fetchWarningNoticesInLease({activeCompany,partner_crm_code:crm_code}));
        dispatch(setWarningNoticeDialog(true));
    };

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/leasing/delete_all_today_partners/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const handleChangeSpecialPartners = async (value) => {
        dispatch(setTodayPartnersParams({special:value,barter:false,virman:false}));
        setSpecialSwitchPosition(value);
        setBarterSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeBarterPartners = async (value) => {
        dispatch(setTodayPartnersParams({barter:value,special:false,virman:false}));
        setBarterSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeVirmanPartners = async (value) => {
        dispatch(setTodayPartnersParams({virman:value,special:false,barter:false}));
        setVirmanSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setBarterSwitchPosition(false);
    };

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setTodayPartnersParams({project:newValue}));
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Bugün Ödemesi Olan Müşteriler"
                autoHeight
                rows={todayPartners}
                columns={todayPartnerColumns}
                getRowId={(row) => row.id}
                loading={todayPartnersLoading}
                customButtons={
                    <>
                        {/* <CustomTableButton
                        title="İçe Aktar"
                        onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                        icon={<UploadFileIcon fontSize="small"/>}
                        /> */}
                        {/* <CustomTableButton
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        /> */}
                        <CustomTableButton
                        title="Sözleşme Bazında Excel'e Aktar"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL("/risk/export_today_partners/")}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Toplu SMS Gönder"
                        onClick={() => {dispatch(setSendSMSDialog(true));}}
                        icon={<SmsIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchTodayPartners({activeCompany,params:{...todayPartnersParams,project}})).unwrap()}
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
                            disabled={todayPartnersLoading}
                            >
                                <MenuItem value='kizilbuk'>KIZILBÜK</MenuItem>
                                <MenuItem value='sinpas'>SİNPAŞ GYO</MenuItem>
                                <MenuItem value='kasaba'>KASABA</MenuItem>
                                <MenuItem value='servet'>SERVET</MenuItem>
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
                rowCount={todayPartnersCount}
                setParams={(value) => dispatch(setTodayPartnersParams(value))}
                onCellClick={handleProfileDialog}
                headerFilters={true}
                noDownloadButton
                disableRowSelectionOnClick={true}
                //apiRef={apiRef}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));dispatch(fetchTodayPartners({activeCompany,params:todayPartnersParams}));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<TodayPartnerDetailPanel uuid={params.row.uuid} todayPartnerLeases={params.row.leases.leases}></TodayPartnerDetailPanel>)}}
                />
            </Grid>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_today_partners/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setTodayPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchTodayPartners({activeCompany,params:todayPartnersParams}));dispatch(setTodayPartnersLoading(false));}}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setTodayPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchTodayPartners({activeCompany,params:{...todayPartnersParams,project}}));dispatch(setTodayPartnersLoading(false));}}
            project={project}
            />
            <CallDialog/>
            <MessageDialog/>
            <SendSMSDialog
            risk_status="today_partners"
            project={project}
            text="Tabloda yer alan kişilere, sistemde kayıtlı telefon numaraları üzerinden gecikme hatırlatması için kısa mesaj gönderilecektir."
            example={`Değerli müşterimiz, {{proje}} projesinde bulunan sözleşmelerinizin ödemelerini hatırlatmak isteriz. ${project === 'kizilbuk' || project === 'kasaba' ? "Ödemelerinizi online sistemden kontrol edip ödeme yapabilirsiniz. " : ""}ÖDEME YAPILDIYSA MESAJI DİKKATE ALMAYINIZ. Arı Finansal Kiralama(İletişim: 4447680/rig@arileasing.com.tr)Mernis No: 0147005285500018`}
            />
            <WarningNoticeDialog/>
        </PanelContent>
    )
}

export default TodayPartners
