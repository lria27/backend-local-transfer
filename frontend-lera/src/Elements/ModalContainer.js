import React from "react";
import {Backdrop, Fade, Modal, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import LoginForm from "./LoginForm";
import SingUpForm from "./SignUpForm";

function ModalContainer({handleClose, open, flag = true, forms}){
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const matches510 = useMediaQuery('(min-width:510px)')
    const style = {position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: matches510 ? 500: 300 ,  background: `rgb(255, 255, 255)`, padding: `30px 35px 40px`,
        boxSizing: `border-box`, borderRadius: `20px`
    }
    if(flag){
        return(
            <>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{timeout: 500,}}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList variant={'fullWidth'} sx={{ marginBottom: '20px'}} onChange={handleChange} >
                                        <Tab label="Увійти" value="1" sx={{color: 'rgba(48,41,229,0.8)'}}/>
                                        <Tab label="Реєстрація" value="2" sx={{color: 'rgba(48,41,229,0.8)'}}/>
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <LoginForm/>
                                </TabPanel>
                                <TabPanel value="2">
                                    <SingUpForm/>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Fade>
                </Modal>
            </>
        )
    }else {
        return(
            <>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{timeout: 500}}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            {forms}
                        </Box>
                    </Fade>
                </Modal>
            </>
        )
    }
}

export default ModalContainer;
