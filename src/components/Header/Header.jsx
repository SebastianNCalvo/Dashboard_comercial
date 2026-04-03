export default function Header({email, esAdmin, onLogout}) {
    
    return(
        <header className="header-admin">
            <div>
                <h1>Comercio</h1>
                <p>Usuario: <strong>{email}</strong> ({esAdmin ? "Admin" : "Vendedor"})</p>
            </div>
            <button className="btn-logout" onClick={cerrarSesion}>Salir</button>
      </header>
    )
}