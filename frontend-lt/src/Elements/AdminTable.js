import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {IconButton, InputAdornment, MenuItem, Select, TableFooter, TableHead, TextField} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModalContainer from "./ModalContainer";
import SetGoods from "./froms/SetGoods";
import axios from "axios";

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function AdminTable({rows, marketsList, userList}) {
    const authData = JSON.parse(localStorage.getItem('marketData'))
    const [isEdit, setEdit] = React.useState(false)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState("");
    const [itemDel, setDel] = React.useState("");
    const [data, setData] = React.useState(rows)
    const [idx, setIDX] = React.useState(0)
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setEdit(false)
        setOpen(false);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [market, setMarket] = React.useState('Всі');

    const handleChange = (event) => {
        setMarket(event.target.value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const handlesearch= ()=>{
        let searchList = data.filter( (person)=>
            person.name.toLowerCase().includes(search.toLowerCase())
        )
        if(market !== "Всі"){
            let searcher = data.filter( (person)=>
                person.ownerName.includes(market)
            )
            let result = searcher.filter( (person)=>
                person.name.toLowerCase().includes(search.toLowerCase())
            )
            return (rowsPerPage > 0
                    ? result.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : result
            )
        }
        return (rowsPerPage > 0
                ? searchList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : searchList
        )

    }

    const deleteItem = (el) => {
        let isBoss = window.confirm('Ви дійсно хочете видалити цю інформацію?')
        if (isBoss) {
            axios.post(`${process.env.REACT_APP_API}/api/goods/delete`, el,{
                headers:{
                    'Authorization': `Bearer ${authData.token}`
                }})
            data.splice(data.indexOf(el), 1);
            setDel(el)
        }
    }

    const editItem = (el) => {
        setEdit(true)
        setIDX(data.indexOf(el))
    }

    return (
            <div style={{width: '100%', position: 'relative', marginTop: '60px'}}>
                <div className={'admin__field'}>
                    <TextField variant="outlined"
                               fullWidth
                               sx={{
                                   margin: '15px 0',
                                   fieldset: {borderColor: '#4865c5'}
                               }}
                               onChange={(e) => setSearch(e.target.value)}
                               InputProps={{
                                   startAdornment: (<InputAdornment position="start"><SearchIcon sx={{color: '#4865c5'}}/></InputAdornment>),
                               }}
                    />
                    <Select
                        sx={{color: '#000', ml: '5px'}}
                        value={market}
                        onChange={handleChange}
                    >
                        <MenuItem value={"Всі"}>Всі</MenuItem>
                        {marketsList.map((cur, idx)=><MenuItem key={idx} value={cur}>{cur}</MenuItem>)}
                    </Select>
                </div>
                <ModalContainer open={open} handleClose={handleClose}
                                forms={<SetGoods data={data} handleClose={handleClose} userList={userList} setData={setData} idx={idx} isEdit={isEdit}/>}
                                flag={false}/>
                <TableContainer component={Paper} sx={{boxShadow: '0px 0px 6px 5px rgba(0,0,0,0.1)'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Id</TableCell>
                                <TableCell align="center">Фото</TableCell>
                                <TableCell align="center">Назва</TableCell>
                                <TableCell align="center">Кількість</TableCell>
                                <TableCell align="center">Склад магазину</TableCell>
                                <TableCell align="center"/>
                                <TableCell align="center"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {handlesearch().map((row, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell align="center">
                                            {row._id}
                                        </TableCell>
                                        <TableCell align="center">
                                            <img src={row.path} alt={row.name} width={'50px'}/>
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.score}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.ownerName}
                                        </TableCell>
                                        <TableCell align="center">
                                            <DeleteIcon style={{cursor: 'pointer', color: '#e13d3d'}} onClick={()=>{deleteItem(row)}
                                            } fontSize={'large'}/>
                                        </TableCell>
                                        <TableCell align="center">
                                            <EditIcon style={{cursor: 'pointer', color: '#3d63e1'}} fontSize={'large'}
                                                onClick={()=>{
                                                    editItem(row)
                                                    handleOpen()
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 53 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter sx={{position:'absolute', display: 'flex',
                            alignItems: 'center', flexDirection: 'column', bottom:'-50px', width: '100%'}}>
                            <TableRow>
                                <TablePagination rowsPerPageOptions={[]}
                                                 colSpan={3}
                                                 count={data.length}
                                                 rowsPerPage={rowsPerPage}
                                                 page={page}
                                                 SelectProps={{
                                                     inputProps: {
                                                         'aria-label': 'rows per page',
                                                     },
                                                     native: true,
                                                 }}
                                                 onPageChange={handleChangePage}
                                                 onRowsPerPageChange={handleChangeRowsPerPage}
                                                 ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                        <div className={'admin__add'}>
                            <IconButton onClick={handleOpen}>
                                <AddCircleOutlineIcon fontSize={'large'}/>
                            </IconButton>
                        </div>
                </TableContainer>
            </div>
    )
}