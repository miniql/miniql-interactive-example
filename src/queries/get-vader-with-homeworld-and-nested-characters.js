
export default {
    name: "4. Vader > Homeworld > Characters",
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

                        // Gets all characters from Darth Vader's homeworld.
                        "characters": { 
                        }
                    }
                }
            }
        }
    }
}
`
}
