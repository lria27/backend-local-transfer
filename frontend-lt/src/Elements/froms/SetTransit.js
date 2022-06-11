import React, {useState} from "react";
import {Button, MenuItem, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from "axios";
import ErrorAlert from "../ErrorAlert";

function SetTransit({userList,handleClose, userData, rows, nameGoods}){
    const authData = JSON.parse(localStorage.getItem('marketData'))
    const [score, setScore] = useState(nameGoods.score)
    const [toastList, setToastList] = useState([]);

    const changeHandlerScore = (event) => {
        if(+event.target.value > 0 && +event.target.value <= nameGoods.score){
            setScore(event.target.value)
        }
    }
    const [market, setMarket] = useState(JSON.stringify(userList[0]))
    const changeHandlerMarket = (event) => {
        setMarket(event.target.value)
    }
    const TransitItem = () => {
        let isBoss = window.confirm('Ви дійсно хочете перемістити даний товар?')
        if (isBoss) {
            if(score === nameGoods.score){
                rows.splice(rows.indexOf(nameGoods), 1);
            }else {
                let change = rows[rows.indexOf(nameGoods)].score
                rows[rows.indexOf(nameGoods)].score = change - score
            }
            axios.post(`${process.env.REACT_APP_API}/api/goods/set-transit`,
            {score: score, market: market, IdGoods: nameGoods._id}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            }).then(r=>{
                handleClose()
            }).catch(error => {
                if (Array.isArray(error.response.data.message)) {
                    setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                              text={error.response.data.message.join(', ')}/>));
                } else {
                    setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                              text={error.response.data.message}/>));
                }
            })
            axios.post(`${process.env.REACT_APP_API}/api/history/add`,
                {score: score, marketTo: market, nameGoods: nameGoods.name}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.token}`
                    }
            }).catch(error => {
                if (Array.isArray(error.response.data.message)) {
                    setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                              text={error.response.data.message.join(', ')}/>));
                } else {
                    setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                              text={error.response.data.message}/>));
                }
            })
        }
    }
    return(
        <div>
            <Box className={'admin__box'}>
                <div>
                    {userData[0].name}
                </div>
                <ArrowRightAltIcon style={{width: '20%', color: '#3b55d7'}} fontSize={'large'}/>
                <Select
                    value={market}
                    onChange={changeHandlerMarket}
                    fullWidth
                    sx={{color: '#000'}}
                >
                    {userList.map((cur, idx)=>(
                        <MenuItem key={idx} value={JSON.stringify(cur)}>{cur.name}</MenuItem>
                    ))}
                </Select>
            </Box>
            <Box className={'admin__box'}>
                <TextField type={'number'} value={score} onChange={changeHandlerScore} name="score" label="Кількість" variant="outlined" fullWidth/>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Button variant="outlined"
                        sx={{borderRadius: '30px', padding: '10px 35px'}}
                        onClick={TransitItem}
                >Перемістити</Button>
            </Box>
        </div>
    )
}

export default SetTransit;
