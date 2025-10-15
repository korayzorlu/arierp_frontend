import { useTheme } from '@emotion/react';
import React, { startTransition, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractPaymentsSummary, fetchContractsSummary, fetchWarningNoticesSummary } from '../../../store/slices/contracts/contractSlice';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { fetchInstallmentsSummary } from '../../../store/slices/leasing/installmentSlice';

function InstallmentPaymentWarningGraph() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {installmentsSummary,installmentsSummaryCount,installmentsSummaryParams,installmentsSummaryLoading} = useSelector((store) => store.installment);
    const {contractPaymentsSummary,warningNoticesSummary,contractPaymentsSummaryCount,contractPaymentsSummaryParams,warningNoticesSummaryParams,contractPaymentsSummaryLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchInstallmentsSummary({activeCompany,params:{...installmentsSummaryParams,paginate:false}}));
            dispatch(fetchContractPaymentsSummary({activeCompany,params:{...contractPaymentsSummaryParams,paginate:false}}));
            dispatch(fetchWarningNoticesSummary({activeCompany,params:{...warningNoticesSummaryParams,paginate:false}}));
        });
    }, [activeCompany,installmentsSummaryParams,contractPaymentsSummaryParams,warningNoticesSummaryParams,dispatch]);

    const combinedData = useMemo(() => {
        const dataMap = new Map();

        installmentsSummary.forEach(item => {
            dataMap.set(item.day, {
                ...dataMap.get(item.day),
                day: new Date(item.day),
                installment: item.amount || 0,
            });
        });

        contractPaymentsSummary.forEach(item => {
            dataMap.set(item.day, {
                ...dataMap.get(item.day),
                day: new Date(item.day),
                contractPayment: item.amount || 0,
            });
        });

        warningNoticesSummary.forEach(item => {
            dataMap.set(item.day, {
                ...dataMap.get(item.day),
                day: new Date(item.day),
                warningNotice: item.amount || 0,
            });
        });

        return Array.from(dataMap.values()).sort((a, b) => a.day - b.day);
    }, [installmentsSummary, contractPaymentsSummary, warningNoticesSummary]);

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
                    ÖDEME, TAHSİLAT VE İHTAR ANALİZİ
                </Typography>
                </Stack>
                <Typography variant="body2">
                    Son 30 gün içinde günlük olarak taksit tutarı toplamı, tahsilat tutarı toplamı ve çekilen ihtar tutarı.
                </Typography>
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
                    dataKey: 'day',
                    scaleType: 'time',
                    valueFormatter: (date) => date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
                }]}
                series={[
                    {
                        dataKey: 'installment',
                        label: 'Ödemeler',
                        showMark: false,
                        color: dark ? theme.palette.mars.main : theme.palette.warning.main,
                    },
                    {
                        dataKey: 'contractPayment',
                        label: 'Tahsilatlar',
                        showMark: false,
                        color: theme.palette.primary.main,
                    },
                    {
                        dataKey: 'warningNotice',
                        label: 'İhtarlar',
                        showMark: false,
                        color: theme.palette.error.main,
                    },
                ]}
                //grid={{ vertical: true, horizontal: true }}
                />
            </Box>
        </Paper>
    )
}

export default InstallmentPaymentWarningGraph
