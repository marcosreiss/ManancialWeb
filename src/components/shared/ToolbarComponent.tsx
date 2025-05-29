import { Button, Stack, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface ToolbarComponentProps {
    searchValue: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateClick: () => void;
    onDeleteClick: () => void;
    selectedCount: number;
    createLabel: string; // Ex: "Nova Categoria", "Novo Produto"
}

export default function ToolbarComponent({
    searchValue,
    onSearchChange,
    onCreateClick,
    onDeleteClick,
    selectedCount,
    createLabel,
}: ToolbarComponentProps) {
    return (
        <Stack direction="row" spacing={2} mb={2} alignItems="center">
            <TextField
                label="Pesquisar..."
                value={searchValue}
                onChange={onSearchChange}
                size="small"
            />
            <Button variant="contained" onClick={onCreateClick}>
                {createLabel}
            </Button>
            {selectedCount > 0 && (
                <Button
                    onClick={onDeleteClick}
                    startIcon={<Delete />}
                    sx={{
                        color: 'error.main',
                        backgroundColor: 'transparent',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '999px',
                        px: 2,
                        py: 1,
                        minWidth: 0,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.05)',
                        },
                    }}
                >
                    Deletar ({selectedCount})
                </Button>
            )}
        </Stack>
    );
}
