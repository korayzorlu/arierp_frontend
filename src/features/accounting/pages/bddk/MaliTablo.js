import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from 'component/panel/PanelContent';
import { Grid } from '@mui/material';


function MaliTablo() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);


    return (
        <PanelContent>
            <Grid container spacing={1}>
                
            </Grid>
            
        </PanelContent>
    )
}

export default MaliTablo
