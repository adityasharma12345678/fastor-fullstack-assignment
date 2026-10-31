# Backend CRM Design

## Data ownership

- An employee has a unique normalized email, a bcrypt-hashed password, and Mongoose timestamps.
- A lead stores the enquiry's name, email, phone, course interest, `claimed` state, `claimedBy` employee reference, and timestamps.
- New leads default to `claimed: false` and `claimedBy: null`.

## Atomic claim

Claiming uses one conditional `findOneAndUpdate` with filter `{ _id, claimed: false }` and sets `claimed: true` and `claimedBy` to the authenticated employee ID. MongoDB applies this document update atomically: competing employees cannot both claim the same unclaimed lead. A subsequent existence check distinguishes an already-claimed lead (`409`) from an unknown ID (`404`).

The public queue selects only `claimed: false`. The private queue selects only records whose `claimedBy` matches the authenticated employee. Public lead creation only copies validated enquiry fields, so a client cannot create an already-claimed or employee-owned lead.

## Security and operations

- Passwords use bcryptjs with 12 salt rounds and are excluded from normal employee queries and public response objects.
- JWTs are signed with `JWT_SECRET`, have a configurable expiry, and resolve to an existing employee on each protected request.
- `express-validator` validates and normalizes incoming fields; a centralized error middleware provides consistent JSON failures.
- Keep secrets out of version control. The example secret is suitable only for local development.

The backend API is separate from frontend Fastor authentication. It does not accept Fastor or Firebase tokens.
