import { useState, useEffect, useRef, useCallback } from "react";
import type { Customer } from "@/models/customerModel";
import { useGetCustomers, useDeleteCustomer } from "@/hooks/useCustomer";
import { useNotification } from "@/context/NotificationContext";

interface UseCustomerPageController {
  customers: Customer[];
  totalRecords: number;
  isLoading: boolean;

  page: number;
  rowsPerPage: number;
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (newRows: number) => void;

  searchValue: string;
  setSearchValue: (value: string) => void;

  selectedIds: string[];
  handleSelectAll: () => void;
  handleSelectOne: (id: string) => void;

  createModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;

  editModalOpen: boolean;
  editCustomerId: string | null;
  openEditModal: (id: string) => void;
  closeEditModal: () => void;

  detailsModalOpen: boolean;
  detailsCustomerId: string | null;
  openDetailsModal: (id: string) => void;
  closeDetailsModal: () => void;

  deleteDialogOpen: boolean;
  openDeleteDialog: () => void;
  closeDeleteDialog: () => void;
  handleDeleteSelected: () => Promise<void>;
  deleteLoading: boolean;

  menuAnchorEl: HTMLElement | null;
  menuCustomerId: string | null;
  handleMenuOpen: (
    e: React.MouseEvent<HTMLElement>,
    customerId: string
  ) => void;
  handleMenuClose: () => void;
  handleMenuOptionClick: (action: "details" | "edit" | "delete") => void;
}

export function useCustomerPageController(): UseCustomerPageController {
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

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuCustomerId, setMenuCustomerId] = useState<string | null>(null);

  const { addNotification } = useNotification();
  const { data, isLoading } = useGetCustomers({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    search: debouncedSearch,
  });

  const deleteMutation = useDeleteCustomer();

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

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((newRows: number) => {
    setRowsPerPage(newRows);
    setPage(0);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (data?.data) {
      setSelectedIds(
        selectedIds.length === data.data.length
          ? []
          : data.data.map((c) => c.id)
      );
    }
  }, [data, selectedIds]);

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }, []);

  const openCreateModal = useCallback(() => setCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setCreateModalOpen(false), []);

  const openEditModal = useCallback((id: string) => {
    setEditCustomerId(id);
    setEditModalOpen(true);
  }, []);
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);

  const openDetailsModal = useCallback((id: string) => {
    setDetailsCustomerId(id);
    setDetailsModalOpen(true);
  }, []);
  const closeDetailsModal = useCallback(() => setDetailsModalOpen(false), []);

  const openDeleteDialog = useCallback(() => setDeleteDialogOpen(true), []);
  const closeDeleteDialog = useCallback(() => setDeleteDialogOpen(false), []);

  const handleDeleteSelected = useCallback(async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          deleteMutation.mutateAsync(id).then(() => {
            addNotification(`Cliente ${id} excluído com sucesso.`, "success");
          })
        )
      );
      setSelectedIds([]);
      closeDeleteDialog();
    } catch {
      addNotification("Erro ao excluir clientes.", "error");
    }
  }, [selectedIds, deleteMutation, addNotification, closeDeleteDialog]);

  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>, customerId: string) => {
      setMenuAnchorEl(e.currentTarget);
      setMenuCustomerId(customerId);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
    setMenuCustomerId(null);
  }, []);

  const handleMenuOptionClick = useCallback(
    (action: "details" | "edit" | "delete") => {
      if (!menuCustomerId) return;
      handleMenuClose();

      if (action === "details") openDetailsModal(menuCustomerId);
      if (action === "edit") openEditModal(menuCustomerId);
      if (action === "delete") {
        setSelectedIds([menuCustomerId]);
        openDeleteDialog();
      }
    },
    [
      menuCustomerId,
      handleMenuClose,
      openDetailsModal,
      openEditModal,
      openDeleteDialog,
    ]
  );

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
    openEditModal,
    closeEditModal,
    detailsModalOpen,
    detailsCustomerId,
    openDetailsModal,
    closeDetailsModal,
    deleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteSelected,
    deleteLoading: deleteMutation.status === "pending",
    menuAnchorEl,
    menuCustomerId,
    handleMenuOpen,
    handleMenuClose,
    handleMenuOptionClick,
  };
}
