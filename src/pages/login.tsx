import {
  Box,
  Button,
  TextField,
  Paper,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from '@/routes/hooks';
import type { TokenModel } from '@/models/authModel';

type FormValues = {
  email: string;
  senha: string;
};

export default function Login() {
  const { setToken } = useAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: FormValues) => {
    login(
      {
        username: data.email,
        password: data.senha,
      },
      {
        onSuccess: (response) => {
          const token = response.token;
          try {
            const decoded: TokenModel = jwtDecode(token);

            if (decoded?.role !== 'Admin') {
              addNotification('Usuário não possui permissão de administrador.', 'error');
              return;
            }

            setToken(token);
            addNotification('Login realizado com sucesso!', 'success');
            router.push('/'); // Altere para sua rota desejada
          } catch (err) {
            console.error('Erro ao decodificar token:', err);
            addNotification('Erro ao processar autenticação.', 'error');
          }
        },
        onError: () => {
          addNotification('Credenciais inválidas.', 'error');
        },
      }
    );
  };

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
        <Box>
          <img
            src="/images/logo.png"
            alt="Logo A SOS"
            style={{ height: 220, borderRadius: '20px' }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: 300 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="E-mail de Acesso:"
              variant="outlined"
              size="small"
              {...register('email', { required: 'Informe o e-mail' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Senha:"
              type="password"
              variant="outlined"
              size="small"
              {...register('senha', { required: 'Informe a senha' })}
              error={!!errors.senha}
              helperText={errors.senha?.message}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isPending}
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
        </form>
      </Box>
    </Paper>
  );
}
