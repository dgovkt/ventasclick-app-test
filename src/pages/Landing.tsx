import React from 'react';
import { PageLayoutPublic } from '../components/PageLayoutPublic';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useContent } from '../contexts/ContentContext';
import { usePlanes } from '../hooks/usePlanes';
import { DollarSign, Award, Globe, ShoppingCart, Zap, Target, CheckCircle, Store, Star } from 'lucide-react';

export const Landing: React.FC = () => {
  const { getPrecio } = usePlanes();

  const heroTitle = useContent('landing.hero.title', 'Construye tu Negocio Digital como Socio Ventas Click');
  const heroSubtitle = useContent(
    'landing.hero.subtitle',
    'Únete a nuestra red de socios y genera ingresos ayudando a negocios a establecer su presencia en línea. Sin inversión inicial, con comisiones atractivas y apoyo completo.'
  );
  const heroCta = useContent('landing.hero.cta', 'Comenzar Ahora');

  const benefitsTitle = useContent('landing.benefits.title', '¿Por qué ser Socio Ventas Click?');
  const benefitsSubtitle = useContent(
    'landing.benefits.subtitle',
    'Obtén todas las herramientas y el respaldo para hacer crecer tu negocio'
  );

  const benefit1Title = useContent('landing.benefits.1.title', 'Sin Inversión Inicial');
  const benefit1Description = useContent(
    'landing.benefits.1.description',
    'Comienza a vender sin necesidad de capital. Solo necesitas tu entusiasmo y ganas de crecer.'
  );

  const benefit2Title = useContent('landing.benefits.2.title', 'Comisiones Competitivas');
  const benefit2Description = useContent(
    'landing.benefits.2.description',
    'Gana comisiones atractivas por cada venta que realices. Tu esfuerzo se traduce en ingresos.'
  );

  const benefit3Title = useContent('landing.benefits.3.title', 'Gestión Simplificada');
  const benefit3Description = useContent(
    'landing.benefits.3.description',
    'Administra tus leads, ventas y comisiones desde una sola plataforma fácil de usar.'
  );

  const benefit4Title = useContent('landing.benefits.4.title', 'Soporte Completo');
  const benefit4Description = useContent(
    'landing.benefits.4.description',
    'Recibe capacitación, materiales de venta y acompañamiento para cerrar más negocios.'
  );

  const plansTitle = useContent('landing.plans.title', 'Nuestros Planes de Venta');
  const plansSubtitle = useContent(
    'landing.plans.subtitle',
    'Cuatro soluciones digitales completas que puedes ofrecer a tus clientes'
  );

  const ctaTitle = useContent('landing.cta.title', '¿Listo para empezar?');
  const ctaSubtitle = useContent('landing.cta.subtitle', 'Regístrate hoy y comienza a generar ingresos como socio');

  return (
    <PageLayoutPublic>
      <section className="bg-gradient-to-br from-primary-light to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span dangerouslySetInnerHTML={{ __html: heroTitle }} />
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button to="/signup" variant="primary" size="lg">
                {heroCta}
              </Button>
              <Button to="/info" variant="outline" size="lg">
                Más Información
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {benefitsTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {benefitsSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit1Title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit1Description}
              </p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit2Title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit2Description}
              </p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit3Title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit3Description}
              </p>
            </Card>

            <Card variant="hover">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit4Title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit4Description}
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {plansTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {plansSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card variant="bordered" className="hover:shadow-xl transition-all flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl mb-4 mx-auto">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Presencia Web</h3>
              <div className="text-3xl font-extrabold text-slate-700 mb-1 text-center">{getPrecio('presencia_web', '$3,499')}</div>
              <p className="text-xs text-gray-500 text-center mb-4">MXN + IVA / año</p>
              <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed flex-grow">
                Sitio web profesional para establecer presencia digital
              </p>
              <ul className="space-y-2">
                {['Diseño web personalizado', 'Hosting y dominio', 'Optimizado para móviles', 'Soporte 1 año'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="bordered" className="hover:shadow-xl transition-all flex flex-col">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 mx-auto">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Tienda Básico</h3>
              <div className="text-3xl font-extrabold text-blue-600 mb-1 text-center">{getPrecio('tienda_basico', '$3,999')}</div>
              <p className="text-xs text-gray-500 text-center mb-4">MXN + IVA / año</p>
              <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed flex-grow">
                Tienda en línea para empezar a vender por internet
              </p>
              <ul className="space-y-2">
                {['Todo Presencia Web', 'Catálogo de productos', 'Carrito de compras', 'Soporte 1 año'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="bordered" className="hover:shadow-xl transition-all flex flex-col ring-2 ring-blue-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Popular</span>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl mb-4 mx-auto">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Tienda Esencial</h3>
              <div className="text-3xl font-extrabold text-blue-600 mb-1 text-center">{getPrecio('tienda_esencial', '$5,999')}</div>
              <p className="text-xs text-gray-500 text-center mb-4">MXN + IVA / año</p>
              <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed flex-grow">
                Tienda con funcionalidades avanzadas y pagos en línea
              </p>
              <ul className="space-y-2">
                {['Todo Tienda Básico', 'Pasarela de pagos', 'Gestión de inventario', 'Reportes y analytics'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="bordered" className="hover:shadow-xl transition-all flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl mb-4 mx-auto">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 text-center">Tienda Premium</h3>
              <div className="text-3xl font-extrabold text-amber-400 mb-1 text-center">{getPrecio('tienda_premium', '$9,999')}</div>
              <p className="text-xs text-gray-400 text-center mb-4">MXN + IVA / año</p>
              <p className="text-gray-300 text-sm mb-4 text-center leading-relaxed flex-grow">
                Solución completa de e-commerce con marketing digital
              </p>
              <ul className="space-y-2">
                {['Todo Tienda Esencial', 'Integraciones avanzadas', 'Marketing digital y SEO', 'Soporte prioritario'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-200">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {ctaTitle}
          </h2>
          <p className="text-xl text-primary-light mb-8">
            {ctaSubtitle}
          </p>
          <Button to="/signup" variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-50">
            Registrarse Gratis
          </Button>
        </div>
      </section>
    </PageLayoutPublic>
  );
};
