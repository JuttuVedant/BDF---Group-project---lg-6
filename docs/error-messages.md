# Error messages (validation.js)

These are all the error messages that `validateTent(body)` can return. If the data is fine it returns `null` (no error).

The routes (`routes/tents.js`) use the message like this: if `validateTent` returns a string, the response is **400** with JSON `{ "message": "<the string>" }`.

## How the checks run

1. The **name** is checked first, then the **size**.
2. For each field the checks go in this order: missing → not text → empty.
3. Only the **first** problem is returned. So if both name and size are bad, the user sees the name error first. Fix it, send again, then see the size error.
4. If there is no request body at all, it is treated like `{}`, so the user gets `Tent name is required`.

## Messages

| # | Message | When it appears | Example body that causes it |
|---|---------|-----------------|-----------------------------|
| 1 | `Tent name is required` | `name` is missing or `null` | `{ "size": "2-person" }` |
| 2 | `Tent name must be text` | `name` is there but is not a string (number, true/false, array, object) | `{ "name": 123, "size": "2-person" }` |
| 3 | `Tent name cannot be empty` | `name` is an empty string or only spaces | `{ "name": "   ", "size": "2-person" }` |
| 4 | `Tent size is required` | `size` is missing or `null` (name is valid) | `{ "name": "Tent 1" }` |
| 5 | `Tent size must be text` | `size` is there but is not a string (name is valid) | `{ "name": "Tent 1", "size": 4 }` |
| 6 | `Tent size cannot be empty` | `size` is an empty string or only spaces (name is valid) | `{ "name": "Tent 1", "size": "" }` |

## Valid example (returns `null`)

```json
{ "name": "Tent 1", "size": "2-person" }
```

## Notes

- `searchTents(db, size)` has no error messages. If nothing matches (or no size is given) it just returns an empty array `[]`.
- A **404** for a tent that does not exist is not a validation error. That message comes from the route file, not from `validation.js`.
