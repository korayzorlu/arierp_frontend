import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { gridFilterModelSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid-premium';
import React, { useCallback, useMemo } from 'react'

const getDefaultFilter = (field) => ({ field, operator: 'is' });

function SelectHeaderFilter(props) {
    const { colDef, label, value: externalValue, options, changeValue, isServer } = props;
    const apiRef = useGridApiContext();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const currentFieldFilters = useMemo(
        () => filterModel.items?.filter(({ field }) => field === colDef.field),
        [colDef.field, filterModel.items],
    );

    const handleChange = useCallback(
        (event) => {
            if(!isServer){
                return event.target.value
            }

            if (!event.target.value) {
                if (currentFieldFilters[0]) {
                    apiRef.current.deleteFilterItem(currentFieldFilters[0]);
                }
                return;
            }
            apiRef.current.upsertFilterItem({
                ...(currentFieldFilters[0] || getDefaultFilter(colDef.field)),
                value: event.target.value,
            });
            if (changeValue){
                changeValue(event.target.value);
            }
           
        },
        [apiRef, colDef.field, currentFieldFilters],
    );

    // Use externalValue if provided, otherwise use filter model value
    const value = externalValue !== undefined ? externalValue : (currentFieldFilters[0]?.value ?? '');

    return (
        <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel id="select-is-admin-label" shrink>
                {label}
            </InputLabel>
            <Select
                labelId="select-is-admin-label"
                id="select-is-admin"
                value={value}
                onChange={handleChange}
                label={label}
                inputProps={{ sx: { fontSize: 14 } }}
                notched
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectHeaderFilter
