// App.jsx - updated with pre-university route
import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import theme
import theme from "./theme";

// Import pages
import HomePage from "./pages/HomePage";
import CharacterCreationPage from "./pages/CharacterCreationPage";
import PreUniversityExamPage from "./pages/PreUniversityExamPage";
import EducationPage from "./pages/EducationPage";
import MilitaryServicePage from "./pages/MilitaryServicePage";
import CareerPage from "./pages/CareerPage";
import ResumePage from "./pages/ResumePage";
import SettingsPage from "./pages/SettingsPage";

// Import layout
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/character-creation"
              element={<CharacterCreationPage />}
            />
            <Route
              path="/pre-university-exam"
              element={<PreUniversityExamPage />}
            />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/military-service" element={<MilitaryServicePage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ChakraProvider>
  );
}

export default App;
