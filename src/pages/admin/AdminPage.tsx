import {
  Box,
  Typography,
  TablePagination,
} from '@mui/material';
import { useState } from 'react';
import {
  useGetAdmins,
  useUpdateAdmin,
  useCreateAdmin,
  useDeleteAdmin,
} from '@/hooks/useAdmin';
import { useNotification } from '@/context/NotificationContext';
import type { Admin } from '@/models/adminModel';
import DeleteConfirmDialog from '@/components/shared/DeleteConfirmDialog';
import ToolbarComponent from '@/components/shared/ToolbarComponent';
import MenuComponent from '@/components/shared/MenuComponent';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import AdminDetailsModal from '@/components/admin/AdminDetailsModal';
import AdminTable from '@/components/admin/AdminTable';
import CreateEditAdminModal from '@/components/admin/CreateEditAdminModal';

export default function AdminPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<Admin[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('edit');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAdmin, setMenuAdmin] = useState<Admin | null>(null);

  const { addNotification } = useNotification();

  const { data, isLoading } = useGetAdmins({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
  });

  const updateMutation = useUpdateAdmin();
  const createMutation = useCreateAdmin();
  const deleteMutation = useDeleteAdmin();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data?.data || [] : []);
  };

  const handleSelectOne = (admin: Admin) => {
    setSelected((prev) =>
      prev.some((a) => a.id === admin.id)
        ? prev.filter((a) => a.id !== admin.id)
        : [...prev, admin]
    );
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, admin: Admin) => {
    setMenuAnchorEl(e.currentTarget);
    setMenuAdmin(admin);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuAdmin(null);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await Promise.all(
        selected.map((admin) =>
          deleteMutation.mutateAsync(admin.id).then(() => {
            addNotification(`Admin "${admin.fullName}" excluído.`, 'success');
          }).catch(() => {
            addNotification(`Erro ao excluir "${admin.fullName}".`, 'error');
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

  const handleSave = (admin: Admin) => {
    setModalLoading(true);

    const payload = {
      ...admin,
      cpf: admin.cpf ?? '',
    };

    if (modalMode === 'edit') {
      updateMutation.mutate(
        { id: admin.id, payload },
        {
          onSuccess: () => {
            addNotification('Admin atualizado com sucesso.', 'success');
            setModalOpen(false);
          },
          onError: () => {
            addNotification('Erro ao atualizar admin.', 'error');
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
          cpf: payload.cpf,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          password: 'Admin123!', // pode ser solicitado do usuário depois
        },
        {
          onSuccess: () => {
            addNotification('Admin criado com sucesso.', 'success');
            setModalOpen(false);
          },
          onError: () => {
            addNotification('Erro ao criar admin.', 'error');
          },
          onSettled: () => {
            setModalLoading(false);
          },
        }
      );
    }
  };

  const openModal = (mode: 'create' | 'edit', admin?: Admin) => {
    setModalMode(mode);
    setCurrentAdmin(admin || null);
    setModalOpen(true);
  };

  const openDetails = (admin: Admin) => {
    setCurrentAdmin(admin);
    setDetailsOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admins</Typography>

      <ToolbarComponent
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onCreateClick={() => openModal('create')}
        onDeleteClick={() => setDialogOpen(true)}
        selectedCount={selected.length}
        createLabel="Novo Admin"
      />

      <AdminTable
        admins={data?.data || []}
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

      <CreateEditAdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={currentAdmin}
        onSubmit={handleSave}
        loading={modalLoading}
      />

      <AdminDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        admin={currentAdmin}
      />

      <DeleteConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDelete}
        selected={selected}
        getItemLabel={(a) => a.fullName}
        loading={deleteLoading}
        entityName="admin"
      />

      <MenuComponent
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        entity={menuAdmin}
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
            onClick: (admin) => openModal('edit', admin),
          },
          {
            label: 'Excluir',
            icon: <Delete fontSize="small" />,
            onClick: (admin) => {
              setSelected([admin]);
              setDialogOpen(true);
            },
            color: 'error.main',
          },
        ]}
      />
    </Box>
  );
}
