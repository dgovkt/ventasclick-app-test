# Sistema de Pagos y Comisiones

## Descripción General

Sistema completo para que los socios configuren sus datos de pago y soliciten el cobro de sus comisiones.

## Estructura de Base de Datos

### Tabla: profiles (actualizada)
Campos añadidos:
- `nombre_banco` - Nombre del banco del socio
- `clabe` - CLABE interbancaria (18 dígitos)
- `numero_cuenta` - Número de cuenta
- `beneficiario` - Nombre del beneficiario
- `frecuencia_pago` - 'semanal' o 'mensual'
- `payment_config_updated_at` - Fecha de última actualización

### Tabla: solicitudes_pago
Almacena las solicitudes de cobro de comisiones:
- `id` - UUID único
- `socio_id` - Referencia al socio
- `monto_solicitado` - Monto total solicitado
- `estatus` - 'pendiente', 'aprobada', 'pagada', 'rechazada'
- `fecha_inicio` - Fecha inicial del período
- `fecha_fin` - Fecha final del período
- `comentarios_admin` - Comentarios del administrador
- `payment_reference` - Referencia externa de pago (para integraciones)
- `payment_date` - Fecha de pago efectivo
- `created_at`, `updated_at`

### Tabla: solicitud_pago_ventas
Tabla intermedia que relaciona solicitudes con ventas específicas:
- `solicitud_pago_id` - Referencia a la solicitud
- `venta_id` - Referencia a la venta
- `comision_calculada` - Comisión calculada al momento de la solicitud

### Tabla: ventas (actualizada)
Campo añadido:
- `pagado_socio` - Boolean, indica si la comisión fue pagada al socio

## Funcionalidades

### 1. Configuración de Pago
Pestaña donde el socio configura:
- Datos bancarios (banco, CLABE, cuenta, beneficiario)
- Frecuencia de pago (semanal o mensual)
- Validación automática de CLABE (18 dígitos)

### 2. Resumen de Comisiones
Vista general con tres tarjetas:
- **Pendientes**: Monto total en solicitudes pendientes
- **Aprobadas**: Monto total en solicitudes aprobadas
- **Pagadas**: Monto total en solicitudes pagadas

### 3. Solicitudes de Cobro
Funcionalidad para crear y gestionar solicitudes:

#### Crear Nueva Solicitud
1. Seleccionar rango de fechas
2. Sistema carga ventas elegibles:
   - `estatus_pago = 'completado'`
   - `pagado_socio = false`
   - Dentro del rango de fechas
3. Socio selecciona ventas a incluir
4. Sistema calcula monto total
5. Se crea la solicitud en estado 'pendiente'

#### Estados de Solicitud
- **Pendiente**: Recién creada, esperando revisión
- **Aprobada**: Revisada y aprobada por admin
- **Pagada**: Pago efectuado
- **Rechazada**: Rechazada con comentarios del admin

## Flujo de Trabajo

### Flujo del Socio
1. Configurar datos bancarios (una sola vez)
2. Realizar ventas y acumular comisiones
3. Crear solicitud de cobro seleccionando ventas
4. Esperar aprobación del administrador
5. Recibir pago según frecuencia configurada

### Flujo del Administrador (futuro)
1. Revisar solicitudes pendientes
2. Validar datos bancarios del socio
3. Aprobar o rechazar solicitud
4. Procesar pago
5. Marcar solicitud como pagada
6. Actualizar `pagado_socio = true` en ventas incluidas

## Preparación para Integraciones

### Campos preparados para pasarelas de pago:
- `payment_reference` en solicitudes_pago
- `payment_date` para fecha exacta de pago
- Estructura permite agregar metadata de transacciones

### Integraciones futuras sugeridas:
- **Chargebee**: Para gestión de suscripciones y pagos recurrentes
- **Stripe Connect**: Para pagos directos a socios
- **Conekta/OpenPay**: Pasarelas locales mexicanas

### Puntos de integración:
1. Validación automática de datos bancarios
2. Procesamiento automático de pagos aprobados
3. Webhooks para actualización de estados
4. Reconciliación automática con registros bancarios

## Seguridad (RLS)

Todas las tablas tienen Row Level Security habilitado:
- Socios solo ven sus propios datos
- Administradores ven todos los datos
- Políticas específicas para INSERT, UPDATE, DELETE

## Contenido Editable (CMS)

Todos los textos de la interfaz son editables vía CMS:
- Etiquetas de formularios
- Mensajes informativos
- Títulos y descripciones
- Textos de ayuda

Slugs principales:
- `comisiones.resumen.*`
- `comisiones.config.*`
- `comisiones.solicitudes.*`
- `comisiones.nueva_solicitud.*`

## Notas Técnicas

- La CLABE se valida automáticamente (18 dígitos numéricos)
- Las ventas elegibles se filtran para evitar duplicados
- El monto se calcula y congela al momento de crear la solicitud
- Los comentarios del admin son visibles para el socio
- El sistema soporta múltiples ventas por solicitud
