# Trekker and Tent Rental API

> **Status:** Draft documentation for the `postman-readme` branch. The backend implementation has not yet been reviewed. Confirm every item marked **[CONFIRM AFTER MERGE]** against the merged team code before treating this README as final.

## Project description

The Trekker and Tent Rental API manages trekkers, tents, and tent rentals. It supports creating and listing trekkers and tents, searching tents by size, recording rentals, returning rented tents, and viewing rental details joined with trekker and tent information.

A rental is active when `returned_date` is `NULL`. The database uses foreign keys to connect each rental to an existing trekker and tent.

## Tech used

- Node.js
- Express.js
- SQLite
- Postman for API testing

**[CONFIRM AFTER MERGE]** Check the exact Node.js version, SQLite package/library, and any additional dependencies in `package.json`.

## Installation and running

1. Clone the repository and switch to the branch containing the merged project.
2. Open a terminal in the project root.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Seed the database:

   ```bash
   npm run seed
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. **[CONFIRM AFTER MERGE]** Check the terminal for the actual port and startup message. The Postman collection currently uses `http://localhost:3000` as `baseUrl`. Change the collection variable if the server uses another port.

## Database table structure

### `trekkers`

| Column | Description |
|---|---|
| `id` | Trekker ID (primary key) |
| `name` | Trekker name |

### `tents`

| Column | Description |
|---|---|
| `id` | Tent ID (primary key) |
| `name` | Tent name |
| `size` | Tent size |

### `rentals`

| Column | Description |
|---|---|
| `id` | Rental ID (primary key) |
| `trekker_id` | Foreign key referencing `trekkers.id` |
| `tent_id` | Foreign key referencing `tents.id` |
| `rented_date` | Date the tent was rented |
| `returned_date` | Return date; `NULL` means the rental is active |

**[CONFIRM AFTER MERGE]** Verify actual column types, constraints, foreign-key behavior, and whether any extra columns or indexes are present.

## API endpoints

Base URL used in the examples: `http://localhost:3000`

> The examples below show the agreed route names and expected behavior. **[CONFIRM AFTER MERGE]** Verify exact status codes, response fields, and error messages against the implemented routes.

| Method | Endpoint | Purpose | Expected success |
|---|---|---|---:|
| GET | `/trekkers` | List trekkers | 200 |
| POST | `/trekkers` | Create a trekker | 201 |
| GET | `/tents` | List tents | 200 |
| POST | `/tents` | Create a tent | 201 |
| GET | `/tents?size=Large` | Search tents by size | 200 |
| GET | `/rentals` | List rentals | 200 |
| POST | `/rentals` | Create a rental | 201 |
| PUT | `/rentals/:id/return` | Return a rental | 200 |
| GET | `/rentals/details` | Get joined rental, trekker, and tent details | 200 |

### Example requests and responses

#### 1. Create a trekker

`POST /trekkers`

Request:

```json
{
  "name": "Asha"
}
```

Example response (**201 Created**):

```json
{
  "id": 1,
  "name": "Asha"
}
```

#### 2. Create a tent

`POST /tents`

Request:

```json
{
  "name": "Tent 8",
  "size": "Large"
}
```

Example response (**201 Created**):

```json
{
  "id": 8,
  "name": "Tent 8",
  "size": "Large"
}
```

#### 3. Search tents by size

`GET /tents?size=Large`

Example response (**200 OK**):

```json
[
  {
    "id": 8,
    "name": "Tent 8",
    "size": "Large"
  }
]
```

#### 4. Create a rental

`POST /rentals`

Request:

```json
{
  "trekker_id": 1,
  "tent_id": 8,
  "rented_date": "2026-11-15"
}
```

Example response (**201 Created**):

```json
{
  "id": 1,
  "trekker_id": 1,
  "tent_id": 8,
  "rented_date": "2026-11-15",
  "returned_date": null
}
```

#### 5. Return a rental

`PUT /rentals/1/return`

Request:

```json
{
  "returned_date": "2026-11-16"
}
```

Example response (**[CONFIRM AFTER MERGE]**):

```json
{
  "message": "Tent returned successfully"
}
```

#### 6. Get joined rental details

`GET /rentals/details`

Example response (**200 OK**; exact property names must be confirmed):

```json
[
  {
    "rental_id": 1,
    "trekker_name": "Asha",
    "tent_name": "Tent 8",
    "tent_size": "Large",
    "rented_date": "2026-11-15",
    "returned_date": null
  }
]
```

## Validation and not-found cases

All errors are expected to be JSON objects with a `message` field. **[CONFIRM AFTER MERGE]** Check exact wording and status codes.

