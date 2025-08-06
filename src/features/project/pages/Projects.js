import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, resetProjectsParams, setProjectsLoading, setProjectsParams } from '../../../store/slices/projects/projectSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGridApiRef } from '@mui/x-data-grid-premium';

function Projects() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {projects,projectsCount,projectsParams,projectsLoading} = useSelector((store) => store.project);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchProjects({activeCompany,params:projectsParams}));
        });
    }, [activeCompany,projectsParams,dispatch]);

    const columns = [
        { field: 'name', headerName: 'Proje İsmi' },
        { field: 'partner_name', headerName: 'Satıcı' },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Proje Listesi"
            autoHeight
            rows={projects}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={projectsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchProjects({activeCompany,params:projectsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={projectsCount}
            checkboxSelection
            setParams={(value) => dispatch(setProjectsParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default Projects
