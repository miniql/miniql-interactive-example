
export default {
    name: "3. Vader > Homeworld + Species",
    text:
`
// This is JSON5: https://json5.org/

{
    "get": {
        "character": {
            "args": {
                "name": "Darth Vader"
            },
            "resolve": {
                "homeworld": { 
                },

                // Get's Darth Vader's species.
                "species": { 
                }
            }
        }
    }
}
`
}
