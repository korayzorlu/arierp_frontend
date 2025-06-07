import { Autocomplete, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function AutocompleteMUI(props) {
    const {emptyValue,label,placeholder,value,onChange,options} = props;

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState({option:value});
    
    const handleOpen = async () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (newValue) => {
        onChange(newValue ? newValue : 0);
        setSelectedValue(newValue ? newValue : null);
    }

    useEffect(() => {
        setSelectedValue(options.find((option) => option === value));
    }, [options,value])

    return (
        <Autocomplete
        size='small'
        variant="outlined"
        fullWidth
        options={options}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={(e, newValue) => handleChange(newValue)}
        value={selectedValue}
        isOptionEqualToValue={(option, val) => option === val}
        autoHighlight
        getOptionLabel={(option) =>  option}
        renderOption={(props,option) => {
            const { key, ...optionProps } = props;
            return (
                <Typography key={key} variant="body1" sx={{ color: 'text.primary' }} {...optionProps}>
                    {option}
                </Typography>
            )
        }}
        renderInput={(params) => (
            <TextField
              {...params}
              label={label || "Option"}
              variant='outlined'
              placeholder={placeholder || `Choose an option`}
            />
          )}
        />
    )
}

export default AutocompleteMUI
