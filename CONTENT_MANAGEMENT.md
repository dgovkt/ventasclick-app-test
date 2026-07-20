# Sistema de Gestión de Contenido (CMS)

## Descripción General

El sistema de gestión de contenido permite a administradores y super administradores editar los textos de la aplicación sin necesidad de modificar código. Similar a WordPress, este sistema ofrece una interfaz amigable para gestionar todo el contenido textual de la aplicación.

## Características

- **Editor WYSIWYG**: Editor visual con formato rico (negritas, cursivas, listas, enlaces)
- **Organización por Secciones**: Contenido organizado por área (Landing, Wizard, Dashboard, Emails)
- **Búsqueda y Filtrado**: Encuentra rápidamente el contenido que necesitas editar
- **Previsualización en Tiempo Real**: Los cambios se reflejan inmediatamente en la aplicación
- **Sistema de Slugs**: Identificadores únicos para cada bloque de contenido
- **Multiidioma**: Soporte para múltiples idiomas (actualmente es-MX)

## Acceso al Panel

### Permisos
- **Admin**: Acceso completo a la gestión de contenido
- **Super Admin**: Acceso completo a la gestión de contenido
- **Socio**: Sin acceso al panel de contenido

### Navegación
1. Inicia sesión con un usuario admin o super_admin
2. En el menú lateral, haz clic en "Contenido"
3. Verás el panel principal con todos los bloques de contenido

## Panel Principal

El panel principal muestra todos los bloques de contenido organizados por sección:

### Elementos de la Interfaz

**Barra de Búsqueda**:
- Busca por título, slug o descripción
- Búsqueda en tiempo real

**Filtro por Sección**:
- Landing: Contenido de la página principal
- Wizard: Textos del asistente paso a paso
- Dashboard: Contenido del panel de control
- Emails: Plantillas de correos

**Lista de Bloques**:
- Cada bloque muestra:
  - **Título**: Nombre descriptivo del contenido
  - **Descripción**: Dónde aparece este contenido
  - **Slug**: Identificador único (solo lectura)
  - **Tipo**: text (texto simple) o richtext (texto con formato)

## Editar Contenido

### Pasos para Editar

1. **Localizar el Contenido**
   - Usa la búsqueda o navega por secciones
   - Haz clic en el bloque que deseas editar

2. **Formulario de Edición**
   - **Título**: Nombre descriptivo (editable)
   - **Slug**: Identificador único (solo lectura, no se puede cambiar)
   - **Sección**: Categoría del contenido (no se puede cambiar después de crearlo)
   - **Tipo**: text o richtext (editable)
   - **Descripción**: Explicación de dónde aparece (editable)
   - **Contenido**: El texto que se mostrará (editable)

3. **Editar el Contenido**

   **Para Texto Simple (type: text)**:
   - Campo de texto sin formato
   - Usa saltos de línea normales
   - No soporta negritas, cursivas, etc.

   **Para Texto Enriquecido (type: richtext)**:
   - Editor visual tipo WordPress
   - Herramientas disponibles:
     - Encabezados (H1, H2, H3)
     - **Negrita**, *Cursiva*, <u>Subrayado</u>, ~~Tachado~~
     - Listas numeradas y con viñetas
     - Enlaces
     - Botón "Limpiar formato"

4. **Guardar Cambios**
   - Haz clic en "Guardar Cambios"
   - Los cambios se aplicarán inmediatamente
   - Los usuarios verán el nuevo contenido al recargar la página

## Crear Nuevo Contenido

### Pasos para Crear un Bloque Nuevo

1. Haz clic en "Nuevo Bloque" en la esquina superior derecha
2. Completa todos los campos requeridos:
   - **Título**: Nombre descriptivo (ej: "Título principal del hero")
   - **Slug**: Identificador único (ej: "landing.hero.title")
     - Usa puntos para separar niveles: `seccion.subseccion.elemento`
     - Solo minúsculas y guiones
     - Ejemplos: `landing.hero.title`, `wizard.step1.question`
   - **Sección**: Selecciona la categoría apropiada
   - **Tipo**: Elige entre texto simple o enriquecido
   - **Descripción**: Explica dónde aparecerá este contenido
   - **Contenido**: El texto que se mostrará
3. Haz clic en "Guardar Cambios"

### Convención de Nombres para Slugs

Sigue esta estructura jerárquica:

```
[seccion].[subseccion].[elemento]
```

**Ejemplos**:
- `landing.hero.title` - Título del hero de la landing
- `landing.features.leads.title` - Título de la característica de leads
- `wizard.step1.question` - Pregunta del paso 1 del wizard
- `dashboard.welcome.message` - Mensaje de bienvenida del dashboard
- `emails.welcome.subject` - Asunto del email de bienvenida

