import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlackListPersons, resetBlackListPersonsParams, setBlackListPersonsLoading, setBlackListPersonsParams } from '../../../store/slices/compliance/blackListPersonSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGridApiRef } from '@mui/x-data-grid-premium';

function BlackListPersons() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {blackListPersons,blackListPersonsCount,blackListPersonsParams,blackListPersonsLoading} = useSelector((store) => store.blackListPerson);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [project, setProject] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBlackListPersons({activeCompany,params:{...blackListPersonsParams,project}}));
        });
    }, [activeCompany,blackListPersonsParams,dispatch]);

    const columns = [
        { field: 'name', headerName: 'İsim / Ünvan', flex:1 },
        { field: 'tc_vkn_passport_no', headerName: 'TC/VKN/Pasaport No', flex:1 },
        { field: 'other_names', headerName: 'Bilinen Diğer İsimler', flex:1 },
        { field: 'nationality', headerName: 'Uyruğu', flex:1 },
        { field: 'birthday', headerName: 'Doğum Tarihi', flex:1 },
        { field: 'organization', headerName: 'Örgüt', flex:1 },
        { field: 'date_number', headerName: 'Resmi Gazete Tarih ve Sayısı', flex:1 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Yasaklı Listesi"
            autoHeight
            rows={blackListPersons}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={blackListPersonsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchBlackListPersons({activeCompany,params:blackListPersonsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={blackListPersonsCount}
            setParams={(value) => dispatch(setBlackListPersonsParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default BlackListPersons
