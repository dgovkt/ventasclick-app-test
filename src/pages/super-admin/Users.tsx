import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users as UsersIcon, UserPlus, Shield, User, Mail, Calendar, Ban, Check, X, CreditCard as Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import type { Database } from '../../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

type FilterRol = 'todos' | 'socio' | 'admin' | 'super_admin';

export default function UsersManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterRol>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(userId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ activo: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      alert(currentStatus ? 'Usuario bloqueado exitosamente' : 'Usuario activado exitosamente');
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error al cambiar el estado del usuario');
    }
  }

  const filteredUsers = filter === 'todos'
    ? users
    : users.filter(u => u.rol === filter);

  const stats = {
    total: users.length,
    socios: users.filter(u => u.rol === 'socio').length,
    admins: users.filter(u => u.rol === 'admin').length,
    superAdmins: users.filter(u => u.rol === 'super_admin').length,
  };

  function getRolBadge(rol: string) {
    switch (rol) {
      case 'super_admin':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Admin</span>;
      case 'socio':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-light text-primary-dark">Socio</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{rol}</span>;
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando usuarios...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-2">Administra usuarios del sistema</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Crear Usuario
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Socios</p>
                  <p className="text-3xl font-bold text-primary mt-2">{stats.socios}</p>
                </div>
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.admins}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Super Admins</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.superAdmins}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('todos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'todos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({stats.total})
              </button>
              <button
                onClick={() => setFilter('socio')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'socio'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Socios ({stats.socios})
              </button>
              <button
                onClick={() => setFilter('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admins ({stats.admins})
              </button>
              <button
                onClick={() => setFilter('super_admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'super_admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Super Admins ({stats.superAdmins})
              </button>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay usuarios para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.nombre?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-semibold text-gray-900">
                                {user.nombre} {user.apellido}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.telefono || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getRolBadge(user.rol)}
                            {!user.activo && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Bloqueado
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(user.created_at).toLocaleDateString('es-MX')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive(user.id, user.activo)}
                            className={`${
                              user.activo
                                ? 'text-red-600 hover:text-red-800'
                                : 'text-primary hover:text-primary-dark'
                            } font-medium`}
                          >
                            {user.activo ? 'Bloquear' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadUsers();
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            loadUsers();
          }}
        />
      )}
    </DashboardLayout>
  );
}

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rol: 'socio' as 'socio' | 'admin' | 'super_admin',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            rol: formData.rol,
          },
        },
      });

      if (authError) throw authError;

      alert('Usuario creado exitosamente');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(error.message || 'Error al crear usuario');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Crear Usuario</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              minLength={6}
              required
            />
            <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="socio">Socio</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditUserModalProps {
  user: Profile;
  onClose: () => void;
  onSuccess: () => void;
}

function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    telefono: user.telefono || '',
    rol: user.rol as 'socio' | 'admin' | 'super_admin',
    activo: user.activo !== false,
    nombre_banco: user.nombre_banco || '',
    clabe: user.clabe || '',
    numero_cuenta: user.numero_cuenta || '',
    beneficiario: user.beneficiario || '',
    frecuencia_pago: user.frecuencia_pago || 'mensual',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono || null,
          rol: formData.rol,
          activo: formData.activo,
          nombre_banco: formData.nombre_banco || null,
          clabe: formData.clabe || null,
          numero_cuenta: formData.numero_cuenta || null,
          beneficiario: formData.beneficiario || null,
          frecuencia_pago: formData.frecuencia_pago,
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('Usuario actualizado exitosamente');
      onSuccess();
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(error.message || 'Error al actualizar usuario');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email || ''}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">El email no puede ser modificado</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="socio">Socio</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado del Usuario
            </label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, activo: !formData.activo })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                formData.activo ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  formData.activo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 text-sm font-medium ${formData.activo ? 'text-green-700' : 'text-red-600'}`}>
              {formData.activo ? 'Activado' : 'Desactivado'}
            </span>
          </div>

          {formData.rol === 'socio' && (
            <>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información Bancaria
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Banco
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_banco}
                      onChange={(e) => setFormData({ ...formData, nombre_banco: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej. BBVA, Santander, Banorte"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CLABE
                      </label>
                      <input
                        type="text"
                        value={formData.clabe}
                        onChange={(e) => setFormData({ ...formData, clabe: e.target.value.replace(/\D/g, '').slice(0, 18) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        placeholder="18 dígitos"
                        maxLength={18}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Cuenta
                      </label>
                      <input
                        type="text"
                        value={formData.numero_cuenta}
                        onChange={(e) => setFormData({ ...formData, numero_cuenta: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiario
                    </label>
                    <input
                      type="text"
                      value={formData.beneficiario}
                      onChange={(e) => setFormData({ ...formData, beneficiario: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre completo del titular"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia de Pago
                    </label>
                    <select
                      value={formData.frecuencia_pago || 'mensual'}
                      onChange={(e) => setFormData({ ...formData, frecuencia_pago: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
