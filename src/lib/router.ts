import { useEffect, useState } from 'react';

export const VIEWS = ['ville', 'parcours', 'missions', 'progression', 'certificat'] as const;
export type View = (typeof VIEWS)[number];
export interface Route {
  view: View;
  moduleId?: string;
}

// Hash routes: #/ville, #/parcours, #/parcours/mod_3, #/missions, #/progression, #/certificat
export const parseHash = (hash: string): Route => {
  const [view, id] = hash.replace(/^#\/?/, '').split('/');
  if (!(VIEWS as readonly string[]).includes(view)) return { view: 'ville' };
  return { view: view as View, moduleId: view === 'parcours' && id ? id : undefined };
};

export const navigate = (path: string) => {
  window.location.hash = path;
};

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
