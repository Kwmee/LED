import { NextResponse } from "next/server";
import {
  createServerSupabaseAuthClient,
  createServerSupabaseClient
} from "@/lib/supabase/server";
import { saveProjectSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = saveProjectSchema.parse(await request.json());
    const supabase = createServerSupabaseClient();
    const authClient = createServerSupabaseAuthClient();
    const authHeader = request.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!supabase || !authClient) {
      return NextResponse.json(
        { error: "Supabase clients are not configured." },
        { status: 500 }
      );
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Missing authorization token." }, { status: 401 });
    }

    const {
      data: { user },
      error: authError
    } = await authClient.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized request." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...payload,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
