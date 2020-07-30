
export default {
    name: "All species with nested",
    text:
`
// This is JSON5: https://json5.org/

{
    "get": {
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