# Módulo de Knowledge Base (KB)

## Descripción General

Sistema completo de base de conocimientos con capacidad de edición visual para administradores y lectura para socios.

## Estructura de Base de Datos

### Tabla: kb_articles
Almacena todos los artículos de la base de conocimientos:

**Campos:**
- `id` - UUID único
- `titulo` - Título del artículo
- `slug` - Identificador único para URLs (generado automáticamente desde el título)
- `categoria` - Categoría del artículo (Onboarding, Ventas, Soporte, etc.)
- `tags` - Array de etiquetas para clasificación adicional
- `contenido` - Contenido HTML enriquecido del artículo
- `visible` - Boolean, indica si el artículo es visible para socios
- `autor_id` - Referencia al admin/super_admin que creó el artículo
- `created_at`, `updated_at` - Marcas de tiempo

**Índices:**
- Índice en `categoria` para filtrado rápido
- Índice en `visible` para consultas de artículos públicos
- Índice único en `slug` para búsqueda por URL
- Índice GIN en `tags` para búsqueda en arrays
- Índice en `autor_id` para consultas por autor

## Funcionalidades por Rol

### Socios (Solo Lectura)
**Ruta:** `/dashboard/kb`

**Funcionalidades:**
- Visualización de artículos visibles
- Búsqueda por texto (título, categoría, tags)
- Filtrado por categoría
- Vista de lectura completa del artículo
- Estadísticas por categoría

**Interfaz:**
- Grid de tarjetas con artículos
- Barra de búsqueda con filtro de categoría
- Vista detallada del artículo con formato HTML
- Navegación entre artículos
- Visualización de tags y metadata

### Admin y Super Admin (CRUD Completo)
**Rutas:**
- Admin: `/admin/kb`
- Super Admin: `/super-admin/kb`

**Funcionalidades:**
- Crear nuevos artículos
- Editar artículos existentes
- Eliminar artículos
- Cambiar visibilidad de artículos
- Búsqueda y filtrado avanzado

**Interfaz de Gestión:**
- Tabla con todos los artículos
- Columnas: Título, Categoría, Visible, Fecha de actualización, Acciones
- Botones de editar y eliminar por artículo
- Búsqueda por título y tags
- Filtro por categoría

### Editor WYSIWYG
**Componente:** `KbEditor`

**Características:**
- Editor visual rico con React Quill
- Generación automática de slug desde título
- Selector de categoría (predefinidas)
- Gestión de tags (separados por coma)
- Contenido HTML con formato completo
- Checkbox de visibilidad
- Validación de campos requeridos

**Herramientas del Editor:**
- Encabezados (H1-H6)
- Formato de texto (negrita, cursiva, subrayado, tachado)
- Listas (ordenadas y desordenadas)
- Indentación
- Enlaces, imágenes, videos
- Colores de texto y fondo
- Alineación
- Citas y bloques de código
- Limpieza de formato

## Categorías Predefinidas

1. **Onboarding** - Guías de inicio para nuevos socios
2. **Ventas** - Técnicas y procesos de ventas
3. **Soporte** - Solución de problemas técnicos
4. **Comisiones** - Información sobre comisiones y pagos
5. **Configuración** - Configuración de cuenta y preferencias
6. **Preguntas Frecuentes** - FAQs comunes
7. **Otro** - Categoría general

Se pueden agregar más categorías directamente en el código (`KbEditor.tsx`).

## Seguridad (RLS)

Todas las políticas de Row Level Security están implementadas:

### Para Socios:
- Pueden ver todos los artículos con `visible = true`
- No pueden ver artículos ocultos
- No pueden crear, editar o eliminar

### Para Admin/Super Admin:
- Pueden ver todos los artículos (visibles y ocultos)
- Pueden crear nuevos artículos (autor_id debe ser su propio ID)
- Pueden editar cualquier artículo
- Pueden eliminar cualquier artículo

## Flujo de Trabajo

### Crear un Artículo
1. Admin accede a `/admin/kb` o `/super-admin/kb`
2. Clic en "Nuevo Artículo"
3. Completa el formulario:
   - Título (genera slug automáticamente)
   - Slug (editable)
   - Categoría (selector)
   - Tags (separados por coma)
   - Contenido (editor WYSIWYG)
   - Checkbox "Visible para socios"
4. Clic en "Guardar Artículo"

### Editar un Artículo
1. En la tabla de artículos, clic en el icono de editar
2. Modifica los campos necesarios
3. Clic en "Guardar Artículo"

### Eliminar un Artículo
1. En la tabla de artículos, clic en el icono de eliminar
2. Confirmar eliminación
3. El artículo se elimina permanentemente

### Buscar y Leer (Socios)
1. Socio accede a `/dashboard/kb`
2. Usa la barra de búsqueda o filtro de categoría
3. Clic en cualquier artículo para verlo completo
4. Clic en "Volver a artículos" para regresar

## Características Técnicas

### Generación de Slug
- Convierte el título a minúsculas
- Normaliza caracteres especiales (á → a)
- Reemplaza espacios por guiones
- Elimina caracteres no alfanuméricos
- Resultado: "Cómo Vender Más" → "como-vender-mas"

### Búsqueda
- Búsqueda case-insensitive
- Busca en título, categoría y tags
- Actualización en tiempo real

### Filtrado
- Por categoría (selector)
- Combinable con búsqueda por texto

### Navegación
Vista de lista → Vista detallada → Botón volver

## Estilos del Contenido

El contenido HTML se renderiza con estilos de prosa:
- Tipografía optimizada para lectura
- Espaciado adecuado entre elementos
- Colores de texto legibles
- Formato para listas, enlaces, imágenes, etc.

## Mejoras Futuras Sugeridas

1. **Versiones de Artículos**
   - Historial de cambios
   - Capacidad de revertir

2. **Búsqueda Avanzada**
   - Búsqueda de texto completo
   - Búsqueda por fecha
   - Búsqueda por autor

3. **Analytics**
   - Artículos más vistos
   - Tiempo de lectura promedio
   - Artículos más útiles (reacciones)

4. **Adjuntos**
   - Subir archivos PDF
   - Imágenes locales
   - Videos alojados

5. **Notificaciones**
   - Avisar a socios de nuevos artículos
   - Actualización de artículos populares

6. **Comentarios**
   - Permitir feedback de socios
   - Sistema de valoraciones

7. **Relacionados**
   - Sugerir artículos relacionados
   - Basado en categoría o tags

## Notas Técnicas

- React Quill ya está instalado (usado también en ContentEditor)
- Los tags se almacenan como array PostgreSQL
- El slug debe ser único (constraint de base de datos)
- El contenido es HTML sanitizado por React Quill
- Las imágenes se deben referenciar por URL (no se almacenan localmente)
