import { useTheme } from '@emotion/react';
import React, { startTransition, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { LineChart } from '@mui/x-charts/LineChart';
import { fetchContractsSummary } from '../../../store/slices/contracts/contractSlice';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { fetchPortfoliosSummary } from '../../../store/slices/leasing/leaseSlice';
import { BarChart } from '@mui/x-charts/BarChart';

function PortfolioGraph() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {portfoliosSummary,portfoliosSummaryCount,portfoliosSummaryParams,portfoliosSummaryLoading} = useSelector((store) => store.lease);

    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPortfoliosSummary({activeCompany,params:{...portfoliosSummaryParams,paginate:false}}));
        });
    }, [activeCompany,portfoliosSummaryParams,dispatch]);

    const dataset = portfoliosSummary
        .map(item => {
            if (!item || !item.month) return { ...item, month: null };
            if (item.month instanceof Date) return { ...item, month: item.month };
            const parts = String(item.month).split('/');
            if (parts.length === 2) {
                const [mm, yyyy] = parts;
                const monthIdx = parseInt(mm, 10) - 1;
                const yearNum = parseInt(yyyy, 10);
                if (!Number.isNaN(monthIdx) && !Number.isNaN(yearNum)) {
                    return { ...item, month: new Date(yearNum, monthIdx, 1) };
                }
            }
            const parsed = new Date(item.month);
            return { ...item, month: isNaN(parsed) ? null : parsed };
        })
        .filter(item => item.month) // drop invalid entries
        .sort((a, b) => a.month - b.month);

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
                    PORTFÖY BÜYÜKLÜĞÜ
                </Typography>
                </Stack>
                <Typography variant="body2">
                    Son 1 yılı içeren kira planı bazında aylık aktif portföy grafiği.
                </Typography>
            </Box>
            <Divider />
            <Box
            sx={{
                height: 300
            }}
            >
                <BarChart
                dataset={dataset}
                xAxis={[{ 
                    dataKey: 'month',
                    scaleType: 'band',
                    valueFormatter: (date) => {
                        const d = new Date(date);
                        return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                    }
                }]}
                series={[
                    {
                        dataKey: 'total',
                        showMark: false,
                        color: dark ? theme.palette.bluelemonade.main : theme.palette.bluelemonade.main,
                    },
                ]}
                loading={portfoliosSummaryLoading}
                />
            </Box>
        </Paper>
    )
}

export default PortfolioGraph
