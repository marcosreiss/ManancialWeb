import { useState } from 'react';
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
import { useCreateCustomer } from '@/hooks/useCustomer';
import { useNotification } from '@/context/NotificationContext';
import type { CreateCustomerPayload } from '@/models/customerModel';
import { getLatLngFromAddressService } from '@/services/utils/googleMapsService';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateCustomerModal({ open, onClose }: Props) {
  const [addressLoading, setAddressLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);

  const { addNotification } = useNotification();
  const createMutation = useCreateCustomer();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CreateCustomerPayload>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
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

  const buildAddressString = (data: CreateCustomerPayload) => {
    const addr = data.defaultAddress;
    if(addr){
        return `${addr.street}, ${addr.number} - ${addr.neighborhood}, ${addr.city} - ${addr.state}, ${addr.zipCode}${addr.complement ? `, ${addr.complement}` : ''}`;
    }
    return "";
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

  const onSubmit = (data: CreateCustomerPayload) => {
    if (markerPos) {
      data.defaultAddress!.latitude = markerPos.lat;
      data.defaultAddress!.longitude = markerPos.lng;
    }
    data.password = "Senha123@"; //senha padrão, cliente vai trocar depois
    createMutation.mutate(data, {
      onSuccess: () => {
        addNotification('Cliente criado com sucesso.', 'success');
        onClose();
      },
      onError: () => addNotification('Erro ao criar cliente.', 'error'),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo Cliente</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          {/* Dados pessoais */}
          <Controller
            name="fullName"
            control={control}
            rules={{ required: 'Nome é obrigatório' }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Nome completo"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email é obrigatório', pattern: { value: /\S+@\S+\.\S+/, message: 'Email inválido' } }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            rules={{ required: 'Telefone é obrigatório' }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Telefone"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
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
          <Controller
            name="defaultAddress.street"
            control={control}
            render={({ field }) => (
              <TextField {...field} margin="normal" fullWidth label="Rua" />
            )}
          />
          <Controller
            name="defaultAddress.number"
            control={control}
            render={({ field }) => (
              <TextField {...field} margin="normal" fullWidth label="Número" />
            )}
          />
          <Controller
            name="defaultAddress.neighborhood"
            control={control}
            render={({ field }) => (
              <TextField {...field} margin="normal" fullWidth label="Bairro" />
            )}
          />
          <Controller
            name="defaultAddress.city"
            control={control}
            render={({ field }) => (
              <TextField {...field} margin="normal" fullWidth label="Cidade" />
            )}
          />
          <Controller
            name="defaultAddress.state"
            control={control}
            render={({ field }) => (
              <TextField {...field} margin="normal" fullWidth label="Estado" />
            )}
          />
          <Controller
            name="defaultAddress.zipCode"
            control={control}
            render={({ field }) => (
              <TextField {...field} margin="normal" fullWidth label="CEP" />
            )}
          />
          <Controller
            name="defaultAddress.complement"
            control={control}
            render={({ field }) => (
              <TextField {...field} margin="normal" fullWidth label="Complemento" />
            )}
          />

          {/* Botão localizar no mapa */}
          <Button onClick={handleFindAddress} disabled={addressLoading} sx={{ mt: 1 }}>
            {addressLoading ? <CircularProgress size={24} /> : 'Buscar no mapa'}
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
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={createMutation.status === 'pending'}
        >
          {createMutation.status === 'pending' ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
