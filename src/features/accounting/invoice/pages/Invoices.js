import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setLastTab } from '../../../../store/slices/accounting/invoiceSlice';
import PanelContent from '../../../../component/panel/PanelContent';
import { Tab, Tabs } from '@mui/material';
import TabPanel from '../../../../component/tab/TabPanel';
import SaleInvoices from '../components/SaleInvoices';
import PurchaseInvoice from '../components/PurchaseInvoice';

function Invoices() {
    const {lastTab} = useSelector((store) => store.invoice);

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
                label="Sale Invoices"
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
                label="Purchase Invoices"
                value={1}
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
               <SaleInvoices/>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <PurchaseInvoice/>
            </TabPanel>
            
        </PanelContent>
    )
}

export default Invoices
