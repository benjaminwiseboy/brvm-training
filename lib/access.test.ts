import { describe, it, expect } from "vitest";
import { isModulePublic, PUBLIC_MODULE_CODES } from "./access";

describe("isModulePublic", () => {
  it("aucun module public aujourd'hui (compte obligatoire)", () => {
    expect(isModulePublic("M01")).toBe(false);
    expect(isModulePublic("M28")).toBe(false);
  });

  it("un code ajouté à PUBLIC_MODULE_CODES devient public — insensible à la casse", () => {
    PUBLIC_MODULE_CODES.add("M01");
    expect(isModulePublic("M01")).toBe(true);
    expect(isModulePublic("m01")).toBe(true);
    expect(isModulePublic("M02")).toBe(false);
    PUBLIC_MODULE_CODES.delete("M01");
  });
});
