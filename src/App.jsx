import './styles/App.css';
import { useAuth } from './hooks/useAuth.js';
import Header from './components/Header/Header.jsx';
import FormularioProducto from './components/FormularioProducto';
import ListaInventario from './components/ListaInventario';
import SeccionVentas from './components/SeccionVentas';
import HistorialVentas from './components/HistorialVentas';
import SeccionGastos from './components/SeccionGastos'; // 1. Importamos el nuevo componente
import ModuloCambios from './components/ModuloCambios';
import { useState } from 'react';
import Login from './components/Login';

function App() {
  const { sesion, esAdmin, cerrarSession, cargando } = useAuth();
  const [pestana, setPestana] = useState('ventas');
  const [actualizador, setActualizador] = useState(0);
  
  const refrescarInventario = () => {
    setActualizador(prev => prev + 1);
  };

  if (cargando) {return <p>Cargando la App</p>}
  if (!sesion) {return <Login />;}
  return (
    <div className="dashboard-main">
      <Header
        email={sesion.user.email}
        esAdmin={esAdmin}
        onLogout={cerrarSession}
      />

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