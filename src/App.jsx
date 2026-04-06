import './styles/App.css';
import { useAuth } from './hooks/useAuth.js';
import { useState } from 'react';
import Header from './components/Header/Header.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import FormularioProducto from './components/FormularioProducto';
import ListaInventario from './components/ListaInventario';
import SeccionVentas from './components/Ventas/SeccionVentas.jsx';
import HistorialVentas from './components/HistorialVentas';
import SeccionGastos from './components/SeccionGastos'; // 1. Importamos el nuevo componente
import ModuloCambios from './components/ModuloCambios';
import Login from './components/Login';

function App() {
  const { session, isAdmin, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('ventas');
  const [actualizador, setActualizador] = useState(0);
  
  const refrescarInventario = () => {
    setActualizador(prev => prev + 1);
  };

  if (loading) {return <p>Cargando la App</p>};
  if (!session) {return <Login />;};

  return (
    <div className="dashboard-main">
      <Header
        email={session.user.email}
        isAdmin={isAdmin}
        onLogout={logout}
      />;

      <NavBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isAdmin={isAdmin}
      />;

      <div className="tab-content">
        
        {activeTab === 'ventas' && (
          <SeccionVentas 
            session={session} 
            alTerminar={refrescarInventario} 
          />
        )};

        {activeTab === 'cambios' && (
          <ModuloCambios 
            session={session} 
            alTerminar={refrescarInventario} 
          />
        )};
        
        {activeTab === 'gastos' && (
          <SeccionGastos 
            session={session} 
            alTerminar={() => {
            }}
          />
        )};

        {activeTab === 'inventario' && (
          <div className="layout-grid">
            <FormularioProducto alTerminar={refrescarInventario} />
            <ListaInventario trigger={actualizador} isAdmin={isAdmin} />
          </div>
        )};
        
        {activeTab === 'historial' && isAdmin && <HistorialVentas />};
      </div>
    </div>
  );
}

export default App;