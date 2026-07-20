# Arquitectura de Socios Ventas Click

## Descripción General

Sistema integral de gestión para socios de ventas con autenticación basada en roles (socio, admin, super_admin). La plataforma permite gestionar leads, ventas, comisiones, solicitudes de pago, casos de éxito y reviews de clientes.

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **UI Icons**: Lucide React

## Arquitectura de Base de Datos

### Tablas Principales

#### 1. profiles
Extensión de `auth.users` con información adicional del usuario.

**Campos:**
- `id` (uuid, PK, FK to auth.users)
- `nombre` (text)
- `apellido` (text)
- `rol` (text) - 'socio', 'admin', 'super_admin'
- `telefono` (text, nullable) - para socios
- `datos_bancarios` (jsonb, nullable) - para socios
- `frecuencia_pago` (text, nullable) - 'semanal' o 'mensual'
- `area` (text, nullable) - para admin/super_admin
- `notas_internas` (text, nullable) - para admin/super_admin
- `activo` (boolean)
- `fecha_registro` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### 2. planes
Planes de servicio disponibles para venta.

**Campos:**
- `id` (uuid, PK)
- `nombre` (text) - ej: "Plan Presencia Web", "Plan Tienda en Línea"
- `precio_anual` (numeric) - 3299 y 6828 MXN
- `descripcion_corta` (text)
- `descripcion_completa` (text, nullable)
- `activo` (boolean)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Datos Iniciales:**
1. Plan Presencia Web: $3,299 MXN/año
2. Plan Tienda en Línea: $6,828 MXN/año

#### 3. leads
Prospectos gestionados por socios.

**Campos:**
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `nombre` (text)
- `apellidos` (text)
- `email` (text)
- `telefono` (text)
- `que_vende` (text)
- `plan_recomendado_id` (uuid, FK to planes, nullable)
- `estado` (text) - 'nuevo', 'en_seguimiento', 'cerrado_ganado', 'cerrado_perdido'
- `origen` (text) - 'wizard', 'manual', 'otro'
- `notas` (text, nullable)
- `fecha_creacion` (timestamptz)
- `fecha_ultima_actualizacion` (timestamptz)

#### 4. ventas
Registros de ventas cerradas.

