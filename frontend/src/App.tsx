import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { RootProvider } from "./providers/rootProvider";
import { createRootStore } from "./stores/rootStore";
import { useLocalObservable } from 'mobx-react-lite';
import './styles/global.scss';
import './styles/fonts.scss';

const App: React.FC = () => {
  useLocalObservable(createRootStore)

  return (
    <RootProvider>
      <div className="App" style={{ height: '100%' }}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/project" element={<ProjectPage />} />
          </Routes>
        </Router>
      </div>
    </RootProvider>
  );
}

export default App;
