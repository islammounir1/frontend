import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute — enveloppe une route pour exiger l'authentification.
 * Optionnel : `roles` = tableau de rôles autorisés.
 *
 * Usage :
 *   <Route path="/admin" element={
 *     <ProtectedRoute roles={['SUPER_ADMIN','ADMIN_SYSTEME']}>
 *       <AdminPage />
 *     </ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/diagramme" replace />;
  }

  return children;
}
