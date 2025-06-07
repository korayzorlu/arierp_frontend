import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import Row from '../grid/Row';
import Col from '../grid/Col';
import { Grid } from '@mui/material';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function BackAndHeader(props) {
    const {children,className} = props;

    const navigate = useNavigate();

    return (
      <Grid
      container
      spacing={0}
      >
          <Grid
          size={6}
          container
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          >
            <IconButton aria-label='back' onClick={()=>navigate(-1)}>
              <ArrowBackIosNewIcon/>
            </IconButton>
          </Grid>
          <Grid
          size={6}
          container
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          >
            {children}
          </Grid>
      </Grid>
    )
}

export default BackAndHeader
