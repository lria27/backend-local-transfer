import React, {useEffect, useState} from "react";
import Header from "../Elements/Header";
import AdminTable from "../Elements/AdminTable";
import axios from "axios";

function AdminPanel({AuthVisible}) {
    const [content, setContent] = useState('')
    const [marketsList, setMarketsList] = useState([])
    const [userList, setList] = useState('')
    const [loading, setLoading] = useState(false)
    const authData = JSON.parse(localStorage.getItem('marketData'))
    useEffect(()=>{
        axios.all([
            axios.get(`${process.env.REACT_APP_API}/api/goods/all`,{
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
        ]).then(axios.spread(( all,users) => {
            setContent(all.data)
            setList(users.data)
            if(all.data) {
                let res = []
                    all.data.map((cur) => {
                        if(!res.includes(cur.ownerName)) res.push(cur.ownerName)
                    })
                setMarketsList(res)
            }
            setLoading(true)
        }));
    }, [])

    if(loading){
        return (
            <>
                <Header AuthVisible={AuthVisible}/>
                <div className={'admin'}>
                    <AdminTable rows={content} marketsList={marketsList} userList={userList}/>
                </div>
            </>
        );
    }
}

export default AdminPanel
