// src/components/InfoBoxes.js
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/system";
import { formatNumber } from "../utils/format";
import { useTranslation } from "react-i18next";

const { host } = window.location;

function InfoBoxes({ data }) {
  const { t } = useTranslation();
  // check if data is available
  if (!data) {
    return <p>{t("No data available.")}</p>;
  }

  const { now, version, hostname, nodename, Total, contact, reconAddr, httpAddr } = data;

  return (
    <Grid container spacing={1}>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title={t("Software Version")} value={version} />
      </Grid>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title={t("Hostname")} value={hostname} />
      </Grid>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title={t("Nodename")} value={nodename} />
      </Grid>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title={t("Contact")} value="">
          <a href={`http://${host}/pks/lookup?op=index&fingerprint=on&search=${contact}`} aria-label={t("Contact the server administrator")}>{contact}</a>
	      </InfoBox>
      </Grid>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title="HTTP" value={httpAddr} />
      </Grid>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title={t("Recon")} value={reconAddr} />
      </Grid>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title={t("Total Keys")} value={formatNumber(Total)} />
      </Grid>
      <Grid  item xs={12} sm={6} md={3}>
        <InfoBox title={t("Data Generated")} value={new Date(now).toLocaleString()} />
      </Grid>
    </Grid>
  );
}

const InfoBoxValueWrapper = styled(Box)({
  minHeight: "75px", // You can adjust this value according to your needs
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  overflowWrap: "anywhere",
});

function InfoBox({ title, value, children }) {
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <InfoBoxValueWrapper>
          <Typography variant="h6" component="div">
            {value}
          </Typography>
          { children }
        </InfoBoxValueWrapper>
      </CardContent>
    </Card>
  );
}

export default InfoBoxes;
