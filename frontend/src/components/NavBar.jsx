import { useStorage } from '../context/StorageContext';
import { useTheme } from '../context/ThemeProvider';
import { useUser } from '../context/UserProvider';

export default function NavBar() {
  const { modo, setModo } = useStorage();
  const { tema, toggleTema } = useTheme();
  const { nombre } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🎮</span>
        <span className="navbar-title">GameTracker</span>
        <span className="navbar-saludo">Hola, {nombre}</span>
      </div>

      <div className="navbar-controles">
        {/* Toggle API vs Local */}
        <div className="modo-toggle" title="Cambiar modo de almacenamiento">
          <span className={modo === 'local' ? 'modo-activo' : ''}>💾 Local</span>
          <button
            className={`toggle-btn ${modo === 'api' ? 'toggle-on' : ''}`}
            onClick={() => setModo(modo === 'local' ? 'api' : 'local')}
            aria-label={`Modo actual: ${modo}. Click para cambiar.`}
          >
            <span className="toggle-thumb" />
          </button>
          <span className={modo === 'api' ? 'modo-activo' : ''}>🌐 API</span>
        </div>

        {/* Toggle tema — atajo T */}
        <button
          className="btn-tema"
          onClick={toggleTema}
          title="Cambiar tema (atajo: T)"
          aria-label={`Tema actual: ${tema}. Click para cambiar.`}
        >
          {tema === 'oscuro' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
