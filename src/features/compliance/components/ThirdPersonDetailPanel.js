import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserDefaultPng from "images/icons/user-default.png";
import { truncateText } from 'utils/stirngUtils';
import ThirdPersonDialog from 'component/dialog/ThirdPersonDialog';
import { setThirdPersonDialog } from 'store/slices/notificationSlice';
import { Links } from 'react-router-dom';

function ThirdPersonDetailPanel(props) {
    const {uuid, thirdPersonResults} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const isFirstSelection = useRef(true);
    const [thirdPerson, setThirdPerson] = useState({
        Images: [],
        OtherNames: [],
        BirthDetails: [],
        AddressDetails: [],
        Links: []
    });

    useEffect(() => {
        let allSelectedRows = [];
        if (apiRef.current) {
            const tableRows = apiRef.current.getAllRowIds().map((id) => apiRef.current.getRow(id))
            const overdueRowIds = []
            tableRows.forEach((tableRow) => {
                if (tableRow.leaseflex_automation){
                    overdueRowIds.push(tableRow.id)
                }
            })
            
            if(overdueRowIds.length > 0){
                apiRef.current.selectRows(overdueRowIds,true,true);
                const map = apiRef.current.getSelectedRows();
                map.forEach((row) => allSelectedRows.push(row));
            }else {
                isFirstSelection.current = false;
            }
        }
    }, [])

    return (
        <>
            <Box sx={{ pt: 2, pb: 2, pl: 8, pr: 8 }}>
                {
                    thirdPersonResults
                    ?   
                        <Grid container spacing={2}>   
                            {   
                                thirdPersonResults.map((result,index) => (
                                    <Grid size={{xs:12,sm:3}}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardMedia
                                                sx={{ height: 140, width: 140, marginLeft: 'auto', marginRight: 'auto', mt: 2,borderRadius: '50%',objectFit: 'cover', }}
                                                image={UserDefaultPng}
                                                title="person"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {result.FullName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', ...truncateText(result.OtherInformation, 4) }}>
                                                    {result.OtherInformation}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                variant='text'
                                                color='primary'
                                                size="small"
                                                onClick={() => {dispatch(setThirdPersonDialog(true));setThirdPerson(result)}}
                                                >
                                                    Daha Fazla Bilgi
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                        
                    :
                        <Typography variant="body2" sx={{textAlign: 'center'}}>
                            Herhangi bir listede bulunmamaktadır.
                        </Typography>
                }
            </Box>
            <ThirdPersonDialog
            thirdPerson={thirdPerson}
            />
        </>
        
    )
}

export default ThirdPersonDetailPanel
