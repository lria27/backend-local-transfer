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
import {InputAdornment, TableFooter, TableHead, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function HistoryTable({rows, head}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState("");
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const handlesearch= ()=>{
        let searchList = rows.filter( (person)=>
            person.goodsName.toLowerCase().includes(search.toLowerCase())
        )
        return (rowsPerPage > 0
                ? searchList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : searchList
        )

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
            <TableContainer component={Paper} sx={{boxShadow: '0px 0px 6px 5px rgba(0,0,0,0.1)'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {head.map((cur, idx)=>(
                                <TableCell key={idx} align="center">{cur}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {handlesearch().map((row, idx) => (
                            <TableRow key={idx} hover>
                                <TableCell align="center">
                                    {new Date(row.dateTransit).toLocaleString()}
                                </TableCell>
                                {head.length === 5?
                                    <TableCell align="center">
                                        {row.fromMarket}
                                    </TableCell>:''
                                }
                                <TableCell align="center">
                                    {row.toMarket}
                                </TableCell>
                                <TableCell align="center">
                                    {row.goodsName}
                                </TableCell>
                                <TableCell align="center">
                                    {row.score}
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