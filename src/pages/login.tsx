import {
    Box,
    Button,
    TextField,
    Paper,
    Stack,
} from '@mui/material';

export default function Login() {
    return (
        <Paper
            elevation={4}
            sx={{
                display: 'flex',
                width: 800,
                maxWidth: '95%',
                height: 460,
                borderRadius: 4,
                overflow: 'hidden',
            }}
        >
            {/* Lado Esquerdo com fundo e texto */}
            <Box
                sx={{
                    flex: 1,
                    backgroundImage: 'url("/images/bg-login.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 4,
                    py: 5,
                }}
            >
                {/* Logo no topo */}
                <Box>
                    <img
                        src="/images/logo.png"
                        alt="Logo A SOS"
                        style={{ height: 220, borderRadius: '20px' }}
                    />
                </Box>
            </Box>


            {/* Lado Direito com formulário */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 4,
                }}
            >
                <Stack spacing={2} width="100%" maxWidth={300}>
                    <TextField
                        fullWidth
                        label="E-mail de Acesso:"
                        variant="outlined"
                        size="small"
                    />

                    <TextField
                        fullWidth
                        label="Senha:"
                        type="password"
                        variant="outlined"
                        size="small"
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: '#1f344a',
                            color: '#fff',
                            fontWeight: 'bold',
                            mt: 1,
                            '&:hover': {
                                backgroundColor: '#172b3f',
                            },
                        }}
                    >
                        AVANÇAR
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}
