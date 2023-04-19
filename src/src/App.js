import { CssBaseline } from "@mui/material";
import MainLayout from "./components/MainLayout";
import PageTitle from './components/PageTitle';

function App() {
  return (
    <>
      <PageTitle titleKey="Page Title" />
      <CssBaseline />
      <MainLayout />
    </>
  );
}

export default App;
