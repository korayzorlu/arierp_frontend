import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRiskPartners, fetchPostaToWarnedRiskPartners, setRiskPartnersLoading, setPostaToWarnedRiskPartnersLoading, setPostaToWarnedRiskPartnersParams } from 'store/slices/leasing/riskPartnerSlice';
import { setAlert, setCallDialog, setDeleteDialog, setExportDialog, setImportDialog, setMessageDialog, setPartnerDialog, setSendSMSDialog, setWarningNoticeDialog } from 'store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from 'component/panel/PanelContent';
import { Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import CustomTableButton from 'component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from 'store/slices/processSlice';
import DeleteDialog from 'component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ListTableServer from 'component/table/ListTableServer';
import RiskPartnerDetailPanel from 'features/risk/components/RiskPartnerDetailPanel';
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
import SmsIcon from '@mui/icons-material/Sms';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import { checkSMS, fetchSMSs } from 'store/slices/communication/smsSlice';
import SendSMSDialog from 'component/dialog/SendSMSDialog';
import { type } from 'jquery';

function ToWarnedRiskPartnersPosta() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {postaToWarnedRiskPartners,postaToWarnedRiskPartnersCount,postaToWarnedRiskPartnersParams,postaToWarnedRiskPartnersLoading} = useSelector((store) => store.riskPartner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

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
    const [project, setProject] = useState("kizilbuk")
    const [exportURL, setExportURL] = useState("")

    // useEffect(() => {
    //     dispatch(setPostaToWarnedRiskPartnersParams({bigger_than_100:true}));
    // }, []);



    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPostaToWarnedRiskPartners({activeCompany,params:{...postaToWarnedRiskPartnersParams,project,type:'posta'}}))
        });

        
    }, [activeCompany,postaToWarnedRiskPartnersParams,dispatch]);

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
        { field: 'max_overdue_days', headerName: 'Maks. Gecikme Günü', flex: 2, type: 'number', renderHeaderFilter: () => null,
            // valueOptions: [
            //     { value: '0', label: '30 Günü Geçmeyenler' },
            //     { value: '30', label: '30 Günü Geçenler' },    
            // ],
            cellClassName: (params) => {
                if (params.row.leases.max_overdue_days <= 30){
                    return 'bg-yellow'
                } else if (params.row.leases.max_overdue_days > 30 && params.row.leases.max_overdue_days <= 60){
                    return 'bg-orange'
                } else if (params.row.leases.max_overdue_days > 60 && params.row.leases.max_overdue_days <= 90){
                    return 'bg-light-red'
                } else if (params.row.leases.max_overdue_days > 90){
                    return 'bg-dark-red'
                }
            },
            renderCell: (params) => params.row.leases.max_overdue_days
        },
        { field: 'total_overdue_amount', headerName: 'Toplam Gecikme Tutarı', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.leases.total_overdue_amount)
        },
        { field: 'a', headerName: 'İletişim', flex: 2, renderCell: (params) => (
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
        await dispatch(checkSMS({data:{uuid:partner_id}})).unwrap();
        await dispatch(fetchSMSs({activeCompany,params:{...smssParams,partner_id,status:"0"}})).unwrap();
        await dispatch(fetchPartnerInformation(crm_code)).unwrap();
        dispatch(setMessageDialog(true));
        
    };

    const handleWarningNoticeDialog = async (crm_code) => {
        dispatch(fetchWarningNoticesInLease({activeCompany,partner_crm_code:crm_code}));
        dispatch(setWarningNoticeDialog(true));
    };

    const handleChangeSpecialPartners = async (value) => {
        dispatch(setPostaToWarnedRiskPartnersParams({special:value,barter:false,virman:false}));
        setSpecialSwitchPosition(value);
        setBarterSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeBarterPartners = async (value) => {
        dispatch(setPostaToWarnedRiskPartnersParams({barter:value,special:false,virman:false}));
        setBarterSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeVirmanPartners = async (value) => {
        dispatch(setPostaToWarnedRiskPartnersParams({virman:value,special:false,barter:false}));
        setVirmanSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setBarterSwitchPosition(false);
    };

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setPostaToWarnedRiskPartnersParams({project:newValue}));
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="İhtar Çekilecek Müşteriler"
                rows={postaToWarnedRiskPartners}
                columns={riskPartnerColumns}
                getRowId={(row) => row.id}
                loading={postaToWarnedRiskPartnersLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Sözleşme Bazında Excel'e Aktar"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL("/risk/export_posta_to_warned_risk_partners/")}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        {/* <CustomTableButton
                        title="SMS İçin Excel'e Aktar"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL("/risk/export_to_warned_risk_partners_for_sms/")}}
                        icon={<SmsIcon fontSize="small"/>}
                        /> */}
                        <CustomTableButton
                        title="Toplu SMS Gönder"
                        onClick={() => {dispatch(setSendSMSDialog(true));}}
                        icon={<SmsIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchPostaToWarnedRiskPartners({activeCompany,params:{...postaToWarnedRiskPartnersParams,project,type:'posta'}})).unwrap()}
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
                            disabled={postaToWarnedRiskPartnersLoading}
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
                rowCount={postaToWarnedRiskPartnersCount}
                setParams={(value) => dispatch(setPostaToWarnedRiskPartnersParams(value))}
                onCellClick={handleProfileDialog}
                headerFilters={true}
                noDownloadButton
                //sortModel={[{ field: 'overdue_days', sort: 'desc' }]}
                disableRowSelectionOnClick={true}
                //apiRef={apiRef}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));dispatch(fetchRiskPartners({activeCompany,params:postaToWarnedRiskPartnersParams}));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<RiskPartnerDetailPanel uuid={params.row.uuid} riskPartnerLeases={params.row.leases.leases}></RiskPartnerDetailPanel>)}}
                />
            </Grid>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setPostaToWarnedRiskPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchPostaToWarnedRiskPartners({activeCompany,params:{...postaToWarnedRiskPartnersParams,project}}));dispatch(setPostaToWarnedRiskPartnersLoading(false));}}
            project={project}
            />
            <CallDialog/>
            <SendSMSDialog
            risk_status="to_warned_posta"
            project={project}
            text="Tabloda yer alan kişilere, sistemde kayıtlı telefon numaraları üzerinden gecikme hatırlatması ve ihtar uyarısı için kısa mesaj gönderilecektir."
            example={`Değerli müşterimiz, {{proje}} projesinde bulunan sözleşmelerinizin {{tutar}} TL ödenmemiş taksiti bulunmaktadır. Bugün itibari ile ihtarname süreci başlatılmıştır. ${project === 'sinpas' ? "Ödemelerinizi online sistemden kontrol edip ödeme yapabilirsiniz. " : ""}ÖDEME YAPILDIYSA MESAJI DİKKATE ALMAYINIZ. Arı Finansal Kiralama(İletişim: 02123102721 / rig@arileasing.com.tr)Mernis No: 0147005285500018`}
            />
            <WarningNoticeDialog/>
            <MessageDialog/>
        </PanelContent>
    )
}

export default ToWarnedRiskPartnersPosta
