import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAlert, setDialog } from '../../../store/slices/notificationSlice'
import Lightbox from '../../../component/image/Lightbox'
import { Divider,IconButton, Paper, Stack, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VissuallyHiddenInput from '../../../component/input/VissuallyHiddenInput'
import { addCompany, fetchCompanies } from '../../../store/slices/organizationSlice'
import TabPanel from '../../../component/tab/TabPanel'
import FormHeader from '../../../component/header/FormHeader'
import { Grid } from '@mui/material';
import Dialog from '../../../component/feedback/Dialog'

function AddCompany() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState({image:null,prevImage:null})
    const [image, setImage] = useState(null);

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addCompany({data})).unwrap();
        setDisabled(false);
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
        };
    };

    const handleDeleteImage = () => {
        setData(data => ({...data, image:null}));
        setImage(null);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title="CREATE COMPANY"
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
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
            </Stack>
         </Paper>
    )
}

export default AddCompany
