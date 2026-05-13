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
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title="MÜŞTERİ MALİ PROFİLİ"
                loadingSave={disabled}
                disabledSave={buttonDisabled}
                onClickSave={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>

                    <Grid container spacing={{xs:2,sm:0}}>
                        <Grid size={{xs:12,sm:12}}>
                            <Info
                            partner={data.partner || {}}
                            />
                        </Grid>
                    </Grid>

                    <Divider/>

                    <Grid container spacing={{xs:2,sm:0}}>
                        <Grid size={{xs:12,sm:12}}>
                            <Incomes
                            income_types={data.income_types || []}
                            other_income={data.other_income || ""}
                            onChangeIncomes={(value) => handleChangeField("income_types",value)}
                            onChangeOtherIncome={(value) => handleChangeField("other_income",value)}
                            />
                        </Grid>
                    </Grid>

                    <Divider/>

                    <Grid container spacing={{xs:2,sm:0}}>
                        <Grid size={{xs:12,sm:12}}>
                            <Jobs
                            sgk_job={data.sgk_job || 0}
                            onChangeSgkJob={(value) => handleChangeField("sgk_job",value)}
                            />
                        </Grid>
                    </Grid>

                    <Divider/>

                    <Grid container spacing={{xs:2,sm:0}}>
                        <Grid size={{xs:12,sm:12}}>
                            <FundSources
                            fund_sources={data.fund_sources || []}
                            other_fund_source={data.other_fund_source || ""}
                            onChangeFundSources={(value) => handleChangeField("fund_sources",value)}
                            onChangeOtherFundSource={(value) => handleChangeField("other_fund_source",value)}
                            />
                        </Grid>
                    </Grid>

                </Stack>
            </Stack>
        </Paper>
    )
}

export default UpdatePartnerFinancialProfile
