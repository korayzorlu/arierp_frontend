import { Box, Stack } from '@mui/material';
import React from 'react'

function TabPanel(props) {
    const {children,value,index, ...other} = props;

    return (
        <Stack
        spacing={2}
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </Stack>
    )
}

export default TabPanel