## Uso en el Código (Para Desarrolladores)

### Hook useContent

Para usar contenido dinámico en cualquier componente:

```typescript
import { useContent } from '../contexts/ContentContext';

export const MiComponente: React.FC = () => {
  const titulo = useContent('landing.hero.title', 'Título por defecto');

  return (
    <h1>{titulo}</h1>
  );
};
```

### Parámetros

- **slug**: Identificador único del contenido
- **defaultValue**: Texto que se muestra si no existe el contenido en la BD

### Para Contenido con HTML

Si el contenido es de tipo `richtext` y contiene HTML:

```typescript
const contenidoRico = useContent('landing.hero.title', 'Título por defecto');

return (
  <div dangerouslySetInnerHTML={{ __html: contenidoRico }} />
);
```

### Refresh Manual

Si necesitas recargar el contenido manualmente:

```typescript
import { useContentRefresh } from '../contexts/ContentContext';

export const MiComponente: React.FC = () => {
  const refreshContent = useContentRefresh();

  const handleRefresh = () => {
    refreshContent();
  };

  return (
    <button onClick={handleRefresh}>Recargar Contenido</button>
  );
};
```

## Base de Datos

### Tabla: content_blocks

```sql
CREATE TABLE content_blocks (
  id uuid PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  section text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,              -- 'text' o 'richtext'
  locale text NOT NULL,             -- 'es-MX'
  value text NOT NULL,              -- Contenido
  meta jsonb,                       -- Metadatos adicionales
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
```

### Políticas RLS

- **Lectura**: Todos los usuarios autenticados pueden leer contenido
- **Escritura**: Solo admin y super_admin pueden crear/editar/eliminar

## Contenido Pre-cargado

El sistema viene con contenido de ejemplo para la landing page:

1. `landing.hero.title` - Título principal
2. `landing.hero.subtitle` - Subtítulo del hero
3. `landing.hero.cta` - Texto del botón principal
4. `landing.features.leads.title` - Título de característica
5. `landing.features.leads.description` - Descripción de característica
6. `landing.features.sales.title` - Título de ventas
7. `landing.features.sales.description` - Descripción de ventas
8. `landing.cta.title` - Título del CTA final
9. `landing.cta.subtitle` - Subtítulo del CTA final

## Mejores Prácticas

### Para Administradores

1. **Descripción Clara**: Siempre incluye una descripción detallada de dónde aparece el contenido
2. **Prueba los Cambios**: Después de editar, verifica que el contenido se vea bien en la aplicación
3. **Usa Richtext Sabiamente**: Solo usa richtext cuando realmente necesites formato
4. **Mantén Consistencia**: Usa el mismo tono y estilo en todo el contenido

### Para Desarrolladores

1. **Siempre Incluye Default**: Nunca dejes el defaultValue vacío
2. **Slugs Descriptivos**: Usa nombres de slug que describan claramente el contenido
3. **Documenta Nuevos Slugs**: Al crear nuevos bloques, documéntalos en este archivo
4. **No Hard-codear Textos**: Todo texto visible al usuario debe usar useContent

## Solución de Problemas

### El contenido no se actualiza

1. Verifica que guardaste los cambios
2. Recarga la página en el navegador
3. Limpia la caché del navegador
4. Verifica que estés editando el slug correcto

### No puedo editar contenido

1. Verifica tu rol (debe ser admin o super_admin)
2. Verifica que estés autenticado
3. Revisa la consola del navegador por errores

### El editor WYSIWYG no funciona

1. Verifica que el tipo del bloque sea 'richtext'
2. Si el tipo es 'text', cámbialo a 'richtext'
3. Recarga la página del editor

### Slug duplicado

- Los slugs deben ser únicos
- Si intentas crear un bloque con un slug existente, recibirás un error
- Usa la búsqueda para verificar si un slug ya existe

## Roadmap

Funcionalidades planeadas para futuras versiones:

- [ ] Previsualización en vivo antes de guardar
- [ ] Historial de versiones y restauración
- [ ] Importar/Exportar contenido en JSON
- [ ] Editor de imágenes
- [ ] Variables dinámicas (ej: {{nombre_usuario}})
- [ ] Plantillas de contenido
- [ ] Programación de publicación
- [ ] Multi-idioma completo
- [ ] Workflow de aprobación
- [ ] Búsqueda avanzada con filtros

## Soporte

Si tienes preguntas o problemas con el sistema de contenido:

1. Consulta esta documentación
2. Revisa la consola del navegador por errores
3. Contacta al equipo de desarrollo
