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
import type { Customer } from '@/models/customerModel';

interface CustomerDetailsModalProps {
    open: boolean;
    onClose: () => void;
    customer: Customer | null;
}

export default function CustomerDetailsModal({
    open,
    onClose,
    customer,
}: CustomerDetailsModalProps) {
    if (!customer) return null;

    const format = (value?: string | null) => (value ? value : '—');
    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    const formatBoolean = (value: boolean) => (value ? 'Sim' : 'Não');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nome
                        </Typography>
                        <Typography variant="body1">{format(customer.fullName)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Email
                        </Typography>
                        <Typography variant="body1">{format(customer.email)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Telefone
                        </Typography>
                        <Typography variant="body1">{format(customer.phoneNumber)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            CPF/CNPJ
                        </Typography>
                        <Typography variant="body1">{format(customer.cpForCNPJ)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Endereço
                        </Typography>
                        <Typography variant="body1">{format(customer.defaultAddress)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Informações adicionais
                        </Typography>
                        <Typography variant="body1">{format(customer.additionalInfo)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Recebe promoções?
                        </Typography>
                        <Typography variant="body1">{formatBoolean(customer.receivesPromotions)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Cadastrado em
                        </Typography>
                        <Typography variant="body1">{formatDate(customer.registeredAt)}</Typography>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
