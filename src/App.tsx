import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/job/:id" element={<JobDetail />} />
      </Routes>
    </Router>
  );
};

export default App;