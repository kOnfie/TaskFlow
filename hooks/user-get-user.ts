import { supabase } from "@/lib/supabaseClient";

export async function useGetUser(): Promise<any> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Failed to receive user");
  }

  return user;
}
