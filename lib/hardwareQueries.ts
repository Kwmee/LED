import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";
import type { Panel } from "@/types/panel";
import type { Processor } from "@/types/processor";

export type CustomPanelInput = {
  brand: string;
  model: string;
  pitchMm: number;
  panelWidthMm: number;
  panelHeightMm: number;
  pixelWidth: number;
  pixelHeight: number;
  weightKg?: number | null;
  powerMaxW?: number | null;
};

export type CustomProcessorInput = {
  brand: string;
  model: string;
  ports: number;
  pixelsPerPort: number;
  maxPixels?: number | null;
};

function requireSupabase() {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  return supabase;
}

function requireUserId(session: Session | null) {
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be signed in to manage custom hardware.");
  }

  return userId;
}

export function mapCustomPanel(row: {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  pitch_mm: number;
  panel_width_mm: number;
  panel_height_mm: number;
  pixel_width: number;
  pixel_height: number;
  weight_kg: number | null;
  power_max_w: number | null;
}): Panel {
  return {
    id: row.id,
    userId: row.user_id,
    brand: row.brand,
    model: row.model,
    pitch: Number(row.pitch_mm),
    widthMm: row.panel_width_mm,
    heightMm: row.panel_height_mm,
    pixelWidth: row.pixel_width,
    pixelHeight: row.pixel_height,
    weightKg: row.weight_kg,
    powerMaxW: row.power_max_w,
    source: "custom"
  };
}

export function mapCustomProcessor(row: {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  ports: number;
  pixels_per_port: number;
  max_pixels: number | null;
}): Processor {
  return {
    id: row.id,
    userId: row.user_id,
    brand: row.brand,
    model: row.model,
    ports: row.ports,
    pixelsPerPort: row.pixels_per_port,
    maxPixels: row.max_pixels ?? row.ports * row.pixels_per_port,
    source: "custom"
  };
}

export async function fetchCustomPanels(session: Session | null) {
  const userId = requireUserId(session);
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from("custom_panels")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapCustomPanel);
}

export async function fetchCustomProcessors(session: Session | null) {
  const userId = requireUserId(session);
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from("custom_processors")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapCustomProcessor);
}

export async function upsertCustomPanel(
  session: Session | null,
  values: CustomPanelInput,
  panelId?: string
) {
  const userId = requireUserId(session);
  const supabase = requireSupabase();
  const payload = {
    user_id: userId,
    brand: values.brand,
    model: values.model,
    pitch_mm: values.pitchMm,
    panel_width_mm: values.panelWidthMm,
    panel_height_mm: values.panelHeightMm,
    pixel_width: values.pixelWidth,
    pixel_height: values.pixelHeight,
    weight_kg: values.weightKg ?? null,
    power_max_w: values.powerMaxW ?? null
  };

  const query = panelId
    ? supabase.from("custom_panels").update(payload).eq("id", panelId).select().single()
    : supabase.from("custom_panels").insert(payload).select().single();

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return mapCustomPanel(data);
}

export async function upsertCustomProcessor(
  session: Session | null,
  values: CustomProcessorInput,
  processorId?: string
) {
  const userId = requireUserId(session);
  const supabase = requireSupabase();
  const payload = {
    user_id: userId,
    brand: values.brand,
    model: values.model,
    ports: values.ports,
    pixels_per_port: values.pixelsPerPort,
    max_pixels: values.maxPixels ?? null
  };

  const query = processorId
    ? supabase.from("custom_processors").update(payload).eq("id", processorId).select().single()
    : supabase.from("custom_processors").insert(payload).select().single();

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return mapCustomProcessor(data);
}

export async function deleteCustomPanel(session: Session | null, panelId: string) {
  requireUserId(session);
  const supabase = requireSupabase();
  const { error } = await supabase.from("custom_panels").delete().eq("id", panelId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCustomProcessor(session: Session | null, processorId: string) {
  requireUserId(session);
  const supabase = requireSupabase();
  const { error } = await supabase.from("custom_processors").delete().eq("id", processorId);

  if (error) {
    throw new Error(error.message);
  }
}
