import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { gridFilterModelSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid-premium';
import React, { useCallback, useMemo } from 'react'

const getDefaultFilter = (field) => ({ field, operator: 'is' });

function SelectHeaderFilter(props) {
    const { colDef, label, value: externalValue, options, changeValue, isServer, multiple } = props;
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
                //console.log("changeValue", event.target.value)
                changeValue(event.target.value);
            }

        },
        [apiRef, colDef.field, currentFieldFilters],
    );

    // ---- Multiple select mode -------------------------------------------------
    const selectableOptions = useMemo(
        () => options.filter((option) => option.value !== 'all' && option.value !== ''),
        [options],
    );

    const multiValue = useMemo(() => {
        const raw = currentFieldFilters[0]?.value;
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string' && raw) return raw.split(',');
        return [];
    }, [currentFieldFilters]);

    const handleMultiChange = useCallback(
        (event) => {
            const selected = (event.target.value || []).filter((v) => v && v !== 'all');

            if (selected.length === 0) {
                if (currentFieldFilters[0]) {
                    apiRef.current.deleteFilterItem(currentFieldFilters[0]);
                }
                if (changeValue) changeValue('');
                return;
            }

            const joined = selected.join(',');
            apiRef.current.upsertFilterItem({
                ...(currentFieldFilters[0] || getDefaultFilter(colDef.field)),
                value: joined,
            });
            if (changeValue) changeValue(joined);
        },
        [apiRef, colDef.field, currentFieldFilters, changeValue],
    );

    if (multiple) {
        return (
            <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel id={`select-${colDef.field}-label`} shrink>
                    {label}
                </InputLabel>
                <Select
                    labelId={`select-${colDef.field}-label`}
                    id={`select-${colDef.field}`}
                    multiple
                    value={multiValue}
                    onChange={handleMultiChange}
                    label={label}
                    notched
                    inputProps={{ sx: { fontSize: 14 } }}
                    renderValue={(selected) =>
                        selected
                            .map((v) => selectableOptions.find((o) => o.value === v)?.label ?? v)
                            .join(', ')
                    }
                >
                    {selectableOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <Checkbox size="small" checked={multiValue.indexOf(option.value) > -1} />
                            <ListItemText primaryTypographyProps={{ fontSize: 14 }} primary={option.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
    // ------------------------------------------------------------------------

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
