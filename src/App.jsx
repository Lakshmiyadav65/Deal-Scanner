import { Navigate, Route, Routes, useParams } from "react-router-dom";
import ScrollManager from "./components/ScrollManager.jsx";
import Explore from "./pages/Explore.jsx";
import Home from "./pages/Home.jsx";
import Restaurant from "./pages/Restaurant.jsx";

function RestaurantRoute() {
  const { slug } = useParams();
  return <Restaurant key={slug} />;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/restaurant/:slug" element={<RestaurantRoute />} />
        <Route path="/restaurant" element={<Navigate to="/restaurant/hyderabad-house" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
