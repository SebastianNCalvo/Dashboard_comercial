import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useAuth = () => {
    const [sesion, setSesion] = useState(null);
    const [cargando, setCargando] = useState(true);

    const ADMIN_UID = "ec37610f-8cab-4b24-921b-9d1f626bb321";
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSesion(session);
            setCargando(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSesion(session);
            setCargando(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const cerrarSesion = async () => {
        await supabase.auth.signOut();
    };

    return {
        sesion,
        esAdmin: sesion?.user.id === ADMIN_UID,
        cerrarSesion,
        cargando
    };
}

