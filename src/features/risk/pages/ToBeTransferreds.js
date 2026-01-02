import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchToBeTransferreds, setToBeTransferredsLoading, setToBeTransferredsParams } from 'store/slices/risk/toBeTransferredSlice';
import { setAlert, setCallDialog, setDeleteDialog, setExportDialog, setImportDialog, setLeaseDialog, setMessageDialog, setPartnerDialog, setPartnerNoteDialog, setWarningNoticeDialog } from 'store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from 'component/panel/PanelContent';
import { Badge, Chip, FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, NativeSelect, Select, Stack, TextField } from '@mui/material';
import CustomTableButton from 'component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from 'store/slices/processSlice';
import DeleteDialog from 'component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ListTableServer from 'component/table/ListTableServer';
import ToBeTransferredDetailPanel from 'features/risk/components/ToBeTransferredDetailPanel';
import { fetchPartnerInformation, fetchPartnerNotes } from 'store/slices/partners/partnerSlice';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import CallDialog from 'component/dialog/CallDialog';
import MessageDialog from 'component/dialog/MessageDialog';
import FeedIcon from '@mui/icons-material/Feed';
import WarningNoticeDialog from 'component/dialog/WarningNoticeDialog';
import { fetchWarningNoticesInLease } from 'store/slices/contracts/contractSlice';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import StarIcon from '@mui/icons-material/Star';
import { cellProgress } from 'component/progress/CellProgress';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchLeaseInformation, setLeasesLoading } from 'store/slices/leasing/leaseSlice';
import { fetchProjects } from 'store/slices/projects/projectSlice';
import { set } from 'lodash';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import PartnerNoteDialog from 'component/dialog/PartnerNoteDialog';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import TableButton from 'component/button/TableButton';

function ToBeTransferreds() {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {toBeTransferreds,toBeTransferredsCount,toBeTransferredsParams,toBeTransferredsLoading} = useSelector((store) => store.toBeTransferred);
    const {projects,projectsCount,projectsParams,projectsLoading} = useSelector((store) => store.project);
    const {partnerNotesParams} = useSelector((store) => store.riskPartner);

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
    const [project, setProject] = useState("kizilbuk")

    // useEffect(() => {
    //     dispatch(setToBeTransferredsParams({bigger_than_100:true}));
    // }, []);



    useEffect(() => {
        startTransition(() => {
            //dispatch(fetchProjects({activeCompany,params:toBeTransferredsParams}));
            dispatch(fetchToBeTransferreds({activeCompany,params:{...toBeTransferredsParams,project}}));
        });
        
    }, [activeCompany,toBeTransferredsParams,dispatch]);

    const toBeTransferredColumns = [
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
        { field: 'leases.paid_rate', headerName: 'Oran', flex:2, type: 'number', renderHeaderFilter: () => null, 
            renderCell: (params) => cellProgress ({value: params.row.leases.paid_rate})
        },
        { field: 'total_overdue_amount', headerName: 'Toplam Gecikme Tutarı', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.leases.total_overdue_amount)
        },
        { field: 'total_excluded_overdue_amount', headerName: 'Diğer Gecikme Tutarı', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.leases.total_excluded_overdue_amount)
        },
        { field: 'total_temerrut_amount', headerName: 'Toplam Temerrüt Tutarı', flex: 2, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.leases.total_temerrut_amount)
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
        }
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
        }else if(params.field==="total_excluded_overdue_amount"){
            dispatch(setLeasesLoading(true));
            await dispatch(fetchLeaseInformation({partner_uuid: params.row.id})).unwrap();
            dispatch(setLeaseDialog(true));
            dispatch(setLeasesLoading(false));
        };
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
        dispatch(setToBeTransferredsParams({special:value,barter:false,virman:false}));
        setSpecialSwitchPosition(value);
        setBarterSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeBarterPartners = async (value) => {
        dispatch(setToBeTransferredsParams({barter:value,special:false,virman:false}));
        setBarterSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setVirmanSwitchPosition(false);
    };

    const handleChangeVirmanPartners = async (value) => {
        dispatch(setToBeTransferredsParams({virman:value,special:false,barter:false}));
        setVirmanSwitchPosition(value);
        setSpecialSwitchPosition(false);
        setBarterSwitchPosition(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    const changeProject = (databaseTerm) => {
        setProject(databaseTerm);
        dispatch(setToBeTransferredsParams({project:databaseTerm}));
        
    };


    const handleChangeBiggerThan100 = async (value) => {
        if(!value){
            dispatch(setToBeTransferredsParams({bigger_than_100:value,overdue_amount:true}));
        }else{
            dispatch(setToBeTransferredsParams({bigger_than_100:value,overdue_amount:false}));
        }
        setBiggerThan100SwitchPosition(value);
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Teslim Onay"
                autoHeight
                rows={toBeTransferreds}
                columns={toBeTransferredColumns}
                getRowId={(row) => row.id}
                loading={toBeTransferredsLoading}
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
                        onClick={() => dispatch(fetchToBeTransferreds({activeCompany,params:{...toBeTransferredsParams,project}})).unwrap()}
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
                            disabled={toBeTransferredsLoading}
                            >
                                {/* {
                                    projects.map((item) => (
                                        <MenuItem key={item.uuid} value={item.uuid}>{item.name}</MenuItem>
                                    ))
                                } */}
                                <MenuItem value='kizilbuk'>KIZILBÜK</MenuItem>
                                <MenuItem value='sefakoy'>BOULEVARD SEFAKÖY</MenuItem>
                                <MenuItem value='koruaura'>KORU AURA</MenuItem>
                                <MenuItem value='metrolife'>METROLIFE</MenuItem>
                                <MenuItem value='metrolifepremium'>METROLIFE PREMIUM</MenuItem>
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
                rowCount={toBeTransferredsCount}
                setParams={(value) => dispatch(setToBeTransferredsParams(value))}
                onCellClick={handleProfileDialog}
                headerFilters={true}
                noDownloadButton
                //sortModel={[{ field: 'overdue_days', sort: 'desc' }]}
                disableRowSelectionOnClick={true}
                //apiRef={apiRef}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));dispatch(fetchToBeTransferreds({activeCompany,params:toBeTransferredsParams}));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<ToBeTransferredDetailPanel uuid={params.row.uuid} toBeTransferredLeases={params.row.leases.leases}></ToBeTransferredDetailPanel>)}}
                />
            </Grid>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_risk_partners/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setToBeTransferredsLoading(true))}
            finalEvent={() => {dispatch(fetchToBeTransferreds({activeCompany,params:toBeTransferredsParams}));dispatch(setToBeTransferredsLoading(false));}}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/leasing/export_delivery_confirms/"
            startEvent={() => dispatch(setToBeTransferredsLoading(true))}
            finalEvent={() => {dispatch(fetchToBeTransferreds({activeCompany,params:{...toBeTransferredsParams,project}}));dispatch(setToBeTransferredsLoading(false));}}
            project={project}
            />
            <CallDialog/>
            <MessageDialog/>
            <WarningNoticeDialog/>
            <PartnerNoteDialog/>
        </PanelContent>
    )
}

export default ToBeTransferreds
