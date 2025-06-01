import {
    Box,
    Typography,
    TablePagination,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
    useGetProducts,
    useUpdateProduct,
    useCreateProduct,
    useDeleteProduct,
} from "@/hooks/useProduct";
import { useNotification } from "@/context/NotificationContext";
import type { Product } from "@/models/productModel";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import ToolbarComponent from "@/components/shared/ToolbarComponent";
import MenuComponent from "@/components/shared/MenuComponent";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import ProductDetailsModal from "@/components/product/ProductDetailsModal";
import ProductTable from "@/components/product/ProductTable";
import CreateEditProductModal from "@/components/product/CreateEditProductModal";

export default function ProductPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<Product[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("edit");
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuProduct, setMenuProduct] = useState<Product | null>(null);

    const { addNotification } = useNotification();

    const { data, isLoading } = useGetProducts({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        search: debouncedSearch,
    });

    const updateMutation = useUpdateProduct();
    const createMutation = useCreateProduct();
    const deleteMutation = useDeleteProduct();

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (searchValue.length >= 3 || searchValue.length === 0) {
                setDebouncedSearch(searchValue);
                setPage(0);
            }
        }, 500);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchValue]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.checked ? data?.data || [] : []);
    };

    const handleSelectOne = (product: Product) => {
        setSelected((prev) =>
            prev.some((p) => p.id === product.id)
                ? prev.filter((p) => p.id !== product.id)
                : [...prev, product]
        );
    };

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, product: Product) => {
        setMenuAnchorEl(e.currentTarget);
        setMenuProduct(product);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuProduct(null);
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await Promise.all(
                selected.map((product) =>
                    deleteMutation.mutateAsync(product.id).then(() => {
                        addNotification(`Produto "${product.name}" excluído.`, "success");
                    }).catch(() => {
                        addNotification(`Erro ao excluir "${product.name}".`, "error");
                        throw new Error();
                    })
                )
            );
            setDialogOpen(false);
            setSelected([]);
        } catch {
            // erros já tratados
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSave = (data: {
        id?: string;
        name: string;
        description: string;
        isActive: boolean;
        imageFile?: File | null;
    }) => {
        setModalLoading(true);

        const payload = {
            name: data.name,
            description: data.description,
            isActive: data.isActive,
            imageFile: data.imageFile ?? undefined,
        };

        if (modalMode === "edit" && data.id) {
            updateMutation.mutate(
                { id: data.id, payload: { ...payload, id: data.id } },
                {
                    onSuccess: () => {
                        addNotification("Produto atualizado com sucesso.", "success");
                        setModalOpen(false);
                    },
                    onError: () => {
                        addNotification("Erro ao atualizar produto.", "error");
                    },
                    onSettled: () => {
                        setModalLoading(false);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    addNotification("Produto criado com sucesso.", "success");
                    setModalOpen(false);
                },
                onError: () => {
                    addNotification("Erro ao criar produto.", "error");
                },
                onSettled: () => {
                    setModalLoading(false);
                },
            });
        }
    };

    const openModal = (mode: "create" | "edit", product?: Product) => {
        setModalMode(mode);
        setCurrentProduct(product || null);
        setModalOpen(true);
    };

    const openDetails = (product: Product) => {
        setCurrentProduct(product);
        setDetailsOpen(true);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Produtos</Typography>

            <ToolbarComponent
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                onCreateClick={() => openModal("create")}
                onDeleteClick={() => setDialogOpen(true)}
                selectedCount={selected.length}
                createLabel="Novo Produto"
            />

            <ProductTable
                products={data?.data || []}
                selected={selected}
                loading={isLoading}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                onMenuOpen={handleMenuOpen}
            />

            <TablePagination
                component="div"
                count={data?.totalRecords || 0}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="registros por página"
            />

            <CreateEditProductModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={currentProduct}
                onSubmit={handleSave}
                loading={modalLoading}
            />

            <ProductDetailsModal
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                product={currentProduct}
            />

            <DeleteConfirmDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleDelete}
                selected={selected}
                getItemLabel={(p) => p.name}
                loading={deleteLoading}
                entityName="produto"
            />

            <MenuComponent
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                entity={menuProduct}
                onClose={handleMenuClose}
                options={[
                    {
                        label: "Visualizar",
                        icon: <Visibility fontSize="small" />,
                        onClick: openDetails,
                    },
                    {
                        label: "Editar",
                        icon: <Edit fontSize="small" />,
                        onClick: (p) => openModal("edit", p),
                    },
                    {
                        label: "Excluir",
                        icon: <Delete fontSize="small" />,
                        onClick: (p) => {
                            setSelected([p]);
                            setDialogOpen(true);
                        },
                        color: "error.main",
                    },
                ]}
            />
        </Box>
    );
}
