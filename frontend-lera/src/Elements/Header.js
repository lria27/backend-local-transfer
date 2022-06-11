import React, {useContext} from "react";
import {AppBar, Button, IconButton, useMediaQuery} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import ModalContainer from "./ModalContainer";
import Hamburger from "./Hamburger";

function Header({AuthVisible}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const auth = useContext(AuthContext)
    let navigate = useNavigate()
    const matches768 = useMediaQuery('(min-width:768px)')
    const logoutHandler = async () =>{
        try {
            navigate("/", { replace: true });
            auth.logout()
        }catch (e){}
    }

    if(AuthVisible){
        if(matches768){
            return (
                <AppBar className={'header'} position={'static'} variant={'elevation'} sx={{backgroundColor: 'white'}}>
                    <div>
                        <IconButton>
                            <NavLink to="/">
                                <img alt={"img"} src={'img/logo.png'} width={'40px'}/>
                            </NavLink>
                        </IconButton>
                    </div>
                    <div>
                        <NavLink className={'link'} to={'/history'}>Історія переміщень</NavLink>
                        {auth.role === 'Market'? <NavLink className={'link'} to="/move"> Товари </NavLink> :
                            <NavLink className={'link'} to="/admin"> Панель </NavLink>
                        }
                        <Button onClick={logoutHandler} sx={{borderRadius: '20px'}} variant="outlined">Вийти</Button>
                    </div>
                </AppBar>
            )
        }else{
            return(
                <Hamburger/>
            )
        }
    }else{
        return (
            <AppBar className={'header'} position={'sticky'} variant={'elevation'} sx={{backgroundColor: 'white'}}>
                <div>
                    <IconButton>
                        <NavLink to="/">
                            <img alt={"img"} src={'img/logo.png'} width={'40px'} height={'40px'}/>
                        </NavLink>
                    </IconButton>
                </div>
                <div>
                    <Button onClick={handleOpen} sx={{borderRadius: '20px'}} variant="outlined">Увійти</Button>
                    <ModalContainer handleClose={handleClose} open={open}/>
                </div>
            </AppBar>
        )
    }

}

export default Header
