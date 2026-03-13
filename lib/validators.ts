type ProjectInsertPayload = {
  user_id: string;
  width_m: number;
  height_m: number;
  pitch: number;
  panel_id: string;
  processor_id: string;
  config_json: unknown;
};

export const saveProjectSchema = {
  parse(input: unknown): ProjectInsertPayload {
    if (!input || typeof input !== "object") {
      throw new Error("Invalid project payload.");
    }

    const payload = input as Record<string, unknown>;
    const requiredStringFields = ["user_id", "panel_id", "processor_id"] as const;
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
      user_id: payload.user_id as string,
      width_m: payload.width_m as number,
      height_m: payload.height_m as number,
      pitch: payload.pitch as number,
      panel_id: payload.panel_id as string,
      processor_id: payload.processor_id as string,
      config_json: payload.config_json
    };
  }
};
