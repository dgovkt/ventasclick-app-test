import React from 'react';
import { PageLayoutPublic } from '../components/PageLayoutPublic';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useContent } from '../contexts/ContentContext';
import {
  Target,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Lightbulb,
  Rocket,
  MessageCircle,
} from 'lucide-react';

export const Info: React.FC = () => {
  const heroTitle = useContent('info.hero.title', 'Cómo Funciona Ser Socio Ventas Click');
  const heroSubtitle = useContent(
    'info.hero.subtitle',
    'Descubre todo lo que necesitas saber para iniciar tu camino como socio exitoso'
  );

  const howItWorksTitle = useContent('info.how_it_works.title', '¿Cómo Funciona?');
  const howItWorksSubtitle = useContent(
    'info.how_it_works.subtitle',
    'Un proceso simple en 4 pasos para comenzar a generar ingresos'
  );

  const step1Title = useContent('info.steps.1.title', '1. Regístrate Gratis');
  const step1Description = useContent(
    'info.steps.1.description',
    'Completa el formulario de registro y crea tu cuenta. No requiere inversión ni experiencia previa.'
  );

  const step2Title = useContent('info.steps.2.title', '2. Recibe Capacitación');
  const step2Description = useContent(
    'info.steps.2.description',
    'Accede a materiales de capacitación, aprende sobre nuestros planes y técnicas de venta efectivas.'
  );

  const step3Title = useContent('info.steps.3.title', '3. Genera Leads');
  const step3Description = useContent(
    'info.steps.3.description',
    'Identifica negocios que necesiten presencia web y regístralos en tu panel. Gestiona el seguimiento desde nuestra plataforma.'
  );

  const step4Title = useContent('info.steps.4.title', '4. Cierra y Gana');
  const step4Description = useContent(
    'info.steps.4.description',
    'Cuando cierres una venta, registra el cierre en el sistema y recibe tu comisión. Así de simple.'
  );

  const benefitsTitle = useContent('info.benefits.title', 'Beneficios de Ser Socio');
  const benefitsSubtitle = useContent(
    'info.benefits.subtitle',
    'Todo lo que obtienes al unirte a nuestra red'
  );

  const examplesTitle = useContent('info.examples.title', 'Ejemplos de Negocio');
  const examplesSubtitle = useContent(
    'info.examples.subtitle',
    'Tipos de negocios que puedes ayudar con nuestras soluciones'
  );

  const example1Title = useContent('info.examples.1.title', 'Restaurantes y Cafeterías');
  const example1Description = useContent(
    'info.examples.1.description',
    'Ayuda a restaurantes a tener su menú en línea, recibir pedidos y establecer presencia digital.'
  );

  const example2Title = useContent('info.examples.2.title', 'Tiendas de Retail');
  const example2Description = useContent(
    'info.examples.2.description',
    'Lleva tiendas físicas al mundo digital con tiendas en línea completas y sistemas de pago integrados.'
  );

  const example3Title = useContent('info.examples.3.title', 'Profesionales Independientes');
  const example3Description = useContent(
    'info.examples.3.description',
    'Diseñadores, abogados, consultores y más pueden tener su portafolio y contacto profesional en línea.'
  );

  const example4Title = useContent('info.examples.4.title', 'Servicios Locales');
  const example4Description = useContent(
    'info.examples.4.description',
    'Plomeros, electricistas, jardineros pueden mostrar sus servicios y recibir solicitudes de presupuesto.'
  );

  const ctaTitle = useContent('info.cta.title', '¿Listo para Comenzar?');
  const ctaSubtitle = useContent(
    'info.cta.subtitle',
    'Únete hoy y empieza a construir tu futuro como socio Ventas Click'
  );

  return (
    <PageLayoutPublic>
      <section className="bg-gradient-to-br from-blue-50 to-primary-light py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {howItWorksTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {howItWorksSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step1Title}</h3>
              <p className="text-gray-600 leading-relaxed">{step1Description}</p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step2Title}</h3>
              <p className="text-gray-600 leading-relaxed">{step2Description}</p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step3Title}</h3>
              <p className="text-gray-600 leading-relaxed">{step3Description}</p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step4Title}</h3>
              <p className="text-gray-600 leading-relaxed">{step4Description}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {benefitsTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {benefitsSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Flexibilidad Total</h4>
                <p className="text-gray-600">Trabaja en tus propios horarios desde cualquier lugar</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Ingresos Sin Límite</h4>
                <p className="text-gray-600">Tus ganancias dependen de tu esfuerzo y dedicación</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Herramientas Incluidas</h4>
                <p className="text-gray-600">Acceso a plataforma completa de gestión sin costo adicional</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Capacitación Continua</h4>
                <p className="text-gray-600">Materiales de venta y entrenamiento para mejorar resultados</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Soporte Dedicado</h4>
                <p className="text-gray-600">Equipo disponible para resolver dudas y ayudarte a crecer</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Pagos Transparentes</h4>
                <p className="text-gray-600">Sistema claro de comisiones y pagos puntuales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {examplesTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {examplesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{example1Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{example1Description}</p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{example2Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{example2Description}</p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{example3Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{example3Description}</p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{example4Title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{example4Description}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {ctaTitle}
          </h2>
          <p className="text-xl text-blue-50 mb-8">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button to="/signup" variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
              Registrarse Ahora
            </Button>
            <Button to="/" variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Volver al Inicio
            </Button>
          </div>
        </div>
      </section>
    </PageLayoutPublic>
  );
};
