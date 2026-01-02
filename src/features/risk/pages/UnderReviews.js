import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnderReviews, setUnderReviewsLoading, setUnderReviewsParams } from 'store/slices/risk/underReviewSlice';
import { setCallDialog, setExportDialog, setImportDialog, setMessageDialog, setPartnerDialog, setPartnerNoteDialog, setWarningNoticeDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import { Badge, Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import CustomTableButton from 'component/table/CustomTableButton';
import { fetchExportProcess } from 'store/slices/processSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ListTableServer from 'component/table/ListTableServer';
import UnderReviewDetailPanel from 'features/risk/components/UnderReviewDetailPanel';
import { fetchPartnerInformation, fetchPartnerNotes } from 'store/slices/partners/partnerSlice';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import CallDialog from 'component/dialog/CallDialog';
import MessageDialog from 'component/dialog/MessageDialog';
import { fetchWarningNoticesInLease } from 'store/slices/contracts/contractSlice';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import StarIcon from '@mui/icons-material/Star';
import ExportDialog from 'component/feedback/ExportDialog';
import SmsIcon from '@mui/icons-material/Sms';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import PartnerNoteDialog from 'component/dialog/PartnerNoteDialog';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import TableButton from 'component/button/TableButton';

function UnderReviews() {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {underReviews,underReviewsCount,underReviewsParams,underReviewsLoading} = useSelector((store) => store.underReview);
    const {partnerNotesParams} = useSelector((store) => store.riskPartner);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [specialSwitchPosition, setSpecialSwitchPosition] = useState(false);
    const [barterSwitchPosition, setBarterSwitchPosition] = useState(false);
    const [virmanSwitchPosition, setVirmanSwitchPosition] = useState(false);
    const [project, setProject] = useState("kizilbuk")
    const [exportURL, setExportURL] = useState("")

    // useEffect(() => {
    //     dispatch(setUnderReviewsParams({bigger_than_100:true}));
    // }, []);



    useEffect(() => {
        startTransition(() => {
            dispatch(fetchUnderReviews({activeCompany,params:{...underReviewsParams,project}}));
        });

        
    }, [activeCompany,underReviewsParams,dispatch]);

    const underReviewColumns = [
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
                label="Seç"
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
        { field: 'partner_notes', headerName: '', width: 180, renderHeaderFilter: () => null, renderCell: (params) => (
            <Stack direction="row" spacing={4} sx={{alignItems: "center",height:'100%',}}>
                <Grid container spacing={1} sx={{width:'100%'}}>
                    <Grid size={{xs:8, sm:8}}>
                        <TableButton
                        text="Notlar"
                        color="celticglow"
                        icon={<NoteAltIcon/>}
                        onClick={()=>{handlePartnerNoteDialog({partner_id:params.row.id,crm_code:params.row.crm_code})}}
                        />
                    </Grid>
                    <Grid size={{xs:4, sm:4}}>
                        <Badge badgeContent={params.row.partner_note_count} color={dark ? 'frostedbirch' : 'silvercoin'}></Badge>
                    </Grid>
                </Grid>
                    
            </Stack>
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
                    <IconButton aria-label="delete" onClick={handleMessageDialog}>
                        <MessageIcon />
                    </IconButton>
                </Grid>
            </Grid>
            )
        },
    ]

    const handlePartnerNoteDialog = async ({partner_id,crm_code}) => {
        await dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id}})).unwrap();
        await dispatch(fetchPartnerInformation(crm_code)).unwrap();
        dispatch(setPartnerNoteDialog(true));
    };

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
        dispatch(setUnderReviewsParams({special:value,barter:false,virman:false}));
        setSpecialSwitchPosition(value);
        setBarterSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeBarterPartners = async (value) => {
        dispatch(setUnderReviewsParams({barter:value,special:false,virman:false}));
        setBarterSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeVirmanPartners = async (value) => {
        dispatch(setUnderReviewsParams({virman:value,special:false,barter:false}));
        setVirmanSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setBarterSwitchPosition(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setUnderReviewsParams({project:newValue}));
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Hatalı veya Belirsiz Kayıt İnceleme Listesi"
                autoHeight
                rows={underReviews}
                columns={underReviewColumns}
                getRowId={(row) => row.id}
                loading={underReviewsLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Sözleşme Bazında Excel'e Aktar"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL("/risk/export_under_reviews/")}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchUnderReviews({activeCompany,params:{...underReviewsParams,project}})).unwrap()}
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
                            disabled={underReviewsLoading}
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
                        {/* <AndroidSwitch
                        label="Özel Müşterileri Göster"
                        checked={specialSwitchPosition}
                        onChange={(value) => handleChangeSpecialPartners(value)}
                        /> */}
                    </>
                }
                rowCount={underReviewsCount}
                setParams={(value) => dispatch(setUnderReviewsParams(value))}
                //density="compact"
                onCellClick={handleProfileDialog}
                headerFilters={true}
                noDownloadButton
                //sortModel={[{ field: 'overdue_days', sort: 'desc' }]}
                disableRowSelectionOnClick={true}
                //apiRef={apiRef}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));dispatch(fetchUnderReviews({activeCompany,params:underReviewsParams}));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<UnderReviewDetailPanel uuid={params.row.uuid} underReviewLeases={params.row.leases.leases}></UnderReviewDetailPanel>)}}
                />
            </Grid>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setUnderReviewsLoading(true))}
            finalEvent={() => {dispatch(fetchUnderReviews({activeCompany,params:{...underReviewsParams,project}}));dispatch(setUnderReviewsLoading(false));}}
            project={project}
            />
            <CallDialog/>
            <MessageDialog/>
            <PartnerNoteDialog/>
        </PanelContent>
    )
}

export default UnderReviews