**Campos:**
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `lead_id` (uuid, FK to leads, nullable)
- `plan_id` (uuid, FK to planes)
- `fecha` (timestamptz)
- `monto` (numeric)
- `estatus_pago` (text) - 'pendiente', 'pagado', 'fallido'
- `referencia_externa` (text, nullable) - ID de Chargebee
- `notas` (text, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### 5. comisiones
Comisiones generadas por ventas.

**Campos:**
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `venta_id` (uuid, FK to ventas)
- `monto_estimado` (numeric)
- `monto_autorizado` (numeric, nullable)
- `estatus` (text) - 'pendiente', 'autorizada', 'pagada', 'rechazada'
- `fecha_creacion` (timestamptz)
- `fecha_actualizacion` (timestamptz)

#### 6. solicitudes_pago
Solicitudes de pago de comisiones por período.

**Campos:**
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `periodo` (text) - ej: "2026-Q1-Quincena1"
- `monto_total_estimado` (numeric)
- `monto_total_autorizado` (numeric, nullable)
- `estatus` (text) - 'pendiente', 'aprobada', 'pagada', 'rechazada'
- `fecha_solicitud` (timestamptz)
- `fecha_resolucion` (timestamptz, nullable)
- `notas_admin` (text, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### 7. casos_exito
Casos de éxito propuestos por socios.

**Campos:**
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `url_sitio` (text)
- `tipo_plan` (text) - 'presencia_web', 'tienda_en_linea'
- `titulo` (text)
- `descripcion_corta` (text)
- `descripcion_completa` (text, nullable)
- `estatus` (text) - 'pendiente', 'aprobado', 'rechazado'
- `aprobado_por` (uuid, FK to profiles, nullable)
- `fecha_aprobacion` (timestamptz, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### 8. customer_reviews
Reviews de clientes gestionadas por socios.

**Campos:**
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `nombre_cliente` (text)
- `contacto_cliente` (text, nullable)
- `score_nps` (integer) - 0 a 10
- `comentario` (text)
- `estatus` (text) - 'pendiente', 'aprobado', 'rechazado'
- `aprobado_por` (uuid, FK to profiles, nullable)
- `fecha_aprobacion` (timestamptz, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Seguridad (Row Level Security)

Todas las tablas tienen RLS habilitado con políticas específicas por rol:

#### Rol: socio
- Puede ver y gestionar solo sus propios datos (leads, ventas, comisiones, solicitudes de pago)
- Puede crear y editar casos de éxito y reviews propios (solo mientras están pendientes)
- Puede ver casos de éxito y reviews aprobados de todos

#### Rol: admin
- Puede ver todos los datos de todos los socios
- Puede moderar contenido (aprobar/rechazar casos de éxito y reviews)
- Puede autorizar comisiones y aprobar solicitudes de pago
- NO puede editar datos bancarios de socios
- NO puede modificar configuración global

#### Rol: super_admin
- Acceso completo a todos los datos
- Puede gestionar usuarios y sus roles
- Puede modificar configuración global del sistema
- Puede gestionar contenido y base de conocimientos

## Estructura del Frontend

### Páginas Públicas

- `/` - Landing page con información del sistema
- `/login` - Inicio de sesión
- `/signup` - Registro de nuevos usuarios

### Rutas para Socio

- `/dashboard` - Dashboard principal con resumen
- `/dashboard/leads` - Gestión de leads/prospectos
- `/dashboard/cierres` - Registro de ventas cerradas
- `/dashboard/comisiones` - Consulta de comisiones
- `/dashboard/simulador` - Simulador de comisiones
- `/dashboard/casos-exito` - Gestión de casos de éxito
- `/dashboard/reviews` - Gestión de reviews de clientes
- `/dashboard/kb` - Base de conocimientos

### Rutas para Admin

- `/admin` - Dashboard administrativo
- `/admin/leads` - Vista de todos los leads
- `/admin/cierres` - Vista de todas las ventas
- `/admin/comisiones` - Autorización de comisiones
- `/admin/casos-exito` - Moderación de casos de éxito
- `/admin/reviews` - Moderación de reviews
- `/admin/usuarios` - Gestión de usuarios

### Rutas para Super Admin

Incluye todas las rutas de admin, más:
- `/super-admin` - Dashboard de super administrador
- `/super-admin/contenido` - Gestión de contenido
- `/super-admin/kb` - Administración de base de conocimientos
- `/super-admin/configuracion` - Configuración global

## Componentes Principales

### Autenticación

**AuthContext** (`src/contexts/AuthContext.tsx`)
- Maneja el estado de autenticación global
- Proporciona funciones para signUp, signIn, signOut
- Mantiene sincronizado el perfil del usuario con la sesión

**ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
- HOC para proteger rutas que requieren autenticación
- Soporta validación de roles específicos
- Redirige a login si no hay autenticación válida

**PublicRoute** (`src/components/PublicRoute.tsx`)
- HOC para rutas públicas (login, signup)
- Redirige a dashboard si el usuario ya está autenticado

### Layout

**DashboardLayout** (`src/components/DashboardLayout.tsx`)
- Layout compartido para todas las páginas del dashboard
- Sidebar responsivo con navegación según el rol
- Información del usuario y botón de logout

### Páginas

Todas las páginas están organizadas por rol:
- `src/pages/socio/` - Páginas del rol socio
- `src/pages/admin/` - Páginas del rol admin
- `src/pages/super-admin/` - Páginas del rol super_admin
- `src/pages/` - Páginas públicas y compartidas

## Flujo de Autenticación

1. Usuario accede a una ruta pública o protegida
2. `AuthContext` verifica si hay una sesión activa
3. Si hay sesión, carga el perfil del usuario desde la tabla `profiles`
4. `ProtectedRoute` valida el rol si es necesario
5. Si no hay sesión válida, redirige a `/login`
6. Al hacer login/signup, se crea sesión en Supabase Auth
7. Se crea automáticamente un registro en `profiles` mediante trigger
8. El perfil se carga y se almacena en el contexto

## Triggers de Base de Datos

### update_updated_at_column
Actualiza automáticamente el campo `updated_at` en todas las tablas cuando se modifica un registro.

### update_lead_fecha_ultima_actualizacion
Actualiza el campo `fecha_ultima_actualizacion` en la tabla `leads` cuando se modifica un lead.

### create_profile_for_user
Crea automáticamente un registro en `profiles` cuando se registra un nuevo usuario en `auth.users`. Utiliza los datos de `raw_user_meta_data` para nombre y apellido.

## Sistema de Gestión de Contenido (CMS)

El sistema incluye un CMS completo tipo WordPress que permite a administradores editar los textos de la aplicación sin modificar código.

### Tabla: content_blocks

**Campos:**
- `id` (uuid, PK)
- `slug` (text, unique) - Identificador único (ej: "landing.hero.title")
- `section` (text) - Categoría: landing, wizard, dashboard, emails
- `title` (text) - Nombre amigable para admins
- `description` (text) - Explicación de dónde se muestra
- `type` (text) - 'text' o 'richtext'
- `locale` (text) - Idioma (es-MX por defecto)
- `value` (text) - Contenido almacenado
- `meta` (jsonb) - Metadatos adicionales
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Características del CMS

1. **Editor WYSIWYG**: Editor visual con React Quill para contenido enriquecido
2. **Organización por Secciones**: Contenido agrupado por área de la aplicación
3. **Búsqueda y Filtrado**: Encuentra rápidamente el contenido a editar
4. **Sistema de Slugs**: Identificadores únicos jerárquicos (ej: landing.hero.title)
5. **Tipos de Contenido**:
   - `text`: Texto simple sin formato
   - `richtext`: Texto con formato HTML (negritas, listas, enlaces, etc.)

### Acceso y Permisos

- **Admin y Super Admin**: Acceso completo a crear, editar y eliminar contenido
- **Socio**: Sin acceso al CMS
- **Usuarios Autenticados**: Pueden leer contenido para consumo en frontend

### Rutas del CMS

- `/admin/content` - Lista de todos los bloques de contenido
- `/admin/content/:id` - Editor de un bloque específico
- `/admin/content/new` - Crear nuevo bloque de contenido

### Hook useContent

Para consumir contenido dinámico en componentes:

```typescript
import { useContent } from '../contexts/ContentContext';

export const MiComponente: React.FC = () => {
  const titulo = useContent('landing.hero.title', 'Título por defecto');

  return <h1>{titulo}</h1>;
};
```

**Parámetros:**
- `slug`: Identificador único del bloque
- `defaultValue`: Texto que se muestra si el bloque no existe

### ContentProvider

El `ContentProvider` envuelve toda la aplicación y:
- Carga todos los bloques de contenido al iniciar
- Cachea el contenido en memoria para acceso rápido
- Proporciona función `refreshContent()` para recargar manualmente

### Contenido Pre-cargado

El sistema incluye contenido de ejemplo para la landing page:
- `landing.hero.title` - Título principal
- `landing.hero.subtitle` - Subtítulo del hero
- `landing.hero.cta` - Texto del botón
- `landing.features.leads.title` - Título característica leads
- `landing.features.leads.description` - Descripción leads
- `landing.features.sales.title` - Título característica ventas
- `landing.features.sales.description` - Descripción ventas
- `landing.cta.title` - Título CTA final
- `landing.cta.subtitle` - Subtítulo CTA final

### Documentación Completa

Para guía detallada de uso del CMS, consulta `CONTENT_MANAGEMENT.md`.

## Próximos Pasos Sugeridos

Para continuar el desarrollo, considera implementar:

1. **CRUD Completo de Leads**: Formularios para crear, editar y eliminar leads
2. **Gestión de Ventas**: Sistema para registrar ventas y vincularlas con leads
3. **Sistema de Comisiones**: Cálculo automático de comisiones basado en ventas
4. **Solicitudes de Pago**: Interfaz para que socios soliciten pagos de comisiones
5. **Moderación de Contenido**: Interfaces para admins para aprobar/rechazar casos de éxito y reviews
6. **Dashboard con Datos Reales**: Conectar los dashboards con datos reales de la base de datos
7. **Simulador de Comisiones**: Herramienta para que socios calculen comisiones potenciales
8. **Base de Conocimientos**: Sistema de artículos y recursos para socios
9. **Notificaciones**: Sistema de notificaciones para eventos importantes
10. **Reportes**: Generación de reportes de ventas, comisiones, etc.

## Variables de Entorno

El proyecto requiere las siguientes variables en el archivo `.env`:

```
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Estas variables ya están configuradas y disponibles en el proyecto.
