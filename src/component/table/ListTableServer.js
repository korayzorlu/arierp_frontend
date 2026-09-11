import React, { useCallback, useState, useTransition, useMemo, useEffect } from 'react'
import TableContent from './TableContent'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { DataGridPremium,  unstable_gridDefaultPromptResolver as promptResolver } from '@mui/x-data-grid-premium';
import MUIToolbar from './MUIToolbar';
import { Box, darken, lighten, styled, Typography } from '@mui/material';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { trTR } from '@mui/x-data-grid/locales';
import AriCheckBox from 'component/checkbox/AriCheckBox';

function ListTableServer(props) {
  const {dark,lang} = useSelector((store) => store.auth);
  const {mobile} = useSelector((store) => store.sidebar);

  const dispatch = useDispatch();

  const [isPending, startTransition] = useTransition();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: props.pageSize || 50 })

  useEffect(() => {
    if (props.pageSize !== undefined) {
      setPaginationModel(prev => ({ ...prev, pageSize: props.pageSize }));
    }
  }, [props.pageSize]);

  const [filterParams, setFilterParams] = useState({});
  const [filterModel, setFilterModel] = useState({ items: [], quickFilterValues: [] });

  const [sortModel, setSortModel] = useState([]);

  const debouncedSetParams = useCallback(debounce(props.setParams, 700), []);
  const debouncedSetFilterParams = useCallback(debounce(setFilterParams, 600), []);

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
    //dispatch(setPartnersParams({start:model.page * model.pageSize,end:(model.page+1) * model.pageSize}));
    props.setParams({start:model.page * model.pageSize,end:(model.page+1) * model.pageSize})
  };

  const handleSortModelChange = (model) => {
    setSortModel(model);

    if(model.length > 0){
      props.setParams({"ordering":model.sort === "asc" ? model[0].field : `-${model[0].field}`});
    }
    

    // dispatch(setPartnersParams(
    //   {
    //       ordering:model.length
    //       ?
    //           (
    //               model[0].sort === 'desc'
    //               ?
    //                   `-${model[0].field}`
    //               :
    //                   model[0].field
    //           )
    //       :
    //       ''
    //   }
    // ));
    props.setParams(
      {
        ordering:model.length
        ?
            (
                model[0].sort === 'desc'
                ?
                    `-${model[0].field}`
                :
                    model[0].field
            )
        :
        ''
      }
    );
  };

  const handleFilterModelChange = (model) => {
    //console.log("filter model", model);
    //console.log("--------Start--------");
    setFilterModel(model);
    if(model.quickFilterValues && model.quickFilterValues.length > 0){
      //console.log("1");
      const value = model.quickFilterValues[model.quickFilterValues.length - 1];
      setFilterParams({ ...filterParams, "search[value]": value });
      debouncedSetParams({ "search[value]": value });
    } else if(model.quickFilterValues && model.quickFilterValues.length === 0 && model.items.length > 0){
      //console.log("2");
      const items = model?.items ?? [];
      items.forEach((item) => {
        //console.log("2-1");
        //const isCodeLike = ['code','contract','lease'].includes(item.field);
        const isCodeLike = [].includes(item.field);
        if (item.value) {
          //console.log("2-1-1");
          setFilterParams({
            ...filterParams,
            ...(isCodeLike ? { "search[value]": item.value } : { [item.field]: item.value })
          });
          if (isCodeLike) {
            //console.log("2-1-1-1");
            props.setParams({ "search[value]": item.value });
          } else {
            //console.log("2-1-1-2");
            debouncedSetParams({ [item.field]: item.value });
          }
        } else {
          //console.log("2-1-2");
          if (isCodeLike) {
            //console.log("2-1-2-1");
            props.setParams({ "search[value]": "" });
          } else {
            //console.log("2-1-2-2");
            props.setParams({ [item.field]: "" });
            //setFilterParams(() => {Object.keys(filterParams).forEach(key => {filterParams[key] = ""})})
            setFilterParams(prev => Object.keys(prev).reduce((acc, key) => { acc[key] = ""; return acc; }, {}));
            const emptyParams = Object.keys(filterParams).reduce((acc, key) => {
              acc[key] = "";
              return acc;
            }, {});
            debouncedSetParams(emptyParams);
          }
        };
      });
    } else if(model.items && model.items.length === 0 && model.quickFilterValues.length === 0){
      //console.log("3");
      //setFilterParams(() => {Object.keys(filterParams).forEach(key => {filterParams[key] = ""})})
      setFilterParams(prev => Object.keys(prev).reduce((acc, key) => { acc[key] = ""; return acc; }, {}));
      const emptyParams = Object.keys(filterParams).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});
      debouncedSetParams(emptyParams);
    } else {
      //console.log("4");
      const cleared = {};
      Object.keys(filterParams).forEach(key => { cleared[key] = "" });
      debouncedSetParams(cleared);
    }
    //console.log("--------Finish--------");
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      
    }
  };

  

  const NoRowsOverlay = () => (
    <Box sx={{mt: 2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%'}}>
      <FolderOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></FolderOffIcon>
      <Typography variant='body2' sx={{color:'text.secondary'}}>
        {lang === "tr" ? "Gösterilecek kayıt yok." : "No records to display."}
      </Typography>
    </Box>
  );

  function processPrompt(prompt, context, conversationId) {
    return promptResolver(
      'https://backend.mui.com/api/datagrid/prompt',
      prompt,
      context,
      conversationId,
    );
  }

  const getBackgroundColor = (color, theme, coefficient) => ({
    backgroundColor: darken(color, coefficient),
    ...theme.applyStyles('light', {
      backgroundColor: lighten(color, coefficient),
    }),
  });

  const StyledDataGridPremium = useMemo(() => styled(DataGridPremium)(({ theme }) => ({
    '& .super-app-theme--overdue': {
      ...getBackgroundColor(theme.palette.error.main, theme, 0.7),
      '&:hover': {
        ...getBackgroundColor(theme.palette.error.main, theme, 0.6),
      },
      '&.Mui-selected': {
        ...getBackgroundColor(theme.palette.error.main, theme, 0.5),
        '&:hover': {
          ...getBackgroundColor(theme.palette.error.main, theme, 0.4),
        },
      },
    },
  })), []);

  return (
    <TableContent height={props.height} onKeyDown={handleKeyDown}>
      <StyledDataGridPremium
      slots={{
        toolbar: MUIToolbar,
        baseCheckbox: AriCheckBox,
        ...(props.noOverlay ? {} : { noRowsOverlay: NoRowsOverlay }),
        //aiAssistantPanel: GridAiAssistantPanel,
        headerFilterMenu: null,
        headerFilterCell: DataGrid.HeaderFilterCell,
      }}
      showToolbar
      slotProps={{
          toolbar: {
              showQuickFilter: true,
              children: props.customButtons,
              title: props.title,
              backButton: props.backButton,
              excelOptions: props.excelOptions,
              customFilters: props.customFilters,
              customFiltersLeft: props.customFiltersLeft,
              apiRef: props.apiRef,
              quickFilterProps: {
                quickFilterParser: (searchInput) => searchInput.split(',').map((value) => value.trim()),
                quickFilterFormatter: (quickFilterValues) => quickFilterValues.join(', '),
                debounceMs: 200,
              },
              noDownloadButton: props.noDownloadButton,
              warnings: props.warnings,
          },
          // loadingOverlay: {
          //   variant: 'linear-progress',
          //   noRowsVariant: 'linear-progress',
          // },
          headerFilterCell: {
            showClearIcon: true,
            InputComponentProps: { label: "Filter" }
          },
        }}
      columns={props.columns}
      rows={props.rows}
      getRowId={props.getRowId || ((row) => row.uuid)}
      initialState={{
        ...props.initialState,
        pinnedColumns: mobile ? { left: [] } : props.initialState?.pinnedColumns,
        columns: {
          columnVisibilityModel: props.hiddenColumns,
        },
      }}
      pageSizeOptions={props.pageSizeOptions || [25, 50, 100]}
      pagination
      paginationModel={paginationModel}
      autoPageSize={props.autoPageSize} 
      //onPaginationModelChange={(model) => setPaginationModel(model)}
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      filterModel={props.filterModel}   
      headerFilters={props.headerFilters}
      disableColumnFilter
      onPaginationModelChange={(model) => handlePaginationModelChange(model)}
      sortModel={props.sortModel}
      onSortModelChange={(model) => handleSortModelChange(model)}
      onFilterModelChange={(model) => handleFilterModelChange(model)}
      rowCount={props.rowCount}
      loading={props.loading}
      checkboxSelection={props.checkboxSelection}
      disableRowSelectionOnClick={props.disableRowSelectionOnClick}
      rowSelectionModel={props.rowSelectionModel}
      onRowSelectionModelChange={props.onRowSelectionModelChange}
      isRowSelected={props.isRowSelected}
      keepNonExistentRowsSelected={props.keepNonExistentRowsSelected}
      disableMultipleRowSelection={props.disableMultipleRowSelection}
      apiRef={props.apiRef}
      hideFooter={props.hideFooter}
      autoHeight={props.autoHeight}
      getRowHeight={() => props.autoRowHeight ? 'auto' : 'false'}
      getRowClassName = {props.getRowClassName}
      sx={{
          ...props.sx,
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
              outline: 'none',
          },
          '--DataGrid-overlayHeight': `${props.noOverlay ? "unset" : "50vh"}`,
          [`.${gridClasses['columnHeader--filter']}`]: { px: 1 },
          '& .MuiDataGrid-columnHeader': {
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              overflow: 'visible',
            },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': {
              position: 'sticky',
              left: 8,
            },
          },
          '& .MuiDataGrid-root': {
            border: 1,
            borderColor: dark ? 'rgba(81,81,81,1)' : 'rgba(224,224,224,1)'
          },
          ...(!dark
            ? {
                '& .MuiDataGrid-detailPanel': {
                  backgroundColor: '#ECEAE6',
                },
              }
            : {}
          ),
          ...(props.noAllSelect
            ? {
                '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                  display: 'none'
                }
            }
            : {}
          )
      }}
      //aiAssistant
      //onPrompt={processPrompt}
      excelExportOptions={props.excelExportOptions}
      cellSelection={props.cellSelection}
      ignoreDiacritics
      localeText={{
        ...trTR.components.MuiDataGrid.defaultProps.localeText,
        filterOperatorContains: 'Ara', // "Şunu içerir" yazısını kaldır
        filterPanelInputLabel: "Filtrele", // Global label değişimi
        filterPanelInputPlaceholder: "Aramak için yazın...",
      }}
      onCellClick={props.onCellClick}
      rowSpanning={props.rowSpanning}
      showCellVerticalBorder={props.showCellVerticalBorder}
      showColumnVerticalBorder={props.showColumnVerticalBorder}
      onProcessRowUpdateError={props.onProcessRowUpdateError}
      groupingColDef={props.groupingColDef}
      getDetailPanelContent={props.getDetailPanelContent}
      getDetailPanelHeight={props.getDetailPanelHeight}
      detailPanelExpandedRowIds={props.detailPanelExpandedRowIds}
      onDetailPanelExpandedRowIdsChange={props.onDetailPanelExpandedRowIdsChange}
      processRowUpdate={props.processRowUpdate}
      density={props.density}
      disableVirtualization={props.disableVirtualization}
      />
    </TableContent>
  )
}

export default ListTableServer
