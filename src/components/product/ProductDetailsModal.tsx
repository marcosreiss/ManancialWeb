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
} from "@mui/material";
import type { Product } from "@/models/productModel";

interface ProductDetailsModalProps {
    open: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function ProductDetailsModal({
    open,
    onClose,
    product,
}: ProductDetailsModalProps) {
    if (!product) return null;

    const format = (value?: string | null) => (value ? value : "—");
    const formatBoolean = (value: boolean) => (value ? "Sim" : "Não");

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Detalhes do Produto</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nome
                        </Typography>
                        <Typography variant="body1">{format(product.name)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Descrição
                        </Typography>
                        <Typography variant="body1">{format(product.description)}</Typography>
                    </Stack>

                    <Divider />

                    <Stack>
                        <Typography variant="subtitle2" color="text.secondary">
                            Produto ativo?
                        </Typography>
                        <Typography variant="body1">{formatBoolean(product.isActive)}</Typography>
                    </Stack>

                    {product.productPictureUrl && (
                        <>
                            <Divider />
                            <Stack>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Imagem
                                </Typography>
                                <Box
                                    component="img"
                                    src={product.productPictureUrl}
                                    alt="Imagem do produto"
                                    sx={{
                                        maxHeight: 220,
                                        maxWidth: "100%",
                                        borderRadius: 2,
                                        mt: 1,
                                        boxShadow: 1,
                                    }}
                                />
                            </Stack>
                        </>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}
