import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setCategoriesLoading, setCategoriesParams } from '../../../../store/slices/products/categorySlice';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../../component/panel/PanelContent';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../../store/slices/processSlice';
import ImportDialog from '../../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import KeyIcon from '@mui/icons-material/Key';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CustomTreeItem from '../../../../component/tree/CustomTreeItem';
import { Button, Divider, Grid, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCategory from '../components/AddCategory';

function Categories() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {categories,categoriesCount,categoriesParams,categoriesLoading} = useSelector((store) => store.category);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchCategories({activeCompany,params:categoriesParams}));
        });
    }, [activeCompany,categoriesParams,dispatch]);

    const columns = [
        { field: 'name', headerName: 'Name', width: 400, editable: true, renderCell: (params) => (
                <Link
                to={`/products/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/products/delete_all_products/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            {/* <ListTableServer
            rows={categories}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={categoriesLoading}
            customButtons={
                <>
                    <CustomTableButton onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}} icon={<UploadFileIcon/>} children="IMPORT"/>
                    <CustomTableButton
                    link="/products/add-category"
                    icon={<AddBoxIcon/>}
                    disabled={activeCompany ? false : true}
                    children="NEW"
                    />
                    <CustomTableButton
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon/>}
                    disabled={categories.length > 0 ? false : true}
                    children="DELETE"
                    />
                    <CustomTableButton
                    onClick={() => dispatch(fetchCategories({activeCompany,params:categoriesParams})).unwrap()}
                    icon={<RefreshIcon/>}
                    children="RELOAD"
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={categoriesCount}
            checkboxSelection
            setParams={(value) => dispatch(setCategoriesParams(value))}
            ></ListTableServer>
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/products/categories_template"
            importURL="/products/import_categories/"
            startEvent={() => dispatch(setCategoriesLoading(true))}
            finalEvent={() => {dispatch(fetchCategories({activeCompany}));dispatch(setCategoriesLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/products/delete_category/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setCategoriesLoading(true))}
            finalEvent={() => {dispatch(fetchCategories({activeCompany}));dispatch(setCategoriesLoading(false));}}
            /> */}
            <Stack spacing={2}>
                <Grid container spacing={1}>

                    <Grid size={{xs:12,sm:6}}>
                        <Paper elevation={0} sx={{p:2,height: '100%'}} square>
                            <Stack spacing={2}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs:12,sm:12}}>
                                        <SimpleTreeView defaultExpandedItems={['grid']}>
                                            <CustomTreeItem itemId="grid" label="Data Grid">
                                                <CustomTreeItem itemId="grid-community" label="@mui/x-data-grid" />
                                                <CustomTreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
                                                <CustomTreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
                                            </CustomTreeItem>
                                            <CustomTreeItem itemId="pickers" label="Date and Time Pickers">
                                                <CustomTreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
                                                <CustomTreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
                                            </CustomTreeItem>
                                            <CustomTreeItem itemId="charts" label="Charts">
                                                <CustomTreeItem itemId="charts-community" label="@mui/x-charts" />
                                                <CustomTreeItem itemId="chartss" label="Charts">
                                                    <CustomTreeItem itemId="chartsdf-community" label="@mui/x-charts" />
                                                </CustomTreeItem>
                                            </CustomTreeItem>
                                            <CustomTreeItem itemId="tree-view" label="Tree View">
                                                <CustomTreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
                                            </CustomTreeItem>
                                            {
                                                categories.map((category,index) => {
                                                    return (
                                                        <CustomTreeItem
                                                        key={category.uuid}
                                                        itemId={index}
                                                        label={category.name}
                                                        onClick={() => navigate(`/categories/update/${category.uuid}`)}
                                                        />
                                                    )
                                                })
                                            }
                                            <Button
                                            variant='text'
                                            color='mars'
                                            size='small'
                                            startIcon={<AddCircleIcon/>}
                                            sx={{pl:1,justifyContent: 'flex-start'}}
                                            onClick={() => navigate("/categories/add-category")}
                                            fullWidth
                                            >
                                                New
                                            </Button>
                                        </SimpleTreeView>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid size={{xs:12,sm:6}}>
                        <Paper elevation={0} sx={{p:6,height: '100%'}} square>
                            <Stack spacing={2}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs:12,sm:12}}>
                                        <Outlet/>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Paper>
                    </Grid>

                </Grid>
            </Stack>
        </PanelContent>
    )
}

export default Categories
