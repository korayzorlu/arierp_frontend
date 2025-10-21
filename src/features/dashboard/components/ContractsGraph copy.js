import { Box, Card, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect } from 'react'
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { fetchContractsSummary } from '../../../store/slices/contracts/contractSlice';

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
                    Son 30 gün içinde oluşturulan günlük sözleşme grafiği.
                </Typography>
            </Box>
            <Divider />
            <Box
            sx={{
                height: 300
            }}
            >
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
                        color: dark ? theme.palette.mars.main : theme.palette.ari.main,
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
