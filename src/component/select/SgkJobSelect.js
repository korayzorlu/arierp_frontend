import { Autocomplete, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCities } from '../../store/slices/dataSlice';
import { deletePartners, fetchPartners } from '../../store/slices/partners/partnerSlice';
import { debounce } from 'lodash';
import { deleteSgkJobs, fetchSgkJobs, fetchSgkJobsForSelect } from 'store/slices/partners/sgkJobSlice';
import axios from 'axios';

function SgkJobSelect(props) {
    const {emptyValue,label,placeholder, value,types, onChange} = props;
    const {activeCompany} = useSelector((store) => store.organization);
    const {sgkJobs,sgkJobsLoading} = useSelector((store) => store.sgkJob);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        if (value && typeof value !== 'object') {
            axios.get(`/partners/sgk_jobs/?ac=${activeCompany.id}`, {
                params: { sgk_job_code: value },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }).then(response => {
                const items = response.data.data || response.data;
                setSelectedValue(items?.[0] ?? null);
            }).catch(() => setSelectedValue(null));
        } else {
            setSelectedValue(value ?? null);
        }
    }, [value, activeCompany]);

    const handleOpen = async () => {
        if(inputValue.length > 2){
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        if(inputValue.length === 0){
            dispatch(deleteSgkJobs());
        };
    };

    const handleChange = (newValue) => {
        onChange(newValue ? newValue.sgk_job_code : 0);
        setSelectedValue(newValue ? newValue : null);
    }

    const debouncedHandleInputChange = useCallback(
        debounce((newInputValue) => {
            if (newInputValue.length > 2) {
                startTransition(() => {
                    dispatch(fetchSgkJobs({activeCompany, params:{description: newInputValue}}));
                })
            } else if (newInputValue.length <= 2) {
                dispatch(deleteSgkJobs());
            }
        }, 400),
        [dispatch, activeCompany]
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
        options={sgkJobs}
        loading={sgkJobsLoading}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={(e, newValue) => handleChange(newValue)}
        onInputChange={(event, newInputValue) => handleInputChange(newInputValue)}
        value={selectedValue}
        inputValue={inputValue}
        isOptionEqualToValue={(option, val) => option.sgk_job_code === val.sgk_job_code}
        autoHighlight
        getOptionLabel={(option) =>  option.description || ""}
        renderOption={(props,option) => {
            const { key, ...optionProps } = props;
            return (
                <Typography key={key} variant="body1" sx={{ color: 'text.primary' }} {...optionProps}>
                    {option.description} - {option.sgk_job_code}
                </Typography>
            )
        }}
        renderInput={(params) => (
            <TextField
              {...params}
              label={label || "Meslek"}
              variant='outlined'
              placeholder={placeholder || "En az 3 karakter yazarak meslek arayın..."}
            />
        )}
        />
    )
}

export default SgkJobSelect
