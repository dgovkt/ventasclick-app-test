# Wizard Complete Implementation

## Overview
Complete implementation of the wizard system with proper prospect tracking, distinguishing between leads and non-interested prospects.

## Database Changes

### New Tables Created

#### 1. `wizard_prospectos`
Tracks prospects who said "not interested" but were still prospected.

**Purpose**: These are NOT leads, just records for analytics and funnel metrics to measure: total prospected vs leads created vs sales closed.

**Columns**:
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `nombre` (text, nullable)
- `apellidos` (text, nullable)
- `email` (text, nullable)
- `telefono` (text, nullable)
- `que_vende` (text, nullable)
- `plan_recomendado_id` (uuid, FK to planes)
- `diagnostico_opcion` (text, A/B/C/D)
- `created_at` (timestamptz)

**RLS Policies**: Socios can only view/manage their own prospects. Super admins can view all.

#### 2. `wizard_accesos`
Tracks every wizard access for analytics and abandonment analysis.

**Columns**:
- `id` (uuid, PK)
- `socio_id` (uuid, FK to profiles)
- `fecha_acceso` (timestamptz)
- `ip_address` (text, nullable)
- `user_agent` (text, nullable)
- `completed` (boolean, default false)
- `session_id` (text, unique session identifier)
- `abandoned_at_step` (integer, nullable)
- `created_at` (timestamptz)

**Purpose**: Measure completion rates, abandonment funnel, identify which screens cause dropoff.

#### 3. `evidencias_ventas`
Stores photographic evidence of sales for commission approval.

**Columns**:
- `id` (uuid, PK)
- `venta_id` (uuid, FK to ventas)
- `foto_url` (text, URL to Supabase Storage)
- `tipo` (text, 'comprobante', 'captura_pantalla', 'otro')
- `nota` (text, optional note)
- `created_at` (timestamptz)

**Purpose**: Socios upload payment receipts, screenshots. Admin reviews before approving commissions.

#### 4. `chargebee_webhooks`
Future integration with Chargebee payment platform.

**Columns**:
- `id` (uuid, PK)
- `event_type` (text)
- `payload` (jsonb, complete webhook data)
- `processed` (boolean, default false)
- `processed_at` (timestamptz, nullable)
- `error_message` (text, nullable)
- `created_at` (timestamptz)

**Purpose**: Queue for processing payment confirmations. Updates ventas.estatus_pago when payment succeeds.

## Content Management System

### All Wizard Screens Now Editable via CMS

All text content loaded from `content_blocks` table with section='wizard':

1. **Welcome Screen** (wizard.bienvenida)
2. **Diagnosis Options** (wizard.diagnostico.opcion_a/b/c/d)
3. **Confirmation Screens** (wizard.confirmacion.presencia_web/tienda)
4. **Plan Presencia Web Steps 1-8** (wizard.plan_web.step1-8)
5. **Plan Tienda Steps 1-6** (wizard.plan_tienda.step1-6)
6. **Post-Purchase Flow Steps 9-16** (wizard.post_compra.step9-16)

### Correct Pricing Now in Content Blocks
- Plan Presencia Web: **$3,299 MXN** (was $12,000)
- Plan Tienda en Línea: **$6,828 MXN** (was $18,000)

## New Wizard Flow

### Step-by-Step Process

#### Step 0: Welcome Screen
- New initial screen with editable hero message
- Explains the diagnostic process
- Bullet points highlighting benefits
- CTA button "Comenzar Diagnóstico"

#### Step 1: Diagnosis (4 Options)
- **Option A**: Dar a conocer su negocio → Maps to Presencia Web
- **Option B**: Mejorar su imagen digital → Maps to Presencia Web
- **Option C**: Vender en línea → Maps to Tienda
- **Option D**: Crecer sus ventas digitales → Maps to Tienda
- Each option has custom icon and description from CMS

#### Step 2: Confirmation Screen
- Shows green checkmark animation
- Confirms recommended plan
- Brief explanation why this plan fits
- CTA "Ver detalles del plan"

#### Step 3: Plan Details (8 steps for Web, 6 for Tienda)
- Progressive disclosure of plan features
- Each step shows 1 benefit with bullets
- Progress bar showing advancement
- Step 8/6 shows final price from CMS

#### Step 4: Client Data Capture (MANDATORY)
- **Moved BEFORE decision to guarantee all prospects are tracked**
- Required fields: nombre, apellidos, email, teléfono, qué vende
- Form validation prevents continuing without complete data
- Motivational message about generating personalized proposal

#### Step 5: Decision Screen
- Shows price summary
- Three clear options:
  1. **"Adquirir plan ahora"** (green primary button)
  2. **"Quiero dejar mis datos para después"** (secondary button)
  3. **"No estoy interesado en este momento"** (text link)

#### Step 6a: Post-Purchase Flow (if "Adquirir plan ahora")
- Steps 9-16 guide through onboarding
- Payment instructions
- App download QR codes
- Portal access guide
- Evidence upload (step 15)
- Final thank you message

#### Step 6b: Success Screen (if "Dejar datos" or "No interesado")
- Confirmation message
- Options to "Ver Leads" or "Nuevo Diagnóstico"

## Data Flow by Decision Type

### 1. User Purchases ("Adquirir plan ahora")
**Creates**:
- Lead with `estado='cerrado_ganado'` and `origen='wizard'`
- Venta with `estatus_pago='pendiente'`
- Commission calculated: $495 (Web) or $1,024 (Tienda)
- wizard_results with `resultado='compro'` and lead_id

**Flow**: Advances to post-purchase steps 9-16

### 2. User Leaves Data for Later ("Dejar datos para después")
**Creates**:
- Lead with `estado='nuevo'` and `origen='wizard'`
- wizard_results with `resultado='dejo_datos'` and lead_id
- Lead appears in mini CRM "Nuevos" section for follow-up

