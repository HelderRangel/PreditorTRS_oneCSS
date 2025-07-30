import { Route, Routes, Navigate } from "react-router-dom";
import { FurnacePage } from "../pages/FcPages";

export function AppRoutes() {
  return (
    <Routes>
      {/* Redireciona da raiz para /fc42 */}
      <Route path="/" element={<Navigate to="/fc42" replace />} />

      <Route
        path="/fc42"
        element={<FurnacePage endpoint="/fc42/preditor" toggleActive="fc42" />}
      />
      <Route
        path="/fc43"
        element={<FurnacePage endpoint="/fc43/preditor" toggleActive="fc43" />}
      />
    </Routes>
  );
}
