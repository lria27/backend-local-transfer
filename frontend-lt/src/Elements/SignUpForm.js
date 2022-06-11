import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hooks";
import {AuthContext} from "../context/AuthContext";
import ErrorAlert from "./ErrorAlert";
import {Button, TextField} from "@mui/material";

function SingUpForm(){
    const {loading, error, request, clearError} = useHttp()
    const auth = useContext(AuthContext)
    const [toastLists, setToastLists] = useState([]);
    const [form, setForm] = useState({
        name:'', email: '', password: '', confirm: ''
    })

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    useEffect(()=>{
        if(error){
            setToastLists(toastLists.concat(<ErrorAlert text={error} key={toastLists.length} />));
        }
        clearError()
    }, [error, clearError, toastLists])

    const registerHandler = async (e) =>{
        try {
            e.preventDefault()
            const data = await request(`${process.env.REACT_APP_API}/api/auth/register`, 'POST', {...form})
            auth.login(data.token, data.marketId, data.role)
        }catch (e){}
    }

    return(
        <div className={'form'}>
            {toastLists}
            <TextField type="text" placeholder="Назва магазину"
                   onChange={changeHandler}
                   name="name" variant={'outlined'} fullWidth sx={{margin: '10px 0'}}/>
            <TextField type="text" placeholder="Email"
                   onChange={changeHandler}
                   name="email" variant={'outlined'} fullWidth sx={{margin: '10px 0'}}/>
            <TextField type="password" placeholder="Пароль"
                   onChange={changeHandler}
                   name="password" variant={'outlined'} fullWidth sx={{margin: '10px 0'}}/>
            <TextField type="password" placeholder="Підтвердити пароль"
                   onChange={changeHandler}
                   name="confirm" variant={'outlined'} fullWidth  sx={{margin: '10px 0'}}/>
            <Button sx={{borderRadius: '30px', margin: '10px 0', padding: '10px 30px'}} variant={'outlined'} disabled={loading} onClick={registerHandler}>Зареєструватися</Button>
        </div>
    )
}

export default SingUpForm;
