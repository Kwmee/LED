type ProjectInsertPayload = {
  width_m: number;
  height_m: number;
  pitch: number;
  panel_id: string;
  panel_source: "default" | "custom";
  processor_id: string;
  processor_source: "default" | "custom";
  config_json: unknown;
};

export const saveProjectSchema = {
  parse(input: unknown): ProjectInsertPayload {
    if (!input || typeof input !== "object") {
      throw new Error("Invalid project payload.");
    }

    const payload = input as Record<string, unknown>;
    const requiredStringFields = [
      "panel_id",
      "panel_source",
      "processor_id",
      "processor_source"
    ] as const;
    const requiredNumberFields = ["width_m", "height_m", "pitch"] as const;

    for (const field of requiredStringFields) {
      if (typeof payload[field] !== "string" || payload[field].length === 0) {
        throw new Error(`Field "${field}" must be a non-empty string.`);
      }
    }

    for (const field of requiredNumberFields) {
      if (typeof payload[field] !== "number" || Number.isNaN(payload[field])) {
        throw new Error(`Field "${field}" must be a valid number.`);
      }
    }

    if (payload.config_json === undefined) {
      throw new Error('Field "config_json" is required.');
    }

    return {
      width_m: payload.width_m as number,
      height_m: payload.height_m as number,
      pitch: payload.pitch as number,
      panel_id: payload.panel_id as string,
      panel_source: payload.panel_source as "default" | "custom",
      processor_id: payload.processor_id as string,
      processor_source: payload.processor_source as "default" | "custom",
      config_json: payload.config_json
    };
  }
};
