import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsProgress } from 'store/slices/processSlice';
import { Divider, Grid, Paper, Stack, TextField } from '@mui/material';
import FormHeader from 'component/header/FormHeader';
import { addBankAccountTransaction } from 'store/slices/finance/bankAccountTransactionSlice';
import { addBlackListPerson } from 'store/slices/compliance/blackListPersonSlice';

function AddBlacklistPerson() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState({companyId: activeCompany ? activeCompany.companyId : null});

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(setIsProgress(false));
    }, [dispatch])
    

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addBlackListPerson({data})).unwrap();
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
                title={`YENİ YASAKLI KİŞİ`}
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            size="small"
                            label={"İsim"}
                            variant='outlined'
                            value={data.name}
                            onChange={(e) => handleChangeField("name",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            size="small"
                            label={"TC/VKN/Passport No"}
                            variant='outlined'
                            value={data.tc_vkn_passport_no}
                            onChange={(e) => handleChangeField("tc_vkn_passport_no",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            size="small"
                            label={"Diğer İsimler"}
                            variant='outlined'
                            value={data.other_names}
                            onChange={(e) => handleChangeField("other_names",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            size="small"
                            label={"Uyruk"}
                            variant='outlined'
                            value={data.nationality}
                            onChange={(e) => handleChangeField("nationality",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            size="small"
                            label={"Doğum Tarihi"}
                            variant='outlined'
                            value={data.birthday}
                            onChange={(e) => handleChangeField("birthday",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            size="small"
                            label={"Örgüt"}
                            variant='outlined'
                            value={data.organization}
                            onChange={(e) => handleChangeField("organization",e.target.value)}
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

export default AddBlacklistPerson
