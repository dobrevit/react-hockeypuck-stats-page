import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Box, Collapse } from "@mui/material";
import { useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { formatNumber, formatDate, formatTime, isSameDay } from "../utils/format";
import { useTranslation } from "react-i18next";

function StatsTable({ data }) {
  const { t } = useTranslation();
  const daily = data?.daily;
  const hourly = data?.hourly;

  if (!Array.isArray(daily) || daily.length === 0) {
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
        {daily.map((row) => (
          <Row key={row.time.toISOString()} row={row} hourlyData={hourly ?? []} />
        ))}
      </TableBody>
    </Table>
  );
}

function Row({ row, hourlyData }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const filteredHourlyData = hourlyData.filter((item) => isSameDay(item.time, row.time));
  const hasHourlyData = filteredHourlyData.length > 0;

  return (
    <>
      <TableRow>
        <TableCell>
          {formatDate(row.time)}
          <IconButton
            aria-label={open ? t("Collapse row") : t("Expand row")}
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{formatNumber(row.inserted)}</TableCell>
        <TableCell>{formatNumber(row.updated)}</TableCell>
        <TableCell>{formatNumber(row.removed)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {hasHourlyData ? (
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
                    {filteredHourlyData.map((hourlyRow) => (
                      <TableRow key={hourlyRow.time.toISOString()}>
                        <TableCell>{formatTime(hourlyRow.time)}</TableCell>
                        <TableCell>{formatNumber(hourlyRow.inserted)}</TableCell>
                        <TableCell>{formatNumber(hourlyRow.updated)}</TableCell>
                        <TableCell>{formatNumber(hourlyRow.removed)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>{t("No hourly data available.")}</p>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default StatsTable;
