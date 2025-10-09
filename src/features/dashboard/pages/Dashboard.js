import { Box, Card, Chip, Divider, Stack, Typography, useTheme } from '@mui/material'
import React, { startTransition, useEffect } from 'react'
import { Grid } from '@mui/material';
import { ReactComponent as EagleIcon2 } from "../../../images/icons/global/eagle.svg";
import { useDispatch, useSelector } from 'react-redux';
import  ctuIcon  from "../../../images/icons/global/ctu-logo.png";
import EagleIcon from '../../../component/icon/EagleIcon';
import ListTableServer from '../../../component/table/ListTableServer';
import { setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { faker } from '@faker-js/faker';
import { fetchContractsSummary } from '../../../store/slices/contracts/contractSlice';
import OverSummaryCard from '../components/OverSummaryCard';
import ContractsGraph from '../components/ContractsGraph';
import ContractsPie from '../components/ContractsPie';


function Dashboard() {
    const {dark,user} = useSelector((store) => store.auth);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);
    
    const endDate = new Date('2025-08-14');
    const dates = [];
    const seriesData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        dates.push(date);
        seriesData.push(faker.number.float({ min: 1, max: 10, precision: 0.5 }));
    }

    const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Istanbul' });

    return (
        
        user.authorization === "Admin"
        ?
        <Stack spacing={2}>

            <Grid container spacing={2}>
                <Grid size={{xs:6,sm:3}}>
                    <OverSummaryCard/>
                </Grid>
                <Grid size={{xs:6,sm:3}}>
                    <OverSummaryCard/>
                </Grid>
                <Grid size={{xs:6,sm:3}}>
                    <OverSummaryCard/>
                </Grid>
                <Grid size={{xs:6,sm:3}}>
                    <OverSummaryCard/>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:9}}>
                    <ContractsGraph/>
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <ContractsPie/>
                </Grid>
            </Grid>

        </Stack>
        :
        null
        
    )
}

export default Dashboard
