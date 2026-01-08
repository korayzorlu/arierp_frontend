import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from 'component/panel/PanelContent';
import { Grid, Paper, Stack, Tab, Tabs } from '@mui/material';
import PolicyIcon from '@mui/icons-material/Policy';
import InfoIcon from '@mui/icons-material/Info';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewListIcon from '@mui/icons-material/ViewList';
import DatasetIcon from '@mui/icons-material/Dataset';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import StorageIcon from '@mui/icons-material/Storage';
import TabPanel from 'component/tab/TabPanel';
import Hesaplar from 'features/accounting/components/bddk/Hesaplar';
import Bl222af from 'features/accounting/components/bddk/Bl222af';


function MaliTablo() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const [tabValue, setTabValue] = useState(0);

    const handleChangeTabValue = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    return (
        <PanelContent>
            <Paper>
                <Stack spacing={2}>
                    <Grid container spacing={1}>
                        <Grid size={{xs:12,sm:12}}>
                            <Tabs
                            value={tabValue}
                            variant='scrollable'
                            scrollButtons="auto"
                            onChange={handleChangeTabValue}
                            >
                                <Tab label="Hesaplar" value={0} icon={<AccountBalanceIcon/>} iconPosition="start"/>
                                <Tab label="BL222AF" value={1} icon={<ViewListIcon/>} iconPosition="start"/>
                                <Tab label="KZ222AF" value={2} icon={<ViewListIcon/>} iconPosition="start"/>
                            </Tabs>
                        </Grid>
                    </Grid>
                    <TabPanel value={tabValue} index={0}>
                        <Hesaplar/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Bl222af/>
                    </TabPanel>
                </Stack>
            </Paper>
            
            
            
        </PanelContent>
    )
}

export default MaliTablo
