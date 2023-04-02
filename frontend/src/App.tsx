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
import { LanguageProvider } from "./providers/languageProvider";
import { ApplicationProvider } from "./providers/applicationProvider";

const App: React.FC = () => {
  useLocalObservable(createRootStore);

  return (
    <RootProvider>
      <ApplicationProvider>
        <LanguageProvider>
          <div className="App" style={{ height: '100%' }}>
            <Router>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<UserPage />} />
                <Route path="/project" element={<ProjectPage />} />
              </Routes>
            </Router>
          </div>
        </LanguageProvider>
      </ApplicationProvider>
    </RootProvider>
  );
}

export default App;
