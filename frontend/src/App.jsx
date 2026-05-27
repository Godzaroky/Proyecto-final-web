import { useState, useEffect, useRef } from 'react';
import { StorageProvider } from './context/StorageProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { UserProvider } from './context/UserProvider';
import NavBar from './components/NavBar';
import FormularioJuego from './components/FormularioJuego';
import ListaItems from './components/ListaItems';
import './index.css';

/**
 * App principal.
 *
 * Atajos de teclado implementados con cleanup en el return del useEffect:
 *   Ctrl+N → enfoca el input de nombre en el formulario
 *   T      → cambia entre tema claro y oscuro
 *
 * El ref del input se sube hasta App para que el atajo Ctrl+N pueda
 * acceder a él desde cualquier parte de la app.
 */
function AppContent() {
  const [refrescador, setRefrescador] = useState(0);

  // Ref para enfocar el input de nombre desde el atajo de teclado
  const inputNombreRef = useRef(null);

  const handleJuegoAgregado = () => {
    setRefrescador((r) => r + 1);
  };

  // ─── Atajos de teclado ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const enInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        e.target.tagName
      );

      // Ctrl+N → enfocar input de nombre
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        inputNombreRef.current?.focus();
        return;
      }

      // T → toggle tema (solo si no estamos escribiendo en un campo)
      if (!enInput && e.key.toLowerCase() === 't') {
        // Disparamos un click al botón de tema a través de un CustomEvent
        // para no duplicar lógica aquí
        document.dispatchEvent(new CustomEvent('toggle-tema'));
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler); // ← cleanup obligatorio
  }, []);

  return (
    <div className="app-layout">
      <NavBar />
      <main className="app-main">
        <FormularioJuego
          inputRef={inputNombreRef}
          onJuegoAgregado={handleJuegoAgregado}
        />
        <ListaItems refrescador={refrescador} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <StorageProvider>
          <AppContent />
        </StorageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
