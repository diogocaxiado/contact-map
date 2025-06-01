import { Route, Routes } from "react-router";
import Home from "../page/Home";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
