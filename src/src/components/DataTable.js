import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";

function DataTable({ data }) {
  const { t } = useTranslation();

  if (!Array.isArray(data.peers) || data.peers.length === 0) {
    return <p>{t("No data available.")}</p>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("Name")}</TableCell>
          <TableCell>{t("HTTP Address")}</TableCell>
          <TableCell>{t("Recon Address")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data["peers"].map((row) => (
          <TableRow key={row.Name}>
            <TableCell>{row.Name}</TableCell>
            <TableCell><a href={`http://${row.httpAddr}/pks/lookup?op=stats`}>{row.httpAddr}</a></TableCell>
            <TableCell>{row.reconAddr}</TableCell>
            {/* Add more table cells for other fields */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DataTable;
