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

            return Promise.allSettled(pokemonsFetch).then(pokemonsArray => {

                const pokemons = pokemonsArray.map(({value}) => {
                    const { 
                        name, height, weight,
                        sprites:{other:{dream_world:{front_default}}},
                        stats, types
                    } = value;
                    
                    return {
                        name: name,
                        height: height,
                        weight: weight,
                        img: front_default,
                        stats: stats,
                        types: types,
                    }
                });

                return pokemons;
            })

        }else{
            console.error(`Se ha obtenido un status ${list.status}`)
        } 

    } catch (error) {
        throw new Error(error)
    }
}


addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#container');
    const card = document.querySelector('#card');
    const cardSkeleton = document.querySelector(' #card-skeleton');

    for(let i = 0; i < 20; i++){
        container.append(cardSkeleton.content.cloneNode(true));
    }

    const pokemons = pokemonList();

    pokemons.then((pokemons) => {
        container.innerHTML = '';

        pokemons.forEach((pokemon) => {
            const div = card.content.cloneNode(true);

            div.querySelector('#title').textContent = pokemon.name;
            div.querySelector('#hp').textContent = pokemon.stats[0].base_stat;
            div.querySelector('#img').src = pokemon.img;
            div.querySelector('#img').alt = pokemon.name;
            div.querySelector('#altura').textContent = pokemon.height/10;
            div.querySelector('#peso').textContent = pokemon.weight;

            container.append(div);
        });
    })


    console.log(container, 'container')
    console.log(card, ' card')
})



