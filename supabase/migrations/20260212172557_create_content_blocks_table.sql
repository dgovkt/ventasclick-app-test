/*
  # Sistema de Gestión de Contenido (CMS)

  ## Descripción
  Tabla para gestión de contenido editable tipo WordPress.
  Permite a admin y super_admin editar textos de la aplicación sin modificar código.

  ## Nueva Tabla: content_blocks

  ### Campos
  - `id` (uuid, PK) - Identificador único
  - `slug` (text, unique) - Identificador único legible (ej: "landing.hero.titulo")
  - `section` (text) - Sección de la app (landing, wizard, dashboard, emails)
  - `title` (text) - Nombre amigable para admin
  - `description` (text) - Explicación de dónde se muestra
  - `type` (text) - Tipo de contenido: 'text' o 'richtext'
  - `locale` (text) - Idioma (es-MX por defecto)
  - `value` (text) - Contenido almacenado
  - `meta` (jsonb) - Metadatos adicionales opcionales
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Seguridad
  - Solo admin y super_admin pueden gestionar contenido
  - Usuarios autenticados pueden leer contenido para consumo en frontend
  - RLS habilitado con políticas restrictivas

  ## Índices
  - Índice único en slug para búsquedas rápidas
  - Índice en section para filtrado por sección
*/

-- Crear tabla content_blocks
CREATE TABLE IF NOT EXISTS content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  section text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'richtext')) DEFAULT 'text',
  locale text NOT NULL DEFAULT 'es-MX',
  value text NOT NULL DEFAULT '',
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_content_blocks_section ON content_blocks(section);
CREATE INDEX IF NOT EXISTS idx_content_blocks_slug ON content_blocks(slug);
CREATE INDEX IF NOT EXISTS idx_content_blocks_locale ON content_blocks(locale);

-- Habilitar RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Política: Todos los usuarios autenticados pueden leer contenido
CREATE POLICY "Anyone authenticated can view content"
  ON content_blocks FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo admin y super_admin pueden insertar contenido
CREATE POLICY "Admins can insert content"
  ON content_blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Política: Solo admin y super_admin pueden actualizar contenido
CREATE POLICY "Admins can update content"
  ON content_blocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Política: Solo admin y super_admin pueden eliminar contenido
CREATE POLICY "Admins can delete content"
  ON content_blocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND rol IN ('admin', 'super_admin')
    )
  );

-- Trigger para actualizar updated_at automáticamente
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_content_blocks_updated_at'
  ) THEN
    CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON content_blocks
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insertar contenido inicial de ejemplo para la landing
INSERT INTO content_blocks (slug, section, title, description, type, value) VALUES
  (
    'landing.hero.title',
    'landing',
    'Título principal del hero',
    'Título grande que aparece en la parte superior de la landing page',
    'richtext',
    'Impulsa tus ventas con <span class="text-blue-600">Socios Ventas Click</span>'
  ),
  (
    'landing.hero.subtitle',
    'landing',
    'Subtítulo del hero',
    'Descripción debajo del título principal',
    'text',
    'La plataforma integral para gestionar leads, cerrar ventas y administrar tus comisiones. Todo lo que necesitas para llevar tu negocio al siguiente nivel.'
  ),
  (
    'landing.hero.cta',
    'landing',
    'Texto del botón principal',
    'Call to action del hero',
    'text',
    'Comenzar Ahora'
  ),
  (
    'landing.features.leads.title',
    'landing',
    'Título de característica: Leads',
    'Card de gestión de leads',
    'text',
    'Gestión de Leads'
  ),
  (
    'landing.features.leads.description',
    'landing',
    'Descripción de característica: Leads',
    'Descripción de la card de gestión de leads',
    'text',
    'Organiza y da seguimiento a todos tus prospectos desde un solo lugar.'
  ),
  (
    'landing.features.sales.title',
    'landing',
    'Título de característica: Ventas',
    'Card de control de ventas',
    'text',
    'Control de Ventas'
  ),
  (
    'landing.features.sales.description',
    'landing',
    'Descripción de característica: Ventas',
    'Descripción de la card de control de ventas',
    'text',
    'Registra y monitorea todas tus ventas con información detallada.'
  ),
  (
    'landing.cta.title',
    'landing',
    'Título del CTA final',
    'Título de la sección final de conversión',
    'text',
    '¿Listo para empezar?'
  ),
  (
    'landing.cta.subtitle',
    'landing',
    'Subtítulo del CTA final',
    'Subtítulo de la sección final de conversión',
    'text',
    'Únete a nuestra red de socios exitosos'
  )
ON CONFLICT (slug) DO NOTHING;