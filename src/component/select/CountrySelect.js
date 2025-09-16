import { Autocomplete, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function CountrySelect(props) {
    const {emptyValue,label, value, onChange, isPhoneCountry} = props;

    const {countries,countriesLoading} = useSelector((store) => store.data);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    
    const handleOpen = async () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        //dispatch(deleteCountries());
    };

    const handleChange = (newValue) => {
        onChange(newValue ? newValue.iso2 : 0);
        setSelectedValue(newValue ? newValue : null);
    }

    useEffect(() => {
        setSelectedValue(countries.find((country) => country.iso2 === value));
    }, [countries])
    

    return (
        // <FormControl size="small" variant="outlined" fullWidth>
        //     <Select
        //         onChange={(e) => {onChange(e.target.value);setSelectedValue(e.target.value)}}
        //         defaultValue={0}
        //         value={selectedValue || 0}
        //     >   
        //         {
        //             emptyValue
        //             ?
        //             <MenuItem value={0} className='d-flex justify-content-start'>
        //                 <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        //                     -- Select Country --
        //                 </Typography>
        //             </MenuItem>
        //             :
        //             <></>
        //         }
        //         {
        //             countries.map((country,index) => {
        //                 return <MenuItem key={index} value={country.iso2} className='d-flex justify-content-start'>
        //                             {/* <img className='me-2' src={country.flag} alt="" height={16} width={24} loading='lazy'/> */}
        //                                 <Typography variant="body1" sx={{ color: 'text.primary' }}>
        //                                     {country.emoji} {country.name}
        //                                 </Typography>
        //                         </MenuItem>
        //             })
        //         }
        //     </Select>
        // </FormControl>

        <Autocomplete
        size='small'
        variant="outlined"
        fullWidth
        options={countries}
        open={open}
        loading={countriesLoading}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={(e, newValue) => handleChange(newValue)}
        value={selectedValue}
        isOptionEqualToValue={(option, val) => option.iso2 === val.iso2}
        autoHighlight
        getOptionLabel={(option) =>  {
            return  (
                isPhoneCountry
                ?
                    `${option.emoji} (${option.dialCode}) ${option.name} - ${option.iso2}`
                :
                    `${option.emoji} ${option.name}`
            )
        }}
        renderOption={(props,option) => {
            const { key, ...optionProps } = props;
            return (
                isPhoneCountry
                ?
                    <Typography key={key} variant="body1" sx={{ color: 'text.primary' }} {...optionProps}>
                        {option.emoji} ({option.dialCode}) {option.name} - {option.iso2}
                    </Typography>
                :
                    <Typography key={key} variant="body1" sx={{ color: 'text.primary' }} {...optionProps}>
                        {option.emoji} {option.name}
                    </Typography>
            )
            
        }}
        renderInput={(params) => (
            <TextField
              {...params}
              label={label || "Ülke"}
              variant='outlined'
              placeholder='Bir ülke seçin'
            />
          )}
        />
    )
}

export default CountrySelect
