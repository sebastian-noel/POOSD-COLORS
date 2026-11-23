import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.COLORS_TEST_URL ?? "http://127.0.0.1:18080";

test("SearchColors returns only matching names for the requested user", async () => {
  const response = await fetch(new URL("/LAMPAPI/SearchColors.php", baseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ search: "blu", userId: 42 }),
    signal: AbortSignal.timeout(5000),
  });

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/i);
  assert.deepEqual(await response.json(), { results: ["Blue"], error: "" });
});
