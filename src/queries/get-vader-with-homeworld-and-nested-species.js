
export default {
    name: "4. Vader > Homeworld > Species",
    text:
`
// This is JSON5: https://json5.org/

// !! This query doesn't work yet !!

{
    "get": {
        "character": {
            "args": {
                "name": "Darth Vader"
            },
            "resolve": {
                
                "homeworld": { 
                    "resolve": {

                        // Gets all species from Darth Vader's homeworld.
                        "species": { 
                        }
                    }
                }
            }
        }
    }
}
`
}
