import React from 'react';

export function Header({ currentRoute, onNavigate }) {
  const navItems = [
    { label: 'Inici', route: 'landing' },
    { label: 'Com funciona', route: 'landing' },
    { label: 'Serveis', route: 'landing' },
    { label: 'Menús', route: 'landing' },
    { label: 'Subscripció', route: 'landing' },
    { label: 'FAQ', route: 'landing' },
  ];

  return (
    <header className="header-top">
      <div className="site-logo">VELTUP</div>
      <nav className="nav-links" aria-label="Navegació principal">
        {navItems.map((item) => (
          <button key={item.label} type="button" onClick={() => onNavigate(item.route)}>
            {item.label}
          </button>
        ))}
        <button type="button" className="btn-secondary" onClick={() => onNavigate('registerIntro')}>
          Registrar-se
        </button>
        <button type="button" className="btn-secondary" onClick={() => onNavigate('login')}>
          Iniciar sessió
        </button>
      </nav>
    </header>
  );
}
