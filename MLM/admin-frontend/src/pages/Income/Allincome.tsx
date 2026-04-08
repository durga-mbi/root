import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllIncome } from "../../hooks/Income/useAllIncome";
import { useGenerateIncome } from "../../hooks/Income/useGenerateIncome";
import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function Allincome() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, isLoading, isError, refetch } = useAllIncome(page + 1, rowsPerPage);
  const { generateIncome, isGenerating } = useGenerateIncome();

  const handleGenerateIncome = async () => {
    if (window.confirm("Are you sure you want to generate income for all members? This should typically be done once a day.")) {
      await generateIncome();
      refetch(); // Refresh the list after generation
    }
  };

  // ✅ Extract correctly from backend response
  const incomeList = data?.data?.data ?? [];
  const totalCount = data?.data?.total ?? 0;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error">
        Failed to load income data
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          All Income (Date Wise)
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PlayArrowIcon />}
          onClick={handleGenerateIncome}
          disabled={isGenerating}
          sx={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            color: "white",
            fontWeight: "bold",
            padding: "8px 24px",
            borderRadius: "25px",
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            "&:hover": {
              background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
            }
          }}
        >
          {isGenerating ? "Processing..." : "Process Daily Income"}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>Sl No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Binary Income (₹)</TableCell>
              <TableCell>Royalty Income (₹)</TableCell>
              <TableCell>Total Income (₹)</TableCell>
              <TableCell>TDS (₹)</TableCell>
              <TableCell>Admin Charges (₹)</TableCell>
              <TableCell>Net Income (₹)</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {incomeList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No income records found
                </TableCell>
              </TableRow>
            ) : (
              incomeList.map((row: any, index: number) => {
                const totalBinary = Number(row.totalBinary || 0);
                const totalRoyalty = Number(row.totalRoyalty || 0);
                const totalIncome = Number(row.totalIncome);
                const tds = Number(row.tds);
                const adminCharges = Number(row.adminCharges);
                const netIncome = Number(row.netincome);

                return (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell>
                      {new Date(row.generatedDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{totalBinary.toLocaleString()}</TableCell>
                    <TableCell>{totalRoyalty.toLocaleString()}</TableCell>
                    <TableCell>{totalIncome.toLocaleString()}</TableCell>
                    <TableCell>{tds.toLocaleString()}</TableCell>
                    <TableCell>{adminCharges.toLocaleString()}</TableCell>

                    <TableCell>
                      <b>{netIncome.toLocaleString()}</b>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/date-wise-income/${row.id}`
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalCount}
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

export default Allincome;