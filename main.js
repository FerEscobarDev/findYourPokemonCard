import './style.css'
const getPokemon = async (url) => {
    const response = await fetch(url)
    if (response.status === 200) {
        return response.json();
    }else{
        return {}
    }
}
const getSpecie = async (name) => {
    const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${name}`   //debe ir el nombre o id del pokemon al final
    const specie = await fetch(urlSpecies);

    if (specie.status === 200) {
        return specie.json();
    }else{
        return {}
    }
}



const pokemonList = async (url) => {
    try {
        
        const list = await fetch(url);
        if(list.status === 200){
            const {results, next, previous} = await list.json();      

            const pokemonsFetch = results.map( async ({ name, url }) => {
                const pokemon = await getPokemon(url);
                const specie = await getSpecie(name);
                const poke = { ...pokemon, species: specie}
                return poke              
            });

            return Promise.allSettled(pokemonsFetch).then(pokemonsArray => {

                const pokemons = pokemonsArray.map(({value}) => {
                    
                    const { 
                        name, height, weight,
                        sprites:{other:{dream_world:{front_default}}},
                        stats, types,
                        species:{color:{name: color}}
                    } = value;

                    return {
                        name: name,
                        height: height,
                        weight: weight,                        
                        color: color,
                        img: front_default,
                        stats: stats,
                        types: types,
                    }
                });

                const list = {
                    paginate: {
                        next: next,
                        previous: previous,
                    },
                    pokemons: pokemons
                }

                return list;
            })

        }else{
            console.error(`Se ha obtenido un status ${list.status}`)
        } 

    } catch (error) {
        throw new Error(error)
    }
}

const printContent = (url) => {
    const container = document.querySelector('#container');
    container.innerHTML = '';
    const card = document.querySelector('#card');
    const cardSkeleton = document.querySelector(' #card-skeleton');

    for(let i = 0; i < 8; i++){
        container.append(cardSkeleton.content.cloneNode(true));
    }

    const list = pokemonList(url);

    list.then(({pokemons, paginate}) => {
        container.innerHTML = '';

        pokemons.forEach((pokemon) => {
            const div = card.content.cloneNode(true);

            div.querySelector('#title').textContent = pokemon.name;
            div.querySelector('#hp').textContent = pokemon.stats[0].base_stat;
            div.querySelector('#img').src = pokemon.img;
            div.querySelector('#img').alt = pokemon.name;
            div.querySelector('#altura').textContent = pokemon.height/10;
            div.querySelector('#peso').textContent = pokemon.weight;
            div.querySelector('#body-card').classList.add(pokemon.color);
            div.querySelector('#card-content').classList.add(pokemon.color);
            div.querySelector('#image').classList.add(pokemon.color);
            div.querySelector('#img-footer').classList.add(pokemon.color);
            
            document.querySelector('#next').setAttribute('data_link', paginate.next);
            document.querySelector('#previous').setAttribute('data_link', paginate.previous);

            container.append(div);
        });
    })
}


addEventListener('DOMContentLoaded', () => {    
    const urlList = 'https://pokeapi.co/api/v2/pokemon?limit=8&offset=0';
    printContent(urlList);
})

const next = document.querySelector('#next');

next.addEventListener('click', () => {
    const url = next.getAttribute('data_link');
    printContent(url);
});

const previous = document.querySelector('#previous');

previous.addEventListener('click', () => {
    const url = previous.getAttribute('data_link');
    printContent(url);
});




