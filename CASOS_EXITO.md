# Sistema de Casos de Éxito

## Descripción General

Sistema completo de gestión de casos de éxito con flujo de aprobación y publicación pública para marketing.

## Estructura de Base de Datos

### Tabla: casos_exito
Almacena todos los casos de éxito propuestos por socios.

**Campos:**
- `id` - UUID único
- `socio_id` - Referencia al socio que propone el caso
- `url_sitio` - URL del sitio web del caso de éxito
- `tipo_plan` - Tipo de plan vendido ('presencia_web' o 'tienda_en_linea')
- `titulo` - Título del caso de éxito
- `descripcion_corta` - Descripción breve (máx 200 caracteres)
- `descripcion_completa` - Descripción detallada (opcional)
- `estatus` - Estado del caso ('pendiente', 'aprobado', 'rechazado')
- `aprobado_por` - Referencia al admin/super_admin que moderó
- `fecha_aprobacion` - Fecha de aprobación/rechazo
- `comentario_moderacion` - Comentario interno del moderador (opcional)
- `created_at`, `updated_at` - Marcas de tiempo

**Índices:**
- PK en `id`
- FK en `socio_id` (cascade delete)
- FK en `aprobado_por` (set null)
- Check constraints en `tipo_plan` y `estatus`

## Funcionalidades por Rol

### Socios (Propuesta y Seguimiento)
**Ruta:** `/dashboard/casos-exito`

**Funcionalidades:**
- Enviar nuevos casos de éxito
- Ver lista de sus casos propuestos
- Ver estado de cada caso (pendiente, aprobado, rechazado)
- Editar casos en estado pendiente
- No pueden ver comentarios de moderación

**Formulario de Envío:**
- URL del sitio (requerido, tipo URL)
- Tipo de plan (selector: Presencia Web / Tienda en Línea)
- Título del caso (requerido)
- Descripción corta (requerida, máx 200 caracteres)
- Descripción completa (opcional, texto largo)

**Validaciones:**
- URL válida
- Campos requeridos completos
- Límite de caracteres en descripción corta

**Mensajería:**
- Banner informativo sobre proceso de revisión
- Confirmación al enviar caso
- Estados visuales claros (badges de color)

### Admin y Super Admin (Moderación)
**Rutas:**
- Admin: `/admin/casos-exito`
- Super Admin: Acceso vía `/admin/casos-exito` (tienen todos los permisos de admin)

**Funcionalidades:**
- Ver todos los casos enviados
- Filtrar por estado (pendiente, aprobado, rechazado)
- Ver información completa del caso
- Ver datos del socio que lo propuso
- Aprobar casos
- Rechazar casos
- Agregar comentarios internos de moderación
- Ver historial de moderación

**Dashboard de Moderación:**
- Tarjetas con contadores por estado
- Lista completa de casos
- Filtro por estado
- Información del socio visible
- Botones de acción rápida

**Modal de Moderación:**
- Vista del caso a moderar
- Campo para comentario interno
- Botón de confirmar aprobación/rechazo
- Validación antes de confirmar

**Al Aprobar un Caso:**
- Se establece `estatus = 'aprobado'`
- Se registra `aprobado_por` (ID del moderador)
- Se registra `fecha_aprobacion`
- Se guarda `comentario_moderacion` (opcional)
- El caso se vuelve público vía API

**Al Rechazar un Caso:**
- Se establece `estatus = 'rechazado'`
- Se registra `aprobado_por` (ID del moderador)
- Se registra `fecha_aprobacion` (fecha de rechazo)
- Se guarda `comentario_moderacion` (opcional)
- El caso NO aparece en la API pública

## API Pública para Marketing

### Edge Function: casos-exito-publicos

**Endpoint:** `{SUPABASE_URL}/functions/v1/casos-exito-publicos`

**Método:** GET

**Autenticación:** No requiere (verify_jwt = false)

**CORS:** Habilitado para todos los orígenes

**Descripción:**
Endpoint público que devuelve únicamente los casos con estatus 'aprobado' para consumo por la página oficial de Ventas Click.

**Respuesta Exitosa:**
```json
{
  "success": true,
  "total": 15,
  "casos": [
    {
      "id": "uuid",
      "url_sitio": "https://ejemplo.com",
      "tipo_plan": "Presencia Web",
      "titulo": "Tienda de ropa boutique en CDMX",
      "descripcion_corta": "Sitio elegante para boutique de moda",
      "descripcion_completa": "Proyecto completo de sitio web...",
      "socio": "Juan Pérez",
      "fecha_publicacion": "2026-02-12T10:30:00Z"
    }
  ]
}
```

**Respuesta de Error:**
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

**Campos en la Respuesta:**
- `id` - Identificador único del caso
- `url_sitio` - URL del sitio web
- `tipo_plan` - Tipo de plan en formato legible
- `titulo` - Título del caso
- `descripcion_corta` - Descripción breve
- `descripcion_completa` - Descripción detallada (puede ser null)
- `socio` - Nombre del socio que lo vendió
- `fecha_publicacion` - Fecha de creación del caso

**Uso desde Página Externa:**
```javascript
// Ejemplo de consumo desde sitio de marketing
fetch('https://[tu-proyecto].supabase.co/functions/v1/casos-exito-publicos')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(`Se encontraron ${data.total} casos de éxito`);
      data.casos.forEach(caso => {
        console.log(`${caso.titulo} - ${caso.url_sitio}`);
      });
    }
  });
```

