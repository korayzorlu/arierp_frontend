import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import React, { useState } from 'react'
import Title from './Title';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Block from './Block';

function Incomes(props) {
    const [diger, setDiger] = useState(false)
    const [state, setState] = useState({
        maas: false,
        ticari: false,
        kira: false,
        yatirim: false,
        diger: false,
        digerGelirBilgileri: "",
    });

    const income_types = [
        {label:"Maaş", value:"maas"},
        {label:"Ticari Kazanç", value:"ticari"},
        {label:"Kira Geliri", value:"kira"},
        {label:"Yatırım Geliri", value:"yatirim"},
        {label:"Diğer", value:"diger"},
    ]

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });

        if (event.target.name === "diger") {
            props.onChangeOtherIncome("");
        };

        const updatedIncomeTypes = [...props.income_types];
        if (event.target.checked) {
            updatedIncomeTypes.push(event.target.name);
        } else {
            const index = updatedIncomeTypes.indexOf(event.target.name);
            if (index > -1) {
                updatedIncomeTypes.splice(index, 1);
            }
        }

        props.onChangeIncomes(updatedIncomeTypes);
    };

    return (
        <Block text="Gelir" icon={<MonetizationOnIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:4}}>
                    {/* <Autocomplete
                    options={income_types}
                    renderInput={(params) => <TextField {...params} label="Gelir Türü" />}
                    fullWidth
                    size='small'
                    /> */}
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Gelir Türü</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                            control={<AriCheckBox name="maas" checked={props.income_types.includes("maas")} onChange={handleChange} />}
                            label="Maaş"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="ticari" checked={props.income_types.includes("ticari")} onChange={handleChange} />}
                            label="Ticari Kazanç"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="kira" checked={props.income_types.includes("kira")} onChange={handleChange} />}
                            label="Kira Geliri"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="yatirim" checked={props.income_types.includes("yatirim")} onChange={handleChange} />}
                            label="Yatırım Geliri"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="diger" checked={props.income_types.includes("diger")} onChange={handleChange} />}
                            label="Diğer"
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid size={{xs:12,sm:8}}>
                    <FormControl component="fieldset" variant="standard" fullWidth>
                        <FormLabel component="legend">Diğer Gelir Bilgileri</FormLabel>
                        <FormGroup>
                            <TextField
                            type="text"
                            size="small"
                            variant='outlined'
                            value={props.other_income}
                            onChange={(e) => props.onChangeOtherIncome(e.target.value)}
                            disabled={props.income_types.includes("diger") ? false : true}
                            multiline
                            rows={7}
                            fullWidth
                            />
                        </FormGroup>
                    </FormControl>
                    
                </Grid>
            </Grid>
        </Block>
    )
}

export default Incomes
