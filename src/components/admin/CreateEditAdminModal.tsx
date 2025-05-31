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
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { Admin } from '@/models/adminModel';

type FormAdmin = Admin & { password?: string };

type Props = {
    open: boolean;
    onClose: () => void;
    initialData?: Admin | null;
    onSubmit: (data: FormAdmin) => void;
    readOnly?: boolean;
    loading?: boolean;
};

export default function CreateEditAdminModal({
    open,
    onClose,
    initialData,
    onSubmit,
    readOnly = false,
    loading = false,
}: Props) {
    const isEditMode = !!initialData;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormAdmin>({
        defaultValues: {
            id: '',
            fullName: '',
            email: '',
            cpf: '',
            phoneNumber: '',
            isActive: true,
            createdAt: '',
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
                    cpf: '',
                    phoneNumber: '',
                    isActive: true,
                    createdAt: '',
                    password: '',
                });
            }
        }
    }, [open, initialData, reset, isEditMode]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? 'Editar Admin' : 'Novo Admin'}</DialogTitle>

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
                                disabled={readOnly || isEditMode} // desabilita edição de email
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        name="cpf"
                        control={control}
                        rules={{ required: 'CPF é obrigatório' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                fullWidth
                                label="CPF"
                                disabled={readOnly}
                                error={!!errors.cpf}
                                helperText={errors.cpf?.message}
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
                    {isEditMode && (
                        <Controller
                            name="isActive"
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
                                    label="Ativo"
                                />
                            )}
                        />
                    )}

                    {!isEditMode && (
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: 'Senha é obrigatória' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="password"
                                    margin="normal"
                                    fullWidth
                                    label="Senha"
                                    disabled={readOnly}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
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
