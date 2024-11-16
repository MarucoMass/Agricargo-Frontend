import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "@fontsource/poppins/100.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import { AuthProvider } from "./components/context/AuthProvider";
import ClientReservations from "./pages/client/ClientReservations";
import ClientHome from "./pages/client/ClientHome";
import Login from "./pages/Login Register/Login";
import Register from "./pages/Login Register/Register";
import AdminCreateShip from "./pages/admin/AdminCreateShip";
import AdminCreateTrip from "./pages/admin/AdminCreateTrip";
import ClientFavorites from "./pages/client/ClientFavorites";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminListShips from "./pages/admin/AdminListShips";
import SuperAdminList from "./pages/superAdmin/SuperAdminList";
import AdminCreateForm from "./components/admincreateform/AdminCreateForm";
import AdminHome from "./pages/admin/AdminHome";
import ClientTripDetail from "./pages/client/ClientTripDetail";
import ClientTripPayment from "./pages/client/ClientTripPayment";
import NotFound from "./components/notFound/NotFound";
import { DarkModeProvider } from "./components/context/DarkModeProvider";
import AdminShips from "./pages/admin/AdminShips";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <ClientHome />,
  },
  {
    path: "/resultado/:id",
    element: (
      <ProtectedRoute allowedRoles={["Client"]}>
        <ClientTripDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mis-reservas",
    element: (
      <ProtectedRoute allowedRoles={["Client"]}>
        <ClientReservations isFavorites={false} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mis-favoritos",
    element: (
      <ProtectedRoute allowedRoles={["Client"]}>
        <ClientFavorites />
      </ProtectedRoute>
    ),
  },
  {
    path: "/empresa/crear-viaje",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminCreateTrip />
      </ProtectedRoute>
    ),
  },
  {
    path: "/empresa/crear-barco",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminCreateShip />
      </ProtectedRoute>
    ),
  },
  {
    path: "/empresa/modificar-barco/:id",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminCreateShip editmode={true}/>
      </ProtectedRoute>
    ),
  },
  {
    path: "/empresa/barcos",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminShips/>
        {/* <AdminListShips/> */}
      </ProtectedRoute>
    )
  },
  {
    path: "/empresa/home",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminHome/>
      </ProtectedRoute>
    )
  },
  {
    path: "/empresa/viajes",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminCreateTrip/>
      </ProtectedRoute>
    )
  },
  {
    path: "/sysadmin",
    element: (
      <ProtectedRoute allowedRoles={["SuperAdmin"]}>
        <SuperAdminList />
      </ProtectedRoute>
    )
    },
    {
        path: "/sysadmin/createUser",
        element: (
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
                <AdminCreateForm />
            </ProtectedRoute>
        )
    },
    {
        path: "/resultado/:id/pago",
        element: (
          <ProtectedRoute allowedRoles={["Client"]}>
              <ClientTripPayment />
          </ProtectedRoute>
        )
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

function App() {
  return (
    <>
      <DarkModeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </DarkModeProvider>
    </>
  );
}

export default App;
