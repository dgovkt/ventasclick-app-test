/*
  # Seed Agent Management Manual Sections

  1. New Manual Sections
    - Creates comprehensive documentation for the Agent Management module
    - Includes 4 sections covering all aspects of agent management
  
  2. Categories
    - All sections under 'gestion_agentes' category
    
  3. Structure
    - Directorio de Agentes (overview and navigation)
    - Métricas de Desempeño (performance metrics explained)
    - Activar y Desactivar Agentes (account management)
    - Rankings y Comparativas (ranking system documentation)
*/

INSERT INTO user_manual_sections (title, slug, content, category, icon_name, order_index, visible)
VALUES
(
  'Directorio de Agentes',
  'directorio-agentes',
  E'# Directorio de Agentes

El módulo de **Gestión de Agentes** proporciona una vista completa de todos los socios comerciales que trabajan con Ventas Click.

## Acceso

Para acceder a esta sección:
1. Ingresa al panel de **Super Admin**
2. Haz clic en **Agentes** en el menú lateral
3. Se mostrará el directorio completo de agentes

## Vista Principal

El directorio muestra una tabla con información de todos los agentes:

### Columnas Disponibles

- **Agente**: Nombre completo y categoría de desempeño
- **Contacto**: Email y teléfono del agente
- **Leads**: Total de leads generados (con indicador de leads del mes actual)
- **Ventas**: Total de ventas cerradas (con indicador de ventas del mes actual)
- **Conversión**: Tasa de conversión de leads a ventas (porcentaje)
- **Comisiones**: Total de comisiones generadas en MXN
- **Estado**: Activo o Inactivo
- **Acciones**: Botones para ver detalles y cambiar estado

### Tarjetas de Resumen

En la parte superior se muestran 4 tarjetas con estadísticas agregadas:

1. **Total Agentes**: Número total de socios comerciales registrados
2. **Agentes Activos**: Cuántos agentes están actualmente activos
3. **Ventas Totales**: Suma de todas las ventas cerradas por todos los agentes
4. **Comisiones Generadas**: Total de comisiones generadas por todos los agentes

## Funciones de Búsqueda y Filtrado

### Barra de Búsqueda
Permite buscar agentes por:
- Nombre
- Apellido
- Email

### Filtro por Estado
Opciones disponibles:
- **Todos los estados**: Muestra todos los agentes
- **Activos**: Solo agentes con cuentas activas
- **Inactivos**: Solo agentes desactivados

### Filtro por Período
Permite ajustar las métricas mostradas:
- **Histórico completo**: Todas las métricas desde el inicio
- **Mes actual**: Solo métricas del mes en curso
- **Último trimestre**: Métricas de los últimos 3 meses

## Categorías de Desempeño

Los agentes se clasifican automáticamente según su tasa de conversión:

- **Excelente** (≥ 50% conversión): Badge verde
- **Bueno** (30-49% conversión): Badge azul
- **Regular** (15-29% conversión): Badge amarillo
- **En desarrollo** (< 15% conversión): Badge gris

## Ver Detalles de un Agente

Para ver información detallada de un agente:

1. Haz clic en el icono de ojo (👁️) en la columna de acciones
2. Se abrirá un modal con:
   - Resumen de métricas principales
   - Últimos 10 leads generados
   - Últimas 10 ventas cerradas
   - Información de contacto completa

El modal de detalle permite revisar el historial reciente de actividad del agente sin salir de la vista principal.',
  'gestion_agentes',
  'UserCheck',
  1,
  true
),
(
  'Métricas de Desempeño de Agentes',
  'metricas-desempeno-agentes',
  E'# Métricas de Desempeño de Agentes

El sistema calcula automáticamente varias métricas clave para evaluar el desempeño de cada agente.

## Métricas Principales

### Total de Leads
- **Qué es**: Número total de leads (contactos/prospectos) generados por el agente
- **Cómo se calcula**: Cuenta todos los registros en la tabla de leads asociados al agente
- **Indicador adicional**: Entre paréntesis se muestra cuántos leads son del mes actual

### Total de Ventas
- **Qué es**: Número total de ventas cerradas exitosamente
- **Cómo se calcula**: Cuenta todas las ventas completadas por el agente
- **Indicador adicional**: Entre paréntesis se muestra cuántas ventas son del mes actual

### Tasa de Conversión
- **Qué es**: Porcentaje de leads que se convierten en ventas
- **Cómo se calcula**: (Total Ventas ÷ Total Leads) × 100
- **Interpretación**:
  - 50% o más: Excelente desempeño
  - 30-49%: Buen desempeño
  - 15-29%: Desempeño regular
  - Menos de 15%: En desarrollo

**Ejemplo**: Si un agente tiene 20 leads y 8 ventas, su tasa de conversión es 40% (8 ÷ 20 × 100)

### Comisiones Generadas
- **Qué es**: Monto total en MXN que el agente ha generado en comisiones
- **Cómo se calcula**: Suma de todas las comisiones de ventas pagadas asociadas al agente
- **Formato**: Se muestra en pesos mexicanos con separadores de miles

## Indicadores de Tendencia

Cuando aplicas filtros de tiempo (mes actual o trimestre), algunas métricas muestran indicadores visuales:

- **Flecha hacia arriba (↗)** en verde: Las métricas están mejorando
- **Flecha hacia abajo (↘)** en rojo: Las métricas están disminuyendo
- Sin flecha: No hay cambio significativo

## Métricas en el Dashboard

Las tarjetas de resumen en la parte superior muestran:

### Total Agentes
Número total de socios comerciales registrados en el sistema, independientemente de su estado.

### Agentes Activos
Cuántos agentes tienen su cuenta activa y pueden acceder al sistema. Esta métrica es importante para medir el equipo de ventas actual.

### Ventas Totales
Suma de todas las ventas cerradas por todos los agentes. Esta métrica refleja el volumen de negocio generado por el equipo completo.

### Comisiones Generadas
Total acumulado de todas las comisiones generadas por todos los agentes. Esta métrica muestra el valor monetario del esfuerzo del equipo.

## Actualización de Métricas

Todas las métricas se calculan en tiempo real cada vez que:
- Se carga la página
- Se aplican filtros
- Se cambia el período de tiempo

No es necesario refrescar manualmente la página para ver cambios recientes.',
  'gestion_agentes',
  'Target',
  2,
  true
),
(
  'Activar y Desactivar Agentes',
  'activar-desactivar-agentes',
  E'# Activar y Desactivar Agentes

La funcionalidad de activar/desactivar permite controlar el acceso de los agentes al sistema sin eliminar sus cuentas.

## Desactivar un Agente

### ¿Cuándo desactivar?

Desactiva un agente en estas situaciones:
- El agente ya no trabaja con Ventas Click
- Suspensión temporal por incumplimiento de políticas
- El agente solicitó pausar su cuenta temporalmente
- Durante períodos de inactividad prolongada

### Proceso de Desactivación

1. Localiza al agente en la tabla del directorio
2. En la columna **Acciones**, haz clic en el icono de prohibición (🚫) rojo
3. Aparecerá un mensaje de confirmación:
   > "¿Estás seguro de que deseas desactivar este agente? No podrá acceder al sistema."
4. Haz clic en **Aceptar** para confirmar
5. El sistema mostrará el mensaje: "Agente desactivado exitosamente"
6. El estado del agente cambiará a **Inactivo** con un badge rojo

### Efectos de la Desactivación

Cuando un agente está desactivado:

- ❌ **No puede iniciar sesión** en el sistema
- ❌ **No puede acceder** a ninguna función del dashboard
- ❌ **No aparece en filtros** de agentes activos
- ✅ **Se conservan todos sus datos**: leads, ventas, comisiones
- ✅ **Aparece en reportes históricos**
- ✅ **Puede ser reactivado** en cualquier momento

**Importante**: Desactivar un agente NO elimina ningún dato. Toda su información histórica permanece en el sistema.

## Activar un Agente

### ¿Cuándo activar?

Activa un agente cuando:
- Un agente desactivado regresa a trabajar
- Se resolvió el motivo de la suspensión
- Se requiere restaurar acceso temporalmente

### Proceso de Activación

1. Cambia el filtro de estado a **Inactivos** o **Todos los estados**
2. Localiza al agente desactivado (tendrá badge rojo de "Inactivo")
3. En la columna **Acciones**, haz clic en el icono de check (✓) verde
4. Aparecerá un mensaje de confirmación:
   > "¿Deseas activar este agente?"
5. Haz clic en **Aceptar** para confirmar
6. El sistema mostrará el mensaje: "Agente activado exitosamente"
7. El estado cambiará a **Activo** con un badge verde

### Efectos de la Activación

Cuando se activa un agente:

- ✅ **Puede iniciar sesión** inmediatamente
- ✅ **Acceso completo** a todas las funciones del dashboard
- ✅ **Aparece en filtros** de agentes activos
- ✅ **Puede generar nuevos leads** y ventas
- ✅ **Continúa desde donde dejó** (sin pérdida de datos)

## Mejores Prácticas

### Comunicación
Siempre comunica al agente antes de desactivar su cuenta, a menos que sea por motivos de seguridad urgentes.

### Documentación
Considera agregar notas en el perfil del agente (en la sección de Usuarios) explicando el motivo de la desactivación y la fecha.

### Revisión Periódica
Revisa periódicamente la lista de agentes inactivos para determinar si:
- Deben ser reactivados
- Requieren seguimiento
- Necesitan limpieza de datos antiguos

### No Eliminar
**Nunca elimines** cuentas de agentes para mantener la integridad de los datos históricos. Usa siempre la función de desactivar.

## Auditoría

El sistema registra automáticamente:
- Quién desactivó o activó la cuenta
- Fecha y hora del cambio
- Estado anterior y nuevo estado

Esta información está disponible en los registros del sistema para auditoría.',
  'gestion_agentes',
  'Ban',
  3,
  true
),
(
  'Rankings y Comparativas de Agentes',
  'rankings-comparativas-agentes',
  E'# Rankings y Comparativas de Agentes

El sistema de rankings permite identificar a los mejores agentes y fomentar la competencia saludable entre el equipo de ventas.

## Top 3 Agentes

En la sección de rankings se destacan los 3 mejores agentes según la métrica seleccionada.

### Visualización

Los rankings se muestran con tarjetas especiales:

1. **Posición #1**: Tarjeta con borde dorado y fondo amarillo claro
2. **Posición #2**: Tarjeta con borde plateado y fondo gris claro
3. **Posición #3**: Tarjeta con borde bronce y fondo naranja claro

Cada tarjeta muestra:
- Número de posición grande (#1, #2, #3)
- Nombre completo del agente
- Email de contacto
- Métricas principales: Ventas, Comisiones y Conversión

## Tipos de Rankings

### Por Ventas
Ordena a los agentes por el **número total de ventas cerradas**.

**Cómo se calcula**: Cuenta el total de registros de ventas asociados a cada agente.

**Mejor uso**: Para reconocer el volumen de trabajo y productividad bruta.

**Ejemplo**:
- Agente A: 45 ventas → #1
- Agente B: 38 ventas → #2
- Agente C: 32 ventas → #3

### Por Comisiones
Ordena a los agentes por el **monto total de comisiones generadas** en MXN.

**Cómo se calcula**: Suma todas las comisiones de ventas pagadas del agente.

**Mejor uso**: Para reconocer el valor monetario aportado al negocio.

**Ejemplo**:
- Agente X: $125,000 → #1
- Agente Y: $98,500 → #2
- Agente Z: $87,300 → #3

**Nota**: Este ranking puede diferir del ranking por ventas si los agentes venden planes de diferentes valores.

### Por Conversión
Ordena a los agentes por su **tasa de conversión** (porcentaje).

**Cómo se calcula**: (Ventas ÷ Leads) × 100 para cada agente.

**Mejor uso**: Para reconocer la eficiencia y calidad del trabajo, no solo cantidad.

**Ejemplo**:
- Agente M: 65% conversión (13 ventas de 20 leads) → #1
- Agente N: 52% conversión (26 ventas de 50 leads) → #2
- Agente O: 48% conversión (12 ventas de 25 leads) → #3

**Ventaja**: Reconoce a agentes que quizás no tienen el mayor volumen pero son muy efectivos cerrando ventas.

## Cómo Cambiar el Tipo de Ranking

1. En la sección **Top 3 Agentes**, verás 3 botones:
   - **Por Ventas**
   - **Por Comisiones**
   - **Por Conversión**

2. Haz clic en el botón correspondiente al criterio deseado

3. El ranking se actualizará instantáneamente mostrando el top 3 según el nuevo criterio

4. El botón seleccionado se mostrará en azul para indicar el criterio activo

## Interpretación de Rankings

### Análisis Multi-Criterio

Es recomendable revisar los 3 tipos de rankings para obtener una imagen completa:

**Escenario 1: Mismo agente en los 3 rankings**
- Indica un agente excepcional con alto volumen, eficiencia y valor generado

**Escenario 2: Diferentes agentes en cada ranking**
- Indica que el equipo tiene fortalezas diversas
- Algunos son productivos en volumen
- Otros son eficientes en conversión
- Otros generan alto valor por venta

### Uso Estratégico

**Para reconocimiento público**: Usa el ranking por ventas o comisiones, que son métricas tangibles y fáciles de comunicar.

**Para coaching**: Usa el ranking por conversión para identificar quién necesita mejorar su efectividad vs. quién solo necesita más leads.

**Para compensación**: Usa el ranking por comisiones, ya que refleja directamente el valor económico generado.

## Filtro de Período

El ranking respeta el **filtro de período** seleccionado en la página:

- **Histórico completo**: Rankings basados en todos los datos desde el inicio
- **Mes actual**: Rankings solo del mes en curso (ideal para competencias mensuales)
- **Último trimestre**: Rankings de los últimos 3 meses

**Tip**: Cambia el período para identificar tendencias:
- ¿Quién fue el mejor del mes pasado?
- ¿Quién ha sido consistente en el trimestre?
- ¿Quién ha sido el mejor históricamente?

## Mejores Prácticas

### Transparencia
Considera compartir los rankings con todo el equipo para fomentar competencia saludable.

### Reconocimiento
Implementa un programa de reconocimiento mensual basado en estos rankings.

### Balance
No te enfoques solo en un tipo de ranking. Reconoce diferentes tipos de excelencia.

### Actualizaciones Regulares
Revisa los rankings semanalmente durante reuniones de equipo para mantener la motivación.

### Metas Claras
Usa los rankings para establecer metas: "El objetivo es entrar al top 3 este mes".',
  'gestion_agentes',
  'Award',
  4,
  true
);
