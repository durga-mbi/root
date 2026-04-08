import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePayoutDetails } from "../../hooks/payout/usePayoutDetails";

function PayoutDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = usePayoutDetails(id, page, limit);

  const historyData = data?.data?.data || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <Box p={4}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <Typography variant="h6" fontWeight={600}>
          Payout Details – Batch #{id}
        </Typography>
      </Stack>

      {/* LOADING */}
      {isLoading && (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <CircularProgress />
          <Typography mt={2}>Loading payout details...</Typography>
        </Paper>
      )}

      {/* EMPTY */}
      {!isLoading && historyData.length === 0 && (
        <Paper sx={{ p: 6 }}>
          <Typography>No detailed records found for this payout batch.</Typography>
        </Paper>
      )}

      {/* TABLE */}
      {!isLoading && historyData.length > 0 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell>Sl No</TableCell>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Gross Amount</TableCell>
                  <TableCell>TDS</TableCell>
                  <TableCell>Admin Charges</TableCell>
                  <TableCell>Net Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Generated At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {historyData.map((row: any, index: number) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell fontWeight={600}>{row.user?.memberId}</TableCell>
                    <TableCell>{`${row.user?.firstName} ${row.user?.lastName}`}</TableCell>
                    <TableCell>₹{Number(row.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>₹{Number(row.tdsAmount).toFixed(2)}</TableCell>
                    <TableCell>₹{Number(row.adminCharges).toFixed(2)}</TableCell>
                    <TableCell fontWeight={700}>₹{Number(row.netAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === "ACTIVE" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* PAGINATION */}
      {!isLoading && totalPages > 1 && (
        <Stack alignItems="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}

export default PayoutDetails;
