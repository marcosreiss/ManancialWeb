import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControlLabel,
    Switch,
    IconButton,
    InputAdornment,
    MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { Driver, PixKeyType } from '@/models/driverModel';

type FormDriver = Driver & { password?: string };

type Props = {
    open: boolean;
    onClose: () => void;
    initialData?: Driver | null;
    onSubmit: (data: FormDriver) => void;
    readOnly?: boolean;
    loading?: boolean;
};

const pixKeyTypes: PixKeyType[] = ['CPF', 'CNPJ', 'Email', 'Phone', 'Random'];

export default function CreateEditDriverModal({
    open,
    onClose,
    initialData,
    onSubmit,
    readOnly = false,
    loading = false,
}: Props) {
    const isEditMode = !!initialData;
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormDriver>({
        defaultValues: {
            id: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            cpf: '',
            cnhNumber: '',
            licenseExpiration: '',
            vehiclePlate: '',
            vehicleType: '',
            vehicleModel: '',
            vehicleColor: '',
            dumpsterSizeInCubicMeters: undefined,
            pixKey: '',
            pixKeyType: undefined,
            isAvailable: true,
            creditBalance: undefined,
            registeredAt: '',
            password: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (isEditMode && initialData) {
                reset(initialData);
            } else {
                reset({
                    id: '',
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    cpf: '',
                    cnhNumber: '',
                    licenseExpiration: '',
                    vehiclePlate: '',
                    vehicleType: '',
                    vehicleModel: '',
                    vehicleColor: '',
                    dumpsterSizeInCubicMeters: undefined,
                    pixKey: '',
                    pixKeyType: undefined,
                    isAvailable: true,
                    creditBalance: undefined,
                    registeredAt: '',
                    password: '',
                });
            }
        }
    }, [open, initialData, reset, isEditMode]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isEditMode ? 'Editar Motorista' : 'Novo Motorista'}</DialogTitle>

            <DialogContent dividers>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    {/* Informações pessoais */}
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
                                disabled={readOnly}
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                            />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email é obrigatório',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'Email inválido',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Email"
                                disabled={readOnly || isEditMode}
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
                                disabled={readOnly}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                            />
                        )}
                    />

                    {!isEditMode && (
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: 'Senha é obrigatória' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    margin="normal"
                                    fullWidth
                                    label="Senha"
                                    disabled={readOnly}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(prev => !prev)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    )}

                    {/* Documentos e licença */}
                    <Controller
                        name="cpf"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="CPF"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="cnhNumber"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Número da CNH"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="licenseExpiration"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                margin="normal"
                                fullWidth
                                label="Validade da CNH"
                                InputLabelProps={{ shrink: true }}
                                disabled={readOnly}
                            />
                        )}
                    />

                    {/* Veículo */}
                    <Controller
                        name="vehiclePlate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Placa do veículo"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="vehicleType"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Tipo do veículo"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="vehicleModel"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Modelo do veículo"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="vehicleColor"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Cor do veículo"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="dumpsterSizeInCubicMeters"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                margin="normal"
                                fullWidth
                                label="Metragem da caçamba (m³)"
                                disabled={readOnly}
                            />
                        )}
                    />

                    {/* Pix */}
                    <Controller
                        name="pixKey"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Chave Pix"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="pixKeyType"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                margin="normal"
                                fullWidth
                                label="Tipo da chave Pix"
                                disabled={readOnly}
                            >
                                {pixKeyTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* Disponibilidade */}
                    <Controller
                        name="isAvailable"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        {...field}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        disabled={readOnly}
                                    />
                                }
                                label="Disponível para entregas"
                            />
                        )}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                {!readOnly && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Salvar'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
