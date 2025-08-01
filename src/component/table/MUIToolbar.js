import { Badge, Box, Divider, Grid, IconButton, InputAdornment, styled, TextField, Tooltip, Typography } from '@mui/material';
import { ColumnsPanelTrigger, ExportCsv, ExportPrint, FilterPanelTrigger, QuickFilter, QuickFilterClear, QuickFilterControl, QuickFilterTrigger, Toolbar, ToolbarButton, AiAssistantPanelTrigger, ExportExcel, GridToolbarQuickFilter, useGridApiContext, PivotPanelTrigger } from '@mui/x-data-grid-premium'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import CustomTableButton from './CustomTableButton';
import AssistantIcon from '@mui/icons-material/Assistant';
import AndroidSwitch from '../switch/AndroidSwitch';

function MUIToolbar(props) {
  const {children,title,backButton,excelOptions,customFilters,customFiltersLeft,noToolbarButtons,noDownloadButton,specialButtons} = props;

  const {dark} = useSelector((store) => store.auth);
  const {mobile} = useSelector((store) => store.sidebar);

  const navigate = useNavigate();

  const buttonSlotProps = {
    button: {
      color: dark ? "primary" : "blackhole"
    }
  };

  const StyledQuickFilter = styled(QuickFilter)({
    display: 'grid',
    alignItems: 'center',
  });

  const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }));

  const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
  }));


  return (
    // <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem" }}>
    //     <Toolbar/>
    //     {children}
    //     <ToolbarQuickFilter></ToolbarQuickFilter>
    // </div>
    
    // <ToolbarContainer sx={{padding:"0.5rem"}}>
    //   <ToolbarButton slotProps={buttonSlotProps}/>
    //   <ToolbarFilterButton slotProps={buttonSlotProps}/>
    //   <ToolbarDensitySelector slotProps={buttonSlotProps}/>
    //   <ToolbarExport slotProps={buttonSlotProps}/>
    //   {children}
    //   <Box sx={{ flexGrow: 1 }} />
      
    //   <ToolbarQuickFilter></ToolbarQuickFilter>
    // </ToolbarContainer>


    <Toolbar sx={{padding:"0.5rem",flexDirection: mobile ? 'column' : 'row',justifyContent:'space-between'}}>
      <Grid
      container
      sx={{
        justifyContent: "space-between",
        width: "100%"
      }}
      direction="column"
      >
        <Grid
        container direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
        >
          <Grid container spacing={0} sx={{alignItems:'center',justifyContent:'space-between',width:mobile ? '100%' : 'unset'}}>
      
            {
              backButton
              ?
                <CustomTableButton
                title="Back"
                onClick={() => navigate(-1)}
                icon={<ArrowBackIosNewIcon fontSize="small"/>}
                sx={{marginRight:4}}
                />
              :
                null
            }

            <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5, textAlign:mobile ? 'end' : 'unset' }}>
              {title}
            </Typography>
          </Grid>

          <Grid display={noToolbarButtons ? 'none' : 'flex'} container spacing={0}>
            <Tooltip title="Sütunlar">
              <ColumnsPanelTrigger render={<ToolbarButton />} sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}}>
                <ViewColumnIcon fontSize="small" />
              </ColumnsPanelTrigger>
            </Tooltip>

            <Tooltip title="Filtreler">
              <FilterPanelTrigger
                render={(props, state) => (
                  <ToolbarButton {...props} color="default">
                    <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                      <FilterListIcon fontSize="small" />
                    </Badge>
                  </ToolbarButton>
                )}
                sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}}
              />
            </Tooltip>

            <Tooltip title="Pivot">
              <PivotPanelTrigger render={<ToolbarButton />} sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}}>
                <PivotTableChartIcon fontSize="small" />
              </PivotPanelTrigger>
            </Tooltip>
              
            {/* <Tooltip title="AI Asistanı">
              <AiAssistantPanelTrigger render={<ToolbarButton />} sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}}>
                <AssistantIcon fontSize="small" />
              </AiAssistantPanelTrigger>
            </Tooltip> */}

            {
              noDownloadButton
              ?
                null
              :
                <Tooltip title="Exel İndir">
                  <ExportExcel render={<ToolbarButton />}  sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}} options={excelOptions}>
                    <FileDownloadIcon fontSize="small" />
                  </ExportExcel>
                </Tooltip>
            }
            

            <Tooltip title="Yazdır">
              <ExportPrint render={<ToolbarButton />}  sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}}>
                <PrintIcon fontSize="small" />
              </ExportPrint>
            </Tooltip>

            {children}

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
            {/* <GridToolbarQuickFilter></GridToolbarQuickFilter> */}
            <StyledQuickFilter
            parser={(searchInput) => searchInput.split(',').map((value) => value.trim())}
            formatter={(quickFilterValues) => quickFilterValues.join(', ')}
            debounceMs={200}
            >
              <QuickFilterTrigger
                render={(triggerProps, state) => (
                  <Tooltip title="Ara" enterDelay={0}>
                    <StyledToolbarButton
                      {...triggerProps}
                      ownerState={{ expanded: state.expanded }}
                      color="default"
                      aria-disabled={state.expanded}
                    >
                      <SearchIcon fontSize="small" />
                    </StyledToolbarButton>
                  </Tooltip>
                )}
                sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}}
              />
              <QuickFilterControl
                render={({ ref, ...controlProps }, state) => (
                  <StyledTextField
                    {...controlProps}
                    ownerState={{ expanded: state.expanded }}
                    inputRef={ref}
                    aria-label="Search"
                    placeholder="Search..."
                    size="small"
                    autoFocus={true}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: state.value ? (
                          <InputAdornment position="end">
                            <QuickFilterClear
                              edge="end"
                              size="small"
                              aria-label="Clear search"
                              material={{ sx: { marginRight: -0.75 } }}
                            >
                              <CancelIcon fontSize="small" />
                            </QuickFilterClear>
                          </InputAdornment>
                        ) : null,
                        ...controlProps.slotProps?.input,
                      },
                      ...controlProps.slotProps,
                    }}
                  />
                )}
                sx={{color: dark ? 'whitehole.main' : 'blackhole.main'}}
              />
            </StyledQuickFilter>
          </Grid>

          {
            specialButtons
            ?
              <Grid container spacing={0}>
                {specialButtons}
              </Grid>
            :
            null

          }

        </Grid>
        <Grid
        container direction="row"
        sx={{
          justifyContent: "space-between",
        }}
        > 
          <Grid>
            {customFiltersLeft}
          </Grid>
          <Grid>
            {customFilters}
          </Grid>
        </Grid>
      </Grid>
      
    </Toolbar>
    
  )
}

export default MUIToolbar
