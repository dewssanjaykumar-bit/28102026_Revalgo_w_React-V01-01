import { Navigate, Route, Routes } from "react-router-dom";
import CreateQuote from "../pages/CreateQuote/CreateQuote";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import NewQuote from "../pages/NewQuote/NewQuote";
import ViewQuote from "../pages/ViewQuote/ViewQuote";
import GlobalFilter from "../pages/GlobalFilter/GlobalFilter";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/createquote" element={<CreateQuote />} />
      <Route path="/newquote" element={<NewQuote />} />
      <Route path="/login" element={<Login />} />
      <Route path="/viewquote" element={<ViewQuote />} />
      <Route
        path="/quote-view"
        element={<Navigate to="/viewquote" replace />}
      />
      <Route path="/global-filter" element={<GlobalFilter />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
