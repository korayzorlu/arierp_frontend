import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCountries, fetchCurrencies } from '../../../../store/slices/dataSlice';
import { deletePartner, fetchPartner, updatePartner } from '../../../../store/slices/partners/partnerSlice';
import { deleteCategory, fetchCategories, fetchCategory, updateCategory } from '../../../../store/slices/products/categorySlice';
import { Divider, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { Grid } from '@mui/material';
import { toUpper } from 'lodash';
import { setDialog } from '../../../../store/slices/notificationSlice';
import Dialog from '../../../../component/feedback/Dialog';

function UpdateCategory() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [switchDisabled, setSwitchDisabled] = useState(false);

    const { uuid } = useParams();

    const [data, setData] = useState({})

    const fetchData = async () => {
        await dispatch(fetchCategories()).unwrap();
        const response = await dispatch(fetchCategory({activeCompany,params:{uuid}})).unwrap();
        setData(response);
    };
    
    useEffect(() => {
        fetchData();
    }, [activeCompany])

    const handleSubmit = async () => {
        setButtonDisabled(true);
        dispatch(updateCategory({data}));
    };

    const handleDelete = async () => {
        setButtonDisabled(true);
        dispatch(deleteCategory({data}));
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };


    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title={`CATEGORY DETAILS`}
                loadingSave={disabled}
                disabledSave={buttonDisabled}
                onClickSave={() => handleSubmit()}
                onClickDelete={() => dispatch(setDialog(true))}
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
            <Dialog
            title="Delete category"
            onClickText="Delete"
            onClickColor="error"
            dismissText="Cancel"
            onClick={handleDelete}
            >
                Are you sure you want to delete this category? You cant't undo this action.
            </Dialog>
        </Paper>
    )
}

export default UpdateCategory
