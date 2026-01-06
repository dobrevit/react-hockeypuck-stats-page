// src/components/StatsTable.js
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Box, Collapse } from "@mui/material";
import { useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { formatNumber } from "../utils/format";
import { useTranslation } from "react-i18next";

function StatsTable({ data }) {
  const { t } = useTranslation();

  if (!Array.isArray(data.Hourly) || data.Hourly.length === 0 || !Array.isArray(data.Daily) || data.Daily.length === 0) {
    return <p>{t("No data available.")}</p>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("Date")}</TableCell>
          <TableCell>{t("Inserted")}</TableCell>
          <TableCell>{t("Updated")}</TableCell>
          <TableCell>{t("Removed")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.Daily.map((row, index) => (
          <Row key={index} row={row} hourlyData={data.Hourly} />
        ))}
      </TableBody>
    </Table>
  );
}

function Row({ row, hourlyData }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const filteredHourlyData = hourlyData.filter(
    (item) => new Date(item.Time).toLocaleDateString() === new Date(row.Time).toLocaleDateString()
  );

  const hasHourlyData = filteredHourlyData.length > 0;

  return (
    <>
      <TableRow>
        <TableCell>
          {new Date(row.Time).toLocaleDateString()}
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{formatNumber(row.Inserted)}</TableCell>
        <TableCell>{formatNumber(row.Updated)}</TableCell>
        <TableCell>{formatNumber(row.Removed)}</TableCell>
      </TableRow>
      {!hasHourlyData && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <p>{t("No hourly data available.")}</p>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      {hasHourlyData && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("Time")}</TableCell>
                      <TableCell>{t("Inserted")}</TableCell>
                      <TableCell>{t("Updated")}</TableCell>
                      <TableCell>{t("Removed")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHourlyData.map((hourlyRow, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(hourlyRow.Time).toLocaleTimeString()}</TableCell>
                        <TableCell>{formatNumber(hourlyRow.Inserted)}</TableCell>
                        <TableCell>{formatNumber(hourlyRow.Updated)}</TableCell>
                        <TableCell>{formatNumber(hourlyRow.Removed)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default StatsTable;
