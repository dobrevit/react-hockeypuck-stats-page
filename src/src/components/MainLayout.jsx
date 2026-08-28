import { useState, useEffect, useCallback } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import RefreshControls from "./RefreshControls";
import DataTable from "./DataTable";
import StatsTable from "./StatsTable";
import InfoBoxes from "./InfoBoxes";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { fetchPgpData } from "../api";
import { EMPTY_STATS } from "../utils/stats";

const AUTO_REFRESH_INTERVAL_MS = 60000;

function MainLayout() {
  const { t } = useTranslation();
  const [data, setData] = useState(EMPTY_STATS);
  const [error, setError] = useState(null);

  // A failed refresh keeps the last good document on screen rather than
  // blanking the page, and says so above the tables.
  const fetchData = useCallback(async () => {
    try {
      setData(await fetchPgpData());
      setError(null);
    } catch (cause) {
      setError(cause.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container maxWidth="lg">
      <Container>
        {/* Box no longer hoists shorthand system props into sx, so layout has
            to be written as sx or it is silently dropped. */}
        <Box
          sx={{
            display: "flex",
            paddingTop: "10px",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            minHeight: "60px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="h4">{t("Page Title")}</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ marginRight: 2 }}>
                <LanguageSwitcher />
              </Box>
              <RefreshControls
                onRefresh={fetchData}
                autoRefreshInterval={AUTO_REFRESH_INTERVAL_MS}
              />
            </Box>
          </Box>
        </Box>
      </Container>
      {error && (
        <Alert severity="error" sx={{ marginTop: 1 }}>
          {t("Could not load statistics.")} {error}
        </Alert>
      )}
      <h2>{t("Settings")}</h2>
      <InfoBoxes data={data} />
      <h2>{t("Gossip Peers")}</h2>
      <DataTable data={data} />
      <h2>{t("Statistics")}</h2>
      <StatsTable data={data} />
    </Container>
  );
}

export default MainLayout;
