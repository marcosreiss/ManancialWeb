import { useRouter } from '@/routes/hooks';
import { Box, Typography, Button, Stack } from '@mui/material';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      p={4}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" fontWeight="bold">
          Página não encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
          A página que você está tentando acessar não existe ou foi movida.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
        >
          Ir para a página inicial
        </Button>
      </Stack>
    </Box>
  );
}
