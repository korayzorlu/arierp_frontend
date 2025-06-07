import { Autocomplete, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCities } from '../../store/slices/dataSlice';
import { deletePartners, fetchPartners } from '../../store/slices/partners/partnerSlice';
import { debounce } from 'lodash';

function PartnerSelect(props) {
    const {emptyValue,label,placeholder, value,types, onChange} = props;
    const {activeCompany} = useSelector((store) => store.organization);
    const {partners,partnersLoading} = useSelector((store) => store.partner);
    
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setSelectedValue(value);
        console.log(value)
    }, [value])
    
    
    const handleOpen = async () => {
        if(inputValue.length > 2){
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        if(inputValue.length === 0){
            dispatch(deletePartners());
        };
    };

    const handleChange = (newValue) => {
        console.log(newValue)
        onChange(newValue ? newValue : null);
        setSelectedValue(newValue ? newValue : null);
    }

    const debouncedHandleInputChange = useCallback(
        debounce((newInputValue) => {
            if (newInputValue.length > 2) {
                dispatch(fetchPartners({activeCompany,params:{types: types || `{customer,supplier}` ,name: newInputValue}}))
            } else if (newInputValue.length <= 2) {
                dispatch(deletePartners());
            }
        }, 400),
        [dispatch]
    );
    
    const handleInputChange = (newInputValue) => {
        setInputValue(newInputValue);
        debouncedHandleInputChange(newInputValue);
        
    }

    return (
        <Autocomplete
        size='small'
        variant="outlined"
        fullWidth
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={(e, newValue) => handleChange(newValue)}
        onInputChange={(event, newInputValue) => handleInputChange(newInputValue)}
        inputValue={inputValue}
        autoHighlight

        options={partners}
        loading={partnersLoading}
        value={selectedValue}
        isOptionEqualToValue={(option, val) => option.uuid === val.uuid}
        getOptionLabel={(option) =>  option.name || ""}
        renderOption={(props,option) => {
            const { key, ...optionProps } = props;
            return (
                <Typography key={key} variant="body1" sx={{ color: 'text.primary' }} {...optionProps}>
                    {option.name}
                </Typography>
            )
        }}
        renderInput={(params) => (
            <TextField
              {...params}
              label={label || "Autocomplete"}
              variant='outlined'
              placeholder={placeholder || "Type at least 3 characters to search for a partner..."}
            />
        )}
        />
    )
}

export default PartnerSelect
