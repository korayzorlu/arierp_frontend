import axios from 'axios';
import React, { useEffect, useMemo, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, Paper, Stack, Tab, Tabs } from '@mui/material';
import { Grid } from '@mui/material';
import FormHeader from 'component/header/FormHeader';
import { fetchPartnerFinancialProfiles, updatePartnerFinancialProfile } from 'store/slices/partners/partnerFinancialProfileSlice';
import InformationTab from 'features/partners/companies/InformationTab';
import Incomes from '../components/Incomes';

function UpdatePartnerFinancialProfile() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [switchDisabled, setSwitchDisabled] = useState(false);

    const { uuid } = useParams();

    const [data, setData] = useState({})

    const fetchData = async () => {
        const response = await dispatch(fetchPartnerFinancialProfiles({activeCompany,params:{uuid}})).unwrap();
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
                    <Grid
                    container
                    spacing={{xs:2,sm:0}}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Grid>
                            <Incomes
                            valueName={data.name || ""}
                            valueFormalName={data.formalName || ""}
                            onChangeName={(value) => handleChangeField("name",value)}
                            onChangeFormalName={(value) => handleChangeField("formalName",value)}
                            disabled={disabled}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default UpdatePartnerFinancialProfile
