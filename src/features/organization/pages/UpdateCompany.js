import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDialog } from '../../../store/slices/notificationSlice';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Dialog from '../../../component/feedback/Dialog';
import Lightbox from '../../../component/image/Lightbox';
import VissuallyHiddenInput from '../../../component/input/VissuallyHiddenInput';
import {deleteCompany,fetchCompany,setActiveCompany, updateCompany } from '../../../store/slices/organizationSlice';
import { Divider, Paper, Stack, Tab, Tabs, TextField } from '@mui/material';
import TabPanel from '../../../component/tab/TabPanel';
import UsersInCompany from '../components/UsersInCompany';
import FormHeader from '../../../component/header/FormHeader';
import { Grid } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';

function UpdateCompany() {
    const {companies,activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const location = useLocation();

    const {id,companyId} = location.state || {};

    const [tabValue, setTabValue] = useState(0);
    const [data, setData] = useState({id:companyId,image:null,prevImage:null,removeImage:false})
    const [image, setImage] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [thisCompanyId, setThisCompanyId] = useState(companyId);

    const fetchData = async () => {
        const response = await dispatch(fetchCompany({activeCompany,params:{companyId}})).unwrap();
        setData(data => ({...data, ...response}));
        setImage(response.image);
    };
    
    useEffect(() => {
        fetchData();
    }, [])

    const handleSubmit = async () => {
        setButtonDisabled(true);
        dispatch(updateCompany({data}));
    };

    const handleDelete = () => {
        setButtonDisabled(true);
        if (activeCompany.id === id) {
            dispatch(setActiveCompany(companies.filter(item => item.id !== activeCompany.id)[0]));
        };
        dispatch(deleteCompany({id}));
    };

    const handleChangeImage = (event) => {
        const file = event.target.files[0];
        setData(data => ({...data, image:file}));
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(data => ({...data, prevImage:reader.result}));
            };
            reader.readAsDataURL(file);
            setButtonDisabled(false);
        };
        setData(data => ({...data, removeImage:false}));
        setImage(null);
    };

    const handleDeleteImage = () => {
        setData(data => ({...data, removeImage:true}));
        setData(data => ({...data, image:null}));
        setImage(null);
        setData(data => ({...data, prevImage:null}));
        setButtonDisabled(false);
    };

    const handleChangeTabValue = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };
    
    //<Button type="submit" addClass="bg-mui-blue text-dark" disabled={buttonDisabled}>Save</Button>
    
    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title="COMPANY DETAILS"
                loadingSave={disabled}
                disabledSave={buttonDisabled}
                onClickSave={() => handleSubmit()}
                onClickDelete={() => dispatch(setDialog(true))}
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
                            <Tabs
                            value={tabValue}
                            variant='scrollable'
                            scrollButtons="auto"
                            onChange={handleChangeTabValue}
                            >
                                <Tab label="Information" value={0} icon={<InfoIcon/>} iconPosition="start"/>
                                <Tab label="Users" value={1} icon={<GroupIcon/>} iconPosition="start"/>
                            </Tabs>
                        </Grid>
                    </Grid>
                </Stack>
                <Divider></Divider>
                <TabPanel value={tabValue} index={0}>
                    <Stack spacing={2}>
                        <Grid container spacing={2} sx={{justifyContent:'center',alignItems:'center'}}>
                            <Grid size={{xs:12,sm:4}} sx={{textAlign:'center'}}>
                                <Lightbox
                                src={image || data.prevImage || require('../../../images/icons/global/company.jpg')}
                                addClass="rounded-circle"
                                height="150"
                                width="150"
                                loading="lazy"
                                >
                                </Lightbox>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} sx={{justifyContent:'center',alignItems:'center'}}>
                            <Grid size={{xs:1,sm:1}} sx={{textAlign:'center',maxWidth:60}}>
                                <IconButton component="label" role={undefined} tabIndex={-1} color="neutral">
                                    <CameraAltIcon />
                                    <VissuallyHiddenInput onChange={handleChangeImage} />
                                </IconButton>
                            </Grid>
                            <Grid size={{xs:1,sm:1}} sx={{textAlign:'center',maxWidth:60}}>
                                <IconButton component="label" role={undefined} tabIndex={-1} color="neutral" onClick={handleDeleteImage}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{xs:12,sm:6}}>
                                <TextField
                                type="text"
                                size="small"
                                label={"Name * "}
                                variant='outlined'
                                value={data.name}
                                onChange={(e) => handleChangeField("name",e.target.value)}
                                disabled={disabled}
                                fullWidth
                                />
                            </Grid>
                            <Grid size={{xs:12,sm:6}}>
                                <TextField
                                type="text"
                                size="small"
                                label={"Formal Name * "}
                                variant='outlined'
                                value={data.formalName}
                                onChange={(e) => handleChangeField("formalName",e.target.value)}
                                disabled={disabled}
                                fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <UsersInCompany companyId={thisCompanyId} companyName={data.name}></UsersInCompany>
                </TabPanel>
            </Stack>
            <Dialog
            title="Delete company"
            onClickText="Delete"
            onClickColor="error"
            dismissText="Cancel"
            onClick={handleDelete}
            >
                Are you sure you want to delete {data.name}? You cant't undo this action.
            </Dialog>
         </Paper>
    )
}

export default UpdateCompany
