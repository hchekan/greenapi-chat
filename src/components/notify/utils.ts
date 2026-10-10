export const Color = {
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

export type ColorType = typeof Color[keyof typeof Color];