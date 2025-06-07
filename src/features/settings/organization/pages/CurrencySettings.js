import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateDisplayCurrency, updatePersonal } from '../../../../store/slices/settings/settingsSlice';
import { Divider, Stack, TextField } from '@mui/material';
import { Grid } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import CurrencySelect from '../../../../component/select/CurrencySelect';
import { fetchCurrencies } from '../../../../store/slices/dataSlice';

function CurrencySettings() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [disabled, setDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [data, setData] = useState({activeCompanyUUID:activeCompany.id,displayCurrency:activeCompany.display_currency})

    const fetchData = async () => {
        await dispatch(fetchCurrencies()).unwrap();
    };

    useEffect(() => {
        fetchData();
        setData({activeCompanyUUID:activeCompany.id,displayCurrency:activeCompany.display_currency});
    }, [activeCompany])

    const handleSubmit = async () => {
        setDisabled(true);
        setButtonDisabled(true);
        
        dispatch(updateDisplayCurrency({data}));

        setDisabled(false);
        setButtonDisabled(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Stack spacing={2}>
            <FormHeader
            title="DISPLAY CURRENCY"
            loadingSave={disabled}
            disabledSave={buttonDisabled}
            onClickSave={() => handleSubmit()}
            noBackButton
            />
            <Divider></Divider>
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:12}}>
                        <CurrencySelect
                        label="Display Currency"
                        emptyValue={true}
                        value={data.displayCurrency || ""}
                        onChange={(value) => handleChangeField("displayCurrency",value || null)}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    )
}

export default CurrencySettings
