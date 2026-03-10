// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home';
import UserDashboard from './pages/Users/UserDashboard';
import UserProfile from './pages/Users/UserProfile';
import EventList from './pages/Users/Events/EventList';
import EventDetails from './pages/Users/Events/EventDetails';
import Rules from './pages/Users/Others/Rules';
import Hostel from './pages/Users/Others/Hostel';
import Winners from './pages/Users/Others/Winners';
import CreateGroup from './pages/Users/Groups/CreateGroup';
import JoinGroup from './pages/Users/Groups/JoinGroup';
import MyGroups from './pages/Users/Groups/MyGroups';
import GroupDetails from './pages/Users/Groups/GroupDetails';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminManageUsers from './pages/Admin/AdminManageUsers';
import AdminEventsOverview from './pages/Admin/AdminEventsOverview';
import AdminDepartments from './pages/Admin/AdminDepartments';
import AdminInstitutes from './pages/Admin/AdminInstitutes';
import AdminWinners from './pages/Admin/AdminWinners';
import CreateEvent from './pages/Admin/CreateEvent';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RoleHomeRedirect from './components/auth/RoleHomeRedirect';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public auth pages */}
          <Route
            path="/login"
            element={(
              <PublicRoute>
                <Login />
              </PublicRoute>
            )}
          />
          <Route
            path="/register"
            element={(
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            )}
          />

          {/* Home page */}
          <Route path="/" element={<Home />} />

          {/* Main app layout - all authenticated routes live under /app */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<RoleHomeRedirect />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="admin" element={<RoleHomeRedirect />} />
              <Route path="profile" element={<UserProfile />} />

              {/* Events */}
              <Route path="events" element={<EventList />} />
              <Route path="events/:id" element={<EventDetails />} />

              {/* Groups */}
              <Route path="groups" element={<MyGroups />} />
              <Route path="groups/create" element={<CreateGroup />} />
              <Route path="groups/join" element={<JoinGroup />} />
              <Route path="groups/:id" element={<GroupDetails />} />

              {/* Others */}
              <Route path="others" element={<Rules />} />
              <Route path="others/rules" element={<Rules />} />
              <Route path="others/hostel" element={<Hostel />} />
              <Route path="others/winners" element={<Winners />} />

              {/* Admin area */}
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/manage-users" element={<AdminManageUsers />} />
              <Route path="admin/events" element={<AdminEventsOverview />} />
              <Route path="admin/events/:id/edit" element={<CreateEvent />} />
              <Route path="admin/departments" element={<AdminDepartments />} />
              <Route path="admin/institutes" element={<AdminInstitutes />} />
              <Route path="admin/winners" element={<AdminWinners />} />
              <Route path="admin/profile" element={<AdminProfile />} />
              <Route path="admin/events/create" element={<CreateEvent />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
