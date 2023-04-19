import { useState, useEffect } from "react";
import { act } from "@testing-library/react";
import { Container, Typography, Box } from "@mui/material";
import RefreshControls from "./RefreshControls";
// import SearchInput from "./SearchInput";
import DataTable from "./DataTable";
import StatsTable from "./StatsTable";
import InfoBoxes from "./InfoBoxes";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { fetchPgpData } from "../api";

function MainLayout() {
  const { t } = useTranslation();
  //const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);

  const fetchData = async function() {
    const fetchedData = await fetchPgpData();
    act(() => {
      setData(fetchedData);
    });
  };
 
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Container>
        <Box
          display="flex"
          paddingTop="10px"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="space-between"
          minHeight="60px"
        >
          <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
            <Typography variant="h4">{t("Page Title")}</Typography>
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <LanguageSwitcher />
              </Box>
              <RefreshControls onRefresh={fetchData} autoRefreshInterval={60000} />
            </Box>
          </Box>
          {/* Rest of your layout components */}
        </Box>
      </Container>
      <h2>{t("Settings")}</h2>
      <InfoBoxes data={data} />
      {/* <SearchInput onSearch={setSearchQuery} /> */}
      <h2>{t("Gossip Peers")}</h2>
      <DataTable data={data} />
      <h2>{t("Statistics")}</h2>
      <StatsTable data={data} />
    </Container>
  );
}

export default MainLayout;
