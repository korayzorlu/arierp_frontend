import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect } from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import GroupsIcon from '@mui/icons-material/Groups';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import { fetchPepPartners, setPepPartnersParams } from '../../../store/slices/compliance/pepPartnerSlice';
import { useGridApiRef } from '@mui/x-data-grid';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';

function PepPartners() {
    const {mobile} = useSelector((store) => store.sidebar);
    const {activeCompany} = useSelector((store) => store.organization);
    const {pepPartners,pepPartnersCount,pepPartnersParams,pepPartnersLoading} = useSelector((store) => store.pepPartner);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPepPartners({activeCompany,params:pepPartnersParams}));
        });
    }, [activeCompany,pepPartnersParams,dispatch]);

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
        { field: 'birthday', headerName: 'Doğum Tarihi', flex:1 },
        { field: 'sgk_job_code', headerName: 'SGK Meslek Kodu', flex:1 },
        // { field: 'is_pep', headerName: 'PEP Durumu', flex:1, renderCell: (params) => (
        //         params.value
        //         ?
        //             <Chip variant='contained' color="error" icon={<WarningIcon />} label="PEP" size='small'/>
        //         :
        //             <Chip variant='outlined' label="Değil" size='small'/>
        //     )   
        // },
        { field: 'pep_degree', headerName: 'PEP Derecesi', flex:1 },
        { field: 'pep_description', headerName: 'PEP Açıklaması', flex:1 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Sorgulanacak Kişiler / Kurumlar"
            //autoHeight
            rows={pepPartners}
            columns={columns}
            getRowId={(row) => row.id}
            loading={pepPartnersLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchPepPartners({activeCompany,params:pepPartnersParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={pepPartnersCount}
            //checkboxSelection
            disableRowSelectionOnClick
            setParams={(value) => dispatch(setPepPartnersParams(value))}
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

export default PepPartners
