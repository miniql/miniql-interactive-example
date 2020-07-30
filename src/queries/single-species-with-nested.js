
export default {
    name: "Single species with nested",
    text:
`
// This is JSON5: https://json5.org/

{
    get: {
        species: {
            args: {
                name: "Hutt"
            }
            resolve: {
                // Nested "planet" entity to resolve.
                homeworld: { 
                }
            }
        }
    }
}
`
}