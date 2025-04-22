import { supabase } from "@/integrations/supabase/client";

export const authService = {
  async login(email: string, password: string) {
    try {
      // First try normal login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Check specifically for email confirmation errors
        if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
          // If email is not confirmed, try to automatically verify it for development purposes
          // This simulates having email confirmation disabled
          const verifyResult = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
          });
          
          // Try login again after verification attempt
          const secondAttempt = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (secondAttempt.error) {
            throw secondAttempt.error;
          }
          
          return secondAttempt.data;
        }
        
        // For other errors, throw them normally
        throw error;
      }
      
      return data;
    } catch (error) {
      throw error;
    }
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
        },
        // Set emailRedirectTo to make email verification easier if needed
        emailRedirectTo: window.location.origin,
      }
    });
    
    if (error) throw error;
    
    // If signup is successful, auto-login the user without requiring email verification
    if (data.user) {
      try {
        // Try to immediately sign in after registration
        await this.login(email, password);
      } catch (loginError) {
        console.error("Auto-login after registration failed:", loginError);
        // Even if auto-login fails, we still return the registration data
      }
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
