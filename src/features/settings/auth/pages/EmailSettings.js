import { useState } from "react";
import Form from "../../../../component/form/Form";
import Input from "../../../../component/input/Input";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../../../store/slices/notificationSlice";
import { fetchUser } from "../../../../store/slices/authSlice";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import BackAndHeader from "../../../../component/card/BackAndHeader";
import Row from "../../../../component/grid/Row";
import Col from "../../../../component/grid/Col";
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import EmailIcon from '@mui/icons-material/Email';
import { Grid } from '@mui/material';
import FormHeader from "../../../../component/header/FormHeader";
import { updateEmail } from "../../../../store/slices/settings/settingsSlice";

function EmailSettings() {
    const {user} = useSelector((store) => store.auth);

    const dispatch = useDispatch();

    const [edit, setEdit] = useState(false);
    const [changed, setChanged] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [data, setData] = useState({email:user.email})

    const handleSubmit = async () => {
        setDisabled(true);
        setButtonDisabled(true);
        setEdit(false);
        const response = await dispatch(updateEmail({data})).unwrap();
        if(response){
            setChanged(true);
        };
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
            title="EMAIL"
            loadingSave={disabled}
            disabledSave={buttonDisabled}
            noBackButton
            />
            <Divider></Divider>
            <Stack spacing={2}>
                {
                    changed
                    ?
                        <Stack spacing={2}>
                            <Grid container spacing={2} sx={{justifyContent:'center',textAlign:'center'}}>
                                <EmailIcon sx={{fontSize:"32px"}}></EmailIcon>
                            </Grid>
                            <Grid container spacing={2} sx={{justifyContent:'center',textAlign:'center'}}>
                                <Typography>
                                    Check your mailbox
                                </Typography>
                            </Grid>
                        </Stack>
                    :
                        (
                            !edit
                            ?
                                <Stack spacing={2}>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs:12,sm:12}}>
                                            <Typography sx={{textAlign:'center'}}>
                                                {
                                                    user.is_email_verified
                                                    ?
                                                        <>
                                                            <VerifiedIcon/> This email address verified!
                                                        </>
                                                    :
                                                        <>
                                                            <NewReleasesIcon/> This email address not verified!
                                                        </>
                                                }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs:12,sm:12}}>
                                            <Stack spacing={2}>
                                                <Typography  sx={{textAlign:'center'}}>
                                                    {user.email}
                                                </Typography>
                                                <Button type="button" variant="contained" color="primary" onClick={() => setEdit(true)} disabled={buttonDisabled} fullWidth>Change Email</Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            :
                                <Grid container spacing={2}>
                                    <Grid size={{xs:12,sm:12}}>
                                        <TextField
                                        type="text"
                                        size="small"
                                        label={"Email * "}
                                        variant='outlined'
                                        value={data.email}
                                        onChange={(e) => handleChangeField("email",e.target.value)}
                                        disabled={disabled}
                                        fullWidth
                                        />
                                    </Grid>
                                    <Grid size={{xs:12,sm:12}}>
                                        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Send Verification Email</Button>
                                    </Grid>
                                    <Grid size={{xs:12,sm:12}}>
                                        <Button  variant="contained" color="error" onClick={() => setEdit(false)} fullWidth>Cancel</Button>
                                    </Grid>
                                </Grid>
                        )
                }
            </Stack>
        </Stack>
    );
}

export default EmailSettings;