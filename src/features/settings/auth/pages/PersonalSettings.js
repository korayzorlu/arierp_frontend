import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../../../component/form/Form";
import Input from "../../../../component/input/Input";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAlert, setDialog } from "../../../../store/slices/notificationSlice";
import { fetchUser } from "../../../../store/slices/authSlice";
import { Button, Divider,Paper, Stack, TextField } from "@mui/material";
import FormHeader from "../../../../component/header/FormHeader";
import { Grid } from '@mui/material';
import { updatePersonal } from "../../../../store/slices/settings/settingsSlice";

function PersonalSettings() {
    const {user} = useSelector((store) => store.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [disabled, setDisabled] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [data, setData] = useState(
        {
            id:user.id,
            email:user.email,
            username:user.username,
            phone_number : user.phone_number,
            is_email_verified : user.is_email_verified,
            first_name:user.first_name,
            last_name:user.last_name
        }
    );

    const handleSubmit = async () => {
        setDisabled(true);
        setButtonDisabled(true);
        
        dispatch(updatePersonal({data}));

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
            title="KİŞİSEL"
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
                        type="text"
                        size="small"
                        label={"Ad * "}
                        variant='outlined'
                        value={data.first_name}
                        onChange={(e) => handleChangeField("first_name",e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:12}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Soyad * "}
                        variant='outlined'
                        value={data.last_name}
                        onChange={(e) => handleChangeField("last_name",e.target.value)}
                        disabled={disabled}
                        fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
        // <Form onSubmit={handleSubmit}>
        //     <div className="row g-0">
        //         <div className="col">
        //             <p className="text-start fw-bold">
        //                 <Button type="button" color="tertary" addClass="shadow-0 p-0 fs-5" onClick={()=>navigate(-1)}><i className="fas fa-arrow-left"></i></Button>
        //             </p>
        //         </div>
        //         <div className="col">
        //             <p className="text-end fw-bold">Personal</p>
        //         </div>
        //     </div>
        //     <Input type="text" id="settings-auth-firstName" label={"First Name"} onChange={(e) => setFirstName(e.target.value)} disabled={disabled}>{firstName}</Input>
        //     <Input type="text" id="settings-auth-lastName" label={"Last Name"} onChange={(e) => setLastName(e.target.value)} disabled={disabled}>{lastName}</Input>
        //     <Button type="submit" variant="contained" color="primary" addClass="btn-block" disabled={disabled} fullWidth>Save</Button>
        // </Form>
    );
}

export default PersonalSettings;