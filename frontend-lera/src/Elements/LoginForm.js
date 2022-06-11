import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hooks";
import {AuthContext} from "../context/AuthContext";
import ErrorAlert from "./ErrorAlert";
import {Button, TextField} from "@mui/material";

function LoginForm(){
    const {loading, error, request, clearError} = useHttp()
    const auth = useContext(AuthContext)
    const [toastList, setToastList] = useState([]);
    const [form, setForm] = useState({
        email: '', password: ''
    })

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    useEffect(()=>{
        if(error){
            setToastList(toastList.concat(<ErrorAlert text={error} key={toastList.length}/>));
        }
        clearError()
    }, [error, clearError, toastList])

    const loginHandler = async (e) =>{
        try {
            e.preventDefault()
            const data = await request(`${process.env.REACT_APP_API}/api/auth/login`, 'POST', {...form})
            auth.login(data.token, data.marketId, data.role)
        }catch (e){}
    }

    return(
        <div className={'form'}>
            {toastList}
            <TextField variant={'outlined'} fullWidth onChange={changeHandler} sx={{margin: '10px 0'}} type="text" placeholder="Email" name={'email'} id="email"/>
            <TextField variant={'outlined'} fullWidth onChange={changeHandler} sx={{margin: '10px 0'}} type="password" placeholder="Пароль" name={'password'} id="password"/>
            <Button  sx={{borderRadius: '30px', margin: '10px 0', padding: '10px 30px'}} variant={'outlined'} disabled={loading} onClick={loginHandler}>Увійти</Button>
        </div>
    )
}

export default LoginForm;
