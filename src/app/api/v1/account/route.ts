import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Self-serve Account Deletion (India DPDP Act & App Store Compliance)
 */
export async function DELETE() {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (supabase && admin) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await admin.auth.admin.deleteUser(data.user.id);
    }
  }

  return NextResponse.json({ deleted: true });
}
