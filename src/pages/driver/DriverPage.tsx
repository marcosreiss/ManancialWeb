import {
    Box,
    Typography,
    TablePagination,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
    useGetDrivers,
    useCreateDriver,
    useUpdateDriver,
    useDeleteDriver,
} from '@/hooks/useDriver';
import { useNotification } from '@/context/NotificationContext';
import type { Driver } from '@/models/driverModel';
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog';
import ToolbarComponent from '@/components/shared/ToolbarComponent';
import MenuComponent from '@/components/shared/MenuComponent';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import DriverTable from '@/components/driver/DriverTable';
import CreateEditDriverModal from '@/components/driver/CreateEditDriverModal';
import DriverDetailsModal from '@/components/driver/DriverDetailsModal';

export default function DriverPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [selected, setSelected] = useState<Driver[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuDriver, setMenuDriver] = useState<Driver | null>(null);

    const { addNotification } = useNotification();

    const { data, isLoading } = useGetDrivers({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        search: debouncedSearch,
    });

    const createMutation = useCreateDriver();
    const updateMutation = useUpdateDriver();
    const deleteMutation = useDeleteDriver();

    useEffect(() => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
            if (searchValue.length >= 3 || searchValue.length === 0) {
                setDebouncedSearch(searchValue);
                setPage(0);
            }
        }, 500);
        return () => {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        };
    }, [searchValue]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.checked ? data?.data || [] : []);
    };

    const handleSelectOne = (driver: Driver) => {
        setSelected((prev) =>
            prev.some((d) => d.id === driver.id)
                ? prev.filter((d) => d.id !== driver.id)
                : [...prev, driver]
        );
    };

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, driver: Driver) => {
        setMenuAnchorEl(e.currentTarget);
        setMenuDriver(driver);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuDriver(null);
    };

    const openModal = (mode: 'create' | 'edit', driver?: Driver) => {
        setModalMode(mode);
        setCurrentDriver(driver || null);
        setModalOpen(true);
    };

    const openDetails = (driver: Driver) => {
        setCurrentDriver(driver);
        setDetailsOpen(true);
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await Promise.all(
                selected.map((driver) =>
                    deleteMutation.mutateAsync(driver.id)
                        .then(() =>
                            addNotification(`caçambeiro "${driver.fullName}" excluído.`, 'success')
                        )
                        .catch(() => {
                            addNotification(`Erro ao excluir "${driver.fullName}".`, 'error');
                            throw new Error();
                        })
                )
            );
            setDialogOpen(false);
            setSelected([]);
        } catch {
            // Erros já tratados
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSave = (driver: Driver & { password?: string }) => {
        setModalLoading(true);

        const payload = {
            ...driver,
            cpf: driver.cpf ?? '',
            cnhNumber: driver.cnhNumber ?? '',
            licenseExpiration: driver.licenseExpiration,
            vehiclePlate: driver.vehiclePlate ?? '',
            vehicleType: driver.vehicleType ?? '',
            vehicleModel: driver.vehicleModel ?? '',
            vehicleColor: driver.vehicleColor ?? '',
            dumpsterSizeInCubicMeters: driver.dumpsterSizeInCubicMeters ?? undefined,
            pixKey: driver.pixKey ?? '',
            pixKeyType: driver.pixKeyType ?? undefined,
            isAvailable: driver.isAvailable,
        };

        if (modalMode === 'edit') {
            updateMutation.mutate(
                { id: driver.id, payload },
                {
                    onSuccess: () => {
                        addNotification('caçambeiro atualizado com sucesso.', 'success');
                        setModalOpen(false);
                    },
                    onError: () => {
                        addNotification('Erro ao atualizar caçambeiro.', 'error');
                    },
                    onSettled: () => {
                        setModalLoading(false);
                    },
                }
            );
        } else {
            createMutation.mutate(
                {
                    ...payload,
                    email: driver.email,
                    password: driver.password || 'caçambeiro123!',
                },
                {
                    onSuccess: () => {
                        addNotification('caçambeiro criado com sucesso.', 'success');
                        setModalOpen(false);
                    },
                    onError: () => {
                        addNotification('Erro ao criar caçambeiro.', 'error');
                    },
                    onSettled: () => {
                        setModalLoading(false);
                    },
                }
            );
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>caçambeiros</Typography>

            <ToolbarComponent
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                onCreateClick={() => openModal('create')}
                onDeleteClick={() => setDialogOpen(true)}
                selectedCount={selected.length}
                createLabel="Novo caçambeiro"
            />

            <DriverTable
                drivers={data?.data || []}
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

            <CreateEditDriverModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialData={currentDriver}
                onSubmit={handleSave}
                loading={modalLoading}
            />

            <DriverDetailsModal
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                driver={currentDriver}
            />

            <DeleteConfirmDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleDelete}
                selected={selected}
                getItemLabel={(d) => d.fullName}
                loading={deleteLoading}
                entityName="caçambeiro"
            />

            <MenuComponent
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                entity={menuDriver}
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
                        onClick: (d) => openModal('edit', d),
                    },
                    {
                        label: 'Excluir',
                        icon: <Delete fontSize="small" />,
                        onClick: (d) => {
                            setSelected([d]);
                            setDialogOpen(true);
                        },
                        color: 'error.main',
                    },
                ]}
            />
        </Box>
    );
}
