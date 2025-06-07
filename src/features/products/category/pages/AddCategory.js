import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsProgress } from '../../../../store/slices/processSlice';
import { fetchCountries, fetchCurrencies } from '../../../../store/slices/dataSlice';
import { addCategory, fetchCategories } from '../../../../store/slices/products/categorySlice';
import { Divider, Paper, Stack, Tab, Tabs, TextField } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { Grid } from '@mui/material';
import AndroidSwitch from '../../../../component/switch/AndroidSwitch';
import TabPanel from '../../../../component/tab/TabPanel';
import InformationTab from '../../../partners/companies/InformationTab';
import AddressTab from '../../../partners/companies/AddressTab';
import ContactTab from '../../../partners/companies/ContactTab';

function AddCategory() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [data, setData] = useState({companyId: activeCompany.companyId})

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(fetchCategories());
        dispatch(setIsProgress(false));
    }, [dispatch]);

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addCategory({data})).unwrap();
        setDisabled(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title={`CREATE CATEGORY`}
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:12}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Name"}
                            variant='outlined'
                            value={data.name}
                            onChange={(e) => handleChangeField("name",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default AddCategory
