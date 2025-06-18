import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Stack, TextField } from "@mui/material";
import FormHeader from "../../../../component/header/FormHeader";
import { Grid } from '@mui/material';
import { updatePassword } from "../../../../store/slices/settings/settingsSlice";

function PasswordReset() {
    const {user} = useSelector((store) => store.auth);

    const dispatch = useDispatch();

    const [disabled, setDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [data, setData] = useState({email:user.email});

    const handleSubmit = async () => {
        setDisabled(true);
        setButtonDisabled(true);
        dispatch(updatePassword({data}));
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
            title="ŞİFRE SIFIRLAMA"
            loadingSave={disabled}
            disabledSave={buttonDisabled}
            onClickSave={() => handleSubmit()}
            noBackButton
            />
            <Divider></Divider>
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:12}}>
                        <TextField
                        type="password"
                        size="small"
                        label={"Mevcut Parola"}
                        variant='outlined'
                        value={data.password}
                        onChange={(e) => handleChangeField("password",e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:12}}>
                        <TextField
                        type="password"
                        size="small"
                        label={"Yeni Parola"}
                        variant='outlined'
                        value={data.newPassword}
                        onChange={(e) => handleChangeField("newPassword",e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:12}}>
                        <TextField
                        type="password"
                        size="small"
                        label={"Yeni Parola Doğrula"}
                        variant='outlined'
                        value={data.newPasswordConfirmation}
                        onChange={(e) => handleChangeField("newPasswordConfirmation",e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    );
}

export default PasswordReset;