## Seguridad (RLS)

### Políticas Implementadas:

**Socios:**
- Pueden ver solo sus propios casos
- Pueden crear nuevos casos (con su socio_id)
- Pueden editar solo sus casos pendientes
- NO pueden ver comentarios de moderación
- NO pueden cambiar el estatus

**Admin/Super Admin:**
- Pueden ver todos los casos
- Pueden actualizar cualquier caso (aprobar/rechazar)
- Pueden ver y agregar comentarios de moderación
- Pueden ver información completa del socio

**Público (API):**
- Solo casos con `estatus = 'aprobado'`
- Sin autenticación requerida
- Datos filtrados (sin comentarios internos)

## Flujo de Trabajo

### Ciclo de Vida de un Caso de Éxito

1. **Propuesta (Socio)**
   - Socio completa formulario
   - Caso se crea con `estatus = 'pendiente'`
   - Sistema muestra confirmación

2. **Revisión (Admin)**
   - Admin ve caso en lista de pendientes
   - Revisa información del caso
   - Verifica URL del sitio
   - Revisa datos del socio

3. **Decisión (Admin)**

   **Opción A: Aprobar**
   - Admin hace clic en "Aprobar"
   - Opcionalmente agrega comentario
   - Confirma aprobación
   - Caso pasa a `estatus = 'aprobado'`
   - Se registra moderador y fecha
   - **Caso aparece en API pública**

   **Opción B: Rechazar**
   - Admin hace clic en "Rechazar"
   - Opcionalmente agrega razón
   - Confirma rechazo
   - Caso pasa a `estatus = 'rechazado'`
   - Se registra moderador y fecha
   - Caso NO aparece en API pública

4. **Publicación (Marketing)**
   - Sitio oficial consulta API
   - Obtiene casos aprobados
   - Muestra en galería/showcase
   - Sin necesidad de tocar backend

## Características de la Interfaz

### Vista de Socio
- Banner informativo sobre proceso de revisión
- Grid de tarjetas con sus casos
- Badges de estado con iconos y colores
- Información completa visible
- Botón prominente para nuevo caso
- Modal de formulario limpio y guiado
- Validación en tiempo real
- Contador de caracteres

### Vista de Admin
- Dashboard con estadísticas por estado
- Tarjetas clickeables para filtrar
- Lista detallada de todos los casos
- Información del socio visible
- Enlaces externos verificables
- Botones de acción contextuales
- Modal de moderación dedicado
- Historial de moderación visible

### Diseño Visual
- Estados con código de colores:
  - Pendiente: Amarillo
  - Aprobado: Verde
  - Rechazado: Rojo
- Iconos claros para cada estado
- Hover states en tarjetas
- Sombras para profundidad
- Espaciado consistente
- Responsive en todos los tamaños

## Ventajas del Sistema

1. **Para Socios:**
   - Proceso simple de envío
   - Visibilidad de sus casos
   - Retroalimentación sobre estado
   - Reconocimiento de su trabajo

2. **Para Admin:**
   - Control total de contenido público
   - Flujo de moderación eficiente
   - Comentarios internos registrados
   - Trazabilidad completa

3. **Para Marketing:**
   - API lista para consumir
   - Sin necesidad de backend
   - Actualización automática
   - Formato estandarizado
   - CORS habilitado

4. **Para el Negocio:**
   - Galería de casos reales
   - Social proof automatizado
   - Control de calidad garantizado
   - Escalable sin intervención manual

## Mejoras Futuras Sugeridas

1. **Imágenes/Screenshots**
   - Subida de imágenes del sitio
   - Galería visual de casos
   - Previsualizaciones automáticas

2. **Métricas de Impacto**
   - Resultados del cliente
   - Incremento en ventas
   - Estadísticas de tráfico
   - ROI del proyecto

3. **Categorías/Tags**
   - Clasificación por industria
   - Tags por funcionalidades
   - Filtros avanzados en API

4. **Testimonios del Cliente**
   - Quote del cliente
   - Calificación del servicio
   - Validación de contacto

5. **Versiones del Caso**
   - Historial de cambios
   - Actualizaciones del proyecto
   - Evolución del sitio

6. **Notificaciones**
   - Avisar a socio sobre decisión
   - Email con resultado
   - Notificaciones push

7. **Analytics de API**
   - Tracking de consultas
   - Casos más vistos
   - Performance de endpoint

## Notas Técnicas

- La tabla `casos_exito` ya existía en el schema original
- Se agregó campo `comentario_moderacion` vía migración
- Edge Function desplegada sin autenticación (público)
- RLS implementado correctamente
- Triggers de `updated_at` automáticos
- Componentes reutilizables (Card, Button, DashboardLayout)
- TypeScript completo con tipado
- Build exitoso sin errores

## URL de la API

**Producción:**
```
https://[tu-proyecto-supabase].supabase.co/functions/v1/casos-exito-publicos
```

**Ejemplo de URL Completa:**
```
https://abcdefghijklmnop.supabase.co/functions/v1/casos-exito-publicos
```

Esta URL puede ser consumida desde:
- Página oficial de Ventas Click
- Landing pages
- Portales externos
- Apps móviles
- Cualquier frontend con fetch/axios
