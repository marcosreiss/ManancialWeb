import { Box, Typography, TablePagination } from "@mui/material";
import ToolbarComponent from "@/components/shared/ToolbarComponent";
import CustomerTable from "@/components/customer/CustomerTable";
import CreateCustomerModal from "@/components/customer/CreateCustomerModal";
import EditCustomerModal from "@/components/customer/EditCustomerModal";
import CustomerDetailsModal from "@/components/customer/CustomerDetailsModal";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import { useCustomerPageController } from "@/hooks/pages/useCustomerPageController";

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
        deleteLoading,
        menuAnchorEl,
        menuCustomerId,
        handleMenuOpen,
        handleMenuClose,
        handleMenuOptionClick,
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
                menuAnchorEl={menuAnchorEl}
                menuCustomerId={menuCustomerId}
                onMenuClose={handleMenuClose}
                onMenuOptionClick={handleMenuOptionClick}
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
        </Box>
    );
}
