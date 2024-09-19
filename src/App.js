import "./App.css";
import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./Router/PrivateRoute";
import ProtectedRoute from "./Router/ProtectedRoute";
import PublicRoute from "./Router/PublicRoute";
import { PropagateLoader } from "react-spinners";
import { useSeomanager } from "./Hooks/SeoManagercheck.jsx";

const SpinnerFallback = () => (
  <div className="lazyLoader">
    <img
      className=" pulse"
      src="https://storage.googleapis.com/varal-habot-vault-marketplace-10032022/images/updated%20trans-Habot-logo-png.png"
      height="55"
      alt="Logo-Habot"
    />
    <PropagateLoader size={20} color="#072F57" />
  </div>
);

const LazyInternalServerError = lazy(() =>
  import("./Components/500/InternalServerError")
);
const LazyNotFound = lazy(() => import("./Components/404/NotFound"));

const LazyHabotFaq = lazy(() =>
  import("./Components/Habotech/HabotFaq/HabotFaq")
);

const LazyHabotSignin = lazy(() =>
  import("./Components/CustomerJourney/Signin/HabotSignin")
);

const LazyCustomerDashboard = lazy(() =>
  import("./Components/CustomerJourney/Dashboard/CustomerDashboard")
);

const LazyHabotAskQuest = lazy(() =>
  import("./Components/Habotech/AskYourQuestion/HabotAskQuest")
);

const LazySignup = lazy(() =>
  import("./Components/CustomerJourney/Signup/Signup")
);

const LazyNotification = lazy(() =>
  import("./Components/CustomerJourney/Notification/Notification.jsx")
);

const LazySectorSelection = lazy(() =>
  import(
    "./Components/CustomerJourney/TrackManager/SectorSelectionPage/SectorSelectionPage.jsx"
  )
);
const LazyTaskAssignmentPage = lazy(() =>
  import(
    "./Components/CustomerJourney/TrackManager/TaskAssignmentPage/TaskAssignmentPage"
  )
);

const LazyTrackManagerDashboard = lazy(() =>
  import(
    "./Components/CustomerJourney/TrackManager/TrackManagerDashboard/TrackManagerDashboard"
  )
);

const LazyKeywordSelectionForm = lazy(() =>
  import(
    "./Components/CustomerJourney/AssignedTCSelection/KeywordSelectionForm/KeywordSelectionForm"
  )
);

const LazyTCForm = lazy(() =>
  import("./Components/CustomerJourney/AssignedTCSelection/TCForm/TCForm")
);

const LazyCampaignManagerDashboard = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignManagerDashboard/CampaignManagerDashboard"
  )
);
const LazyCampaignInitiationPage = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignInitiationPage/CampaignInitiationPage"
  )
);
const LazyCampaignTaskAssignment = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignTaskAssignment/CampaignTaskAssignment"
  )
);
const LazyContentCreationForm = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/ContentCreationForm/ContentCreationForm"
  )
);

const LazyJobDescriptionForm = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/JobDescriptionForm/JobDescriptionForm"
  )
);

const LazyTaskMonitoringPage = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/TaskMonitoringPage/TaskMonitoringPage"
  )
);

const LazyTCContentForm = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/TCContentForm/TCContentForm"
  )
);

const LazyOutsourcingTeam = lazy(() =>
  import("./Components/CustomerJourney/OutsourcingTeam/OutsourcingTeam")
);

const LazyDataUpdationPage = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/DataUpdationPage/DataUpdationPage"
  )
);
const LazyDailyMonitor = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/DailyMonitor/DailyMonitor"
  )
);
const LazySales = lazy(() =>
  import("./Components/CustomerJourney/TrackManager/SalesPage/Sales")
);
const LazyTrackAssignmentPage = lazy(() =>
  import(
    "./Components/CustomerJourney/TrackManager/TrackAssignmentPage/TrackAssignmentPage"
  )
);

const LazyAssignedTask = lazy(() =>
  import(
    "./Components/CustomerJourney/AssignedTCSelection/AssignedTask/AssignedTask"
  )
);

const LazyCampaignKeywordFile = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignInitiationPage/CampaignKeywordFile"
  )
);

const LazyCampaignTaskForm = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignManagerDashboard/CampaignTaskForm"
  )
);

const LazyOutsourcingForm = lazy(() =>
  import("./Components/CustomerJourney/OutsourcingTeam/OutsourcingForm")
);

const LazySectorEntry = lazy(() =>
  import(
    "./Components/CustomerJourney/TrackManager/SectorSelectionPage/SectorEntry"
  )
);

