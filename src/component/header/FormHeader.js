import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { Button, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

function FormHeader(props) {
    const {
        children,
        disabled,
        loadingAdd,
        disabledAdd,
        onClickAdd,
        loadingSave,
        disabledSave,
        onClickSave,
        loadingDelete,
        disabledDelete,
        onClickDelete,
        title,
        noBackButton,
    } = props;

    const navigate = useNavigate();

    return (
        <Grid
        container
        spacing={0}
        >
            <Grid
            size={4}
            container
            sx={{
                justifyContent: "flex-start",
                alignItems: "center",
            }}
            >   
                {
                    noBackButton
                    ?
                        null
                    :
                        <IconButton aria-label='back' onClick={()=>navigate(-1)}>
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                }
            </Grid>
            <Grid
            size={4}
            container
            sx={{
                justifyContent: "flex-center",
                alignItems: "center",
            }}
            >
                <Typography variant='body1' sx={{textAlign: 'center',width: '100%',color:'text.secondary'}}>
                    {title || ""}
                </Typography>
            </Grid>
            <Grid
            size={4}
            container
            sx={{
                justifyContent: "flex-end",
                alignItems: "center",
            }}
            >
                
                {
                    onClickAdd
                    ?
                    <Button
                    aria-label="add"
                    variant='contained'
                    color="opposite"
                    onClick={() => onClickAdd()}
                    loading={loadingAdd}
                    disabled={disabled || disabledAdd}
                    startIcon={<AddIcon/>}
                    >
                        Oluştur
                    </Button>
                    :
                    <></>
                }

                {
                    onClickSave
                    ?
                    <IconButton
                    aria-label="save"
                    color="opposite"
                    onClick={() => onClickSave()}
                    loading={loadingSave}
                    disabled={disabled || disabledSave}
                    >
                        <SaveIcon/>
                    </IconButton>
                    :
                    <></>
                }

                {
                    onClickDelete
                    ?
                    <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => onClickDelete()}
                    loading={loadingDelete}
                    disabled={disabled || disabledDelete}
                    >
                        <DeleteIcon/>
                    </IconButton>
                    :
                    <></>
                }

            </Grid>
        </Grid>
    )
}

export default FormHeader
