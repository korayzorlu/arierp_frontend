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


function Dashboard() {
    const {dark,user} = useSelector((store) => store.auth);

    const {activeCompany} = useSelector((store) => store.organization);
    const {contractsSummary,contractsSummaryCount,contractsSummaryParams,contractsSummaryLoading} = useSelector((store) => store.contract);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractsSummary({activeCompany,params:{...contractsSummaryParams,paginate:false}}));
        });
    }, [activeCompany,contractsSummaryParams,dispatch]);
    

    const endDate = new Date('2025-08-14');
    const dates = [];
    const seriesData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        dates.push(date);
        seriesData.push(faker.number.float({ min: 1, max: 10, precision: 0.5 }));
    }

    const xAxisData = bankActivities.map(item =>
        Date(item.created_date) // Grafikte tarih düzgün gözüksün diye
    );
    // amount → data
    const amountData = bankActivities.map(item => Number(item.processed_amount));

    const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Istanbul' });

    return (
        
        user.authorization === "Adminnn"
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
                <Grid size={{xs:12,sm:6}}>
                    <Card variant="outlined" square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ p: 2,backgroundColor: dark ? 'mars.main' : 'ari.main',color: dark ? '#000' : '#fff' }}>
                            <Stack
                            direction="row"
                            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                            >
                            <Typography gutterBottom variant="h6" component="div">
                                SÖZLEŞME RAPORU
                            </Typography>
                            </Stack>
                            <Typography variant="body2">
                                Son 30 gün içinde onaylanan günlük sözleşme grafiği.
                            </Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <LineChart
                            dataset={contractsSummary.map(item => ({
                                ...item,
                                day: new Date(item.day) // Ensure 'day' is a Date object
                            }))}
                            xAxis={[{ 
                                dataKey: 'day',
                                scaleType: 'time',
                                valueFormatter: (date) => date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
                            }]}
                            series={[
                                {
                                    dataKey: 'count',
                                    showMark: true,
                                    color: dark ? theme.palette.primary.main : theme.palette.primary.main,
                                },
                            ]}
                            height={300}
                            //grid={{ vertical: true, horizontal: true }}
                            />
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Card variant="outlined" square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ p: 2,backgroundColor: dark ? 'mars.main' : 'ari.main',color: dark ? '#000' : '#fff' }}>
                            <Stack
                            direction="row"
                            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                            >
                            <Typography gutterBottom variant="h6" component="div">
                                TAHSİLAT RAPORU
                            </Typography>
                            </Stack>
                            <Typography variant="body2">
                                Son 30 gün içinde gerçekleşen günlük tahsilat grafiği.
                            </Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <LineChart
                            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                            series={[
                                {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                                },
                            ]}
                            height={300}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

        </Stack>
        :
        null
        
    )
}

export default Dashboard
