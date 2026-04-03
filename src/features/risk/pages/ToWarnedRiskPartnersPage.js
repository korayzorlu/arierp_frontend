import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from 'component/panel/PanelContent';
import { Badge, Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import TabPanel from 'component/tab/TabPanel';
import ToWarnedRiskPartners from '../components/ToWarned/ToWarnedRiskPartners';
import MonthlyWarnedRiskPartners from '../components/ToWarned/MonthlyWarnedRiskPartners';
import AnnualWarnedRiskPartners from '../components/ToWarned/AnnualWarnedRiskPartners';

function ToWarnedRiskPartnersPage() {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {toWarnedRiskPartners,toWarnedRiskPartnersCount,toWarnedRiskPartnersParams,toWarnedRiskPartnersLoading,partnerNotesParams} = useSelector((store) => store.riskPartner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

    const dispatch = useDispatch();

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
                                <Tab label="İhtar Çekilecekler" value={0} icon={<EmailIcon/>} iconPosition="start"/>
                                <Tab label="Aylık Mükerrer Ödememe" value={1} icon={<WarningIcon/>} iconPosition="start"/>
                                <Tab label="Yıllık Mükerrer Ödememe" value={2} icon={<WarningIcon/>} iconPosition="start"/>
                            </Tabs>
                        </Grid>
                    </Grid>
                    <TabPanel value={tabValue} index={0}>
                        <ToWarnedRiskPartners/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <MonthlyWarnedRiskPartners/>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <AnnualWarnedRiskPartners/>
                    </TabPanel>
                </Stack>
            </Paper>
        </PanelContent>
    )
}

export default ToWarnedRiskPartnersPage
