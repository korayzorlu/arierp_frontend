import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function AccountButton(props) {
    const {title,balance,currency,icon,text,link} = props;

    const {dark} = useSelector((store) => store.auth);
    const {mobile} = useSelector((store) => store.sidebar);
    const {activeCompany} = useSelector((store) => store.organization);

    return (
        <Button
        component={Link}
        to={link}
        variant="outlined"
        color={dark ? 'whitehole' : 'blackhole'}
        square={true}
        sx={{ height:240,p:0,borderRadius:0,textAlign:'center' }}
        fullWidth
        >
            <Box sx={{ p: 2,backgroundColor: dark ? '#111' : 'cream.main',height:'100%',width:'100%' }}>
                <Stack
                direction="row"
                spacing={0}
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography gutterBottom variant={mobile ? 'h6' : 'h5'} component="div">
                        {title}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        0.00 {activeCompany ? activeCompany.display_currency : ""}
                    </Typography>
                </Stack>
                <Stack spacing={2}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {icon}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {text}
                    </Typography>
                </Stack>
            </Box>
        </Button>
    )
}

export default AccountButton
