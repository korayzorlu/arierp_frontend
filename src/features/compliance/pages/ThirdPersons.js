import { Button, Checkbox, Chip, Grid, IconButton, ListItemText, Menu, MenuItem, Stack} from '@mui/material'
import React, { startTransition, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import { fetchThirdPersons, setThirdPersonsParams, updateThirdPerson, updateThirdPersonDowngrade, updateThirdPersonIsEmailSent, updateThirdPersonStatus } from '../../../store/slices/compliance/thirdPersonSlice';
import { useGridApiRef } from '@mui/x-data-grid';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ThirdPersonStatusDialog from 'component/dialog/ThirdPersonStatusDialog';
import { setThirdPersonCustomerDialog, setThirdPersonDocumentDialog, setThirdPersonPaymentDetailDialog, setThirdPersonStatusDialog } from 'store/slices/notificationSlice';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import ThirdPersonDetailPanel from '../components/ThirdPersonDetailPanel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ThirdPersonDocumentDialog from 'component/dialog/ThirdPersonDocumentDialog';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import dayjs from 'dayjs';
import ThirdPersonPaymentDetailDialog from 'component/dialog/ThirdPersonPaymentDetailDialog';
import ThirdPersonDialog from 'component/dialog/ThirdPersonDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { gridClasses } from '@mui/x-data-grid-premium';
import ThirdPersonCustomerDialog from '../components/ThirdPersonCustomerDialog';
import InfoIcon from '@mui/icons-material/Info';

function ThirdPersons() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {thirdPersons,thirdPersonsCount,thirdPersonsParams,thirdPersonsLoading,thirdPerson} = useSelector((store) => store.thirdPerson);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [selectedRow, setSelectedRow] = useState({})
    const [checkboxChecked, setCheckboxChecked] = useState(true);
    

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchThirdPersons({activeCompany,params:thirdPersonsParams}));
        });
    }, [activeCompany,thirdPersonsParams,dispatch]);

    const getStatus = (status) => {
        switch (status) {
            case "pending":
                return { color: "primary", icon: <WarningIcon />, label: "Kontrol Et" };
            case "cleared":
                return { color: "success", icon: <CheckIcon />, label: "Temiz" };
            case "flagged":
                return { color: "error", icon: <DoDisturbAltIcon />, label: "Yasaklı" };
            case "need_document":
                return { color: "info", icon: <HourglassBottomIcon />, label: "Belge/Kimlik Gerekli" };
            default:
                return { color: "primary", icon: <CheckIcon />, label: "Bilinmiyor" };
        }
    };

    const columns = [
        { field: 'created_date', headerName: 'Sorgu Tarihi', width: 120 },
        { field: 'name', headerName: 'İsim', width: 320,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.row.status === "need_document" && !params.row.is_customer_sent //&& (!params.row.tc_vkn_no || params.row.tc_vkn_no === '')
                        ?
                            <Button
                            key={params.value.id}
                            variant='text'
                            color="opposite"
                            size='small'
                            onClick={() => {
                                dispatch(setThirdPersonCustomerDialog(true));
                                setSelectedRow(params.row);
                            }}
                            sx={{textAlign: 'left', pl:0,pr:0}}
                            >
                                {params.value}
                            </Button>
                        :
                            params.row.is_customer_sent
                            ?
                                <Stack spacing={2}>
                                    <Grid container>
                                        {params.value}
                                    </Grid>
                                    <Grid container>
                                        <Chip
                                        variant='contained'
                                        color="mars"
                                        icon={<InfoIcon />}
                                        label="Müşteri Olarak Bildirildi"
                                        size='small'
                                        />
                                    </Grid>
                                    
                                </Stack>
                            :
                                params.value
                    }
                    
                </Stack>
            ),
        },
        { field: 'tc_vkn_no', headerName: 'TC/VKN No', width: 140 },
        { field: 'finmaks_transaction', headerName: 'Ödeme Detayı', width: 160, renderHeaderFilter: () => null,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.value
                        ?
                            <Button
                            key={params.value.id}
                            variant='contained'
                            color="mars"
                            endIcon={<VisibilityIcon />}
                            size='small'
                            onClick={() => {
                                dispatch(setThirdPersonPaymentDetailDialog(true));
                                setSelectedRow(params.row);
                            }}
                            >
                                Ödeme Detayı
                            </Button>
                        :
                            null
                    }
                </Stack>
            ),
        },
        { field: 'status', headerName: 'Sorgu Sonucu', width: 240, 
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.row.status === "pending"
                        ?
                            <Button
                            key={params.row.transaction_id}
                            variant='contained'
                            color="info"
                            endIcon={<ArrowOutwardIcon />}
                            size='small'
                            onClick={() => {
                                dispatch(setThirdPersonStatusDialog(true));
                                setSelectedRow(params.row);
                            }}
                            >
                                Kontrol Et ve Güncelle
                            </Button>
                        :
                            <Chip
                            key={params.row.transaction_id}
                            variant='contained'
                            color={getStatus(params.value).color}
                            icon={getStatus(params.value).icon}
                            label={getStatus(params.value).label}
                            size='small'
                            onClick={() => {
                                if(user.authorization === 'Kredi Tahsis'){
                                    dispatch(setThirdPersonStatusDialog(true));
                                    setSelectedRow(params.row);
                                }  
                            }}
                            />
                    }
                </Stack>
            ),
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'pending', label: 'Kontrol Edilecek' },
                    { value: 'cleared', label: 'Temiz' },
                    { value: 'need_document', label: 'Belge/Kimlik Gerekiyor' },
                    { value: 'flagged', label: 'Yasaklı/Şüpheli' },
                ]}
                />
            )
        },
        { field: 'is_email_sent', headerName: 'Email Gönderildi mi?', width: 200, 
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    <Checkbox
                    checked={params.value ? true : false}
                    onChange={(event) => {
                        dispatch(updateThirdPersonIsEmailSent({data:{id: params.row.id, is_email_sent: event.target.checked}}));
                        if(event.target.checked){
                            dispatch(updateThirdPerson({id: params.row.id}));
                        }else{
                            dispatch(updateThirdPersonDowngrade({id: params.row.id}));
                        }
                        setSelectedRow(params.row);
                    }}
                    />
                </Stack>
            ),
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'true', label: 'Gönderilenler' },
                    { value: 'false', label: 'Gönderilmeyenler' },
                ]}
                />
            )
        },
        { field: 'third_person_documents', headerName: 'Belge', renderHeaderFilter: () => null, flex: 1,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        dayjs(params.row.created_date, "DD.MM.YYYY HH:mm").isBefore(dayjs("22.11.2025 15:40", "DD.MM.YYYY HH:mm"))
                        ?
                            null
                        :     
                            params.value.length > 0
                            ?   
                                <>
                                    <Link to={`${process.env.REACT_APP_BACKEND_URL}${params.value[0].url}`} target="_blank" component="a" sx={{ textDecoration: 'underline' }}>
                                        <IconButton
                                        color='opposite'
                                        size='small'
                                        >
                                            <AttachFileRoundedIcon />
                                        </IconButton>
                                    </Link>
                                    {params.value[0].label}
                                </>
                            :   
                                params.row.status === "need_document"
                                ?
                                    <Button
                                    key={params.row.id}
                                    variant='contained'
                                    color={dark ? 'silvercoin' : 'ari'}
                                    endIcon={<CloudUploadIcon />}
                                    size='small'
                                    onClick={() => {
                                        dispatch(setThirdPersonDocumentDialog(true));
                                        setSelectedRow(params.row);
                                    }}
                                    >
                                        Belge Ekle
                                    </Button>
                                :
                                    null
                    }
                </Stack>
            )
        },
    ]

    const handleCheckboxChange = (event) => {
        setCheckboxChecked(event.target.checked);
    };

    return (
        <PanelContent>
            <ListTableServer
            title="3. Şahıs Ödemelerinde Sorgulanacak Kişiler Listesi"
            //autoHeight
            rows={thirdPersons}
            columns={columns}
            getRowId={(row) => row.id}
            loading={thirdPersonsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchThirdPersons({activeCompany,params:thirdPersonsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={thirdPersonsCount}
            autoRowHeight
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
            }}
            //checkboxSelection
            disableRowSelectionOnClick
            setParams={(value) => dispatch(setThirdPersonsParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            getDetailPanelHeight={() => "auto"}
            getDetailPanelContent={(params) => {return(<ThirdPersonDetailPanel uuid={params.row.uuid} thirdPersonResults={params.row.results}></ThirdPersonDetailPanel>)}}
            />
            <ThirdPersonStatusDialog
            row={selectedRow}
            />
            <ThirdPersonCustomerDialog
            row={selectedRow}
            />
            <ThirdPersonDocumentDialog
            row={selectedRow}
            finalEvent={() => dispatch(fetchThirdPersons({activeCompany,params:thirdPersonsParams})).unwrap()}
            />
            <ThirdPersonPaymentDetailDialog
            row={selectedRow}
            />
            <ThirdPersonDialog
            thirdPerson={thirdPerson}
            />
        </PanelContent>
    )
}

export default ThirdPersons
