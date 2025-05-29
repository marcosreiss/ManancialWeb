import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';

type DeteleConfirmDialogProps<T> = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selected: T[];
    getItemLabel: (item: T) => string;
    loading?: boolean;
    entityName?: string;
};

export default function DeleteConfirmDialog<T>({
    open,
    onClose,
    onConfirm,
    selected,
    getItemLabel,
    loading = false,
    entityName = 'item',
}: DeteleConfirmDialogProps<T>) {
    const multiple = selected.length > 1;

    const message = multiple
        ? `Deseja realmente excluir ${selected.length} ${entityName}s selecionados?`
        : selected[0]
            ? `Deseja realmente excluir o(a) ${entityName} "${getItemLabel(selected[0])}"?`
            : `Deseja realmente excluir este(a) ${entityName}?`;


    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Excluir</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress color="inherit" size={18} /> : null}
                >
                    {loading ? 'Excluindo...' : 'Excluir'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
