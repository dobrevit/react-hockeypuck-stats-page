import { useState, useEffect } from "react";
import { Container } from "@mui/material";
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
    setData(fetchedData);
  };
 
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <h1>{t("Page Title")}</h1><LanguageSwitcher />
      <h2>{t("Settings")}</h2>
      <InfoBoxes data={data} onRefresh={fetchData} />
      {/* <SearchInput onSearch={setSearchQuery} /> */}
      <h2>{t("Gossip Peers")}</h2>
      <DataTable data={data} />
      <h2>{t("Statistics")}</h2>
      <StatsTable data={data} />
    </Container>
  );
}

export default MainLayout;
