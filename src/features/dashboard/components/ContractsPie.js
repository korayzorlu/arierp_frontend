import { useTheme } from '@emotion/react';
import { Box, Card, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { fetchContractsSummary } from '../../../store/slices/contracts/contractSlice';
import { fetchLeasesSummary } from '../../../store/slices/leasing/leaseSlice';

function ContractsPie() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {leasesSummary,leasesSummaryCount,leasesSummaryParams,leasesSummaryLoading} = useSelector((store) => store.lease);

    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchLeasesSummary({activeCompany,params:{...leasesSummaryParams,paginate:false}}));
        });
    }, [activeCompany,leasesSummaryParams,dispatch]);

    
    const data = [
        { label: 'Aktifleştirildi', value: leasesSummary.aktiflestirildi, color: '#0088FE' },
        { label: 'Planlandı', value: leasesSummary.planlandi, color: "#FF911F" },
        { label: 'Durduruldu', value: leasesSummary.durduruldu, color: '#CA3422' },
        { label: 'Feshedildi', value: leasesSummary.feshedildi, color: '#0e9e2dff' },
    ];

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
                    KİRA PLANI STATÜ DAĞILIMI
                </Typography>
                </Stack>
                <Typography variant="body2">
                    Yürürlükteki kira planlarının statü bazlı dağılımı.
                </Typography>
            </Box>
            <Divider />
            <Box
            sx={{
                height: 300
            }}
            >
                <PieChart
                series={[{
                    data:data,
                    innerRadius: 50,
                    outerRadius: 100,
                    paddingAngle: 0,
                    arcLabel: 'value'
                }]}
                settings={{
                    margin: { right: 5 },
                    width: 300,
                    height: 300,
                    hideLegend: true,
                }}
                />
            </Box>
        </Paper>
    )
}

export default ContractsPie
