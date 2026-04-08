import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useBatchIncome } from "../../hooks/Income/useBatchIncome";

function DateWiseUserIncome() {
  const { id } = useParams<{ id: string }>();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, isLoading } = useBatchIncome(
    id,
    page + 1,
    rowsPerPage
  );

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={1}>
        Batch Wise User Income
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Detailed income for Batch ID: <b>{id}</b>
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Sl No</TableCell>
              <TableCell>User Info</TableCell>
              <TableCell>Binary Income (₹)</TableCell>
              <TableCell>Royalty Income (₹)</TableCell>
              <TableCell>TDS (₹)</TableCell>
              <TableCell>Admin Charges (₹)</TableCell>
              <TableCell>Net Income (₹)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row: any, index: number) => {
                return (
                  <TableRow key={row.userId} hover>
                    <TableCell>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600} variant="body2">
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.memId}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.binaryIncome.toLocaleString()}</TableCell>
                    <TableCell>{row.royaltyIncome.toLocaleString()}</TableCell>
                    <TableCell>{row.tds.toLocaleString()}</TableCell>
                    <TableCell>{row.adminCharges.toLocaleString()}</TableCell>
                    <TableCell>
                      <b>{row.netIncome.toLocaleString()}</b>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
}

export default DateWiseUserIncome;
