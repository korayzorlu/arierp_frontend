import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import React, { useState } from 'react'
import Block from './Block';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

function FundSources(props) {
    const handleChange = (event) => {

        if (event.target.name === "diger") {
            props.onChangeOtherFundSource("");
        };

        const updatedFundSources = [...props.fund_sources];
        if (event.target.checked) {
            updatedFundSources.push(event.target.name);
        } else {
            const index = updatedFundSources.indexOf(event.target.name);
            if (index > -1) {
                updatedFundSources.splice(index, 1);
            }
        }

        props.onChangeFundSources(updatedFundSources);
    };

    return (
        <Block text="Fon Kaynakları" icon={<RequestQuoteIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:4}}>
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Fon Kaynağı Türü</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                            control={<AriCheckBox name="satis" checked={props.fund_sources.includes("satis")} onChange={handleChange} />}
                            label="Satış Geliri"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="maas" checked={props.fund_sources.includes("maas")} onChange={handleChange} />}
                            label="Maaş"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="maas_birikimi" checked={props.fund_sources.includes("maas_birikimi")} onChange={handleChange} />}
                            label="Maaş Birikimi"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="kira" checked={props.fund_sources.includes("kira")} onChange={handleChange} />}
                            label="Kira Geliri"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="miras" checked={props.fund_sources.includes("miras")} onChange={handleChange} />}
                            label="Miras"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="sirket" checked={props.fund_sources.includes("sirket")} onChange={handleChange} />}
                            label="Şirket Geliri"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="yurtdisi" checked={props.fund_sources.includes("yurtdisi")} onChange={handleChange} />}
                            label="Yurtdışı Geliri"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="belirsiz" checked={props.fund_sources.includes("belirsiz")} onChange={handleChange} />}
                            label="Belirsiz Kaynak"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="kripto" checked={props.fund_sources.includes("kripto")} onChange={handleChange} />}
                            label="Kripto Kazancı"
                            />
                            <FormControlLabel
                            control={<AriCheckBox name="diger" checked={props.fund_sources.includes("diger")} onChange={handleChange} />}
                            label="Diğer"
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid size={{xs:12,sm:8}}>
                    <FormControl component="fieldset" variant="standard" fullWidth>
                        <FormLabel component="legend">Diğer Fon Kaynağı Bilgileri</FormLabel>
                        <FormGroup>
                            <TextField
                            type="text"
                            size="small"
                            variant='outlined'
                            value={props.other_fund_source}
                            onChange={(e) => props.onChangeOtherFundSource(e.target.value)}
                            disabled={props.fund_sources.includes("diger") ? false : true}
                            multiline
                            rows={8}
                            fullWidth
                            />
                        </FormGroup>
                    </FormControl>
                    
                </Grid>
            </Grid>
        </Block>
    )
}

export default FundSources
