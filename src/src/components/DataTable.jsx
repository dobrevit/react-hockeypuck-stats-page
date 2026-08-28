import { Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { peerStatsUrl } from "../utils/stats";
import { formatDateTime } from "../utils/format";

function DataTable({ data }) {
  const { t } = useTranslation();
  const peers = data?.peers;

  if (!Array.isArray(peers) || peers.length === 0) {
    return <p>{t("No data available.")}</p>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("Name")}</TableCell>
          <TableCell>{t("HTTP Address")}</TableCell>
          <TableCell>{t("Recon Address")}</TableCell>
          <TableCell>{t("Recon Status")}</TableCell>
          <TableCell>{t("Last Recon")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {peers.map((peer) => (
          <TableRow key={peer.reconAddr || peer.name}>
            <TableCell>{peer.name}</TableCell>
            <TableCell>
              <a href={peerStatsUrl(peer)} aria-label={t("Visit the {{name}} peer", { name: peer.name })}>
                {peer.httpAddr}
              </a>
            </TableCell>
            <TableCell>{peer.reconAddr}</TableCell>
            <TableCell>
              <PeerStatus peer={peer} />
            </TableCell>
            <TableCell>{formatDateTime(peer.lastIncomingRecon ?? peer.lastOutgoingRecon)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// The status word on its own does not say why a peer is unhappy, so hang the
// most recent error off it as a tooltip when the server reported one.
function PeerStatus({ peer }) {
  const { t } = useTranslation();
  const status = peer.reconStatus || t("Unknown");
  const error = peer.lastIncomingError || peer.lastOutgoingError || peer.lastRecoveryError;

  if (!error) {
    return status;
  }

  return (
    <Tooltip title={error}>
      <span>{`${status} ⚠`}</span>
    </Tooltip>
  );
}

export default DataTable;
