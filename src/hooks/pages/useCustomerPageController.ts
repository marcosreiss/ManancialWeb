import { useState, useEffect, useRef } from "react";
import type { Customer } from "@/models/customerModel";
import { useGetCustomers, useDeleteCustomer } from "@/hooks/useCustomer";
import { useNotification } from "@/context/NotificationContext";

export function useCustomerPageController() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState<string | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsCustomerId, setDetailsCustomerId] = useState<string | null>(
    null
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuCustomer, setMenuCustomer] = useState<Customer | null>(null);

  const { addNotification } = useNotification();
  const deleteMutation = useDeleteCustomer();

  const { data, isLoading } = useGetCustomers({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    search: debouncedSearch,
  });

  // Debounce Search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchValue.length === 0 || searchValue.length >= 3) {
        setDebouncedSearch(searchValue);
        setPage(0);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue]);

  // Pagination
  const handleChangePage = (newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  // Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.data) {
      setSelectedIds(data.data.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Modals
  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const handleEditClick = (customer: Customer) => {
    setEditCustomerId(customer.id);
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);

  const handleDetailsClick = (customer: Customer) => {
    setDetailsCustomerId(customer.id);
    setDetailsModalOpen(true);
  };
  const closeDetailsModal = () => setDetailsModalOpen(false);

  const handleDeleteClick = (customer: Customer) => {
    setDeleteTargetIds([customer.id]);
    setDeleteDialogOpen(true);
  };

  const openDeleteDialog = () => {
    setDeleteTargetIds(selectedIds);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  // Delete
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        deleteTargetIds.map((id) =>
          deleteMutation.mutateAsync(id).then(() => {
            addNotification(`Cliente ${id} excluído com sucesso.`, "success");
          })
        )
      );
      setSelectedIds((prev) =>
        prev.filter((id) => !deleteTargetIds.includes(id))
      );
      closeDeleteDialog();
    } catch {
      addNotification("Erro ao excluir clientes.", "error");
    }
  };

  // Menu
  const handleMenuOpen = (
    e: React.MouseEvent<HTMLElement>,
    customer: Customer
  ) => {
    setMenuAnchorEl(e.currentTarget);
    setMenuCustomer(customer);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuCustomer(null);
  };

  return {
    customers: data?.data || [],
    totalRecords: data?.totalRecords || 0,
    isLoading,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    searchValue,
    setSearchValue,
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    createModalOpen,
    openCreateModal,
    closeCreateModal,
    editModalOpen,
    editCustomerId,
    handleEditClick,
    closeEditModal,
    detailsModalOpen,
    detailsCustomerId,
    handleDetailsClick,
    closeDetailsModal,
    deleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteSelected,
    deleteLoading: deleteMutation.status === "pending",
    menuAnchorEl,
    menuCustomer,
    handleMenuOpen,
    handleMenuClose,
    handleDeleteClick,
  };
}
