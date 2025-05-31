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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { Customer } from '@/models/customerModel';

type FormCustomer = Customer & { password?: string };

type Props = {
    open: boolean;
    onClose: () => void;
    initialData?: Customer | null;
    onSubmit: (data: FormCustomer) => void;
    readOnly?: boolean;
    loading?: boolean;
};

export default function CreateEditCustomerModal({
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
    } = useForm<FormCustomer>({
        defaultValues: {
            id: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            cpForCNPJ: '',
            defaultAddress: '',
            additionalInfo: '',
            receivesPromotions: true,
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
                    cpForCNPJ: '',
                    defaultAddress: '',
                    additionalInfo: '',
                    receivesPromotions: true,
                    registeredAt: '',
                    password: '',
                });
            }
        }
    }, [open, initialData, reset, isEditMode]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>

            <DialogContent dividers>
                <Box component="form" noValidate sx={{ mt: 1 }}>
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

                    <Controller
                        name="cpForCNPJ"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="CPF ou CNPJ"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="defaultAddress"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Endereço principal"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="additionalInfo"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="Informações adicionais"
                                disabled={readOnly}
                            />
                        )}
                    />

                    <Controller
                        name="receivesPromotions"
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
                                label="Receber promoções"
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
                                                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    )}
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
