import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Stack,
} from '@mui/material';
import type { Admin } from '@/models/adminModel';

interface AdminDetailsModalProps {
    open: boolean;
    onClose: () => void;
    admin: Admin | null;
}

export default function AdminDetailsModal({
    open,
    onClose,
    admin,
}: AdminDetailsModalProps) {
    if (!admin) return null;

    const format = (value?: string | null) => (value ? value : '—');
    const formatBoolean = (value?: boolean) => (value ? 'Ativo' : 'Inativo');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Detalhes do Admin</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nome
                        </Typography>
                        <Typography variant="body1">{format(admin.fullName)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Email
                        </Typography>
                        <Typography variant="body1">{format(admin.email)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            CPF
                        </Typography>
                        <Typography variant="body1">{format(admin.cpf)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Telefone
                        </Typography>
                        <Typography variant="body1">{format(admin.phoneNumber)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Status
                        </Typography>
                        <Typography variant="body1">{formatBoolean(admin.isActive)}</Typography>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
