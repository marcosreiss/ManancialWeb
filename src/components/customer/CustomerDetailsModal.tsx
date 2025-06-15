import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Stack,
    Box,
    CircularProgress,
    Paper,
} from '@mui/material';
import { useGetCustomerById } from '@/hooks/useCustomer';
import { useNotification } from '@/context/NotificationContext';
import MapViewer from '@/components/shared/MapViewer';

interface Props {
    open: boolean;
    onClose: () => void;
    customerId: string;
}

export default function CustomerDetailsModal({ open, onClose, customerId }: Props) {
    const { data: customer, isLoading, error } = useGetCustomerById(customerId);
    const { addNotification } = useNotification();

    if (isLoading) {
        return (
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            </Dialog>
        );
    }

    if (error || !customer) {
        addNotification('Erro ao carregar detalhes do cliente.', 'error');
        onClose();
        return null;
    }

    const format = (value?: string | null) => (value ? value : '—');
    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    const formatBoolean = (value: boolean) => (value ? 'Sim' : 'Não');

    const address = customer.defaultAddress;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3}>
                    {/* Informações Pessoais */}
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Informações Pessoais</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            <Typography><strong>Nome:</strong> {format(customer.fullName)}</Typography>
                            <Typography><strong>Email:</strong> {format(customer.email)}</Typography>
                            <Typography><strong>Telefone:</strong> {format(customer.phoneNumber)}</Typography>
                            <Typography><strong>CPF/CNPJ:</strong> {format(customer.cpForCNPJ)}</Typography>
                        </Stack>
                    </Paper>

                    {/* Endereço */}
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Endereço</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {address ? (
                            <Stack spacing={1}>
                                <Typography><strong>Rua:</strong> {format(address.street)}</Typography>
                                <Typography><strong>Número:</strong> {format(address.number)}</Typography>
                                <Typography><strong>Bairro:</strong> {format(address.neighborhood)}</Typography>
                                <Typography><strong>Cidade:</strong> {format(address.city)}</Typography>
                                <Typography><strong>Estado:</strong> {format(address.state)}</Typography>
                                <Typography><strong>CEP:</strong> {format(address.zipCode)}</Typography>
                                {address.complement && (
                                    <Typography><strong>Complemento:</strong> {address.complement}</Typography>
                                )}

                                {address.latitude && address.longitude && (
                                    <Box mt={2}>
                                        <MapViewer
                                            center={{ lat: address.latitude, lng: address.longitude }}
                                            markers={[{ lat: address.latitude, lng: address.longitude }]}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        ) : (
                            <Typography>—</Typography>
                        )}
                    </Paper>

                    {/* Outros Dados */}
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Outros Dados</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            <Typography><strong>Informações adicionais:</strong> {format(customer.additionalInfo)}</Typography>
                            <Typography><strong>Recebe promoções:</strong> {formatBoolean(customer.receivesPromotions)}</Typography>
                            <Typography><strong>Cadastrado em:</strong> {formatDate(customer.registeredAt)}</Typography>
                        </Stack>
                    </Paper>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
