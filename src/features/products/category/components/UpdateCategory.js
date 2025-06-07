import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setIsProgress } from '../../../../store/slices/processSlice';
import { fetchCountries, fetchCurrencies } from '../../../../store/slices/dataSlice';
import { deleteCategory, fetchCategories, fetchCategory, updateCategory } from '../../../../store/slices/products/categorySlice';
import { Button, Grid, Stack, TextField } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '../../../../component/feedback/Dialog';
import { setDialog } from '../../../../store/slices/notificationSlice';

function UpdateCategory() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {categoriesParams} = useSelector((store) => store.category);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { uuid } = useParams();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [data, setData] = useState({companyId: activeCompany.companyId})

    const fetchData = async () => {
        const response = await dispatch(fetchCategory({activeCompany,params:{uuid}})).unwrap();
        setData(response);
    };
    
    useEffect(() => {
        fetchData();
    }, [activeCompany])

    const handleSubmit = async () => {
        setDisabled(true);
        setButtonDisabled(true);
        
        await dispatch(updateCategory({data})).unwrap();

        dispatch(fetchCategories({activeCompany,params:categoriesParams}));

        setDisabled(false);
    };

    const handleDelete = async () => {
        setButtonDisabled(true);
        await dispatch(deleteCategory({data})).unwrap();
        dispatch(fetchCategories({activeCompany,params:categoriesParams}));
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Stack spacing={2}>
            <FormHeader
            title={`UPDATE CATEGORY`}
            loadingAdd={disabled}
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
                        sx={{pl:1}}
                        onClick={() => handleSubmit()}
                        fullWidth
                        disabled={buttonDisabled}
                        >
                            Save
                        </Button>
                    </Grid>
                    <Grid size={{xs:12,sm:12}}>
                        <Button
                        variant='contained'
                        color='error'
                        sx={{pl:1}}
                        onClick={() => dispatch(setDialog(true))}
                        fullWidth
                        >
                            Delete
                        </Button>
                    </Grid>
                    <Dialog
                    title="Delete company"
                    onClickText="Delete"
                    onClickColor="error"
                    dismissText="Cancel"
                    onClick={handleDelete}
                    >
                        Are you sure you want to delete {data.name}? You cant't undo this action.
                    </Dialog>
                </Grid>
            </Stack>
        </Stack>
    )
}

export default UpdateCategory
