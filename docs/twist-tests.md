# TrekGear Hub - No Double Booking Tests

Branch: `twist-no-double-booking`

## Prerequisites

- Start the Node.js server.
- Make sure the database is seeded.
- Make sure Tent 8 and both trekkers Asha and Ravi exist.
- Make sure Tent 8 has no active rental before starting.
- Replace the example IDs below with the actual IDs in your database.

Base URL: `http://localhost:3000`

## Test 1: Rent Tent 8 to Asha

**Method:** POST  
**URL:** `/rentals/`

Request body:

```json
{
  "trekker_id": 1,
  "tent_id": 8
}
```

**Expected result:**

- Status: `201 Created`
- A new rental is saved.
- `rented_date` contains today's date.
- `returned_date` is `null`.

Save the rental ID from the response for Test 3.

## Test 2: Try renting Tent 8 to Ravi

**Method:** POST  
**URL:** `/rentals/`

Request body:

```json
{
  "trekker_id": 2,
  "tent_id": 8
}
```

**Expected result:**

- Status: `409 Conflict`
- No new rental is created.
- Response message:

```json
{
  "message": "Tent Tent 8 is already rented"
}
```

The message above assumes the tent's actual name is `Tent 8`.

## Test 3: Return Tent 8 and rent it to Ravi

### Step A: Return Asha's rental

**Method:** POST  
**URL:** `/rentals/RENTAL_ID/return`

Replace `RENTAL_ID` with the rental ID returned in Test 1.

**Expected result:**

- Status: `200 OK`
- `returned_date` contains today's date.

### Step B: Rent Tent 8 to Ravi again

**Method:** POST  
**URL:** `/rentals/`

Request body:

```json
{
  "trekker_id": 2,
  "tent_id": 8
}
```

**Expected result:**

- Status: `201 Created`
- A new rental is saved for Ravi.
- `rented_date` contains today's date.
- `returned_date` is `null`.

## Expected status summary

| Step | Expected status |
|---|---:|
| Asha rents Tent 8 | 201 |
| Ravi tries to rent the already-rented Tent 8 | 409 |
| Return Asha's rental | 200 |
| Ravi rents Tent 8 after it is returned | 201 |

Run the tests in this order without reseeding or resetting the database between them.
