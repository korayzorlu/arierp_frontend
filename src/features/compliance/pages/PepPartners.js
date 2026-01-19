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
import { gridClasses } from '@mui/x-data-grid-premium';

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
        { field: 'name', headerName: 'İsim', width: 300, renderCell: (params) => (
                <Link
                to={`/partners/update/${params.row.id}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
            )
        },
        { field: 'tc_vkn_no', headerName: 'TC/VKN No', width: 120 },
        { field: 'crm_code', headerName: 'CRM Kodu', width: 90 },
        { field: 'birthday', headerName: 'Doğum Tarihi', width: 120 },
        { field: 'sgk_job_code', headerName: 'SGK Meslek Kodu', width: 90 },
        // { field: 'is_pep', headerName: 'PEP Durumu', width: 360, renderCell: (params) => (
        //         params.value
        //         ?
        //             <Chip variant='contained' color="error" icon={<WarningIcon />} label="PEP" size='small'/>
        //         :
        //             <Chip variant='outlined' label="Değil" size='small'/>
        //     )   
        // },
        { field: 'pep_degree', headerName: 'PEP Derecesi', width: 90 },
        { field: 'pep_description', headerName: 'PEP Açıklaması', width: 360 },
        { field: 'email', headerName: 'Email', width: 300 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Kamusal Nüfuz Sahibi Kişiler (PEP)"
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
            autoRowHeight
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
            }}
            />
        </PanelContent>
    )
}

export default PepPartners
