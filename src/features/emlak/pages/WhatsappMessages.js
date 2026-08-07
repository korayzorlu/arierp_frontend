import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchWhatsappMessages, setWhatsappMessagesLoading, setWhatsappMessagesParams } from 'store/slices/emlak/whatsappMessageSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'static/css/Installments.css';
import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
import { Typography } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddWhatsappMessageDialog from '../components/AddWhatsappMessageDialog';
import { setAddWhatsappMessageDialog, setDeleteDialog } from 'store/slices/notificationSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteDialog from 'component/feedback/DeleteDialog';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WHATSAPP_MESSAGE = 'merhaba test';

function WhatsappMessages() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {whatsappMessages,whatsappMessagesCount,whatsappMessagesParams,whatsappMessagesLoading} = useSelector((store) => store.whatsappMessage);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();
    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set(),
    });

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchWhatsappMessages({activeCompany,params:whatsappMessagesParams}));
            //dispatch(fetchProjects({activeCompany,params:projectsParams}));
        });
    }, [activeCompany,whatsappMessagesParams,dispatch]);

    const columns = [
        { field: 'text', headerName: 'Mesaj', flex:1, renderCell: (params) => (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', py: 1 }}>
                {params.value}
            </Typography>
        ) },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Whatsapp Mesajları Listesi"
            rows={whatsappMessages}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={whatsappMessagesLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Ekle"
                    onClick={() => dispatch(setAddWhatsappMessageDialog(true))}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon fontSize="small"/>}
                    disabled={rowSelectionModel.ids.size > 0 || rowSelectionModel.type === 'exclude' ? false : true}
                    />
                    <CustomTableButton
                    title="Whatsapp Mesajı Gönder"
                    onClick={() => {
                        const selectedRow = rowSelectionModel.type === 'exclude'
                            ? whatsappMessages.find((row) => !rowSelectionModel.ids.has(row.uuid))
                            : whatsappMessages.find((row) => rowSelectionModel.ids.has(row.uuid));
                        const phoneNumber = selectedRow?.phone_number_1?.replace(/\D/g, '');
                        const message = selectedRow?.text || '';
                        if (!phoneNumber) return;
                        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    icon={<WhatsAppIcon fontSize="small"/>}
                    disabled={rowSelectionModel.ids.size > 0 && rowSelectionModel.ids.size < 2 ? false : true}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchWhatsappMessages({activeCompany,params:whatsappMessagesParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={whatsappMessagesCount}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            setParams={(value) => dispatch(setWhatsappMessagesParams(value))}
            disableRowSelectionOnClick
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
            <AddWhatsappMessageDialog/>
            <DeleteDialog
            deleteURL={'/emlak/delete_whatsapp_message/'}
            selectedItems={rowSelectionModel}
            startEvent={() => dispatch(setWhatsappMessagesLoading(true))}
            finalEvent={() => {dispatch(fetchWhatsappMessages({activeCompany,params:whatsappMessagesParams}));dispatch(setWhatsappMessagesLoading(false));}}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default WhatsappMessages
