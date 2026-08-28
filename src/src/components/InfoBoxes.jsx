import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatNumber, formatDateTime } from "../utils/format";
import { useTranslation } from "react-i18next";

const { host } = window.location;

function InfoBoxes({ data }) {
  const { t } = useTranslation();

  if (!data) {
    return <p>{t("No data available.")}</p>;
  }

  const { now, software, version, hostname, nodename, total, contact, reconAddr, httpAddr } = data;

  // The document names the server as well as its version, so show both.
  const softwareVersion = [software, version].filter(Boolean).join(" ");

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title={t("Software Version")} value={softwareVersion} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title={t("Hostname")} value={hostname} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title={t("Nodename")} value={nodename} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title={t("Contact")} value="">
          {contact && (
            <a
              href={`http://${host}/pks/lookup?op=index&fingerprint=on&search=${contact}`}
              aria-label={t("Contact the server administrator")}
            >
              {contact}
            </a>
          )}
        </InfoBox>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title="HTTP" value={httpAddr} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title={t("Recon")} value={reconAddr} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title={t("Total Keys")} value={formatNumber(total)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <InfoBox title={t("Data Generated")} value={formatDateTime(now)} />
      </Grid>
    </Grid>
  );
}

const InfoBoxValueWrapper = styled(Box)({
  minHeight: "75px",
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
          {children}
        </InfoBoxValueWrapper>
      </CardContent>
    </Card>
  );
}

export default InfoBoxes;
