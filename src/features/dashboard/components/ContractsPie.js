import { useTheme } from '@emotion/react';
import { Box, Card, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect, useState } from 'react'
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

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchLeasesSummary({activeCompany,params:{...leasesSummaryParams,paginate:false}}));
        });
    }, [activeCompany,leasesSummaryParams,dispatch]);

    
    const data = [
        { label: 'Aktifleştirildi', value: leasesSummary.aktiflestirildi || 0, color: theme.palette.metallicblue.main },
        { label: 'Planlandı', value: leasesSummary.planlandi || 0, color: theme.palette.metallicgold.main },
        { label: 'Durduruldu', value: leasesSummary.durduruldu || 0, color: theme.palette.ari.main },
        { label: 'Feshedildi', value: leasesSummary.feshedildi || 0, color: theme.palette.steelplate.main },
        { label: 'Devredilecek', value: leasesSummary.devredilecek || 0, color: theme.palette.greengecko.main },
        { label: 'Devredildi', value: leasesSummary.devredildi || 0, color: theme.palette.neonnephrite.main },
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
                    arcLabel: 'value',
                    arcLabelMinAngle: 10
                }]}
                settings={{
                    margin: { right: 5 },
                    width: 300,
                    height: 300,
                    hideLegend: true,
                }}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: '#fff',
                    }
                }}
                loading={leasesSummaryLoading}
                />
            </Box>
        </Paper>
    )
}

export default ContractsPie
