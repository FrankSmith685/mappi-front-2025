import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";

interface CustomTableProps {
  headers: string[];
  data?: string[][];
  rows?: number;
  columns?: number;
  loading?: boolean;
  columnWidths?: string[]; // 👈 nuevo
}

const CustomTable = ({
  headers,
  data = [],
  rows = data.length || 0,
  columns = headers.length,
  loading = false,
  columnWidths = [], // 👈 valores opcionales
}: CustomTableProps) => {
  return (
    <TableContainer
      component={Paper}
      className="rounded-xl border border-gray-200 shadow-sm overflow-x-auto"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <Table
        className="min-w-full"
        size="medium"
        sx={{ tableLayout: "fixed" }} // 👈 fuerza a respetar los anchos
      >
        {/* 🔹 Encabezado */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F0F7F4" }}>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#374151",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  paddingY: "12px",
                  paddingX: "16px",
                  borderBottom: "2px solid #E5E7EB",
                  whiteSpace: "nowrap",
                  width: columnWidths[index] || "auto", // 👈 ancho personalizado
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* 🔹 Cuerpo */}
        <TableBody>
          {loading ? (
            Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} sx={{ paddingY: "10px", paddingX: "16px" }}>
                    <Skeleton height={28} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {row.map((cell, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      color: "#374151",
                      fontSize: "0.9rem",
                      paddingY: "12px",
                      paddingX: "16px",
                      borderBottom: "1px solid #F0F0F0",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: columnWidths[colIndex] || "auto", // 👈 ancho personalizado
                    }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns}
                sx={{
                  textAlign: "center",
                  color: "#6B7280",
                  fontStyle: "italic",
                  paddingY: "24px",
                }}
              >
                No hay planes disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
