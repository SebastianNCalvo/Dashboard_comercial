import './NavBar.css'

export default function NavBar({activeTab, onChangeTab, isAdmin}){
    return(
        <nav className="tabs-nav">

            <button 
            className={activeTab === 'ventas' ? 'active' : ''} 
            onClick={() => onChangeTab('ventas')}
            > Ventas </button>

            <button 
            className={activeTab === 'cambios' ? 'active' : ''} 
            onClick={() => onChangeTab('cambios')}
            > Cambios </button>
            
            <button 
            className={activeTab === 'gastos' ? 'active' : ''} 
            onClick={() => onChangeTab('gastos')}
            > Gastos </button>

            <button 
            className={activeTab === 'inventario' ? 'active' : ''} 
            onClick={() => onChangeTab('inventario')}
            > Inventario </button>
            
            {isAdmin && (
            <button 
                className={activeTab === 'historial' ? 'active' : ''} 
                onClick={() => onChangeTab('historial')}
            > Historial </button>
            )}
        </nav>
    )
}