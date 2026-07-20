import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { ChargebeeScript } from './components/ChargebeeScript';
import { ChargebeeEnvironmentBadge } from './components/ChargebeeEnvironmentBadge';

import { Landing } from './pages/Landing';
import { Info } from './pages/Info';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

import { SocioDashboard } from './pages/socio/Dashboard';
import { SocioLeads } from './pages/socio/Leads';
import { SocioCierres } from './pages/socio/Cierres';
import { SocioComisiones } from './pages/socio/Comisiones';
import { SocioKb } from './pages/socio/Kb';
import { SocioCasosExito } from './pages/socio/CasosExito';
import SocioReviews from './pages/socio/Reviews';
import Wizard from './pages/socio/Wizard';
import SocioSimulador from './pages/socio/Simulador';
import SocioProspectos from './pages/socio/Prospectos';
import SocioManual from './pages/socio/Manual';

import { AdminDashboard } from './pages/admin/Dashboard';
import { ContentManagement } from './pages/admin/ContentManagement';
import { ContentEditor } from './pages/admin/ContentEditor';
import { KbManagement } from './pages/admin/KbManagement';
import { AdminCasosExito } from './pages/admin/CasosExito';
import AdminReviews from './pages/admin/Reviews';
import { SuperAdminDashboard } from './pages/super-admin/Dashboard';
import { SuperAdminKbManagement } from './pages/super-admin/KbManagement';
import { SuperAdminCasosExito } from './pages/super-admin/CasosExito';
import SuperAdminReviews from './pages/super-admin/Reviews';
import SuperAdminUsers from './pages/super-admin/Users';
import SuperAdminSettings from './pages/super-admin/Settings';
import SuperAdminLeads from './pages/super-admin/Leads';
import SuperAdminCierres from './pages/super-admin/Cierres';
import SuperAdminComisiones from './pages/super-admin/Comisiones';
import SuperAdminAgentes from './pages/super-admin/Agentes';
import SuperAdminManuales from './pages/super-admin/Manuales';

import ReviewForm from './pages/ReviewForm';
import { Placeholder } from './pages/Placeholder';
import { WizardPublic } from './pages/WizardPublic';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ContentProvider>
          <ChargebeeScript />
          <ChargebeeEnvironmentBadge />
          <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/info"
            element={
              <PublicRoute>
                <Info />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/leads"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cierres"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioCierres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/comisiones"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioComisiones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wizard"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <Wizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/simulador"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioSimulador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/casos-exito"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioCasosExito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reviews"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/kb"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioKb />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/prospectos"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioProspectos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/manual"
            element={
              <ProtectedRoute allowedRoles={['socio']}>
                <SocioManual />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <Placeholder title="Leads (Admin)" description="Gestión de todos los leads del sistema" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cierres"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <Placeholder title="Cierres (Admin)" description="Gestión de todas las ventas" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/comisiones"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <Placeholder title="Comisiones (Admin)" description="Autorización y gestión de comisiones" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/casos-exito"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminCasosExito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <Placeholder title="Usuarios" description="Gestión de usuarios del sistema" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <ContentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <ContentEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/kb"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <KbManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/leads"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/cierres"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminCierres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/comisiones"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminComisiones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/contenido"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <ContentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/contenido/:id"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <ContentEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/kb"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminKbManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/casos-exito"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminCasosExito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/reviews"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/usuarios"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/configuracion"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/agentes"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminAgentes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/manuales"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminManuales />
              </ProtectedRoute>
            }
          />
          <Route path="/super-admin/manual" element={<Navigate to="/super-admin/manuales" replace />} />
          <Route path="/super-admin/manual-socio" element={<Navigate to="/super-admin/manuales" replace />} />

          <Route path="/review/:socioId" element={<ReviewForm />} />
          <Route path="/wizard/:token" element={<WizardPublic />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ContentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
