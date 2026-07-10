import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstallmentsInLease } from 'store/slices/leasing/leaseSlice';
import BasicTable from 'component/table/BasicTable';
import { Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { fetchInstallmentInformation } from 'store/slices/leasing/installmentSlice';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import PartnerInformationDocuments from 'features/credit/components/PartnerInformationDocuments';
import ContractInfo from './Info/ContractInfo';
import CustomerInfo from './Info/CustomerInfo';
import ProjectInfo from './Info/ProjectInfo';
import FinanceInfo from './Info/FinanceInfo';
import StatusInfo from './Info/StatusInfo';

function Info(props) {

    return (
         <>
            <Stack spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <ContractInfo
                            code={props.data.code}
                            contract={props.data.contract}
                            vade={props.data.vade}
                            activation_date={props.data.activation_date}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <CustomerInfo
                            partner={props.data.partner}
                            partner_tc={props.data.partner_tc}
                            vade={props.data.vade}
                            activation_date={props.data.activation_date}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <ProjectInfo
                            item={props.data.item ? props.data.item.name : ""}
                            block={props.data.block}
                            unit={props.data.unit}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <FinanceInfo
                            musteri_baz_maliyet={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.musteri_baz_maliyet)}
                            irr={props.data.irr}
                            currency={props.data.currency}
                            finansman_kurum={props.data.finansman_kurum}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <StatusInfo
                            lease_status={props.data.lease_status}
                            status={props.data.status}
                            />
                        </Stack>
                    </Paper>
                </Grid>
  
            </Stack>
            
        </>
    )
}

export default Info
