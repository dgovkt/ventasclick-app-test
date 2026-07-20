import { useEffect } from 'react';
import { useChargebeeConfig } from '../hooks/useChargebeeConfig';

export function ChargebeeScript() {
  const { config } = useChargebeeConfig();

  useEffect(() => {
    if (!config) return;

    const existingScript = document.querySelector('script[data-cb-site]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = config.scriptUrl;
    script.setAttribute('data-cb-site', config.siteName);
    script.async = true;

    script.onload = () => {
      const chargebee = (window as any).Chargebee;
      if (chargebee?.init) {
        chargebee.init({
          site: config.siteName,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[data-cb-site]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [config?.siteName, config?.scriptUrl]);

  return null;
}
