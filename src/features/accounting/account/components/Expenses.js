import React from 'react'
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { Paper, Stack } from '@mui/material';
import AccountButton from './AccountButton';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';

function Expenses() {
    const {mobile} = useSelector((store) => store.sidebar);

    return (
        <Paper elevation={0} square>
            <Stack spacing={2}>
                <Grid container spacing={{xs:2,sm:6}} sx={{padding:mobile ? 2 : 6}}>
                    <Grid size={{xs:12,sm:6}}>
                        <AccountButton
                        title='Expense'
                        link="/accounts/expense"
                        icon={<CallMissedOutgoingIcon sx={{fontSize:mobile ? 80 : 120}}/>}
                        text='Represents costs incurred during operations.'
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    )
}

export default Expenses
