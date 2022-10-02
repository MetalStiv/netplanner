import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProjectPage from './pages/ProjectPage/ProjectPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App" style={{height: '100%'}}>
      <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/project" element={<ProjectPage />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
