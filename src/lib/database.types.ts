export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'socio' | 'admin' | 'super_admin';

export type LeadEstado = 'nuevo' | 'en_seguimiento' | 'cerrado_ganado' | 'cerrado_perdido';
export type LeadOrigen = 'wizard' | 'manual' | 'otro';

export type EstatusPago = 'pendiente' | 'pagado' | 'fallido';

export type ComisionEstatus = 'pendiente' | 'autorizada' | 'pagada' | 'rechazada';

export type SolicitudPagoEstatus = 'pendiente' | 'aprobada' | 'pagada' | 'rechazada';

export type CasoExitoEstatus = 'pendiente' | 'aprobado' | 'rechazado';
export type TipoPlan = 'presencia_web' | 'tienda_en_linea';

export type ReviewEstatus = 'pendiente' | 'aprobado' | 'rechazado';

export type FrecuenciaPago = 'semanal' | 'mensual';

export type ContentType = 'text' | 'richtext';
export type ContentSection = 'landing' | 'wizard' | 'dashboard' | 'emails';

export type ManualCategory =
  | 'introduccion'
  | 'gestion_usuarios'
  | 'gestion_bills_leads'
  | 'gestion_cierres_ventas'
  | 'gestion_comisiones'
  | 'gestion_planes'
  | 'reviews_nps'
  | 'casos_exito'
  | 'gestion_contenido'
  | 'base_conocimientos'
  | 'configuracion_sistema'
  | 'reportes_analiticas'
  | 'preguntas_frecuentes';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          nombre: string;
          apellido: string;
          rol: UserRole;
          telefono: string | null;
          datos_bancarios: Json | null;
          frecuencia_pago: FrecuenciaPago | null;
          area: string | null;
          notas_internas: string | null;
          activo: boolean;
          fecha_registro: string;
          created_at: string;
          updated_at: string;
          nombre_banco: string | null;
          clabe: string | null;
          numero_cuenta: string | null;
          beneficiario: string | null;
          payment_config_updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          nombre: string;
          apellido: string;
          rol?: UserRole;
          telefono?: string | null;
          datos_bancarios?: Json | null;
          frecuencia_pago?: FrecuenciaPago | null;
          area?: string | null;
          notas_internas?: string | null;
          activo?: boolean;
          fecha_registro?: string;
          created_at?: string;
          updated_at?: string;
          nombre_banco?: string | null;
          clabe?: string | null;
          numero_cuenta?: string | null;
          beneficiario?: string | null;
          payment_config_updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          nombre?: string;
          apellido?: string;
          rol?: UserRole;
          telefono?: string | null;
          datos_bancarios?: Json | null;
          frecuencia_pago?: FrecuenciaPago | null;
          area?: string | null;
          notas_internas?: string | null;
          activo?: boolean;
          fecha_registro?: string;
          created_at?: string;
          updated_at?: string;
          nombre_banco?: string | null;
          clabe?: string | null;
          numero_cuenta?: string | null;
          beneficiario?: string | null;
          payment_config_updated_at?: string | null;
        };
      };
      planes: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          precio_anual: number;
          porcentaje_comision: number;
          comision_socio: number;
          descripcion_corta: string;
          descripcion_completa: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          slug: string;
          precio_anual: number;
          porcentaje_comision?: number;
          comision_socio?: number;
          descripcion_corta: string;
          descripcion_completa?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          slug?: string;
          precio_anual?: number;
          porcentaje_comision?: number;
          comision_socio?: number;
          descripcion_corta?: string;
          descripcion_completa?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          socio_id: string;
          nombre: string;
          apellidos: string;
          email: string;
          telefono: string;
          que_vende: string;
          plan_recomendado_id: string | null;
          estado: LeadEstado;
          origen: LeadOrigen;
          notas: string | null;
          fecha_creacion: string;
          fecha_ultima_actualizacion: string;
        };
        Insert: {
          id?: string;
          socio_id: string;
          nombre: string;
          apellidos: string;
          email: string;
          telefono: string;
          que_vende: string;
          plan_recomendado_id?: string | null;
          estado?: LeadEstado;
          origen?: LeadOrigen;
          notas?: string | null;
          fecha_creacion?: string;
          fecha_ultima_actualizacion?: string;
        };
        Update: {
          id?: string;
          socio_id?: string;
          nombre?: string;
          apellidos?: string;
          email?: string;
          telefono?: string;
          que_vende?: string;
          plan_recomendado_id?: string | null;
          estado?: LeadEstado;
          origen?: LeadOrigen;
          notas?: string | null;
          fecha_creacion?: string;
          fecha_ultima_actualizacion?: string;
        };
      };
      ventas: {
        Row: {
          id: string;
          socio_id: string;
          lead_id: string | null;
          plan_id: string;
          fecha: string;
          monto: number;
          estatus_pago: EstatusPago;
          referencia_externa: string | null;
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          socio_id: string;
          lead_id?: string | null;
          plan_id: string;
          fecha?: string;
          monto: number;
          estatus_pago?: EstatusPago;
          referencia_externa?: string | null;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          socio_id?: string;
          lead_id?: string | null;
          plan_id?: string;
          fecha?: string;
          monto?: number;
          estatus_pago?: EstatusPago;
          referencia_externa?: string | null;
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comisiones: {
        Row: {
          id: string;
          socio_id: string;
          venta_id: string;
          monto_estimado: number;
          monto_autorizado: number | null;
          estatus: ComisionEstatus;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          socio_id: string;
          venta_id: string;
          monto_estimado: number;
          monto_autorizado?: number | null;
          estatus?: ComisionEstatus;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          id?: string;
          socio_id?: string;
          venta_id?: string;
          monto_estimado?: number;
          monto_autorizado?: number | null;
          estatus?: ComisionEstatus;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
      };
      solicitudes_pago: {
        Row: {
          id: string;
          socio_id: string;
          periodo: string;
          monto_total_estimado: number;
          monto_total_autorizado: number | null;
          estatus: SolicitudPagoEstatus;
          fecha_solicitud: string;
          fecha_resolucion: string | null;
          notas_admin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          socio_id: string;
          periodo: string;
          monto_total_estimado: number;
          monto_total_autorizado?: number | null;
          estatus?: SolicitudPagoEstatus;
          fecha_solicitud?: string;
          fecha_resolucion?: string | null;
          notas_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          socio_id?: string;
          periodo?: string;
          monto_total_estimado?: number;
          monto_total_autorizado?: number | null;
          estatus?: SolicitudPagoEstatus;
          fecha_solicitud?: string;
          fecha_resolucion?: string | null;
          notas_admin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      casos_exito: {
        Row: {
          id: string;
          socio_id: string;
          url_sitio: string;
          tipo_plan: TipoPlan;
          titulo: string;
          descripcion_corta: string;
          descripcion_completa: string | null;
          estatus: CasoExitoEstatus;
          aprobado_por: string | null;
          fecha_aprobacion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          socio_id: string;
          url_sitio: string;
          tipo_plan: TipoPlan;
          titulo: string;
          descripcion_corta: string;
          descripcion_completa?: string | null;
          estatus?: CasoExitoEstatus;
          aprobado_por?: string | null;
          fecha_aprobacion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          socio_id?: string;
          url_sitio?: string;
          tipo_plan?: TipoPlan;
          titulo?: string;
          descripcion_corta?: string;
          descripcion_completa?: string | null;
          estatus?: CasoExitoEstatus;
          aprobado_por?: string | null;
          fecha_aprobacion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_reviews: {
        Row: {
          id: string;
          socio_id: string;
          nombre_cliente: string;
          contacto_cliente: string | null;
          score_nps: number;
          comentario: string;
          estatus: ReviewEstatus;
          aprobado_por: string | null;
          fecha_aprobacion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          socio_id: string;
          nombre_cliente: string;
          contacto_cliente?: string | null;
          score_nps: number;
          comentario: string;
          estatus?: ReviewEstatus;
          aprobado_por?: string | null;
          fecha_aprobacion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          socio_id?: string;
          nombre_cliente?: string;
          contacto_cliente?: string | null;
          score_nps?: number;
          comentario?: string;
          estatus?: ReviewEstatus;
          aprobado_por?: string | null;
          fecha_aprobacion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_blocks: {
        Row: {
          id: string;
          slug: string;
          section: string;
          title: string;
          description: string;
          type: ContentType;
          locale: string;
          value: string;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          section: string;
          title: string;
          description: string;
          type?: ContentType;
          locale?: string;
          value?: string;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          section?: string;
          title?: string;
          description?: string;
          type?: ContentType;
          locale?: string;
          value?: string;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_manual_sections: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          category: ManualCategory;
          icon_name: string;
          order_index: number;
          parent_section_id: string | null;
          visible: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string;
          category: ManualCategory;
          icon_name?: string;
          order_index?: number;
          parent_section_id?: string | null;
          visible?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          category?: ManualCategory;
          icon_name?: string;
          order_index?: number;
          parent_section_id?: string | null;
          visible?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kb_articles: {
        Row: {
          id: string;
          titulo: string;
          slug: string;
          categoria: string;
          tags: string[];
          contenido: string;
          visible: boolean;
          autor_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          slug: string;
          categoria: string;
          tags?: string[];
          contenido: string;
          visible?: boolean;
          autor_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          slug?: string;
          categoria?: string;
          tags?: string[];
          contenido?: string;
          visible?: boolean;
          autor_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
