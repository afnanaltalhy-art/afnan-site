// Local PostgreSQL for development/testing (no install needed): `npm run db:local`
import EmbeddedPostgres from "embedded-postgres";

const pg = new EmbeddedPostgres({ databaseDir: process.env.PGDATA_DIR || "./.pgdata", user: "afnan", password: "afnan", port: 5433, persistent: true });
const fresh = !(await import("node:fs")).existsSync((process.env.PGDATA_DIR || "./.pgdata") + "/PG_VERSION");
if (fresh) await pg.initialise();
await pg.start();
try { await pg.createDatabase("afnan"); } catch { /* exists */ }
console.log("PostgreSQL ready: postgresql://afnan:afnan@localhost:5433/afnan");
const stop = async () => { await pg.stop(); process.exit(0); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
setInterval(() => {}, 1 << 30);
