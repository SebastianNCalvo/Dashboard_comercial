import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useAuth = () => {
    const [session, setsession] = useState(null);
    const [loading, setLoading] = useState(true);

    const ADMIN_UID = "ec37610f-8cab-4b24-921b-9d1f626bb321";
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setsession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setsession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return {
        session,
        isAdmin: session?.user.id === ADMIN_UID,
        logout,
        loading
    };
}

