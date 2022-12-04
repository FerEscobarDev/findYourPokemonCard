import './style.css'
const pokemon = async (url) => {
  const response = await fetch(url)
  if (response.status === 200) {
    return response.json()
  }else{
    return {}
  }
}



let urlSpecies = 'https://pokeapi.co/api/v2/pokemon-species/'   //debe ir el nombre o id del pokemon al final

const pokemonList = async () => {
    try {
        const urlList = 'https://pokeapi.co/api/v2/pokemon';
        const list = await fetch(urlList);
        if(list.status === 200){
            const {results} = await list.json();        

            const pokemonsFetch = results.map( async ({ url }) => await pokemon(url))

            Promise.allSettled(pokemonsFetch).then(pokemonsArray => {

                const pokemons = pokemonsArray.map(({value}) => {
                    const { 
                        name, height, 
                        sprites:{other:{dream_world:{front_default}}},
                        stats, types
                    } = value;
                    
                    return {
                        name: name,
                        height: height,
                        img: front_default,
                        stats: stats,
                        types: types,
                    }
                });
                console.log(pokemons)
            })

        }else{
            console.error(`Se ha obtenido un status ${list.status}`)
        } 

    } catch (error) {
        throw new Error(error)
    }
}

pokemonList();