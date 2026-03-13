export function calculateResolutionFromDimensions(
  widthM: number,
  heightM: number,
  pitchMm: number
) {
  const widthPixels = Math.round((widthM / pitchMm) * 1000);
  const heightPixels = Math.round((heightM / pitchMm) * 1000);

  return {
    widthPixels,
    heightPixels
  };
}
