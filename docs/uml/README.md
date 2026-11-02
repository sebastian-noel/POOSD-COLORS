# COLORS UML diagrams

These diagrams model the implementation at `5f2ebcf`, the application revision reviewed for Assignment 3. Each PlantUML source has a corresponding PNG in this directory.

| Diagram | Source | Rendered image |
| --- | --- | --- |
| Use case | [usecase.puml](usecase.puml) | [usecase.png](usecase.png) |
| Activity | [activity.puml](activity.puml) | [activity.png](activity.png) |
| Class | [class.puml](class.puml) | [class.png](class.png) |

## Modeling decisions and evidence

- **Four user goals:** the use cases follow the login button in `index.html` and the add, search, and logout buttons in `color.html`. No registration, edit, delete, or contact-management features are implemented, so none are modeled. A single User actor covers the same person's actions before and after login. Login is a prerequisite in normal use, not an `include` relationship, because add/search/logout do not call `doLogin()`.
- **Procedural implementation:** `js/code.js` declares globals and six functions; the three PHP files execute at file scope and declare helper functions. The class diagram uses `<<script>>` classifiers to group these real members instead of inventing controller, service, or repository classes. The page bindings are shown in a note because the HTML pages do not declare classes or methods. Dashed arrows mean dependencies, not inheritance or ownership.
- **Stored data:** `Users` and `Colors` are table-backed entity classifiers. Columns and types come from the root README setup instructions; login, insert, and search SQL confirm their use. The `1` to `0..*` association expresses the intended user/color relationship through `Colors.UserID`. It does not assert an enforced foreign key, cascade deletion, or composition: no schema DDL is checked in. The unused `Contacts` table is excluded because no application path accesses it.
- **Browser state:** `saveCookie()` stores one cookie named `firstName`, whose value also contains comma-separated `lastName` and `userId` entries, with a 20-minute expiry (`js/code.js:61-67`). `readCookie()` redirects only when `userId < 0` (`69-100`). The diagrams retain that exact test instead of claiming robust authentication or numeric validation. `doLogout()` resets globals, expires that cookie, and redirects (`102-109`); there is no logout endpoint or PHP session.
- **Requests and database access:** all frontend calls are same-origin JSON POSTs under `/LAMPAPI`. Each PHP script independently loads `/etc/colors/database.php`, constructs `mysqli`, and uses a prepared statement. The configuration classifier represents the returned array documented in the root README; the private file itself is outside the repository and was not read.
- **Login behavior:** `Login.php:25-36` compares the submitted username/password directly. `doLogin()` checks the returned ID, saves browser state, and redirects (`js/code.js:8-59`). Although `index.html` loads `js/md5.js`, its login calls are commented out, so hashing is not shown as active behavior.
- **Add behavior:** `AddColor.php:22-27` inserts the submitted `userId` and color name. `addColor()` displays success on every completed HTTP 200 response without inspecting the JSON error (`js/code.js:111-140`). The activity diagram shows this behavior even for an HTTP 200 connection-error response; it does not claim the frontend verifies persistence.
- **Search behavior:** `SearchColors.php:23-46` applies `LIKE` with surrounding `%` characters and filters by submitted `userId`. This preserves SQL wildcard behavior and does not imply literal-only substring matching or sorted results. The success JSON contains only names. No matches or a reported connection error produce JSON without `results` (`64-73`). `searchColor()` unconditionally reads `results.length` (`js/code.js:163-175`), so those responses cause an asynchronous callback TypeError and leave the previous list unchanged. The outer `try/catch` does not catch that later callback exception. `css/styles.css` hides `#colorSearchResult`, so the diagram describes setting its status rather than visibly displaying it.
- **Activity scope:** the diagram covers login, the color-page cookie gate, repeated add/search actions, and logout. A failed login ends that attempt; the user can submit another attempt. The loop represents user interaction, not polling. Response paths assume completed HTTP 200 requests, as stated on the image. Unhandled SQL exceptions and request/transport failures are outside this workflow detail; no recovery behavior is invented.

## Regeneration

With Java and PlantUML installed, run from the repository root. The sources select PlantUML's built-in Smetana layout for the use case and class diagrams, so Graphviz is not required. This keeps rendering local without installing system packages or sending the source to a public rendering service.

```sh
plantuml -charset UTF-8 -tpng docs/uml/usecase.puml docs/uml/activity.puml docs/uml/class.puml
```

Alternatively, use `java -jar /path/to/plantuml.jar` in place of `plantuml`. Keep the source and PNG pairs together when updating a diagram.

## Verification

The diagrams were syntax-checked and rendered locally with PlantUML 1.2026.2. All three PNGs were visually inspected, and each PNG's embedded source was compared with its `.puml` file to verify that the pairs match.

Twelve checks ran the unchanged `js/code.js` in an isolated JavaScript environment with simulated DOM, cookies, and HTTP responses. They confirmed the function inventory, request payloads, successful/failed login, cookie restoration and expiry, the exact cookie gate, logout, add-error feedback, successful search, missing-results failures, and non-200 callback behavior. PHP queries and JSON construction were checked against source; these checks did not contact the deployed application or run a live PHP/MySQL integration test.

## Review and submission

Inspect all three PNGs and compare the source references above with the implementation. The assignment asks for the URL of the single final commit containing all diagrams. Creating that commit and pushing it require the repository owner's approval; the diagrams are prepared for review first.
