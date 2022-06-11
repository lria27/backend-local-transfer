import React, {useState} from "react";
import {Button, MenuItem,Input, styled,  Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import NumbersIcon from '@mui/icons-material/Numbers';
import StorefrontIcon from '@mui/icons-material/Storefront';
import axios from "axios";
import DownloadIcon from '@mui/icons-material/Download';
import ErrorAlert from "../ErrorAlert";

function SetGoods({setData, data, idx, isEdit, handleClose, userList}){
    const Input = styled('input')({
        display: 'none',
    });
    const [img, setImg] = React.useState(null)
    const handleInputChange = (event)=> {
        setImg(event.target.files[0])
    }
    const authData = JSON.parse(localStorage.getItem('marketData'))
    const [name, setName] = useState(!isEdit?'':data[idx].name)
    const changeHandlerName = (event) => {
        setName(event.target.value)
    }
    const [toastList, setToastList] = useState([]);
    const [score, setScore] = useState(!isEdit?1:data[idx].score)
    const changeHandlerScore = (event) => {
        if(+event.target.value > 0){
            setScore(event.target.value)
        }
    }

    const [market, setMarket] = useState(!isEdit?JSON.stringify(userList[0]):
        JSON.stringify(userList.filter((mark)=>{
            return mark.name === data[idx].ownerName
        })[0]))

    const changeHandlerMarket = (event) => {
        setMarket(event.target.value)
    }

    const addItem = () => {
        let isBoss = window.confirm('Ви дійсно хочете додати цю інформацію?')
        if (isBoss) {
            if(img){
                axios.post(`${process.env.REACT_APP_API}/api/goods/add`, {
                        ownerId: JSON.parse(market)._id, name: name, score: score, ownerName: JSON.parse(market).name
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    }).then(r => {
                    const formData = new FormData();
                    formData.append('file', img);
                    formData.append('id', r.data.result._id)
                    axios.post(`${process.env.REACT_APP_API}/api/goods/upload`, formData,  {
                        headers: { 'content-type': 'multipart/form-data' }
                    })
                    const newItem = {
                        _id: r.data.result._id,
                        ownerName: JSON.parse(market).name,
                        name: name,
                        path: URL.createObjectURL(img),
                        score: score,
                    }
                    const newItems = [...data, newItem]
                    setData(newItems)
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
            }else {
                setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                          text={"Будь ласка додайте зображення продуку"}/>));
            }
        }
    }

    const editItem = () => {
        let isBoss = window.confirm('Ви дійсно хочете додати цю інформацію?')
        if (isBoss) {
            if(img){
                axios.post(`${process.env.REACT_APP_API}/api/goods/set-data`,{
                        ownerId: JSON.parse(market)._id, name: name, score: score, ownerName: JSON.parse(market).name, _id: data[idx]._id},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    }).then(res=>{
                            const formData = new FormData();
                            formData.append('file', img);
                            formData.append('id', res.data._id)
                            axios.post(`${process.env.REACT_APP_API}/api/goods/upload`, formData,  {
                                headers: { 'content-type': 'multipart/form-data' }
                            })
                            data[idx].name = name
                            data[idx].score = score
                            data[idx].path = URL.createObjectURL(img)
                            data[idx].ownerName = JSON.parse(market).name
                        handleClose()
                }).catch(error => {
                    if(Array.isArray(error.response.data.message)){
                        setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                                  text={error.response.data.message.join(', ')}/>));
                    }else {
                        setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                                  text={error.response.data.message}/>));
                    }
                })
            }else{
                axios.post(`${process.env.REACT_APP_API}/api/goods/set-data`,{
                        ownerId: JSON.parse(market)._id, name: name, score: score, ownerName: JSON.parse(market).name, _id: data[idx]._id},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    }).then(res=>{
                    data[idx].name = name
                    data[idx].score = score
                    data[idx].ownerName = JSON.parse(market).name
                    handleClose()
                }).catch(error => {
                    if(Array.isArray(error.response.data.message)){
                        setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                                  text={error.response.data.message.join(', ')}/>));
                    }else {
                        setToastList(toastList.concat(<ErrorAlert key={toastList.length}
                                                                  text={error.response.data.message}/>));
                    }
                })
            }
        }
    }

    return(
        <div>
            {toastList}
            <Box className={'admin__box'}>
                <DriveFileRenameOutlineOutlinedIcon sx={{mr: 1.5, my: 0.4, color: '#8492e8'}}/>
                <TextField name="name" onChange={changeHandlerName} value={name} label="Назва товару" variant="outlined" fullWidth/>
            </Box>
            <Box className={'admin__box'}>
                <NumbersIcon sx={{mr: 1.5, my: 0.4, color: '#8492e8'}}/>
                <TextField type={'number'} name="score" onChange={changeHandlerScore}
                           value={score} label="Кількість" variant="outlined" fullWidth/>
            </Box>
            <Box className={'admin__box'}>
                <StorefrontIcon sx={{mr: 1.5, my: 0.4, color: '#8492e8'}}/>
                <Select
                    fullWidth
                    sx={{color: '#000'}}
                    value={market}
                    onChange={changeHandlerMarket}
                >
                    {userList.map((cur, idx)=><MenuItem key={idx} value={JSON.stringify(cur)}>{cur.name}</MenuItem>)}
                </Select>
            </Box>
            <Box className={'admin__box'} sx={{ml: 1.5}}>
                <label htmlFor="contained-button-file">
                    <Input accept="image/*" onChange={handleInputChange} id="contained-button-file" multiple type="file" />
                    <Button variant="outlined" component="span" startIcon={<DownloadIcon style={{color: '#8492e8'}}/>}>
                        Загрузити фото
                    </Button>
                </label>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Button variant="outlined"
                        sx={{borderRadius: '30px', padding: '10px 35px'}}
                        onClick={
                            ()=>{
                                if(isEdit){
                                    editItem()
                                }
                                else {
                                    addItem()
                                }
                            }}
                >
                    {isEdit?'Змінити': 'Додати'}
                </Button>
            </Box>
        </div>
    )
}

export default SetGoods;
