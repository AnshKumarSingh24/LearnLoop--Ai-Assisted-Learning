import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Workspace from './pages/Workspace';
import { CourseBuilder } from './pages/CourseBuilder';
import { CourseView } from './pages/CourseView';
import ArtifactStudio from './pages/ArtifactStudio';
import PlaceholderPage from './pages/PlaceholderPage';
import Library from "./pages/Library";
import Learn from "./pages/Learn";
import StudyStats from "./pages/StudyStats";
import Profile from "./pages/Profile";
import SpaceOverview from "./pages/SpaceOverview";
import PageEditor from "./pages/PageEditor";
import LearningControlCenter from "./pages/LearningControlCenter";
import { CompanionProvider } from "./contexts/CompanionContext";
import { FloatingCompanion } from "./components/companion/FloatingCompanion";
import { DarwinityStoreProvider } from "./contexts/DarwinityStoreContext";
import { LessonView } from "./pages/LessonView";

import Onboarding from "./pages/Onboarding";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

function Router() {
  const [location, setLocation] = useLocation();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading || !user || !profile) return;
    if (!profile.onboardingCompleted && location !== "/onboarding" && location !== "/landing") {
      setLocation("/landing");
    }
  }, [location, loading, profile, setLocation, user]);

  return (
    <Switch>
      <Route path="/landing" component={Onboarding} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/canvas/:spaceId/:pageId">
        {(params) => <Workspace key={params?.pageId} />}
      </Route>
      <Route path="/canvas" component={Workspace} />
      <Route>
        <DashboardLayout>
          <Switch>
            <Route path={"/"} component={Dashboard} />
            <Route path={"/courses/:courseId"} component={CourseView} />
            <Route path={"/courses/:courseId/learn/:lessonId"} component={LessonView} />
            <Route path={"/artifacts"} component={ArtifactStudio} />
            <Route path={"/library"} component={Library} />
            <Route path={"/learn"} component={Learn} />
            <Route path={"/stats"} component={StudyStats} />
            <Route path={"/learning-plan"} component={LearningControlCenter} />
            <Route path={"/profile"} component={Profile} />
            <Route path={"/spaces/:spaceId"} component={SpaceOverview} />
            <Route path={"/spaces/:spaceId/pages/:pageId"}>
              {(params) => <PageEditor key={params?.pageId} />}
            </Route>
            <Route path={"/404"} component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </DashboardLayout>
      </Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <DarwinityStoreProvider>
          <CompanionProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <FloatingCompanion />
            </TooltipProvider>
          </CompanionProvider>
        </DarwinityStoreProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
