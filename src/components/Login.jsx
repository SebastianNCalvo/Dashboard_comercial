import { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error al ingresar: " + error.message);
    }
    setCargando(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Local Comercial</h2>
        <p>Panel de Administración</p>
        <p>Utilice los datos mostrados en cada campo para probar la App: Gestión de Stock</p>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="admin@admin.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="123admin456" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        
        <div className="login-footer">
          &copy; Mi local comercial - Gestión de Stock
        </div>
      </div>
    </div>
  );
};

export default Login;