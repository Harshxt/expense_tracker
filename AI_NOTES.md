# AI Usage Notes

**1. Which parts of the code were AI-generated vs. written by me?**
*   **AI-Generated:** Around 30-40% of the code has been written by AI. This includes the complete `seed.js` and `api.tests.json` files. Other than this, AI was only used for guidance across the whole repo, including some logic like the categoryFilters and `storage.js` logic. AI also drafted the regex for the date validation.
*   **Written/Modified by me:** The project architecture, module structure, bug fixing (resolving ESM/CommonJS conflicts with Jest), and refining the date validation logic. The endpoints and the whole `server.js` code was written by me along with the guidance of the AI. The idea of seeding the database and improving category filters was performed by me.  I modified `storage.js` to fit the appropriate naming convention. 

**2. What I validated, tested, or changed in the AI's output, and why:**
*   **Category Filtering Bug:** The initial AI logic for the `GET /expenses?category=` filter failed silently (returning `[]`) if there were whitespace mismatches. I modified the code to include `.trim().toLowerCase()` on both the query parameter and the stored data, and added a null-check to prevent crashes if an expense lacked a category.
*   **Robust Date Validation:** The initial POST route accepted any string as a date. I explicitly requested and validated a strict ISO 8601 (`YYYY-MM-DD`) regex check, paired with JavaScript's `Date` parsing (`toISOString().slice(0, 10)`), to reject impossible calendar dates (e.g., February 31st).
*   **ESM Compatibility:** The AI originally suggested using the `uuid` npm package for ID generation. This caused a `SyntaxError: Unexpected token 'export'` when running the Jest suite due to CommonJS/ESM conflicts. Instead of configuring Babel, I removed the `uuid` package entirely and rewrote the ID generation using Node's native `crypto.randomUUID()`.
*   **Test Isolation:** I verified the `beforeAll` and `afterAll` hooks in the Jest suite to ensure they temporarily override `data.json` during execution, allowing tests to run predictably without destroying the actual saved data.

**3. Any AI suggestion I decided not to use, and why:**
*   **Tech Stack:** The AI presented Spring Boot and Express. I rejected Spring Boot in favor of Express because the assignment required writing to a local `.json` file, and Node.js handles JSON parsing natively with far less boilerplate than Java/Jackson. Along with this, my proficiency in Express.js was far more than my proficiency in Springboot currently.
*   **Separate Filter Endpoint:** The AI initially considered making a dedicated route like `/expenses/category/:category`. I rejected this in favor of a `req.query` parameter on the main `GET /expenses` route, which is a cleaner RESTful practice for filtering.
*   **UUID library choice**: AI suggested usageof `uuidv4()` for the generation of Id, which was proven incompatible with supertest as it didn't support CommonJS syntax.