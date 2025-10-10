import { useTheme } from '@emotion/react';
import React, { startTransition, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeasesSummary } from '../../../store/slices/leasing/leaseSlice';
import { Box, Card, Divider, Paper, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { fetchManagerSummary } from '../../../store/slices/leasing/riskPartnerSlice';

function RisksBar() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {managerSummary,managerSummaryCount,managerSummaryParams,managerSummaryLoading} = useSelector((store) => store.riskPartner);

    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchManagerSummary({activeCompany,project:'all'}));
        });
    }, [activeCompany,dispatch]);

    return (
        <Paper elevation={0} square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Box
            sx={{
                p: 2,
                backgroundColor: dark ? 'navyblack.main' : 'whitehole.main',
                color: dark ? '#fff' : '#000',
                height: 90
            }}
            >
                <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                <Typography gutterBottom variant="h6" component="div">
                    VADESİ GEÇMİŞLER RAPORU
                </Typography>
                </Stack>
                <Typography variant="body2">
                    Vadesi geçmiş kira planlarının durumu.
                </Typography>
            </Box>
            <Divider />
            <Box
            sx={{
                height: 300
            }}
            >
                <BarChart
                xAxis={[{
                    data: ['Gecikme(0-30)','İhtar Çekilecek','İhtar Çekilen','Fesih Edilecek'],
                }]}
                series={[{ data: managerSummary.slice(0, -1).map(item => item.quantity), color: '#CA3422' }]}
                height={300}
                />
            </Box>
        </Paper>
    )
}

export default RisksBar