const LazyCampKeywordAssignment = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampKeywordAssignment/CampKeywordAssignment"
  )
);

const LazyJobAssignmentsList = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/TCContentForm/JobAssignmentsList/JobAssignmentsList"
  )
);
const LazyKeywordJobAssignment = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/TCContentForm/KeywordJobAssignment/KeywordJobAssignment"
  )
);
const LazyCampaignJobsAssigned = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignJobsAssigned/CampaignJobsAssigned"
  )
);

const LazyCampaignList = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignList/CampaignList"
  )
);
const LazyTaskAssignCampaignManager = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/TaskAssignCampaignManager/TaskAssignCampaignManager"
  )
);

const LazyContentJobAssignment = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/ContentJobAssignment/ContentJobAssignment"
  )
);
const LazyTcJobList = lazy(() =>
  import(
    "./Components/CustomerJourney/ContentManager/TCContentForm/TcJobList/TcJobList"
  )
);
const LazyOsJobAssignmentList = lazy(() =>
  import(
    "./Components/CustomerJourney/OutsourcingTeam/OsJobAssignmentList/OsJobAssignmentList"
  )
);
const LazyOsJobAssignmentDetails = lazy(() =>
  import(
    "./Components/CustomerJourney/OutsourcingTeam/OsJobAssignmentDetails/OsJobAssignmentDetails"
  )
);
const LazyContentManagerJobList = lazy(() =>
  import(
    "./Components/CustomerJourney/OutsourcingTeam/ContentManagerJobList/ContentManagerJobList"
  )
);
const LazyContentManagerListDetails = lazy(() =>
  import(
    "./Components/CustomerJourney/OutsourcingTeam/ContentManagerListDetails/ContentManagerListDetails"
  )
);

const LazyTrackManagerKeywordJobAssignment = lazy(() =>
  import(
    "./Components/CustomerJourney/TrackManager/TrackManagerKeywordJobAssignment/TrackManagerKeywordJobAssignment"
  )
);

const LazyGoogleAnalytcis = lazy(() =>
  import(
    "./Components/CustomerJourney/TrackManager/TrackManagerDashboard/GoogleAnalytcis"
  )
);

const LazyTaskList = lazy(() =>
  import("./Components/CustomerJourney/TrackManager/TaskList/TaskList")
);

const LazyCampaignManagerList = lazy(() =>
  import(
    "./Components/CustomerJourney/CampaignManager/CampaignManagerList/CampaignManagerList"
  )
);

const LazyListCampaignManager = lazy(() =>
  import(
    "./Components/CustomerJourney/OutsourcingTeam/ListCampaignManager/ListCampaignManager"
  )
);
// seo lazy
const LazyPortalsetup = lazy(() =>
  import("./Components/Portal/PortalTabs/PortalTabs.jsx")
);

const LazyPortalStatus = lazy(() =>
  import("./Components/Portal/Portal-Status/PortalStatus.jsx")
);

const LazyScreenshotAssessment = lazy(() =>
  import("./Components/Portal/ScreenshotAssessment/ScreenshotAssessment.jsx")
);

const Lazycontentmanager = lazy(() =>
  import("./Components/Portal/ContentManager/Contentmanager.jsx")
);

