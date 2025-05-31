import {
    Box,
    Typography,
    TablePagination,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    useGetCustomers,
    useUpdateCustomer,
    useCreateCustomer,
    useDeleteCustomer,
} from '@/hooks/useCustomer';
import { useNotification } from '@/context/NotificationContext';
import type { Customer } from '@/models/customerModel';
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog';
import ToolbarComponent from '@/components/shared/ToolbarComponent';
import MenuComponent from '@/components/shared/MenuComponent';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import CustomerDetailsModal from '@/components/customer/CustomerDetailsModal';
import CustomerTable from '@/components/customer/CustomerTable';
import CreateEditCustomerModal from '@/components/customer/CreateEditCustomerModal';

export default function CustomerPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<Customer[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('edit');
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuCustomer, setMenuCustomer] = useState<Customer | null>(null);

    const { addNotification } = useNotification();

    const { data, isLoading } = useGetCustomers({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        search: debouncedSearch,
    });

    const updateMutation = useUpdateCustomer();
    const createMutation = useCreateCustomer();
    const deleteMutation = useDeleteCustomer();

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

    const handleSelectOne = (customer: Customer) => {
        setSelected((prev) =>
            prev.some((c) => c.id === customer.id)
                ? prev.filter((c) => c.id !== customer.id)
                : [...prev, customer]
        );
    };

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, customer: Customer) => {
        setMenuAnchorEl(e.currentTarget);
        setMenuCustomer(customer);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuCustomer(null);
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await Promise.all(
                selected.map((customer) =>
                    deleteMutation.mutateAsync(customer.id).then(() => {
                        addNotification(`Cliente "${customer.fullName}" excluído.`, 'success');
                    }).catch(() => {
                        addNotification(`Erro ao excluir "${customer.fullName}".`, 'error');
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

    const handleSave = (customer: Customer & { password?: string }) => {
        setModalLoading(true);

        const payload = {
            ...customer,
            cpForCNPJ: customer.cpForCNPJ ?? '',
            defaultAddress: customer.defaultAddress ?? '',
            additionalInfo: customer.additionalInfo ?? '',
        };

        if (modalMode === 'edit') {
            updateMutation.mutate(
                { id: customer.id, payload },
                {
                    onSuccess: () => {
                        addNotification('Cliente atualizado com sucesso.', 'success');
                        setModalOpen(false);
                    },
                    onError: () => {
                        addNotification('Erro ao atualizar cliente.', 'error');
                    },
                    onSettled: () => {
                        setModalLoading(false);
                    },
                }
            );
        } else {
            createMutation.mutate(
                {
                    fullName: payload.fullName,
                    email: payload.email,
                    phoneNumber: payload.phoneNumber,
                    password: customer.password || 'Cliente123!',
                    cpForCNPJ: payload.cpForCNPJ,
                    defaultAddress: payload.defaultAddress,
                    additionalInfo: payload.additionalInfo,
                    receivesPromotions: payload.receivesPromotions,
                },
                {
                    onSuccess: () => {
                        addNotification('Cliente criado com sucesso.', 'success');
                        setModalOpen(false);
                    },
                    onError: () => {
                        addNotification('Erro ao criar cliente.', 'error');
                    },
                    onSettled: () => {
                        setModalLoading(false);
                    },
                }
            );
        }
    };

    const openModal = (mode: 'create' | 'edit', customer?: Customer) => {
        setModalMode(mode);
        setCurrentCustomer(customer || null);
        setModalOpen(true);
    };

    const openDetails = (customer: Customer) => {
        setCurrentCustomer(customer);
        setDetailsOpen(true);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Clientes</Typography>

            <ToolbarComponent
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                onCreateClick={() => openModal('create')}
                onDeleteClick={() => setDialogOpen(true)}
                selectedCount={selected.length}
                createLabel="Novo Cliente"
            />

            <CustomerTable
                customers={data?.data || []}
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

            <CreateEditCustomerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={currentCustomer}
                onSubmit={handleSave}
                loading={modalLoading}
            />

            <CustomerDetailsModal
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                customer={currentCustomer}
            />

            <DeleteConfirmDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleDelete}
                selected={selected}
                getItemLabel={(c) => c.fullName}
                loading={deleteLoading}
                entityName="cliente"
            />

            <MenuComponent
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                entity={menuCustomer}
                onClose={handleMenuClose}
                options={[
                    {
                        label: 'Visualizar',
                        icon: <Visibility fontSize="small" />,
                        onClick: openDetails,
                    },
                    {
                        label: 'Editar',
                        icon: <Edit fontSize="small" />,
                        onClick: (c) => openModal('edit', c),
                    },
                    {
                        label: 'Excluir',
                        icon: <Delete fontSize="small" />,
                        onClick: (c) => {
                            setSelected([c]);
                            setDialogOpen(true);
                        },
                        color: 'error.main',
                    },
                ]}
            />
        </Box>
    );
}
