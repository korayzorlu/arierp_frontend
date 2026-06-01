import axios from 'axios';
import React, { useEffect, useMemo, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, Paper, Stack, Tab, Tabs } from '@mui/material';
import { Grid } from '@mui/material';
import FormHeader from 'component/header/FormHeader';
import { fetchPartnerFinancialProfile, fetchPartnerFinancialProfiles, updatePartnerFinancialProfile } from 'store/slices/partners/partnerFinancialProfileSlice';
import InformationTab from 'features/partners/companies/InformationTab';
import Incomes from '../components/Incomes';
import FundSources from '../components/FundSources';
import Jobs from '../components/Jobs';
import Info from '../components/Info';
import { fetchSgkJobs } from 'store/slices/partners/sgkJobSlice';
import Assets from '../components/Assets';
import Transactions from '../components/Transactions';
import CustomerInfo from '../components/CustomerInfo';
import PepControl from '../components/PepControl';
import PaymentInfo from '../components/PaymentInfo';
import CriticalControl from '../components/CriticalControl';
import PaymentPerformance from '../components/PaymentPerformance';

function UpdatePartnerFinancialProfile() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany,disabled} = useSelector((store) => store.organization);
    const {sgkJobsParams} = useSelector((store) => store.sgkJob);

    const dispatch = useDispatch();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [switchDisabled, setSwitchDisabled] = useState(false);

    const { uuid } = useParams();

    const [data, setData] = useState({})

    const fetchData = async () => {
        const response = await dispatch(fetchPartnerFinancialProfile({activeCompany,params:{uuid}})).unwrap();
        setData(response);
    };
    
    useEffect(() => {
        fetchData();
    }, [activeCompany])

    const handleSubmit = async () => {
        setButtonDisabled(true);
        dispatch(updatePartnerFinancialProfile({data}));
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Stack spacing={1}>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:12}}>
                    <Paper elevation={0} sx={{p:2}} square>
                        <Stack spacing={2}>
                            <FormHeader
                            title="MÜŞTERİ MALİ PROFİLİ"
                            loadingSave={disabled}
                            disabledSave={buttonDisabled}
                            onClickSave={() => handleSubmit()}
                            />
                            <Divider></Divider>
                            <Info
                            partner={data.partner || {}}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <Incomes
                            income_types={data.income_types || []}
                            other_income={data.other_income || ""}
                            onChangeIncomes={(value) => handleChangeField("income_types",value)}
                            onChangeOtherIncome={(value) => handleChangeField("other_income",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <Jobs
                            sgk_job={data.sgk_job || 0}
                            institution={data.institution || ""}
                            position={data.position || ""}
                            real_estate_assets={data.real_estate_assets || "0"}
                            vehicle_assets={data.vehicle_assets || "0"}
                            bank_deposit_assets={data.bank_deposit_assets || "0"}
                            investment_assets={data.investment_assets || "0"}
                            other_assets={data.other_assets || "0"}
                            onChangeSgkJob={(value) => handleChangeField("sgk_job",value)}
                            onChangeInstitution={(value) => handleChangeField("institution",value)}
                            onChangePosition={(value) => handleChangeField("position",value)}
                            onChangeRealEstateAssets={(value) => handleChangeField("real_estate_assets",value)}
                            onChangeVehicleAssets={(value) => handleChangeField("vehicle_assets",value)}
                            onChangeBankDepositAssets={(value) => handleChangeField("bank_deposit_assets",value)}
                            onChangeInvestmentAssets={(value) => handleChangeField("investment_assets",value)}
                            onChangeOtherAssets={(value) => handleChangeField("other_assets",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <Assets
                            real_estate_assets_count={data.real_estate_assets_count || 0}
                            vehicle_assets_count={data.vehicle_assets_count || 0}
                            bank_deposit_assets={data.bank_deposit_assets || ""}
                            investment_assets={data.investment_assets || ""}
                            other_assets={data.other_assets || ""}
                            onChangeRealEstateAssetsCount={(value) => handleChangeField("real_estate_assets_count",value)}
                            onChangeVehicleAssetsCount={(value) => handleChangeField("vehicle_assets_count",value)}
                            onChangeBankDepositAssets={(value) => handleChangeField("bank_deposit_assets",value)}
                            onChangeInvestmentAssets={(value) => handleChangeField("investment_assets",value)}
                            onChangeOtherAssets={(value) => handleChangeField("other_assets",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2, height:'100%'}} square>
                        <Stack spacing={2}>
                            <FundSources
                            fund_sources={data.fund_sources || []}
                            other_fund_source={data.other_fund_source || ""}
                            onChangeFundSources={(value) => handleChangeField("fund_sources",value)}
                            onChangeOtherFundSource={(value) => handleChangeField("other_fund_source",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <Transactions
                            transaction_amount={data.transaction_amount || ""}
                            transaction_frequency={data.transaction_frequency || ""}
                            transaction_risk={data.transaction_risk || ""}
                            job_compliance={data.job_compliance || ""}
                            onChangeTransactionAmount={(value) => handleChangeField("transaction_amount",value)}
                            onChangeTransactionFrequency={(value) => handleChangeField("transaction_frequency",value)}
                            onChangeTransactionRisk={(value) => handleChangeField("transaction_risk",value)}
                            onChangeJobCompliance={(value) => handleChangeField("job_compliance",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <CustomerInfo
                            customer_type={data.customer_type || ""}
                            is_foreign_nationality={data.is_foreign_nationality || false}
                            is_end_beneficiary={data.is_end_beneficiary || false}
                            is_transparency={data.is_transparency || false}
                            is_foreign_partner={data.is_foreign_partner || false}
                            is_complex_partner={data.is_complex_partner || false}
                            company_type={data.company_type || ""}
                            onChangeCompanyType={(value) => handleChangeField("company_type",value)}
                            onChangeIsForeignNationality={(value) => handleChangeField("is_foreign_nationality",value)}
                            onChangeIsEndBeneficiary={(value) => handleChangeField("is_end_beneficiary",value)}
                            onChangeCustomerType={(value) => handleChangeField("customer_type",value)}
                            onChangeIsTransparency={(value) => handleChangeField("is_transparency",value)}
                            onChangeIsForeignPartner={(value) => handleChangeField("is_foreign_partner",value)}
                            onChangeIsComplexPartner={(value) => handleChangeField("is_complex_partner",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <PepControl
                            is_pep={data.is_pep || false}
                            is_negative_news={data.is_negative_news || false}
                            onChangeIsPep={(value) => handleChangeField("is_pep",value)}
                            onChangeIsNegativeNews={(value) => handleChangeField("is_negative_news",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <PaymentInfo
                            is_cash_payment={data.is_cash_payment || false}
                            is_balloon_payment={data.is_balloon_payment || false}
                            remitter_type={data.remitter_type || ""}
                            onChangeIsCashPayment={(value) => handleChangeField("is_cash_payment",value)}
                            onChangeIsBalloonPayment={(value) => handleChangeField("is_balloon_payment",value)}
                            onChangeRemitterType={(value) => handleChangeField("remitter_type",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <CriticalControl
                            is_suspicious={data.is_suspicious || false}
                            is_blacklisted={data.is_blacklisted || false}
                            onChangeIsSuspicious={(value) => handleChangeField("is_suspicious",value)}
                            onChangeIsBlacklisted={(value) => handleChangeField("is_blacklisted",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <Stack spacing={2}>
                            <PaymentPerformance
                            is_warning_notice={data.is_warning_notice || false}
                            is_delayed={data.is_delayed || false}
                            is_kkb_score_low={data.is_kkb_score_low || false}
                            is_administrative_follow_up={data.is_administrative_follow_up || false}
                            is_cheque_risk={data.is_cheque_risk || false}
                            partner={data.partner || {}}
                            onChangeIsWarningNotice={(value) => handleChangeField("is_warning_notice",value)}
                            onChangeIsDelayed={(value) => handleChangeField("is_delayed",value)}
                            onChangeIsKkbScoreLow={(value) => handleChangeField("is_kkb_score_low",value)}
                            onChangeIsAdministrativeFollowUp={(value) => handleChangeField("is_administrative_follow_up",value)}
                            onChangeIsChequeRisk={(value) => handleChangeField("is_cheque_risk",value)}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

        </Stack>
        // <Paper elevation={0} sx={{p:2}} square>
        //     <Stack spacing={2}>
        //         <FormHeader
        //         title="MÜŞTERİ MALİ PROFİLİ"
        //         loadingSave={disabled}
        //         disabledSave={buttonDisabled}
        //         onClickSave={() => handleSubmit()}
        //         />
        //         <Divider></Divider>
        //         <Stack spacing={2}>

        //             <Grid container spacing={{xs:2,sm:0}}>
        //                 <Grid size={{xs:12,sm:12}}>
        //                     <Info
        //                     partner={data.partner || {}}
        //                     />
        //                 </Grid>
        //             </Grid>

        //             <Divider/>

        //             <Grid container spacing={{xs:2,sm:0}}>
        //                 <Grid size={{xs:12,sm:12}}>
        //                     <Incomes
        //                     income_types={data.income_types || []}
        //                     other_income={data.other_income || ""}
        //                     onChangeIncomes={(value) => handleChangeField("income_types",value)}
        //                     onChangeOtherIncome={(value) => handleChangeField("other_income",value)}
        //                     />
        //                 </Grid>
        //             </Grid>

        //             <Divider/>

        //             <Grid container spacing={{xs:2,sm:0}}>
        //                 <Grid size={{xs:12,sm:12}}>
        //                     <Jobs
        //                     sgk_job={data.sgk_job || 0}
        //                     institution={data.institution || ""}
        //                     position={data.position || ""}
        //                     onChangeSgkJob={(value) => handleChangeField("sgk_job",value)}
        //                     onChangeInstitution={(value) => handleChangeField("institution",value)}
        //                     onChangePosition={(value) => handleChangeField("position",value)}
        //                     />
        //                 </Grid>
        //             </Grid>

        //             <Divider/>

        //             <Grid container spacing={{xs:2,sm:0}}>
        //                 <Grid size={{xs:12,sm:12}}>
        //                     <FundSources
        //                     fund_sources={data.fund_sources || []}
        //                     other_fund_source={data.other_fund_source || ""}
        //                     onChangeFundSources={(value) => handleChangeField("fund_sources",value)}
        //                     onChangeOtherFundSource={(value) => handleChangeField("other_fund_source",value)}
        //                     />
        //                 </Grid>
        //             </Grid>

        //         </Stack>
        //     </Stack>
        // </Paper>
    )
}

export default UpdatePartnerFinancialProfile
