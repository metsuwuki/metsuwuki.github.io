import { describe, expect, it } from "vitest";
import { validateGuestbook } from "../src/services/moderation";
import { parseGuestbookProfile } from "../src/routes/guestbook";

describe("guestbook validation", () => {
  it("accepts normalized plain text", () => {
    expect(validateGuestbook("  Player  ", "  Hello Nexus  ", "profile2")).toEqual({ name: "Player", message: "Hello Nexus", avatar: "profile2" });
  });
  it("rejects stored XSS and invalid avatars", () => {
    expect(validateGuestbook("Player", "<img src=x onerror=alert(1)>", "profile")).toHaveProperty("error");
    expect(validateGuestbook("Player", "Hello", "../../admin")).toHaveProperty("error");
  });
  it("enforces lengths", () => {
    expect(validateGuestbook("x", "Hello", "profile")).toHaveProperty("error");
    expect(validateGuestbook("Player", "x".repeat(501), "profile")).toHaveProperty("error");
  });
});

describe("guestbook profiles", () => {
  it("keeps legacy requests in the Metsuki guestbook", () => {
    expect(parseGuestbookProfile(undefined)).toBe("metsuki");
    expect(parseGuestbookProfile("")).toBe("metsuki");
  });

  it("accepts known profiles and rejects arbitrary scopes", () => {
    expect(parseGuestbookProfile("metsuki")).toBe("metsuki");
    expect(parseGuestbookProfile("mika")).toBe("mika");
    expect(parseGuestbookProfile("admin")).toBeNull();
  });
});
