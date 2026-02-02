// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddCreator from "./pages/AddCreator";
import ViewCreator from "./pages/ViewCreator";
import EditCreator from "./pages/EditCreator";

export default function App() {
  return (
    <div className="appBg">
      <Routes>
        {/* SAME page for / and /creators */}
        <Route path="/" element={<Home />} />
        <Route path="/creators" element={<Home />} />

        {/* other pages */}
        <Route path="/new" element={<AddCreator />} />
        <Route path="/creators/:id" element={<ViewCreator />} />
        <Route path="/creators/:id/edit" element={<EditCreator />} />
      </Routes>
    </div>
  );
}
