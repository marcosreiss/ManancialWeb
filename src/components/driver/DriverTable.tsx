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
import type { Driver } from '@/models/driverModel';

interface Props {
    drivers: Driver[];
    selected: Driver[];
    loading: boolean;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (driver: Driver) => void;
    onMenuOpen: (e: React.MouseEvent<HTMLElement>, driver: Driver) => void;
}

export default function DriverTable({
    drivers,
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
                                checked={selected.length === drivers.length && drivers.length > 0}
                                onChange={onSelectAll}
                            />
                        </TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>CNH</TableCell>
                        <TableCell>Placa</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drivers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                Nenhum motorista encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        drivers.map((driver) => (
                            <TableRow
                                key={driver.id}
                                hover
                                sx={{
                                    backgroundColor: selected.some((s) => s.id === driver.id)
                                        ? 'rgba(59, 130, 246, 0.1)'
                                        : undefined,
                                    '&:hover': {
                                        backgroundColor: selected.some((s) => s.id === driver.id)
                                            ? 'rgba(59, 130, 246, 0.15)'
                                            : '#f9fafb',
                                    },
                                }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.some((s) => s.id === driver.id)}
                                        onChange={() => onSelectOne(driver)}
                                    />
                                </TableCell>
                                <TableCell>{driver.fullName}</TableCell>
                                <TableCell>{driver.email}</TableCell>
                                <TableCell>{driver.cnhNumber || '—'}</TableCell>
                                <TableCell>{driver.vehiclePlate || '—'}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={(e) => onMenuOpen(e, driver)}>
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