**Flow**: Goes directly to success screen

### 3. User Not Interested ("No estoy interesado")
**Creates**:
- Record in `wizard_prospectos` (NOT a lead)
- wizard_results with `resultado='no_interesado'` and `lead_id=NULL`
- Counts for metrics but NOT in mini CRM

**Flow**: Goes directly to success screen with neutral message

## Complete Funnel Tracking

The system now tracks three distinct types:

1. **PROSPECTS NOT INTERESTED** (wizard_prospectos)
   - Not leads, just tracked for analytics
   - Used to measure total prospected
   - Can be exported for future reactivation campaigns

2. **LEADS** (leads table)
   - Showed interest or purchased
   - Appear in mini CRM for active follow-up
   - States: nuevo, en_seguimiento, cerrado_ganado, cerrado_perdido

3. **SALES** (ventas table)
   - Leads that purchased
   - Generate pending commissions

### Full Funnel Metrics Available

```
Total Wizard Accesses (wizard_accesos)
    ↓
Diagnoses Completed (wizard_results count)
    ↓
Data Captured (wizard_results + wizard_prospectos)
    ↓
┌─────────────────────┬───────────────────────┐
│ Not Interested      │ Leads Created         │
│ (wizard_prospectos) │ (leads table)         │
└─────────────────────┴───────────────────────┘
                            ↓
                     Sales Closed
                     (ventas table)
```

## Session Tracking

Every wizard access is tracked with:
- Unique `session_id` generated with crypto.randomUUID()
- Records access time, user agent
- Updates `completed` flag when wizard finishes
- Tracks `abandoned_at_step` if user leaves mid-flow

This enables:
- Abandonment analysis per screen
- Conversion rate calculations
- Time-in-wizard metrics
- A/B testing future optimizations

## Commission Calculation

Commissions are now correctly calculated:
- **Plan Presencia Web**: 15% of $3,299 = **$495 MXN**
- **Plan Tienda en Línea**: 15% of $6,828 = **$1,024 MXN**

Stored in `ventas.comision_socio` field when sale is created.

## Future Integrations Prepared

### Chargebee Webhook Flow (Documented, Not Yet Implemented)
1. Webhook endpoint receives payment events
2. Validates signature for security
3. On `payment_succeeded`: Updates `ventas.estatus_pago` to 'completado'
4. Creates `comisiones` record with `estatus='pendiente'`
5. Admin reviews evidence and manually approves commission
6. Commission moves to approved state for payment processing

### Photo Evidence Upload (Structure Ready)
- `evidencias_ventas` table created
- Socios can upload multiple photos per sale
- Supports JPG, PNG, PDF (max 5MB)
- Admin panel can review before commission approval
- Storage in Supabase Storage bucket "evidencias"

## UI/UX Improvements

1. **Welcome screen** creates inviting first impression
2. **Confirmation screen** provides positive feedback after diagnosis
3. **Progress bars** show advancement through plan details
4. **Required field indicators** with red asterisks
5. **Form validation** prevents empty submissions
6. **Visual hierarchy** with clear CTAs and color coding
7. **Post-purchase flow** guides user through onboarding
8. **Icon-based diagnosis options** for better visual recognition

## Technical Implementation

### Component Architecture
- Single `Wizard.tsx` component manages all flow
- State machine with `WizardStep` type for clear step tracking
- Content loaded dynamically from CMS on mount
- Session tracking integrated throughout
- Proper error handling with user-friendly messages

### Database Interactions
- Uses `maybeSingle()` for safe single-row queries
- Proper RLS policies on all new tables
- Indexed columns for performance
- Cascading deletes where appropriate
- NULL handling for optional prospect data

### CMS Integration
- All text loaded from `content_blocks` table
- Meta field stores structured data (bullets, prices, etc.)
- Admins can edit via ContentManagement pages
- Fallback text if content not found

## Next Steps (Not Implemented Yet)

The following features have database structure ready but need frontend implementation:

1. **Funnel Metrics Dashboard** (for socios)
   - Visual funnel chart
   - Conversion rates per stage
   - Period comparison (month over month)

2. **Non-Interested Prospects Panel**
   - List view with filters
   - Export to CSV
   - "Convert to Lead" action button

3. **Mini CRM Lead States**
   - Tabs for: Nuevos, En Seguimiento, Ganados, Perdidos
   - Filter by origin (wizard vs manual)
   - Filter by recommended plan

4. **Photo Evidence Upload Component**
   - File picker with preview
   - Upload to Supabase Storage
   - Multiple files per sale
   - Type selection dropdown

5. **Admin Commission Approval Panel**
   - List pending approvals
   - View sale details and evidence
   - Approve/reject with comments
   - Verification checklist

6. **QR Code System**
   - Public route /wizard/:socioId
   - QR code generator in socio dashboard
   - Shareable links
   - Automatic socio association

7. **Commission Simulator**
   - Input quantities of each plan
   - Calculate projected earnings
   - Show quincenal/mensual breakdown
   - Save scenarios

8. **Aggregate Reports** (super admin)
   - System-wide conversion metrics
   - Socio ranking by performance
   - Abandonment analysis
   - Optimization recommendations

## Summary

The wizard now properly distinguishes between three types of records:
- **Prospects who weren't interested** (tracked but not leads)
- **Leads with interest** (in CRM for follow-up)
- **Closed sales** (generate commissions)

This provides complete visibility into the funnel from first contact to closed sale, allowing accurate measurement of:
- Total people prospected
- Conversion rate to interested leads
- Conversion rate to sales
- Where prospects drop off
- Which plans convert better

All while maintaining correct pricing ($3,299 and $6,828) and proper commission calculations ($495 and $1,024).
