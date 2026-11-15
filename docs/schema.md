# TrekGear Hub - Database Schema

Database: SQLite file `trekgear.db` (made automatically by `db.js`).
Foreign keys are turned on with `PRAGMA foreign_keys = ON`.

## trekkers

Stores the people who rent gear.

| Column | Type | What it is for |
|--------|------|----------------|
| id | INTEGER, primary key, auto increment | Unique number for each trekker |
| name | TEXT, required | Name of the trekker, like "Asha" |

## tents

Stores the tents that can be rented.

| Column | Type | What it is for |
|--------|------|----------------|
| id | INTEGER, primary key, auto increment | Unique number for each tent |
| name | TEXT, required | Name of the tent, like "Tent 8" |
| size | TEXT, required | Size of the tent, like "2-person" or "4-person" |

## rentals

Stores which trekker rented which tent and when.

| Column | Type | What it is for |
|--------|------|----------------|
| id | INTEGER, primary key, auto increment | Unique number for each rental |
| trekker_id | INTEGER, required, foreign key to trekkers(id) | Who rented the tent |
| tent_id | INTEGER, required, foreign key to tents(id) | Which tent was rented |
| rented_date | TEXT, required | Date the tent was rented, format YYYY-MM-DD |
| returned_date | TEXT, can be NULL | Date the tent was returned. **NULL means the rental is still active** (the tent is out) |

## How the tables connect

- One trekker can have many rentals (`rentals.trekker_id` -> `trekkers.id`)
- One tent can have many rentals over time (`rentals.tent_id` -> `tents.id`)
- A tent is "currently rented" if it has a rental where `returned_date IS NULL`. This is what the no double booking rule checks.
- Because foreign keys are on, you cannot add a rental for a trekker or tent id that does not exist, and you cannot delete a trekker or tent that still has rentals.

## Sample data (from seed.js)

- Trekkers: Asha, Ravi, Meena, Kiran
- Tents: Tent 1 to Tent 10 (2-person, 4-person and 6-person)
- Rentals: Ravi returned Tent 3, Meena still has Tent 5
- Tent 8 is free at the start so the twist tests work
