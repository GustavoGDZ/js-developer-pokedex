const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const extractNames = (slots, key) => slots.map((slot) => slot[key].name)

    pokemon.types = extractNames(pokeDetail.types, 'type')
    pokemon.type = pokemon.types[0] // Primeiro tipo como principal

    pokemon.abilities = extractNames(pokeDetail.abilities, 'ability')
    pokemon.ability = pokemon.abilities[0] // Primeira habilidade como principal

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default || 'default-image.png' // Imagem padrão

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
}

