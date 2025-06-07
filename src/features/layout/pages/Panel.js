import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../../../component/navbar/Navbar';
import Sidenav from '../../../component/sidebar/Sidenav';
import Alert from '../../../component/alert/Alert';
import { useDispatch, useSelector } from 'react-redux';
//import Alert from '@mui/joy/Alert';
import UserDialog from '../../../component/dialog/UserDialog';
import { setLoading } from '../../../store/slices/authSlice';
import { fetchMenuItems } from '../../../store/slices/subscriptionsSlice';
import { fetchCompaniesForStart } from '../../../store/slices/organizationSlice';
import { fetchNotifications } from '../../../store/slices/notificationSlice';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import { joinWebsocket } from '../../../store/slices/websocketSlice';
import { Grid } from '@mui/material';
import { Stack } from '@mui/material';

function Panel() {
  const {alert} = useSelector((store) => store.notification);
  const {contentWidth} = useSelector((store) => store.sidebar);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      
      await Promise.allSettled([
        dispatch(fetchMenuItems()).unwrap(),
        dispatch(fetchCompaniesForStart()).unwrap(),
        //dispatch(fetchCountries()).unwrap(),
        dispatch(fetchNotifications()).unwrap(),
        dispatch(fetchImportProcess()).unwrap(),
        dispatch(joinWebsocket()).unwrap()
      ]);
      
      dispatch(setLoading(false));
    };

    fetchData();

  },[dispatch]);

  return (
    <>
      <Navbar></Navbar>
      <div className='row homeContent p-0 m-0 w-100'>

        <div className='col sidebarContent p-0 m-0 h-100' style={{"maxWidth":contentWidth.sidebar}}>
          <Sidenav></Sidenav>
        </div>

        <div className='col p-0 m-0 h-100 pageContent overflow-scroll' style={{"maxWidth":contentWidth.page}}>

          <div className="row p-2 m-0 g-0">
            <div className="col-md-12">

               <Outlet />

            </div>
          </div>
          
        </div>

      </div>

      {/* <Grid container sx={{width:'100%'}} className='homeContent'>

        <Grid sx={{maxWidth:contentWidth.sidebar,height:'100%'}} className='sidebarContent'>
          <Sidenav></Sidenav>
        </Grid>

        <Grid size={12} sx={{maxWidth:contentWidth.page,height:'100%'}} className='pageContent overflow-scroll'>
          <Stack>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Outlet />
              </Grid>
            </Grid>
          </Stack>
        </Grid>

      </Grid> */}

      {/* <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: 'column' }}>
        <Alert
            key="save"
            sx={{ alignItems: 'flex-start' }}
            startDecorator={alert.icon}
            variant="soft"
            color={alert.color}
            endDecorator={
              <IconButton variant="soft" color={alert.color}>
                <CloseRoundedIcon />
              </IconButton>
            }
          >
            <div>
              <div>Saved</div>
              <Typography level="body-sm" color={alert.color}>
                alert.text
              </Typography>
            </div>
          </Alert>
      </Box> */}
     
      <Alert></Alert>
      <UserDialog/>
    </>
  )
}

export default Panel
