
export default {
    name: "2. Single species with nested",
    text:
`
// This is JSON5: https://json5.org/

{
    "get": {
        "species": {
            "args": {
                // Gets a single species with this name.
                "name": "Hutt"
            },
            "resolve": {
                // Nested "planet" entity to resolve.
                "homeworld": { 
                }
            }
        }
    }
}
`
}