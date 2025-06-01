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
    Avatar,
    Tooltip,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import type { Product } from "@/models/productModel";

interface Props {
    products: Product[];
    selected: Product[];
    loading: boolean;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (product: Product) => void;
    onMenuOpen: (e: React.MouseEvent<HTMLElement>, product: Product) => void;
}

export default function ProductTable({
    products,
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
        <TableContainer component={Paper} sx={{ height: "60vh", backgroundColor: "white" }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={selected.length === products.length && products.length > 0}
                                onChange={onSelectAll}
                            />
                        </TableCell>
                        <TableCell>Imagem</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                Nenhum produto encontrado.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => {
                            const isSelected = selected.some((s) => s.id === product.id);
                            return (
                                <TableRow
                                    key={product.id}
                                    hover
                                    sx={{
                                        backgroundColor: isSelected
                                            ? "rgba(59, 130, 246, 0.1)"
                                            : undefined,
                                        "&:hover": {
                                            backgroundColor: isSelected
                                                ? "rgba(59, 130, 246, 0.15)"
                                                : "#f9fafb",
                                        },
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => onSelectOne(product)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {product.productPictureUrl ? (
                                            <Tooltip title="Visualizar imagem">
                                                <Avatar
                                                    src={product.productPictureUrl}
                                                    alt={product.name}
                                                    variant="rounded"
                                                    sx={{ width: 42, height: 42 }}
                                                />
                                            </Tooltip>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>

                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.isActive ? "Ativo" : "Inativo"}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => onMenuOpen(e, product)}>
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
