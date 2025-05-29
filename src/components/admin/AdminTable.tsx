import {
    Checkbox,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import type { Admin } from '@/models/adminModel';

interface Props {
    admins: Admin[];
    selected: Admin[];
    loading: boolean;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (admin: Admin) => void;
    onMenuOpen: (e: React.MouseEvent<HTMLElement>, admin: Admin) => void;
}

export default function AdminTable({
    admins,
    selected,
    loading,
    onSelectAll,
    onSelectOne,
    onMenuOpen,
}: Props) {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ height: '60vh', backgroundColor: 'white' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={selected.length === admins.length && admins.length > 0}
                                onChange={onSelectAll}
                            />
                        </TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {admins.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                Nenhum admin encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        admins.map((admin) => (
                            <TableRow
                                key={admin.id}
                                hover
                                sx={{
                                    backgroundColor: selected.some((s) => s.id === admin.id)
                                        ? 'rgba(59, 130, 246, 0.1)'
                                        : undefined,
                                    '&:hover': {
                                        backgroundColor: selected.some((s) => s.id === admin.id)
                                            ? 'rgba(59, 130, 246, 0.15)'
                                            : '#f9fafb',
                                    },
                                }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.some((s) => s.id === admin.id)}
                                        onChange={() => onSelectOne(admin)}
                                    />
                                </TableCell>
                                <TableCell>{admin.fullName}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>{admin.cpf}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={(e) => onMenuOpen(e, admin)}>
                                        <MoreVert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
