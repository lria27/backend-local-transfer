import React from "react";
import { Snackbar} from "@mui/material";
import {Alert} from "@mui/lab";

function ErrorAlert({text}){
    const [open, setOpen] = React.useState(true);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return(
        <Snackbar open={open} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
                  autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="info" sx={{ width: '100%', margin: 'auto' }}>
                {text}
            </Alert>
        </Snackbar>
    )
}

export default ErrorAlert;
