import './Header.css'
export default function Header({email, isAdmin, onLogout}) {
    
    return(
        <header className="header-admin">
            <div>
                <h1>Comercio</h1>
                <p>Usuario: <strong>{email}</strong> ({isAdmin ? "Admin" : "Vendedor"})</p>
            </div>
            <button className="btn-logout" onClick={onLogout}>Salir</button>
      </header>
    )
}