export const routes = {
  jobListing: "/requirements",
};
function App() {
  const seoadmin = useSeomanager();

  return (
    <div className="App">
      <Routes>
        <Route
          path="*"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyNotFound />
            </Suspense>
          }
        />

        <Route
          path="/500"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyInternalServerError />
            </Suspense>
          }
        />

        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyHabotSignin />
            </Suspense>
          }
        />

        <Route
          path="/signup"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazySignup />
            </Suspense>
          }
        />

        <Route
          path="/habotech-faq"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyHabotFaq />
            </Suspense>
          }
        />

        <Route
          path="/customer-journey"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCustomerDashboard />
            </Suspense>
          }
        />

        <Route
          path="/habotech-ask-question"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyHabotAskQuest />
            </Suspense>
          }
        />

        <Route
          path="/notification"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyNotification />
            </Suspense>
          }
        />
        <Route
          path="/sector-selection"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazySectorSelection />
            </Suspense>
          }
        />

        <Route
          path="/task-assignment-page"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTaskAssignmentPage />
            </Suspense>
          }
        />
        <Route
          path="/track-manager-dashboard"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTrackManagerDashboard />
            </Suspense>
          }
        />
        <Route
          path="/keyword-selection"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyKeywordSelectionForm />
            </Suspense>
          }
        />

        <Route
          path="/tc-form/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTCForm />
            </Suspense>
          }
        />

        <Route
          path="/campaign-manager"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignManagerDashboard />
            </Suspense>
          }
        />

        <Route
          path="/campaign-initiation/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignInitiationPage />
            </Suspense>
          }
        />

        <Route
          path="/campaign-selection-page/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignTaskAssignment />
            </Suspense>
          }
        />

        <Route
          path="/content-creation-form/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyContentCreationForm />
            </Suspense>
          }
        />

        <Route
          path="/job-description-form"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyJobDescriptionForm />
            </Suspense>
          }
        />

        <Route
          path="/task-monitor-page"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTaskMonitoringPage />
            </Suspense>
          }
        />

        <Route
          path="/tc-content-form/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTCContentForm />
            </Suspense>
          }
        />
        <Route
          path="/outsourcee-manager/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyOutsourcingTeam />
            </Suspense>
          }
        />

        <Route
          path="/data-updation"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyDataUpdationPage />
            </Suspense>
          }
        />

        <Route
          path="/daily-monitor"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyDailyMonitor />
            </Suspense>
          }
        />

        <Route
          path="/sales"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazySales />
            </Suspense>
          }
        />

        <Route
          path="/track-assignment-page/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTrackAssignmentPage />
            </Suspense>
          }
        />

        <Route
          path="/assigned-task"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyAssignedTask />
            </Suspense>
          }
        />

        <Route
          path="/campaign-keyword-file"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignKeywordFile />
            </Suspense>
          }
        />

        <Route
          path="/campaign-task-form"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignTaskForm />
            </Suspense>
          }
        />

        <Route
          path="/outsource-form"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyOutsourcingForm />
            </Suspense>
          }
        />

        <Route
          path="/add-sector"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazySectorEntry />
            </Suspense>
          }
        />

        <Route
          path="/campaign-keyword-assignment"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampKeywordAssignment />
            </Suspense>
          }
        />

        <Route
          path="/tc-job-assignment"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyJobAssignmentsList />
            </Suspense>
          }
        />
        <Route
          path="/tc-keyword-job-assignment"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyKeywordJobAssignment />
            </Suspense>
          }
        />

        <Route
          path="/campaign-jobs-assigned/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignJobsAssigned />
            </Suspense>
          }
        />

        <Route
          path="/campaign-list"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignList />
            </Suspense>
          }
        />

        <Route
          path="/campaign-task-assignment/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTaskAssignCampaignManager />
            </Suspense>
          }
        />

        <Route
          path="/content-job-assignment"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyContentJobAssignment />
            </Suspense>
          }
        />

        <Route
          path="/tc-job-list"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTcJobList />
            </Suspense>
          }
        />

        <Route
          path="/os-job-assignment-list/:id/:ids"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyOsJobAssignmentList />
            </Suspense>
          }
        />

        <Route
          path="/os-job-assignment-details/:id/:ids"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyOsJobAssignmentDetails />
            </Suspense>
          }
        />

        <Route
          path="/content-manager-job-list"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyContentManagerJobList />
            </Suspense>
          }
        />

        <Route
          path="/content-manager-list-details/:id"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyContentManagerListDetails />
            </Suspense>
          }
        />

        <Route
          path="/google-analytcis"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyGoogleAnalytcis />
            </Suspense>
          }
        />

        <Route
          path="/track-keyword-job-assignment"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTrackManagerKeywordJobAssignment />
            </Suspense>
          }
        />

        <Route
          path="/task-list"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyTaskList />
            </Suspense>
          }
        />

        <Route
          path="/campaign-manager-list"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyCampaignManagerList />
            </Suspense>
          }
        />

        <Route
          path="/list-campaign-manager"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyListCampaignManager />
            </Suspense>
          }
        />
        {/* seo routes */}
        <Route
          path="/Portal-setup"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyPortalsetup />
            </Suspense>
          }
        />

        <Route
          path="/Portal-status"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <LazyPortalStatus />
            </Suspense>
          }
        />
        {seoadmin && (
          <Route
            path="/ScreenshotAssessment"
            element={
              <Suspense
                fallback={
                  <div>
                    <SpinnerFallback />
                  </div>
                }
              >
                <LazyScreenshotAssessment />
              </Suspense>
            }
          />
        )}

        <Route
          path="/TaskPortal"
          element={
            <Suspense
              fallback={
                <div>
                  <SpinnerFallback />
                </div>
              }
            >
              <Lazycontentmanager />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
