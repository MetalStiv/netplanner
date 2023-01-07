import UserPage from "./pages/UserPage/UserPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { RootProvider } from "./providers/rootProvider";
import { createRootStore } from "./stores/rootStore";
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from "react";

const App: React.FC = () => {
  useLocalObservable(createRootStore);
  useEffect(() => {
    document.title = 'Netplanner';
  }, []);

  return (
    <RootProvider>
      <div className="App" style={{ height: '100%' }}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<UserPage />} />
            <Route path="/project" element={<ProjectPage />} />
          </Routes>
        </Router>
      </div>
    </RootProvider>
  );
}

export default App;
