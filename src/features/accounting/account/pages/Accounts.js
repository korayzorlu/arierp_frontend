import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setLastTab } from '../../../../store/slices/accounting/accountSlice';
import { Tab, Tabs } from '@mui/material';
import PanelContent from '../../../../component/panel/PanelContent';
import TabPanel from '../../../../component/tab/TabPanel';
import Receivable from '../components/Receivable';
import Payable from '../components/Payable';
import Assets from '../components/Assets';
import Liabilities from '../components/Liabilities';
import Revenue from '../components/Revenue';
import Expenses from '../components/Expenses';
import Equity from '../components/Equity';

function Accounts() {
    const {lastTab} = useSelector((store) => store.account);

    const dispatch = useDispatch();

    const [tabValue, setTabValue] = useState(lastTab);
    
    useEffect(() => {
        dispatch(setLastTab(0));
    }, [])

    const handleChangeTabValue = (event, newTabValue) => {
        dispatch(setLastTab(newTabValue));
        setTabValue(newTabValue);
    };

    return (
        <PanelContent>
            <Tabs
            value={tabValue}
            variant='scrollable'
            scrollButtons="auto"
            onChange={handleChangeTabValue}
            slotProps={{
                indicator:{
                    sx:{
                        display: 'none',
                        backgroundColor: 'opposite.main'
                    }
                }
            }}
            >
                <Tab
                label="Assets"
                value={0}
                iconPosition="start"
                sx={{
                    '&.Mui-selected' : {
                        backgroundColor: 'panelbox.main',
                        color: 'opposite.main'
                    }
                }}
                />
                <Tab
                label="Lilabilities"
                value={1}
                iconPosition="start"
                sx={{
                    '&.Mui-selected' : {
                        backgroundColor: 'panelbox.main',
                        color: 'opposite.main'
                    }
                }}
                />
                <Tab
                label="Equity"
                value={2}
                iconPosition="start"
                sx={{
                    '&.Mui-selected' : {
                        backgroundColor: 'panelbox.main',
                        color: 'opposite.main'
                    }
                }}
                />
                <Tab
                label="Revenue"
                value={3}
                iconPosition="start"
                sx={{
                    '&.Mui-selected' : {
                        backgroundColor: 'panelbox.main',
                        color: 'opposite.main'
                    }
                }}
                />
                <Tab
                label="Expenses"
                value={4}
                iconPosition="start"
                sx={{
                    '&.Mui-selected' : {
                        backgroundColor: 'panelbox.main',
                        color: 'opposite.main'
                    }
                }}
                />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <Assets/>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Liabilities/>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Equity/>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                <Revenue/>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
                <Expenses/>
            </TabPanel>
            
        </PanelContent>
    )
}

export default Accounts
