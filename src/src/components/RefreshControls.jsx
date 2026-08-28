import { Button, FormControlLabel, Switch } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function RefreshControls({ onRefresh, autoRefreshInterval }) {
  const { t } = useTranslation();
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Owning the interval in an effect rather than in the change handler means
  // it is torn down on unmount and whenever the switch or interval changes.
  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }
    const intervalId = setInterval(onRefresh, autoRefreshInterval);
    return () => clearInterval(intervalId);
  }, [autoRefresh, onRefresh, autoRefreshInterval]);

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={autoRefresh}
            onChange={(event) => setAutoRefresh(event.target.checked)}
          />
        }
        label={t("Auto-refresh")}
      />
      <Button variant="contained" color="primary" onClick={onRefresh}>
        {t("Refresh")}
      </Button>
    </>
  );
}

export default RefreshControls;
