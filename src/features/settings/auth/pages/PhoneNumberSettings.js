import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAlert } from '../../../../store/slices/notificationSlice';
import { fetchUser, setVerifyPhoneNumber } from '../../../../store/slices/authSlice';
import Form from '../../../../component/form/Form';
import { Button, Divider, FormControl, MenuItem, Select, Stack, TextField } from '@mui/material';
import Row from '../../../../component/grid/Row';
import Col from '../../../../component/grid/Col';
import { fetchCountries } from '../../../../store/slices/dataSlice';
import FormHeader from '../../../../component/header/FormHeader';
import { Grid } from '@mui/material';
import CountrySelect from '../../../../component/select/CountrySelect';

function PhoneNumberSettings() {
    const {user} = useSelector((store) => store.auth);
    const {countries} = useSelector((store) => store.data);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
    const [disabled, setDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [iso2, setIso2] = useState("TR");
    const [data, setData] = useState({})

    useEffect(() => {
      dispatch(fetchCountries());
    }, [])
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisabled(true);
        setButtonDisabled(true);
        
        try {
            const response = await axios.post(`/users/phone_number_settings/`, 
                {   
                    iso2 : iso2,
                    phoneNumber : phoneNumber,
                },
                {withCredentials: true},
            );
            dispatch(setAlert({status:response.data.status,text:response.data.message}));
            dispatch(setVerifyPhoneNumber(phoneNumber.slice(-2)))
            navigate(
                "/phone-number-verify",
                {
                    state: {iso2:iso2,phoneNumber:phoneNumber}
                }
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {
            dispatch(fetchUser());
            setDisabled(false);
        };
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        
        <Stack spacing={2}>
            <FormHeader
            title="TELEFON NUMARASI"
            loadingSave={disabled}
            disabledSave={buttonDisabled}
            noBackButton
            />
            <Divider></Divider>
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:5}}>
                        <CountrySelect
                        label="Ülke Kodu"
                        emptyValue={true}
                        value={data.phoneCountry || user.location.country}
                        onChange={(value) => handleChangeField("phoneCountry",value)}
                        isPhoneCountry={true}
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:7}}>
                        <TextField
                        type="number"
                        size="small"
                        label={"Numara"}
                        variant='outlined'
                        value={data.phoneNumber || ""}
                        onChange={(e) => handleChangeField("phoneNumber",e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={buttonDisabled} fullWidth>SMS İle Doğrulama kodu Gönder</Button>
        </Stack>
            
    )
}

export default PhoneNumberSettings
