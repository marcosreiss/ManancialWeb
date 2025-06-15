import { Box, Typography, TablePagination } from "@mui/material";
import ToolbarComponent from "@/components/shared/ToolbarComponent";
import CustomerTable from "@/components/customer/CustomerTable";
import CreateCustomerModal from "@/components/customer/CreateCustomerModal";
import EditCustomerModal from "@/components/customer/EditCustomerModal";
import CustomerDetailsModal from "@/components/customer/CustomerDetailsModal";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import RowActionsMenu from "@/components/shared/RowActionsMenu";
import { useCustomerPageController } from "@/hooks/pages/useCustomerPageController";
import { Visibility, Edit, Delete } from "@mui/icons-material";

export default function CustomerPage() {
    const {
        customers,
        totalRecords,
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
        deleteLoading,
        menuAnchorEl,
        menuCustomer,
        handleMenuOpen,
        handleMenuClose,
        handleDeleteClick,
    } = useCustomerPageController();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Clientes
            </Typography>

            <ToolbarComponent
                searchValue={searchValue}
                onSearchChange={(e) => setSearchValue(e.target.value)}
                onCreateClick={openCreateModal}
                onDeleteClick={openDeleteDialog}
                selectedCount={selectedIds.length}
                createLabel="Novo Cliente"
            />

            <CustomerTable
                customers={customers}
                selectedIds={selectedIds}
                loading={isLoading}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                onMenuOpen={handleMenuOpen}
            />

            <TablePagination
                component="div"
                count={totalRecords}
                page={page}
                onPageChange={(_, newPage) => handleChangePage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => handleChangeRowsPerPage(parseInt(e.target.value, 10))}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="registros por página"
            />

            <CreateCustomerModal open={createModalOpen} onClose={closeCreateModal} />

            {editCustomerId && (
                <EditCustomerModal
                    open={editModalOpen}
                    onClose={closeEditModal}
                    customerId={editCustomerId}
                />
            )}

            {detailsCustomerId && (
                <CustomerDetailsModal
                    open={detailsModalOpen}
                    onClose={closeDetailsModal}
                    customerId={detailsCustomerId}
                />
            )}

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDeleteSelected}
                selected={selectedIds}
                getItemLabel={(id) => {
                    const c = customers.find((c) => c.id === id);
                    return c?.fullName || id;
                }}
                loading={deleteLoading}
                entityName="cliente"
            />

            <RowActionsMenu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                entity={menuCustomer}
                onClose={handleMenuClose}
                options={[
                    {
                        label: "Visualizar",
                        icon: <Visibility fontSize="small" />,
                        onClick: handleDetailsClick,
                    },
                    {
                        label: "Editar",
                        icon: <Edit fontSize="small" />,
                        onClick: handleEditClick,
                    },
                    {
                        label: "Excluir",
                        icon: <Delete fontSize="small" color="error" />,
                        onClick: handleDeleteClick,
                        color: "error.main",
                    },
                ]}
            />
        </Box>
    );
}
