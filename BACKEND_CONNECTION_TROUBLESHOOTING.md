# Backend MongoDB Connection Troubleshooting

## What was failing

The backend's configured URI uses the Atlas `mongodb+srv://` scheme. The URI format is supported by Mongoose 9 and its MongoDB Node.js driver, but this scheme first requires a DNS SRV lookup for:

```text
_mongodb._tcp.cluster0.0kntxtg.mongodb.net
```

In the affected environment, the operating-system DNS resolver (`127.0.0.1`) returned `ECONNREFUSED` for that SRV query. A direct SRV query to public resolvers succeeded in this environment, which indicates a local DNS resolver/path issue rather than evidence that the Atlas cluster is unhealthy. DNS settings and access policies vary by network, so use resolvers permitted by your network.

The backend now supports an optional DNS override for SRV lookups, validates connection settings before connecting, reports SRV lookup failures with a specific safe diagnostic, and redacts MongoDB URIs from other connection error messages.

During a prior connection test, setting the DNS override allowed the driver to progress past SRV lookup and contact Atlas, which then rejected the configured database credentials. This confirmed DNS resolution was one issue; valid Atlas Database Access credentials are also required. The backend now reports authentication failures separately without printing the URI.

## Exact `.env` format

Create `backend/.env` from `.env.example`. Use one unquoted `KEY=value` entry per line; do not include angle brackets literally. Replace the placeholders with the current Atlas values, and URL-encode any reserved characters in the database username/password (for example `@` becomes `%40`). Use the **Database Access** user password, not the Atlas website login password.

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<db_username>:<url_encoded_password>@cluster0.0kntxtg.mongodb.net/fastor_crm?retryWrites=true&w=majority
MONGODB_SERVER_SELECTION_TIMEOUT_MS=15000
JWT_SECRET=<at_least_32_random_characters>
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
```

Atlas may provide additional query options such as `appName`; retain the options in the connection string Atlas generates. The database path (`/fastor_crm` above) selects the CRM database. Do not commit `backend/.env`.

### DNS override for `querySrv ECONNREFUSED`

If the system resolver cannot perform SRV queries, set a DNS server reachable and permitted on your network:

```dotenv
MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8
```

This setting is optional and only applies to `mongodb+srv://` connections. It changes the Node.js DNS resolver used by this backend process. If your network blocks public DNS, use your organization's DNS servers instead. Do not enable this override without considering your network policy.

You can test DNS before starting the API:

```powershell
node -e "require('node:dns').promises.resolveSrv('_mongodb._tcp.cluster0.0kntxtg.mongodb.net').then(console.log).catch(error => { console.error(error.code, error.message); process.exitCode = 1 })"
```

If that fails but direct queries to an allowed DNS resolver work, set `MONGODB_DNS_SERVERS`, then restart the backend. The backend's output should no longer show an SRV resolution failure.

## Non-SRV Atlas fallback

Mongoose 9 also supports the standard `mongodb://` replica-set seed-list format. In Atlas, use **Connect → Drivers** and copy the standard non-SRV connection string/host list if it is offered. Do not guess shard hostnames or the replica-set name.

The shape is:

```dotenv
MONGODB_URI=mongodb://<db_username>:<url_encoded_password>@<atlas-host-0>:27017,<atlas-host-1>:27017,<atlas-host-2>:27017/fastor_crm?tls=true&replicaSet=<atlas-replica-set-name>&authSource=admin&retryWrites=true&w=majority
```

Keep the hosts, replica-set name, TLS setting, and other query parameters exactly as Atlas provides them. This avoids the SRV lookup, though ordinary DNS resolution of the individual hostnames and outbound access to Atlas on port `27017` are still required. If Atlas only gives you a `mongodb+srv://` URI, ask the Atlas administrator for a standard seed-list URI or fix SRV resolution; do not derive a URI by inventing hosts.

## dotenv and Mongoose compatibility

- `backend/server.js` loads `backend/.env` by an absolute path based on `__dirname`; starting `npm run dev` from the backend directory or repository root uses the same file.
- Variables already exported in the shell/process take precedence over values in `.env`, which is dotenv's default. Check for a stale `MONGODB_URI` or DNS override in the terminal if editing `.env` appears to have no effect.
- The project uses Mongoose `9.11.4`, MongoDB Node.js driver `7.7.0`, and Node.js `24.15.0` in the verification environment. Mongoose passes both `mongodb+srv://` and standard `mongodb://` URIs to its driver. The SRV URI and standard replica-set URI both parsed successfully with the installed driver parser.
- `MONGODB_SERVER_SELECTION_TIMEOUT_MS` controls the driver's server selection timeout. It defaults to 10 seconds when omitted and must be a positive integer.

## Start and verify

```powershell
cd C:\RN\fastor-fullstack-assignment\backend
npm install
Copy-Item .env.example .env -Force
notepad .env
npm run dev
```

The API starts listening only after MongoDB connects. If connection still fails after SRV resolution works, verify the Atlas database username/password, percent-encoding, Atlas **Network Access** IP allowlist, cluster hostname, TLS options, and that your network permits outbound MongoDB connections. If the error is authentication failure, update the URI with the current **Database Access** credentials. If the error is a timeout, check the IP allowlist and outbound network access. A healthy Atlas cluster can still reject a client whose IP is not allowed.

Never paste database credentials into issue trackers or public logs. If a password has been exposed, rotate it in Atlas and update `.env`.
