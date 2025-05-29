import { PrivateRouter, PublicRouter } from "./routes/section";
import { useAuth } from "@/context/AuthContext"; // ajuste o caminho se necessário
import '@/global.css';
import { CircularProgress, Box } from "@mui/material";

function App() {
  const { isAuthenticated } = useAuth();
  const authStatus = isAuthenticated();

  // Enquanto o AuthContext estiver verificando o token (authStatus === null)
  if (authStatus === null) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return authStatus ? <PrivateRouter /> : <PublicRouter />;
}

export default App;
