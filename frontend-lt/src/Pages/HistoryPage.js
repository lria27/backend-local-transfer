import React, {useEffect, useState} from "react";
import Header from "../Elements/Header";
import HistoryTable from "../Elements/HistoryTable";
import axios from "axios";

function HistoryPage({AuthVisible, role}) {
    const [historyData, setHistory] = useState('')
    const [loading, setLoading] = useState(false)
    const authData = JSON.parse(localStorage.getItem('marketData'))

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API}/api/history/${role}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authData.token}`
            }
        }).then((r)=>{
            setHistory(r.data)
            setLoading(true)
        })
    }, [])
    if(loading){
        if(role === 'market') {
            return (
                <>
                    <Header AuthVisible={AuthVisible}/>
                    <div className={'admin'}>
                        <HistoryTable rows={historyData} head={['Дата транзакції', 'Отримувач', 'Назва товару', 'Кількість']}/>
                    </div>
                </>
            )
        }else {
            return (
                <>
                    <Header AuthVisible={AuthVisible}/>
                    <div className={'admin'}>
                        <HistoryTable rows={historyData} head={['Дата транзакції', 'Відправник', 'Отримувач', 'Назва товару', 'Кількість']}/>
                    </div>
                </>
            )
        }
    }
}

export default HistoryPage
