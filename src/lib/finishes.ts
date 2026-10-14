// Finish/colour options shared by the home-page configurator and the 360°
// product viewer. Add a finish here and both pick it up.
export interface FinishOption {
  id: string;
  label: string;
  hex: string;
}

export const FINISHES: FinishOption[] = [
  { id: "matte-black", label: "Matte Black Steel", hex: "#23262b" },
  { id: "warm-walnut", label: "Warm Walnut", hex: "#6b4226" },
  { id: "slate-grey", label: "Slate Grey Upholstery", hex: "#6b7280" },
];
