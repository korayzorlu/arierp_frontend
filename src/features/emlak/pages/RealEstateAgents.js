import React, { useEffect, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRealEstateAgents, setRealEstateAgentsParams } from 'store/slices/emlak/realEstateAgentSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'static/css/Installments.css';
import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';

function RealEstateAgents() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {realEstateAgents,realEstateAgentsCount,realEstateAgentsParams,realEstateAgentsLoading} = useSelector((store) => store.realEstateAgent);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchRealEstateAgents({activeCompany,params:realEstateAgentsParams}));
            //dispatch(fetchProjects({activeCompany,params:projectsParams}));
        });
    }, [activeCompany,realEstateAgentsParams,dispatch]);

    const columns = [
        { field: 'name', headerName: 'İsim', width:120 },
        { field: 'phone_number_1', headerName: 'Tel. No 1', width:120 },
        { field: 'phone_number_2', headerName: 'Tel. No 2', width:120 },
        { field: 'url', headerName: 'İlan Sayfası', flex:1 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Emlakçı Listesi"
            rows={realEstateAgents}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={realEstateAgentsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchRealEstateAgents({activeCompany,params:realEstateAgentsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={realEstateAgentsCount}
            // checkboxSelection
            setParams={(value) => dispatch(setRealEstateAgentsParams(value))}
            // //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            noDownloadButton
            apiRef={apiRef}
            autoRowHeight
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
            }}
            />
        </PanelContent>
    )
}

export default RealEstateAgents
