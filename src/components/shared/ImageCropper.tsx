import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slider,
    Box,
} from "@mui/material";
import getCroppedImg from "@/utils/cropImage";

interface ImageCropperProps {
    open: boolean;
    imageSrc: string;
    onClose: () => void;
    onComplete: (file: File) => void;
    aspect?: number;
    outputSize?: { width: number; height: number };
}

export default function ImageCropper({
    open,
    imageSrc,
    onClose,
    onComplete,
    aspect = 4 / 3,
    outputSize = { width: 800, height: 600 },
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleCrop = async () => {
        if (!croppedAreaPixels) return;
        const file = await getCroppedImg(imageSrc, croppedAreaPixels, outputSize);
        onComplete(file);
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Recortar Imagem</DialogTitle>
            <DialogContent dividers>
                <Box position="relative" width="100%" height="400px" bgcolor="#333">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </Box>
                <Box mt={2} px={2}>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(_, value) => setZoom(value as number)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleCrop}>Recortar</Button>
            </DialogActions>
        </Dialog>
    );
}
