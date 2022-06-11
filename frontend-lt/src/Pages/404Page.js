import React from "react";
import Header from "../Elements/Header";
import {Button} from "@mui/material";
import {NavLink} from "react-router-dom";

function Page404({AuthVisible}) {
    return (
        <>
            <Header AuthVisible={AuthVisible} />
            <div className={'container404'}>
                <div className={'page404'}>
                    <span className={'text404'}>
                        404
                    </span>
                    <div className={'gif404'}>
                        <img src={'img/cat.gif'} width={'100%'} alt={'cat404'}/>
                    </div>
                </div>
                <div className={'title404'}>Цієї сторінки не існує!</div>
                <Button sx={{borderRadius: '20px'}} variant={'outlined'}>
                    <NavLink style={{textDecoration: 'none'}} to={'/'}>Головна</NavLink>
                </Button>
            </div>
        </>
    );
}

export default Page404