| Scenario | Expected status | Example |
|---|---:|---|
| Create trekker without `name` | 400 | `POST /trekkers` with `{}` |
| Create tent without required fields | 400 | `POST /tents` with `{"name":"Incomplete Tent"}` |
| Create rental without required fields | 400 | `POST /rentals` without `rented_date` |
| Rental references missing trekker or tent | 404 | Use an ID that does not exist |
| Return an unknown rental | 404 | `PUT /rentals/999999/return` |

Example error response:

```json
{
  "message": "A descriptive validation or not-found message"
}
```

## Postman collection

Import `postman/Trekker_Tent_Rental.postman_collection.json` into Postman.

The collection contains these folders:

1. **Trekkers** — list, create, and missing-name validation.
2. **Tents** — list, create, missing-field validation, and search by size.
3. **Rentals** — list, create, missing-field validation, not-found cases, return, and joined rental details.
4. **Twist tests — run in order** — the three requested twist scenarios (the third scenario uses two HTTP requests: return Asha's rental, then rent to Ravi).

Collection variables:

| Variable | Purpose | Initial value |
|---|---|---|
| `baseUrl` | API base URL | `http://localhost:3000` |
| `ashaTrekkerId` | Asha's trekker ID | `1` |
| `raviTrekkerId` | Ravi's trekker ID | `2` |
| `tent8Id` | Tent 8 ID | `8` |
| `rentalAshaId` | Rental ID created for Asha | Set by Twist 1 test |
| `rentedDate` | Rental date | `2026-11-15` |
| `returnedDate` | Return date | `2026-11-16` |
| `tentSize` | Search size | `Large` |

**[CONFIRM AFTER MERGE]** Confirm that Asha, Ravi, and Tent 8 exist in the seeded database and update their IDs in the collection variables. If the seed data does not create these records, create them first using the collection requests.

## Twist tests (run in this exact order)

Run the requests in the **Twist tests — run in order** folder in this order. Use the same database throughout the sequence; do not reseed or reset the database between requests.

### Twist 1 — Rent Tent 8 to Asha

- Request: `POST /rentals`
- Body:

  ```json
  {
    "trekker_id": 1,
    "tent_id": 8,
    "rented_date": "2026-11-15"
  }
  ```

- Expected: **201 Created**
- The collection test saves the returned rental ID as `rentalAshaId`.

### Twist 2 — Rent Tent 8 to Ravi while it is still rented to Asha

- Request: `POST /rentals`
- Body:

  ```json
  {
    "trekker_id": 2,
    "tent_id": 8,
    "rented_date": "2026-11-15"
  }
  ```

- Expected: **409 Conflict**
- Expected JSON message:

  ```json
  {
    "message": "Tent 8 is already rented"
  }
  ```

### Twist 3 — Return Tent 8, then rent it to Ravi

This twist requires two requests, in order:

1. **Return Asha's rental**
   - Request: `PUT /rentals/{{rentalAshaId}}/return`
   - Body:

     ```json
     {
       "returned_date": "2026-11-16"
     }
     ```

   - Expected: **200 OK** (**[CONFIRM AFTER MERGE]** exact success response).

2. **Rent Tent 8 to Ravi**
   - Request: `POST /rentals`
   - Body:

     ```json
     {
       "trekker_id": 2,
       "tent_id": 8,
       "rented_date": "2026-11-16"
     }
     ```

   - Expected: **201 Created**

## Important implementation checks after merge

- **[CONFIRM AFTER MERGE]** The server mounts the join router before the rentals router at `/rentals`, so `GET /rentals/details` must be handled by the join router.
- **[CONFIRM AFTER MERGE]** The active-rental conflict must return HTTP **409** and the exact message `Tent 8 is already rented`. A previous draft route example returned 400 with a generic message; update the backend or revise this expectation only if the team changes the agreed requirement.
- **[CONFIRM AFTER MERGE]** Confirm the return route's HTTP status and request body field.
- **[CONFIRM AFTER MERGE]** Confirm all validation and not-found response messages.
- **[CONFIRM AFTER MERGE]** Confirm the seeded IDs for Asha, Ravi, and Tent 8.
- **[CONFIRM AFTER MERGE]** Confirm the actual server port and npm scripts.

## Git branch and push

Use the following commands from the repository root after adding the README and Postman collection:

```bash
git switch postman-readme
git status
git add README.md postman/Trekker_Tent_Rental.postman_collection.json
git commit -m "Add Postman collection and project README"
git push -u origin postman-readme
```

Only these two files are included in this documentation task:

- `README.md`
- `postman/Trekker_Tent_Rental.postman_collection.json`
