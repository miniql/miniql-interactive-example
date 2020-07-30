
export default {
    name: "4. All species with nested",
    text:
`
// This is JSON5: https://json5.org/

{
    "get": {
        // Get all species.
        "species": { 
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