
import { supabase } from "@/integrations/supabase/client";

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Check specifically for email confirmation errors
      if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
        throw new Error("Please verify your email before logging in. Check your inbox for a confirmation link.");
      }
      throw error;
    }
    return data;
  },

  async register(name: string, email: string, password: string, role: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          role,
        }
      }
    });
    
    if (error) throw error;
    
    // Add a note about email verification if it's required
    if (!data.user?.identities?.[0]?.identity_data?.email_verified) {
      return {
        ...data,
        message: "Account created! Please check your email to verify your account before logging in."
      };
    }
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  async resendConfirmationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    
    if (error) throw error;
    return { success: true };
  }
};
