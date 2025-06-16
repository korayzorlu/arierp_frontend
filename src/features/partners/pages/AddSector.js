import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addPartner } from '../../../store/slices/partners/partnerSlice';
import { Divider, Grid, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../component/header/FormHeader';
import { addSector } from '../../../store/slices/partners/sectorSlice';


function AddSector() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState({companyId: activeCompany.companyId})

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addSector({data})).unwrap();
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
                title="SEKTÖR EKLE"
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:12}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"İsim"}
                            variant='outlined'
                            value={data.name}
                            onChange={(e) => handleChangeField("name",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Kod"}
                            variant='outlined'
                            value={data.code}
                            onChange={(e) => handleChangeField("code",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Ana Sektör Kodu"}
                            variant='outlined'
                            value={data.main_sector_code}
                            onChange={(e) => handleChangeField("mainSectorCode",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Eşleştirme Kodu"}
                            variant='outlined'
                            value={data.match_code}
                            onChange={(e) => handleChangeField("matchCode",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"KKBMB Sektör Kodu"}
                            variant='outlined'
                            value={data.kkbmb_sector_code}
                            onChange={(e) => handleChangeField("kkbmbSectorCode",e.target.value)}
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

export default AddSector
