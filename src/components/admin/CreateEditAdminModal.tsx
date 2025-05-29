import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { Admin } from '@/models/adminModel';

type Props = {
    open: boolean;
    onClose: () => void;
    initialData?: Admin | null;
    onSubmit: (data: Admin) => void;
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
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Admin>({
        defaultValues: {
            id: '',
            fullName: '',
            email: '',
            cpf: '',
            profilePictureUrl: '',
            isActive: true,
            createdAt: '',
        },
    });

    useEffect(() => {
        if (open && initialData) {
            reset(initialData);
        }
    }, [open, initialData, reset]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editar Admin</DialogTitle>

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
                                disabled={readOnly}
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
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
