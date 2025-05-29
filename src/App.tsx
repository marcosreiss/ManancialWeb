import { PrivateRouter, PublicRouter } from "./routes/section";
import '@/global.css';


function App() {

  const isAuthenticated = false;

  return isAuthenticated ? (
    <PrivateRouter />
  ) : (
    <PublicRouter />
  );
}

export default App
