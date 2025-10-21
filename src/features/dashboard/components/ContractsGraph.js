import { Box, Card, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect } from 'react'
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { fetchContractsSummary } from '../../../store/slices/contracts/contractSlice';
import { BarChart } from '@mui/x-charts/BarChart';

function ContractsGraph() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractsSummary,contractsSummaryCount,contractsSummaryParams,contractsSummaryLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractsSummary({activeCompany,params:{...contractsSummaryParams,paginate:false}}));
        });
    }, [activeCompany,contractsSummaryParams,dispatch]);

    const dataset = contractsSummary
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
                    SÖZLEŞME RAPORU
                </Typography>
                </Stack>
                <Typography variant="body2">
                    Son 1 yıl içinde oluşturulan aylık sözleşme grafiği.
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
                    },
                }]}
                series={[
                    {
                        dataKey: 'count',
                        showMark: true,
                        color: dark ? theme.palette.frostedbirch.main : theme.palette.ari.main,
                    },
                ]}
                loading={contractsSummaryLoading}
                //grid={{ vertical: true, horizontal: true }}
                />
            </Box>
        </Paper>
    )
}

export default ContractsGraph
