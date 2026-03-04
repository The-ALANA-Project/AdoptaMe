import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { BrowsePage } from "./pages/BrowsePage";
import { AnimalDetailPage } from "./pages/AnimalDetailPage";
import { SubmitAnimalPage } from "./pages/SubmitAnimalPage";
import { AdminPage } from "./pages/AdminPage";
import { TerminosPage } from "./pages/TerminosPage";
import { PrivacidadPage } from "./pages/PrivacidadPage";
import { SobreMiPage } from "./pages/SobreMiPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ErrorBoundaryPage } from "./pages/ErrorBoundaryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorBoundaryPage,
    children: [
      { index: true, Component: HomePage },
      { path: "animales", Component: BrowsePage },
      { path: "animales/:id", Component: AnimalDetailPage },
      { path: "enviar", Component: SubmitAnimalPage },
      { path: "admin", Component: AdminPage },
      { path: "terminos", Component: TerminosPage },
      { path: "privacidad", Component: PrivacidadPage },
      { path: "sobre-mi", Component: SobreMiPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);