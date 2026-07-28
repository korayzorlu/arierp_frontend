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
import RiskInfo from './Info/RiskInfo';
import KurDegerlemesiInfo from './Info/KurDegerlemesiInfo';
import KurKaybi from './Info/KurKaybi';

function Info(props) {

    return (
         <>
            <Stack spacing={1}>
                <Grid size={{xs:12,sm:12}}>
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

                <Grid size={{xs:12,sm:12}}>
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

                <Grid size={{xs:12,sm:12}}>
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

                <Grid size={{xs:12,sm:12}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <FinanceInfo
                            musteri_baz_maliyet={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.musteri_baz_maliyet)}
                            operasyon_baz_maliyet={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.operasyon_baz_maliyet)}
                            vat={props.data.vat}
                            irr={props.data.irr}
                            currency={props.data.currency}
                            pesinat_amount={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.pesinat_amount)}
                            kira_amount={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.kira_amount)}
                            devir_bedeli_amount={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.devir_bedeli_amount)}
                            paid_amount={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.paid_amount)}
                            finansman_kurum={props.data.finansman_kurum}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{xs:12,sm:12}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <RiskInfo
                            overdue_amount={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.overdue_amount)}
                            overdue_days={props.data.overdue_days}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:3}}>
                        <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                            <Stack spacing={2}>
                                <KurKaybi
                                geciken_odenmesi_gereken_usd={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.geciken_odenmesi_gereken_usd)}
                                kur_kaybi={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.kur_kaybi)}
                                kur_kaybi_orani={props.data.kur_kaybi/props.data.geciken_odenmesi_gereken_usd * 100}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid size={{xs:12,sm:9}}>
                        <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                            <Stack spacing={2}>
                                <KurDegerlemesiInfo
                                overdue_amount={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.overdue_amount)}
                                odenmesi_gereken_yerel={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.odenmesi_gereken_yerel)}
                                odenmesi_gereken_usd={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.odenmesi_gereken_usd)}
                                odenen_yerel={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.odenen_yerel)}
                                odenen_usd={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.odenen_usd)}
                                geciken_usd={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.geciken_usd)}
                                geciken_odenmesi_gereken_usd={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.geciken_odenmesi_gereken_usd)}
                                kur_kaybi={new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.data.kur_kaybi)}
                                kur_kaybi_orani={props.data.kur_kaybi/props.data.geciken_odenmesi_gereken_usd * 100}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid size={{xs:12,sm:12}}>
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
