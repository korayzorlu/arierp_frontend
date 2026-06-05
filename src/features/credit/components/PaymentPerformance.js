import { Autocomplete, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import SgkJobSelect from 'component/select/SgkJobSelect';
import AndroidSwitch from 'component/switch/AndroidSwitch';
import React, { useState } from 'react'
import Block from './Block';
import PaymentsIcon from '@mui/icons-material/Payments';

function PaymentPerformance(props) {
    return (
        <Block text="Ödeme Performansı" icon={<PaymentsIcon />}>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="İhtar var"
                    checked={props.is_warning_notice}
                    onChange={(value) => props.onChangeIsWarningNotice(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="Gecikme var"
                    checked={props.is_delayed}
                    onChange={(value) => props.onChangeIsDelayed(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label="KKB skoru düşük"
                    checked={props.is_kkb_score_low}
                    onChange={(value) => props.onChangeIsKkbScoreLow(value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:12}}>
                    <AndroidSwitch
                    label={props.partner.customer_type === 'individual' ? "İdari,kanuni takip ve varlık yönetim şirketine devir var" : "İdari,kanuni takip ve konkordata var"}
                    checked={props.is_administrative_follow_up}
                    onChange={(value) => props.onChangeIsAdministrativeFollowUp(value)}
                    />
                </Grid>
            </Grid>
            {
                props.partner.customer_type === 'institutional'
                ?
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:12}}>
                            <AndroidSwitch
                            label="Çek riski var"
                            checked={props.is_cheque_risk}
                            onChange={(value) => props.onChangeIsChequeRisk(value)}
                            />
                        </Grid>
                    </Grid>
                :
                    null
            }
            
        </Block>
    )
}

export default PaymentPerformance
