import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const AuthConText = createContext({
  session: null,
  loading: true,
});

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(function () {
    async function fetchSession() {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }

    fetchSession();
    // Cập nhật lại trạng thái session khi người dùng đăng nhâp hoặc đăng xuất
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <AuthConText.Provider value={{ session, loading }}>
      {children}
    </AuthConText.Provider>
  );
}

export const useAuth = () => useContext(AuthConText);
