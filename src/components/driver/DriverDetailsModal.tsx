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
import type { Driver } from '@/models/driverModel';

interface DriverDetailsModalProps {
    open: boolean;
    onClose: () => void;
    driver: Driver | null;
}

export default function DriverDetailsModal({
    open,
    onClose,
    driver,
}: DriverDetailsModalProps) {
    if (!driver) return null;

    const format = (value?: string | number | null) => value ?? '—';

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    const formatBool = (value: boolean) => (value ? 'Sim' : 'Não');

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Detalhes do Motorista</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nome completo
                        </Typography>
                        <Typography>{format(driver.fullName)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Email
                        </Typography>
                        <Typography>{format(driver.email)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Telefone
                        </Typography>
                        <Typography>{format(driver.phoneNumber)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            CPF
                        </Typography>
                        <Typography>{format(driver.cpf)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            CNH
                        </Typography>
                        <Typography>{format(driver.cnhNumber)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Validade da CNH
                        </Typography>
                        <Typography>{formatDate(driver.licenseExpiration)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Veículo
                        </Typography>
                        <Typography>
                            {[
                                driver.vehiclePlate,
                                driver.vehicleType,
                                driver.vehicleModel,
                                driver.vehicleColor,
                            ]
                                .filter(Boolean)
                                .join(' | ') || '—'}
                        </Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Metragem da caçamba (m³)
                        </Typography>
                        <Typography>{format(driver.dumpsterSizeInCubicMeters)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Chave Pix
                        </Typography>
                        <Typography>{format(driver.pixKey)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Tipo da chave Pix
                        </Typography>
                        <Typography>{format(driver.pixKeyType)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Saldo de crédito (R$)
                        </Typography>
                        <Typography>{driver.creditBalance?.toFixed(2) ?? '—'}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Disponível para entregas?
                        </Typography>
                        <Typography>{formatBool(driver.isAvailable)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Cadastrado em
                        </Typography>
                        <Typography>{formatDate(driver.registeredAt)}</Typography>
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
