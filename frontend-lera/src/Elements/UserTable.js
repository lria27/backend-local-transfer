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
import {Button, InputAdornment, TableFooter, TableHead, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TransitEnterexitIcon from '@mui/icons-material/TransitEnterexit';
import ModalContainer from "./ModalContainer";
import SetTransit from "./froms/SetTransit";

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function UserTable({rows, userList, userData}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState("");
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const [nameGoods, setNameGoods] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const handlesearch= ()=>{
        let searchList = rows.filter( (person)=>
            person.name.toLowerCase().includes(search.toLowerCase())
        )
        return (rowsPerPage > 0
                ? searchList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : searchList
        )

    }
    const handlerTransit = (row) => {
        setNameGoods(row)
        handleOpen()
    }
    return (
        <div style={{width: '100%', position: 'relative', marginTop: '60px'}}>
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
            <ModalContainer open={open} handleClose={handleClose}
                            forms={<SetTransit handleClose={handleClose} rows={rows} userData={userData} nameGoods={nameGoods} userList={userList}/>}
                            flag={false}/>
            <TableContainer component={Paper} sx={{boxShadow: '0px 0px 6px 5px rgba(0,0,0,0.1)'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">Назва товару</TableCell>
                            <TableCell align="center">Фото</TableCell>
                            <TableCell align="center">Кількість</TableCell>
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
                                    {row.name}
                                </TableCell>
                                <TableCell align='center'>
                                    <img src={row.path} alt={row.name} width={'50px'}/>
                                </TableCell>
                                <TableCell align="center">
                                    {row.score}
                                </TableCell>
                                <TableCell align="center">
                                    <Button onClick={()=>{
                                        handlerTransit(row)
                                    }} variant={'outlined'}>
                                        <TransitEnterexitIcon/>
                                        Перемістити
                                    </Button>
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
                                             count={rows.length}
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
            </TableContainer>
        </div>
    )
}