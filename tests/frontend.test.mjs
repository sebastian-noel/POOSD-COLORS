import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createContext, runInContext } from "node:vm";

const script = readFileSync(new URL("../js/code.js", import.meta.url), "utf8");

function readCookie(cookie) {
  const window = { location: { href: "color.html" } };
  const context = createContext({ document: { cookie }, window });
  runInContext(script, context);
  return { userId: runInContext("readCookie(); userId;", context), page: window.location.href };
}

test("readCookie restores the saved user ID and keeps the color page open", () => {
  assert.deepEqual(readCookie("firstName=Test,lastName=User,userId=42"), {
    userId: 42,
    page: "color.html",
  });
});

test("readCookie redirects to login when no cookie is present", () => {
  assert.equal(readCookie("").page, "index.html");
});
