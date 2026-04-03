import './styles/App.css';
import FormularioProducto from './components/FormularioProducto';
import ListaInventario from './components/ListaInventario';
import SeccionVentas from './components/SeccionVentas';
import HistorialVentas from './components/HistorialVentas';
import SeccionGastos from './components/SeccionGastos'; // 1. Importamos el nuevo componente
import ModuloCambios from './components/ModuloCambios';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Header from './components/Header/Header.jsx';

function App() {
  const [sesion, setSesion] = useState(null);
  const [pestana, setPestana] = useState('ventas');
  const [actualizador, setActualizador] = useState(0);
  
  const refrescarInventario = () => {
    setActualizador(prev => prev + 1);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesion(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesion(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  if (!sesion) {
    return <Login />;
  }

  const ADMIN_UID = "ec37610f-8cab-4b24-921b-9d1f626bb321";
  const esAdmin = sesion?.user.id === ADMIN_UID;

  return (
    <div className="dashboard-main">
      <Header></Header>

      <nav className="tabs-nav">
        <button 
          className={pestana === 'ventas' ? 'active' : ''} 
          onClick={() => setPestana('ventas')}
        >
          Ventas
        </button>

        <button 
          className={pestana === 'cambios' ? 'active' : ''} 
          onClick={() => setPestana('cambios')}
        >
          Cambios
        </button>
        
        <button 
          className={pestana === 'gastos' ? 'active' : ''} 
          onClick={() => setPestana('gastos')}
        >
          Gastos
        </button>

        <button 
          className={pestana === 'inventario' ? 'active' : ''} 
          onClick={() => setPestana('inventario')}
        >
          Inventario
        </button>
        
        {esAdmin && (
          <button 
            className={pestana === 'historial' ? 'active' : ''} 
            onClick={() => setPestana('historial')}
          >
            Historial
          </button>
        )}
      </nav>

      <div className="tab-content">
        {pestana === 'inventario' && (
          <div className="layout-grid">
            <FormularioProducto alTerminar={refrescarInventario} />
            <ListaInventario trigger={actualizador} esAdmin={esAdmin} />
          </div>
        )}

        {pestana === 'ventas' && (
          <SeccionVentas 
            alTerminar={refrescarInventario} 
            sesion={sesion} 
          />
        )}

        {pestana === 'cambios' && (
          <ModuloCambios 
            sesion={sesion} 
            alTerminar={refrescarInventario} 
          />
        )}
        
        {pestana === 'gastos' && (
          <SeccionGastos 
            sesion={sesion} 
            alTerminar={() => {
            }}
          />
        )}
        
        {pestana === 'historial' && esAdmin && <HistorialVentas />}
      </div>
    </div>
  );
}

export default App;