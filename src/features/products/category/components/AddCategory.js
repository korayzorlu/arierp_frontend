import { Button, Divider, Grid, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormHeader from '../../../../component/header/FormHeader'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsProgress } from '../../../../store/slices/processSlice';
import { fetchCountries, fetchCurrencies } from '../../../../store/slices/dataSlice';
import { addCategory, fetchCategories } from '../../../../store/slices/products/categorySlice';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddIcon from '@mui/icons-material/Add';

function AddCategory() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {categoriesParams} = useSelector((store) => store.category);

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
    }, [dispatch])
    

    const handleChangeTabValue = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addCategory({data})).unwrap();
        await dispatch(fetchCategories({activeCompany,params:categoriesParams})).unwrap();
        setDisabled(false);
    };

    const handleChangeShareholder = (value) => {
        setSwitchDisabled(value);
        handleChangeField("customer",false);
        handleChangeField("supplier",false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Stack spacing={2}>
            <FormHeader
            title={`CREATE NEW CATEGORY`}
            loadingAdd={disabled}
            disabledAdd={buttonDisabled}
            noBackButton={true}
            />
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
                    <Grid size={{xs:12,sm:12}}>
                        <Button
                        variant='contained'
                        color='primary'
                        startIcon={<AddIcon/>}
                        sx={{pl:1}}
                        onClick={() => handleSubmit()}
                        fullWidth
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    )
}

export default AddCategory
