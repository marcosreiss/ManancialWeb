import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    CircularProgress,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import MapViewer from '@/components/shared/MapViewer';
import { useGetCustomerById, useUpdateCustomer } from '@/hooks/useCustomer';
import { useNotification } from '@/context/NotificationContext';
import type { UpdateCustomerPayload } from '@/models/customerModel';
import { getLatLngFromAddressService } from '@/services/utils/googleMapsService';

interface Props {
    open: boolean;
    onClose: () => void;
    customerId: string;
}

export default function EditCustomerModal({ open, onClose, customerId }: Props) {
    const { addNotification } = useNotification();
    const updateMutation = useUpdateCustomer();
    const { data: customer, isLoading: loadingCustomer } = useGetCustomerById(customerId);

    const [addressLoading, setAddressLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<UpdateCustomerPayload>({
        defaultValues: {
            id: '',
            fullName: '',
            phoneNumber: '',
            cpForCNPJ: '',
            defaultAddress: {
                street: '',
                number: '',
                neighborhood: '',
                city: '',
                state: '',
                zipCode: '',
                complement: '',
                latitude: 0,
                longitude: 0,
            },
            additionalInfo: '',
            receivesPromotions: true,
        },
    });

    useEffect(() => {
        if (customer) {
            reset({
                id: customer.id,
                fullName: customer.fullName,
                phoneNumber: customer.phoneNumber,
                cpForCNPJ: customer.cpForCNPJ || '',
                defaultAddress: customer.defaultAddress || {
                    street: '',
                    number: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    complement: '',
                    latitude: 0,
                    longitude: 0,
                },
                additionalInfo: customer.additionalInfo || '',
                receivesPromotions: customer.receivesPromotions,
            });

            if (customer.defaultAddress) {
                const { latitude, longitude } = customer.defaultAddress;
                setMapCenter({ lat: latitude, lng: longitude });
                setMarkerPos({ lat: latitude, lng: longitude });
            }
        }
    }, [customer, reset]);

    const buildAddressString = (data: UpdateCustomerPayload) => {
        const addr = data.defaultAddress;
        if (addr) {
            return `${addr.street}, ${addr.number} - ${addr.neighborhood}, ${addr.city} - ${addr.state}, ${addr.zipCode}${addr.complement ? `, ${addr.complement}` : ''}`;
        }
        return '';
    };

    const handleFindAddress = async () => {
        const data = getValues();
        const addressString = buildAddressString(data);
        if (!addressString) return;
        setAddressLoading(true);
        try {
            const { lat, lng } = await getLatLngFromAddressService(addressString);
            setMapCenter({ lat, lng });
            setMarkerPos({ lat, lng });
        } catch {
            addNotification('Endereço não encontrado.', 'error');
        } finally {
            setAddressLoading(false);
        }
    };

    const onSubmit = (data: UpdateCustomerPayload) => {
        if (markerPos) {
            data.defaultAddress!.latitude = markerPos.lat;
            data.defaultAddress!.longitude = markerPos.lng;
        }
        updateMutation.mutate(
            { id: data.id, payload: data },
            {
                onSuccess: () => {
                    addNotification('Cliente atualizado com sucesso.', 'success');
                    onClose();
                },
                onError: () => addNotification('Erro ao atualizar cliente.', 'error'),
            }
        );
    };

    if (loadingCustomer) {
        return (
            <Dialog open={open} fullWidth maxWidth="sm">
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogContent dividers>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    {/* Dados pessoais */}
                    <Controller
                        name="fullName"
                        control={control}
                        rules={{ required: 'Nome é obrigatório' }}
                        render={({ field }) => (
                            <TextField {...field} margin="normal" fullWidth label="Nome completo" error={!!errors.fullName} helperText={errors.fullName?.message} />
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{ required: 'Telefone é obrigatório' }}
                        render={({ field }) => (
                            <TextField {...field} margin="normal" fullWidth label="Telefone" error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />
                        )}
                    />
                    <Controller
                        name="cpForCNPJ"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} margin="normal" fullWidth label="CPF ou CNPJ" />
                        )}
                    />

                    {/* Endereço */}
                    <Controller name="defaultAddress.street" control={control} render={({ field }) => (
                        <TextField {...field} margin="normal" fullWidth label="Rua" />
                    )} />
                    <Controller name="defaultAddress.number" control={control} render={({ field }) => (
                        <TextField {...field} margin="normal" fullWidth label="Número" />
                    )} />
                    <Controller name="defaultAddress.neighborhood" control={control} render={({ field }) => (
                        <TextField {...field} margin="normal" fullWidth label="Bairro" />
                    )} />
                    <Controller name="defaultAddress.city" control={control} render={({ field }) => (
                        <TextField {...field} margin="normal" fullWidth label="Cidade" />
                    )} />
                    <Controller name="defaultAddress.state" control={control} render={({ field }) => (
                        <TextField {...field} margin="normal" fullWidth label="Estado" />
                    )} />
                    <Controller name="defaultAddress.zipCode" control={control} render={({ field }) => (
                        <TextField {...field} margin="normal" fullWidth label="CEP" />
                    )} />
                    <Controller name="defaultAddress.complement" control={control} render={({ field }) => (
                        <TextField {...field} margin="normal" fullWidth label="Complemento" />
                    )} />

                    {/* Buscar no mapa */}
                    <Button onClick={handleFindAddress} disabled={addressLoading} sx={{ mt: 1 }}>
                        {addressLoading ? <CircularProgress size={24} /> : 'Recalcular localização'}
                    </Button>

                    {mapCenter && (
                        <Box mt={2} mb={2}>
                            <MapViewer center={mapCenter} markers={markerPos ? [markerPos] : []} />
                        </Box>
                    )}

                    {/* Receber promoções */}
                    <FormControlLabel
                        control={
                            <Controller
                                name="receivesPromotions"
                                control={control}
                                render={({ field }) => <Switch {...field} checked={field.value} />}
                            />
                        }
                        label="Receber promoções"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={updateMutation.status === 'pending'}>
                    {updateMutation.status === 'pending' ? 'Atualizando...' : 'Atualizar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
