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
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import type { Customer } from "@/models/customerModel";

interface Props {
    customers: Customer[];
    selectedIds: string[];
    loading: boolean;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (id: string) => void;
    onMenuOpen: (e: React.MouseEvent<HTMLElement>, customer: Customer) => void;
}

export default function CustomerTable({
    customers,
    selectedIds,
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

    const allSelected = selectedIds.length === customers.length && customers.length > 0;

    return (
        <TableContainer component={Paper} sx={{ height: "60vh", backgroundColor: "white" }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox checked={allSelected} onChange={onSelectAll} />
                        </TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>CPF/CNPJ</TableCell>
                        <TableCell>Telefone</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                Nenhum cliente encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        customers.map((customer) => {
                            const isSelected = selectedIds.includes(customer.id);
                            return (
                                <TableRow
                                    key={customer.id}
                                    hover
                                    sx={{
                                        backgroundColor: isSelected ? "rgba(59, 130, 246, 0.1)" : undefined,
                                        "&:hover": {
                                            backgroundColor: isSelected ? "rgba(59, 130, 246, 0.15)" : "#f9fafb",
                                        },
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => onSelectOne(customer.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{customer.fullName}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.cpForCNPJ || "—"}</TableCell>
                                    <TableCell>{customer.phoneNumber}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => onMenuOpen(e, customer)}>
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
