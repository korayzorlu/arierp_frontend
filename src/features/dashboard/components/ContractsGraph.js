import { Box, Card, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect, useState } from 'react'
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { fetchContractsSummary } from 'store/slices/contracts/contractSlice';
import { BarChart } from '@mui/x-charts/BarChart';

function ContractsGraph() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractsSummary,contractsSummaryCount,contractsSummaryParams,contractsSummaryLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const theme = useTheme();
    const [month, setMonth] = useState(12);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractsSummary({activeCompany,month,params:{...contractsSummaryParams,paginate:false}}));
        });
    }, [activeCompany,contractsSummaryParams,month,dispatch]);

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
                <Stack>
                    <Grid container>
                        <Grid size={{xs:12,sm:10}}>
                            <Typography gutterBottom variant="h6">
                                 SÖZLEŞME RAPORU
                            </Typography>
                        </Grid>
                        <Grid size={{xs:12,sm:2}}>
                            <FormControl sx={{mr: 2}} fullWidth>
                                <InputLabel id="demo-simple-select-label">Tarih Aralığı</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size='small'
                                value={month}
                                label="Tarih Aralığı"
                                onChange={(e) => setMonth(e.target.value)}
                                disabled={contractsSummaryLoading}
                                >
                                    <MenuItem value={12}>1 Yıl</MenuItem>
                                    <MenuItem value={24}>2 Yıl</MenuItem>
                                    <MenuItem value={60}>5 Yıl</MenuItem>
                                    <MenuItem value={120}>10 Yıl</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={{}} spacing={2}>
                        <Typography variant="body2">
                            Son {month/12} yıl içinde oluşturulan aylık sözleşme grafiği.
                        </Typography>
                    </Grid>
                </Stack>
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
