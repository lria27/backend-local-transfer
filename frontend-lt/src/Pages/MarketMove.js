import React, {useEffect, useState} from "react";
import Header from "../Elements/Header";
import axios from "axios";
import UserTable from "../Elements/UserTable";

function MarketMove({AuthVisible}) {
    const [content, setContent] = useState('')
    const [userList, setList] = useState('')
    const [userData, setData] = useState('')
    const [loading, setLoading] = useState(false)
    const authData = JSON.parse(localStorage.getItem('marketData'))
    useEffect(()=>{
        axios.all([
            axios.get(`${process.env.REACT_APP_API}/api/goods/market-goods`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            }),
            axios.get(`${process.env.REACT_APP_API}/api/auth/data`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            }),
            axios.get(`${process.env.REACT_APP_API}/api/auth/all`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            })
        ]).then(axios.spread(( all, userData,users) => {
            setContent(all.data)
            setData(userData.data)
            setList(users.data.filter((e)=>
                !e.name.includes(userData.data[0].name)
            ))
            setLoading(true)
        }));
    }, [])
    if(loading){
        return (
                <>
                    <Header AuthVisible={AuthVisible}/>
                    <div className={'admin'}>
                        <UserTable rows={content} userData={userData} userList={userList}/>
                    </div>
                </>
            );

    }
}

export default MarketMove
