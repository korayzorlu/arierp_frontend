import { Box } from "@mui/material";
import { useState } from "react";

function TableContent(props) {
    const {children,width,height,onKeyDown} = props;

    return ( 
        <Box
        sx={{width:width ? width : "100%",height:height ? height : "calc(100vh - 75px)",overflow:"auto"}}
        onKeyDown={onKeyDown}
        >
            {children}
        </Box>
    );
}

export default TableContent;