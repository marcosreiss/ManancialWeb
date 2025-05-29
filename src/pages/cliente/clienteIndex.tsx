import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton,
    TextField,
    Button,
    Stack,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface Cliente {
    cnpj: string;
    razaoSocial: string;
}

const clientesMock: Cliente[] = [
    { cnpj: '07.376.385/0001-35', razaoSocial: 'SDB BOMBONIERE LTDA – ME' },
    { cnpj: '52.659.679/0001-29', razaoSocial: 'PAES E DOCES TRIGONELA LTDA – EPP' },
];

export default function ClienteIndex() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredClientes = clientesMock.filter(cliente =>
        cliente.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
        cliente.cnpj.includes(search)
    );

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Cadastro de Clientes e Fornecedores
            </Typography>

            <Paper elevation={2} sx={{ borderRadius: 4, p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel id="rows-per-page">Exibir</InputLabel>
                        <Select
                            labelId="rows-per-page"
                            value={rowsPerPage}
                            label="Exibir"
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            {[5, 10, 25].map((num) => (
                                <MenuItem key={num} value={num}>{num}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        label="Pesquisar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button variant="contained" color="success">
                        + Incluir
                    </Button>
                </Stack>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>CNPJ</strong></TableCell>
                                <TableCell><strong>Razão Social</strong></TableCell>
                                <TableCell align="right"><strong>Ações</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClientes
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((cliente, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{cliente.cnpj}</TableCell>
                                        <TableCell>{cliente.razaoSocial}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <IconButton color="primary" size="small">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton color="error" size="small">
                                                    <Delete />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredClientes.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Resultados por página"
                />
            </Paper>
        </Box>
    );
}
