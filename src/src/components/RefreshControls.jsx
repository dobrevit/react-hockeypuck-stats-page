import { Button, FormControlLabel, Switch } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function RefreshControls({ onRefresh, autoRefreshInterval }) {
  const { t } = useTranslation();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);

  const handleAutoRefreshChange = (event) => {
    setAutoRefresh(event.target.checked);
    if (event.target.checked) {
      // Start auto-refresh
      setRefreshIntervalId(
        setInterval(() => {
          onRefresh();
        }, autoRefreshInterval)
      );
      setAutoRefresh(!autoRefresh);
    } else {
      // Stop auto-refresh
      clearInterval(refreshIntervalId);
      setRefreshIntervalId(null);
      setAutoRefresh(!autoRefresh);
    }
  };

  const handleRefresh = () => {
    onRefresh();
  };

  // Set up auto-refresh
  useState(() => {
    if (autoRefresh) {
      const intervalId = setInterval(() => {
        onRefresh();
      }, autoRefreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, onRefresh, autoRefreshInterval]);

  // src/components/RefreshControls.js
  useEffect(() => {
    return () => {
      // Clean up the auto-refresh interval when the component is unmounted
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, [refreshIntervalId]);

  return (
    <>
      <FormControlLabel
        control={<Switch checked={autoRefresh} onChange={handleAutoRefreshChange} />}
        label={t("Auto-refresh")}
      />
      <Button variant="contained" color="primary" onClick={handleRefresh}>
        {t("Refresh")}
      </Button>
    </>
  );
}

export default RefreshControls;
