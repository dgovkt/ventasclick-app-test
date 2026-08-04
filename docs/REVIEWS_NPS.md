# Sistema de Reviews y NPS

Sistema completo de gestión de reviews de clientes con metodología Net Promoter Score (NPS) integrado.

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Base de Datos](#base-de-datos)
4. [Flujo de Usuario](#flujo-de-usuario)
5. [Componentes del Sistema](#componentes-del-sistema)
6. [Edge Functions](#edge-functions)
7. [Métricas NPS](#métricas-nps)
8. [Seguridad y RLS](#seguridad-y-rls)

---

## Resumen Ejecutivo

El sistema de Reviews y NPS permite a los socios de la plataforma:
- Recopilar feedback de sus clientes mediante un formulario público
- Visualizar estadísticas NPS completas de su desempeño
- Compartir un enlace único para que los clientes dejen reviews
- Ver todas las reviews recibidas con su estado de moderación

Los administradores pueden:
- Moderar todas las reviews del sistema
- Aprobar o rechazar reviews según criterios de calidad
- Ver estadísticas generales del sistema

## Arquitectura del Sistema

### Esquema de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    Sistema de Reviews                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Formulario │    │   Dashboard  │    │  Moderación  │  │
│  │    Público   │───▶│    Socio     │◀───│    Admin     │  │
│  │  /review/:id │    │  /dashboard/ │    │   /admin/    │  │
│  └──────────────┘    │   reviews    │    │   reviews    │  │
│         │             └──────────────┘    └──────────────┘  │
│         │                     │                    │         │
│         └─────────────────────┼────────────────────┘         │
│                               ▼                              │
│                    ┌──────────────────┐                      │
│                    │  customer_reviews│                      │
│                    │      Table       │                      │
│                    └──────────────────┘                      │
│                               │                              │
│                               ▼                              │
│                    ┌──────────────────┐                      │
│                    │ reviews-publicas │                      │
│                    │  Edge Function   │                      │
│                    └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Base de Datos

### Tabla: `customer_reviews`

```sql
CREATE TABLE customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nombre_cliente text NOT NULL,
  contacto_cliente text,
  score_nps integer NOT NULL CHECK (score_nps >= 0 AND score_nps <= 10),
  comentario text NOT NULL,
  estatus text NOT NULL CHECK (estatus IN ('pendiente', 'aprobado', 'rechazado')) DEFAULT 'pendiente',
  aprobado_por uuid REFERENCES profiles(id) ON DELETE SET NULL,
  fecha_aprobacion timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### Campos Principales

- **socio_id**: ID del socio que recibirá la review
- **nombre_cliente**: Nombre del cliente que deja la review
- **contacto_cliente**: Email o teléfono del cliente (opcional)
- **score_nps**: Puntuación de 0 a 10 (metodología NPS)
- **comentario**: Texto descriptivo de la experiencia del cliente
- **estatus**: Estado de moderación (pendiente, aprobado, rechazado)
- **aprobado_por**: ID del admin que moderó la review
- **fecha_aprobacion**: Timestamp de la moderación

### Políticas RLS

```sql
-- Socios pueden ver sus propias reviews
CREATE POLICY "Socios can view own reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (socio_id = auth.uid());

-- Admins pueden ver todas las reviews
CREATE POLICY "Admins can view all reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

-- Admins pueden moderar reviews
CREATE POLICY "Admins can moderate reviews"
  ON customer_reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.rol IN ('admin', 'super_admin')
    )
  );

-- Cualquiera puede crear una review (formulario público)
CREATE POLICY "Anyone can create reviews"
  ON customer_reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

## Flujo de Usuario

### 1. Socio Comparte Enlace

El socio accede a `/dashboard/reviews` y copia su enlace único:

```
https://tuapp.com/review/[socio_id]
```

### 2. Cliente Completa Formulario

El cliente accede al enlace y completa:
1. Su nombre (requerido)
2. Contacto opcional (email o teléfono)
3. Score NPS de 0 a 10
4. Comentario descriptivo

La review se crea con estatus `pendiente`.

### 3. Moderación por Admin

Los administradores revisan la review en `/admin/reviews` y pueden:
- Aprobar la review (cambia a `aprobado`)
- Rechazar la review (cambia a `rechazado`)

### 4. Visualización de Reviews

- Los socios ven todas sus reviews (aprobadas, rechazadas y pendientes)
- Solo las reviews `aprobadas` son públicas vía Edge Function
- Los socios ven estadísticas NPS actualizadas en tiempo real

## Componentes del Sistema

### 1. Formulario Público (`/src/pages/ReviewForm.tsx`)

**Ruta**: `/review/:socioId`
**Acceso**: Público (sin autenticación)

Características:
- Validación de socio existente
- Formulario de 4 campos
- Selector visual de NPS (0-10)
- Colores dinámicos según score (verde para promotores, amarillo para pasivos, rojo para detractores)
- Confirmación visual después del envío

### 2. Dashboard del Socio (`/src/pages/socio/Reviews.tsx`)

**Ruta**: `/dashboard/reviews`
**Acceso**: Socios autenticados

Características:
- Enlace único con botón de copiar
- 5 tarjetas de estadísticas:
  - Total de reviews
  - NPS Score
  - Promotores (9-10)
  - Pasivos (7-8)
  - Detractores (0-6)
- Lista completa de reviews con:
  - Nombre del cliente
  - Categoría (Promotor/Pasivo/Detractor)
  - Estado de moderación
  - Puntuación
  - Comentario
  - Fechas de recepción y moderación

### 3. Panel de Moderación Admin (`/src/pages/admin/Reviews.tsx`)

**Ruta**: `/admin/reviews`
**Acceso**: Admins y Super Admins

Características:
- 4 tarjetas de estadísticas generales
- Filtros por estado (Todos, Pendientes, Aprobados, Rechazados)
- Lista de reviews con información del socio
- Botones de acción rápida (Aprobar/Rechazar) para reviews pendientes
- Vista consolidada de todas las reviews del sistema

### 4. Panel Super Admin (`/src/pages/super-admin/Reviews.tsx`)

**Ruta**: `/super-admin/reviews`
**Acceso**: Super Admins únicamente

Características adicionales:
- Estadística de NPS promedio global
- Mismas funcionalidades que el panel de admin
- Vista de alto nivel del sistema

## Edge Functions

### `reviews-publicas`

**Endpoint**: `https://[proyecto].supabase.co/functions/v1/reviews-publicas`
**Método**: GET
**Autenticación**: No requerida (público)

#### Parámetros Query String

- `socio_id` (opcional): Filtra reviews de un socio específico

#### Respuesta

```json
{
  "success": true,
  "stats": {
    "total": 15,
    "promedio": 8.7,
    "promotores": 10,
    "pasivos": 3,
    "detractores": 2,
    "nps_score": 53
  },
  "reviews": [
    {
      "id": "uuid",
      "nombre_cliente": "Juan Pérez",
      "score_nps": 9,
      "categoria": "promotor",
      "comentario": "Excelente servicio...",
      "socio": "María López",
      "fecha_publicacion": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Uso

```javascript
// Todas las reviews aprobadas
const response = await fetch('https://[proyecto].supabase.co/functions/v1/reviews-publicas');

// Reviews de un socio específico
const response = await fetch('https://[proyecto].supabase.co/functions/v1/reviews-publicas?socio_id=uuid');

const data = await response.json();
```

## Métricas NPS

### ¿Qué es NPS?

Net Promoter Score es una métrica que mide la lealtad del cliente en una escala de 0 a 10.

### Categorías

- **Promotores** (9-10): Clientes muy satisfechos que recomendarían el servicio
- **Pasivos** (7-8): Clientes satisfechos pero no entusiastas
- **Detractores** (0-6): Clientes insatisfechos que podrían dañar la reputación

### Cálculo del NPS Score

```
NPS Score = ((Promotores - Detractores) / Total de Respuestas) × 100
```

#### Ejemplo:

- 10 Promotores
- 3 Pasivos
- 2 Detractores
- Total: 15 reviews

```
NPS = ((10 - 2) / 15) × 100 = 53
```

### Interpretación

- **NPS > 70**: Excelente
- **NPS 50-70**: Muy bueno
- **NPS 30-50**: Bueno
- **NPS 0-30**: Necesita mejoras
- **NPS < 0**: Crítico

## Seguridad y RLS

### Principios de Seguridad

1. **Formulario Público**: Cualquiera puede crear una review (necesario para el formulario público)
2. **Visibilidad Limitada**: Los socios solo ven sus propias reviews
3. **Moderación Restringida**: Solo admins pueden cambiar el estatus
4. **Publicación Controlada**: Solo reviews aprobadas son públicas vía API

### Validaciones

- Score NPS debe estar entre 0 y 10 (constraint de BD)
- Nombre del cliente es obligatorio
- Comentario es obligatorio
- Estatus solo puede ser: pendiente, aprobado, rechazado

### Auditabilidad

El sistema registra:
- Quién moderó cada review (`aprobado_por`)
- Cuándo fue moderada (`fecha_aprobacion`)
- Cuándo fue creada (`created_at`)
- Última actualización (`updated_at`)

## Casos de Uso

### Caso 1: Socio Solicita Review

1. Socio cierra una venta exitosa
2. Accede a `/dashboard/reviews`
3. Copia su enlace único
4. Envía el enlace al cliente vía WhatsApp/Email
5. Cliente completa el formulario
6. Review aparece como "Pendiente" en el dashboard del socio

### Caso 2: Moderación de Review

1. Admin recibe notificación de nueva review
2. Accede a `/admin/reviews`
3. Filtra por "Pendientes"
4. Lee la review del cliente
5. Aprueba la review si cumple con criterios de calidad
6. La review ahora es visible públicamente

### Caso 3: Landing Page Pública

1. Visitante accede a la landing page
2. Landing consume la Edge Function `reviews-publicas`
3. Se muestran todas las reviews aprobadas
4. Visitante ve testimonios reales de clientes satisfechos
5. Aumenta la confianza en la plataforma

## Mantenimiento

### Monitoreo Recomendado

- Tiempo de respuesta del formulario público
- Tasa de reviews pendientes vs moderadas
- NPS promedio por socio
- Tiempo promedio de moderación

### Optimizaciones Futuras

- Notificaciones automáticas a admins cuando hay reviews pendientes
- Dashboard de tendencias NPS en el tiempo
- Exportación de reports en PDF
- Widget embebible de reviews para sitios externos
- Sistema de badges para socios con NPS alto

---

## Conclusión

El sistema de Reviews y NPS proporciona una solución completa para la gestión de feedback de clientes, con controles de moderación robustos y métricas accionables para mejorar continuamente la calidad del servicio.
