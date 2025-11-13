import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect } from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import GroupsIcon from '@mui/icons-material/Groups';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import { fetchScanPartners, setScanPartnersParams } from '../../../store/slices/compliance/scanPartnerSlice';
import { useGridApiRef } from '@mui/x-data-grid';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';

function ScanPartners() {
    const {mobile} = useSelector((store) => store.sidebar);
    const {activeCompany} = useSelector((store) => store.organization);
    const {scanPartners,scanPartnersCount,scanPartnersParams,scanPartnersLoading} = useSelector((store) => store.scanPartner);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchScanPartners({activeCompany,params:scanPartnersParams}));
        });
    }, [activeCompany,scanPartnersParams,dispatch]);

    const columns = [
        { field: 'name', headerName: 'İsim', width: 360, renderCell: (params) => (
                <Link
                to={`/partners/update/${params.row.id}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
            )
        },
        { field: 'tc_vkn_no', headerName: 'TC/VKN No', flex:1 },
        { field: 'crm_code', headerName: 'CRM Kodu', flex:1 },
        { field: 'last_scan_date', headerName: 'Son Sorgulama Tarihi', flex:1 },
        { field: 'next_scan_date', headerName: 'Sonraki Sorgulama Tarihi', flex:1 },
        // { field: 'check', headerName: 'Sorgu', flex:1, renderCell: (params) => (
        //         <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
        //             {
        //                 params.row.scan
        //                 ?
        //                     <Chip key={params.row.transaction_id} variant='contained' color="success" icon={<CheckIcon />} label="Tahsilata Gönderildi" size='small'/>
                            
        //                 :
        //                     <Button
        //                         key={params.row.transaction_id}
        //                         variant='contained'
        //                         color="mars"
        //                         endIcon={<ArrowOutwardIcon />}
        //                         size='small'
        //                         onClick={() => {console.log("clicked")}}
        //                         >
        //                             Sorgula
        //                         </Button>
        //             }
        //         </Stack>
        //     )
        // },
        { field: 'is_reliable_person', headerName: 'Sorgu Sonucu', flex:1, renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.row.is_reliable_person
                        ?
                            <Chip key={params.row.transaction_id} variant='contained' color="success" icon={<CheckIcon />} label="Güvenilir" size='small'/>
                        :
                            <Chip key={params.row.transaction_id} variant='contained' color="error" icon={<WarningIcon />} label="Yasaklı / Kontrol Edilecek" size='small'/>
                    }
                </Stack>
            )
        },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Sorgulanacak Kişiler / Kurumlar"
            //autoHeight
            rows={scanPartners}
            columns={columns}
            getRowId={(row) => row.id}
            loading={scanPartnersLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchScanPartners({activeCompany,params:scanPartnersParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={scanPartnersCount}
            //checkboxSelection
            disableRowSelectionOnClick
            setParams={(value) => dispatch(setScanPartnersParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
        // <Stack
        // sx={{
        //     height: 'calc(100vh - 56px)',
        //     overflow: 'hidden',
        //     scrollbarWidth: 'none',
        //     '&::-webkit-scrollbar': { display: 'none' },
        // }}
        // justifyContent="center"
        // alignItems="center">
        //     <Grid container spacing={1} direction={"column"} alignItems="center" sx={{width: mobile ? '100%' : '40%'}}>
        //         <Grid size={{xs:12,sm:12}}>
        //             <Button
        //             variant="contained"
        //             color='paper'
        //             fullWidth
        //             sx={{
        //                 height: 180,
        //                 flexDirection: 'column',
        //                 display: 'flex',
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //             }}
        //             >   
        //                 <Typography sx={{color:'text.secondary', width: '100%', textAlign: 'start'}}>
        //                     <PolicyIcon sx={{fontSize: '2.5rem'}}/>
        //                 </Typography>
        //                 <Typography sx={{color:'text.primary'}}>
        //                     <PersonIcon sx={{fontSize: '4rem'}}/>
        //                 </Typography>
        //                 <Typography sx={{color:'text.primary', fontSize: '1.5rem'}}>
        //                     Tekil kişi Sorgulama
        //                 </Typography>
        //             </Button>
        //         </Grid>
        //         <Grid size={{xs:12,sm:12}}>
        //             <Button
        //             variant="contained"
        //             color='paper'
        //             fullWidth
        //             sx={{
        //                 height: 180,
        //                 flexDirection: 'column',
        //                 display: 'flex',
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //             }}
        //             >   
        //                 <Typography sx={{color:'text.secondary', width: '100%', textAlign: 'start'}}>
        //                     <PolicyIcon sx={{fontSize: '2.5rem'}}/>
        //                 </Typography>
        //                 <Typography sx={{color:'text.primary'}}>
        //                     <GroupsIcon sx={{fontSize: '4rem'}}/>
        //                 </Typography>
        //                 <Typography sx={{color:'text.primary', fontSize: '1.5rem'}}>
        //                     Toplu Sorgulama
        //                 </Typography>
        //             </Button>
        //         </Grid>
        //     </Grid>
        // </Stack>
    )
}

export default ScanPartners
