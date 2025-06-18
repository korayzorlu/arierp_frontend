import React, { useState } from 'react'
import Form from '../../../../component/form/Form'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAlert } from '../../../../store/slices/notificationSlice';
import { fetchUser } from '../../../../store/slices/authSlice';
import BackAndHeader from '../../../../component/card/BackAndHeader';
import Row from '../../../../component/grid/Row';
import Col from '../../../../component/grid/Col';
import Lightbox from '../../../../component/image/Lightbox';
import { Button, Divider, IconButton, Stack } from '@mui/material';
import VissuallyHiddenInput from '../../../../component/input/VissuallyHiddenInput';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Grid } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { updateProfile } from '../../../../store/slices/settings/settingsSlice';

function Profile() {
    const {user} = useSelector((store) => store.auth);

    const dispatch = useDispatch();

    const [image, setImage] = useState(user.image);
    const [disabled, setDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [data, setData] = useState({image:null,prevImage:null,removeImage:false})

    const handleSubmit = async () => {
        setDisabled(true);
        dispatch(updateProfile({data}));
        setDisabled(false);
    };

    const handleChangeImage = (event) => {
        setButtonDisabled(false)
        const file = event.target.files[0];
        setData(data => ({...data, image:file}));

        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(data => ({...data, prevImage:reader.result}));
            };
            reader.readAsDataURL(file);
        };
        setData(data => ({...data, removeImage:false}));
        setImage(null);
    };

    const handleDeleteImage = () => {
        setButtonDisabled(false)
        setData(data => ({...data, removeImage:true}));
        setData(data => ({...data, image:null}));
        setData(data => ({...data, prevImage:null}));
        setImage(null);
    };

    return (
        <Stack spacing={2}>
            <FormHeader
            title="PROFIL"
            loadingSave={disabled}
            disabledSave={buttonDisabled}
            onClickSave={() => handleSubmit()}
            noBackButton
            />
            <Divider></Divider>
            <Stack spacing={2}>
                <Grid container spacing={2} sx={{justifyContent:'center',alignItems:'center'}}>
                    <Grid size={{xs:12,sm:4}} sx={{textAlign:'center'}}>
                        <Lightbox
                        src={image || data.prevImage || require('../../../../images/icons/navbar/user-2.png')}
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
            </Stack>
        </Stack>
    )
}

export default Profile
