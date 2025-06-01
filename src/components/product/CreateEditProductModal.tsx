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
    InputLabel,
    Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { Product } from "@/models/productModel";

type FormProduct = {
    id?: string;
    name: string;
    description: string;
    isActive: boolean;
    imageFile?: File | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    initialData?: Product | null;
    onSubmit: (data: FormProduct) => void;
    readOnly?: boolean;
    loading?: boolean;
};

export default function CreateEditProductModal({
    open,
    onClose,
    initialData,
    onSubmit,
    readOnly = false,
    loading = false,
}: Props) {
    const isEditMode = !!initialData;

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormProduct>({
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
            imageFile: null,
        },
    });

    useEffect(() => {
        if (open) {
            if (isEditMode && initialData) {
                reset({
                    id: initialData.id,
                    name: initialData.name,
                    description: initialData.description,
                    isActive: initialData.isActive,
                    imageFile: null,
                });
                setImagePreview(initialData.productPictureUrl || null);
            } else {
                // 🛠 Corrige bug: limpa todos os campos e o preview
                reset({
                    id: "",
                    name: "",
                    description: "",
                    isActive: true,
                    imageFile: null,
                });
                setImagePreview(null);
            }
        }
    }, [open, isEditMode, initialData, reset]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setValue("imageFile", file);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditMode ? "Editar Produto" : "Novo Produto"}</DialogTitle>

            <DialogContent dividers>
                <Box component="form" noValidate>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Nome é obrigatório" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nome"
                                fullWidth
                                margin="normal"
                                disabled={readOnly}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Descrição é obrigatória" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Descrição"
                                fullWidth
                                multiline
                                minRows={3}
                                margin="normal"
                                disabled={readOnly}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />

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
                                label="Produto ativo"
                            />
                        )}
                    />

                    {!readOnly && (
                        <Box mt={2}>
                            <InputLabel>Imagem do produto</InputLabel>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </Box>
                    )}

                    {imagePreview && (
                        <Box mt={2}>
                            <Typography variant="caption">Pré-visualização:</Typography>
                            <Box
                                component="img"
                                src={imagePreview}
                                alt="Pré-visualização"
                                sx={{ mt: 1, maxHeight: 180, borderRadius: 2 }}
                            />
                        </Box>
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
                        {loading ? "Salvando..." : isEditMode ? "Atualizar" : "Salvar"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
