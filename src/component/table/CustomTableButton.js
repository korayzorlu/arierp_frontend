import { Button, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from 'react-redux';
import { ToolbarButton } from '@mui/x-data-grid';

function CustomTableButton(props) {
    const {children, link, icon,onClick,disabled,color,variant,title,sx} = props;

    const {dark} = useSelector((store) => store.auth);

  return (
    <Tooltip title={title}>
      <IconButton
      component={link ? Link : IconButton}
      render={<ToolbarButton />}
      variant={variant || "text"}
      to={link}
      onClick={onClick}
      disabled={disabled ? disabled : false}
      color={
        color
        ?
        color
        :
        dark
          ?
            "whitehole"
          :
            "blackhole"
      }
      sx={sx}
      >
        {icon}
        
      </IconButton>
    </Tooltip>
    
  )
}

export default CustomTableButton
