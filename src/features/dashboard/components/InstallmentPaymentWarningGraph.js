import { useTheme } from '@emotion/react';
import React, { startTransition, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractPaymentsSummary, fetchContractsSummary, fetchWarningNoticesSummary } from '../../../store/slices/contracts/contractSlice';
import { Box, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { fetchInstallmentsSummary } from '../../../store/slices/leasing/installmentSlice';

function InstallmentPaymentWarningGraph() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {installmentsSummary,installmentsSummaryCount,installmentsSummaryParams,installmentsSummaryLoading} = useSelector((store) => store.installment);
    const {contractPaymentsSummary,warningNoticesSummary,contractPaymentsSummaryCount,contractPaymentsSummaryParams,warningNoticesSummaryParams,contractPaymentsSummaryLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const theme = useTheme();
    const [month, setMonth] = useState(24);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchInstallmentsSummary({activeCompany,month,params:{...installmentsSummaryParams,paginate:false}}));
            dispatch(fetchContractPaymentsSummary({activeCompany,month,params:{...contractPaymentsSummaryParams,paginate:false}}));
            dispatch(fetchWarningNoticesSummary({activeCompany,params:{...warningNoticesSummaryParams,paginate:false}}));
        });
    }, [activeCompany,installmentsSummaryParams,contractPaymentsSummaryParams,warningNoticesSummaryParams,month,dispatch]);

    const installmentsDataset = installmentsSummary
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

    const contractPaymentsDataset = contractPaymentsSummary
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

    const warningNoticesDataset = warningNoticesSummary
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

    const combinedData = useMemo(() => {
        const dataMap = new Map();

        installmentsDataset.forEach(item => {
            dataMap.set(item.month, {
                ...dataMap.get(item.month),
                month: new Date(item.month),
                installment: item.amount || 0,
            });
        });

        contractPaymentsDataset.forEach(item => {
            dataMap.set(item.month, {
                ...dataMap.get(item.month),
                month: new Date(item.month),
                contractPayment: item.amount || 0,
            });
        });

        warningNoticesDataset.forEach(item => {
            dataMap.set(item.month, {
                ...dataMap.get(item.month),
                month: new Date(item.month),
                warningNotice: item.amount || 0,
            });
        });

        return Array.from(dataMap.values());
    }, [installmentsDataset, contractPaymentsDataset, warningNoticesDataset]);

    

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
                                MÜŞTERİ BORCU VE TAHSİLAT GRAFİĞİ
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
                                disabled={installmentsSummaryLoading || contractPaymentsSummaryLoading}
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
                            Son {month/12} yıl içinde aylık olarak taksit tutarı toplamı ve tahsilat tutarı toplamı.
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
                <LineChart
                dataset={combinedData}
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
                        data: installmentsDataset.map(item => item.amount),
                        label: 'Ödemeler',
                        showMark: false,
                        color: dark ? theme.palette.mars.main : theme.palette.warning.main,
                    },
                    {
                        data: contractPaymentsDataset.map(item => item.amount),
                        label: 'Tahsilatlar',
                        showMark: false,
                        color: theme.palette.primary.main,
                    },
                    // {
                    //     data: warningNoticesDataset.map(item => item.amount),
                    //     label: 'İhtarlar',
                    //     showMark: false,
                    //     color: theme.palette.error.main,
                    // },
                ]}
                loading={installmentsSummaryLoading || contractPaymentsSummaryLoading}
                //grid={{ vertical: true, horizontal: true }}
                />
            </Box>
        </Paper>
    )
}

export default InstallmentPaymentWarningGraph
