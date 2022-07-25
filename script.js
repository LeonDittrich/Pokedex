let allPokemons = [];
let searchedPokemons = [];

let PokemonValues;
let pokemonAmount = 20;
let nr = 1;
let waitOnPokemon = true;


async function loadPokemon() {
    for (let i = nr; i <= pokemonAmount; i++) {  // alter Code let i = 1; i <= 151; i++
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        PokemonValues = await response.json();
        allPokemons.push(PokemonValues);

        console.log('Loaded pokemon', PokemonValues);
    }

    await renderPokemon(allPokemons);
}

window.onscroll = async function() {

    if (window.scrollY + window.innerHeight >= document.body.clientHeight && waitOnPokemon) {
        console.log("bottom!");
        if(pokemonAmount >= 151) {

        } else {
            await scroll();
        }
    }  
}

async function scroll() {
    waitOnPokemon = false;
    if (pokemonAmount == 20) {
        nr += pokemonAmount;
    }else {
        nr = pokemonAmount + 1;
    }
    pokemonAmount += 20;      
    await loadPokemon(nr);
    waitOnPokemon = true;
}


async function renderPokemon(pokemon) {
    document.getElementById('pokedexContainer').innerHTML = "";
    for (let i = 0; i < pokemon.length; i++) {
        let poketypes = pokemon[i]['types'][0]['type']['name'];
        document.getElementById('pokedexContainer').innerHTML += `
        <div onclick="pokecard('${pokemon[i].name}')" class="pokedex ${getPokemonBackground(pokemon[i]['types'][0]['type']['name'])}">
            <div class="pokedex-specs">
                <h2>${pokemon[i]['name']}</h2>
                <div id="pokemonType10(${i})"></div>
            </div>
            <div class="pokedex-img">
                <div>
                    <h1 class="Id-Number ${getPokemonBackground(poketypes)}2">#${pokemon[i]['id']}</h1>
                </div> 
                <img class="pokemonIMG" src="${pokemon[i]['sprites']['other']['dream_world']['front_default']}">
            </div>
        </div>`;
        addType(pokemon, i);
        
    }     
}

function getPokemonBackground(pokemonType) {
    return pokemonType;
}


function searchPokemon() {
    let search = document.getElementById('find-pokemon').value;
    search = search.toLowerCase();


    let filteredPokemons = allPokemons.filter(p => p.name.startsWith(search));
    renderPokemon(filteredPokemons);
}

function hoverBackBtn() {
    document.getElementById('back').src = "./img/arrow2.ico";
}

function backBtn() {
    document.getElementById('back').src = "./img/arrow.ico";
}

function addType(pokemon, i) {
    for (let j = 0; j < pokemon[i]['types'].length; j++) {
        let poketypes = pokemon[i]['types'][j]['type']['name'];
        document.getElementById(`pokemonType10(${i})`).innerHTML += `<button class="pokemon-type-btn ${getPokemonBackground(poketypes)}" id="pokemonType(${i})">${poketypes}</button>`;
    }
}

function goBack() {
    document.getElementById('pokedexContainer').classList.remove('d-none');
    document.getElementById('pokecardContainer').classList.add('d-none');

}


async function renderPokemonInfo(pokemon) {
    let urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`;
    let responseSpecies = await fetch(urlSpecies);
    let PokemonSpecifics = await responseSpecies.json();
    return PokemonSpecifics;
}


/* ----------------------------------------------------------------Pokemonkarte eingefügt------------------------------------------------------- */
async function pokecard(pokemonName) {
    pokemon = allPokemons.find(p => p.name === pokemonName);
    let cardContainer = document.getElementById('pokecardContainer');
    document.getElementById('pokedexContainer').classList.add('d-none');
    document.getElementById('pokecardContainer').classList.remove('d-none');
    

    cardContainer.innerHTML = '';
    cardContainer.innerHTML += `
        <div id="pokecard">
            <div class="video">
                <video autoplay muted loop id="myVideo">
                    <source src="./video/${getPokemonBackground(pokemon['types'][0]['type']['name'])}.mp4" type="video/mp4">
                </video>
                <div class="back">
                    <img onmouseout="backBtn()" onmouseover="hoverBackBtn()" src="./img/arrow.ico" id="back"
                        onclick="goBack()">
                </div>
                <div class="infos">
                    <div class="pokedex-specs2">
                        <h1>${pokemon.name}</h1>
                        <div id="pokemonType5"></div>
                    </div>
                    <div class="pokemonNumber">
                        <h2 class="Id-Number2">#${pokemon['id']}</h2>
                    </div>
                </div>
                <div class="pokecard-img">
                    <img class="pokemonIMG2" src="./img/animated/${pokemon.name}.gif">
                </div>
            </div>

            <div class="info-container">
                <div class="navbar">
                    <a onclick="loadAbout(${`pokemon`})" href="#about">About</a>
                    <a onclick="loadBase(${`pokemon`})" href="#base-stats">Base-Stats</a>
                    <a onclick="loadMoves(${`pokemon`})" href="#moves">Moves</a>
                </div>
                <div id="navbar-content" class="navbar-content"></div> 
            </div>
        </div>`;
    addTypePokecard(pokemon);
    loadAbout(pokemon);
    loadBase(pokemon);
}
/* Anmerkungen: Das *10 und /10 ist dazu da umd die Einheiten umzurechnen in die Jeweilige Einheit die dahinter steht. */


function addTypePokecard(pokemon) {
    for (let j = 0; j < pokemon['types'].length; j++) {
        let poketypes = pokemon['types'][j]['type']['name'];
        document.getElementById(`pokemonType5`).innerHTML += `<button class="pokemon-type-btn ${getPokemonBackground(poketypes)}" id="pokemonType(${j})">${poketypes}</button>`;
    }
}

/* -------------------------------------------------------------------About Container--------------------------------------------------------- */
async function loadAbout(pokemon) {
    let Specifics = await renderPokemonInfo(pokemon);
    console.log(Specifics);
    let navbarContainer = document.getElementById('navbar-content');
    navbarContainer.innerHTML = '';
    navbarContainer.innerHTML += `
    <div class="about">
        <div class="container1">
            <div class="titles">
                <span>Species</span>
                <span>Height</span>
                <span>Weight</span>
                <span>Abilities</span>
            </div>
            <div class="text">
                <span>${Specifics['genera'][7]['genus']}</span>
                <span>${pokemon['height']*10}cm</span>
                <span>${pokemon['weight']/10}kg</span>
                <div id="abilities" class="abilities">
                    
                </div>
            </div>
        </div>
        <div class="container2">
            <h3>Breeding</h3>
            <div class="titles2Container">
                <div id="titles2">
                </div>
                <div id="egg" class="text2 eggTitle">                    
                </div>
            </div>
        </div>
    </div>`;
    addAbilities(pokemon);
    addEggGroup(Specifics);
}


function addAbilities(pokemon) {
    for (let i = 0; i < pokemon['abilities'].length; i++) {
        let abilities = pokemon['abilities'][i]['ability']['name'];

        if (i <= 0) {
            document.getElementById('abilities').innerHTML +=`<span id="abilities">${abilities}</span>`;
        }else{
            document.getElementById('abilities').innerHTML +=`<span id="abilities">${pokemon['abilities'][0]['ability']['name']},</span>
                                                            <span>${pokemon['abilities'][1]['ability']['name']}</span>`;
        }
    }
    
}

function addEggGroup(Specifics) {
    for (let j = 0; j < Specifics['egg_groups'].length; j++) {
        let eggs = Specifics['egg_groups'][j]['name'];
        document.getElementById(`egg`).innerHTML += `<span>${eggs}</span>`;
        document.getElementById('titles2').innerHTML += `<span>Egg-Groups</span>`;
    }
}


/* -------------------------------------------------------------------About Container--------------------------------------------------------- */
function loadBase(pokemon) {
    let navbarContainer = document.getElementById('navbar-content');
    navbarContainer.innerHTML = '';
    navbarContainer.innerHTML += `
    <div class="mainContainerBase">
            <div class="baseStats titles3">
                <span>HP</span>
                <dl class="horizontal">
                    <dt>${pokemon['stats'][0]['base_stat']}</dt>
                    <dd><span style="width:${pokemon['stats'][0]['base_stat']/2.5}%; background: red;"></span></dd>
                </dl>
            </div> 

            <div class="baseStats titles3">   
                <span>Attack</span>
                <dl class="horizontal">
                    <dt>${pokemon['stats'][1]['base_stat']}</dt>
                    <dd><span style="width:${pokemon['stats'][1]['base_stat']/2.5}%;"></span></dd>
                </dl>    
            </div>

            <div class="baseStats titles3">
                <span>Defense</span>
                <dl class="horizontal">
                    <dt>${pokemon['stats'][2]['base_stat']}</dt>
                    <dd><span style="width:${pokemon['stats'][2]['base_stat']/2.5}%; background: red;"></span></dd>
                </dl>
            </div>        

            <div class="baseStats titles3">
                <span>Sp. Atk</span>
                <dl class="horizontal">
                    <dt>${pokemon['stats'][3]['base_stat']}</dt>
                    <dd><span style="width:${pokemon['stats'][3]['base_stat']/2.5}%;"></span></dd>
                </dl>
            </div>

            <div class="baseStats titles3">
                <span>Sp. Def</span>
                <dl class="horizontal">
                    <dt>${pokemon['stats'][4]['base_stat']}</dt>
                    <dd><span style="width:${pokemon['stats'][4]['base_stat']/2.5}%;"></span></dd>
                </dl>
            </div>

            <div class="baseStats titles3">
                <span>Speed</span>
                <dl class="horizontal">
                    <dt>${pokemon['stats'][5]['base_stat']}</dt>
                    <dd><span style="width:${pokemon['stats'][5]['base_stat']/2.5}%; background: red;"></span></dd>
                </dl>
            </div>
    </div>`;
}


/* -------------------------------------------------------------------Moves Container--------------------------------------------------------- */
async function loadMoves(pokemon) {
    let navbarContainer = document.getElementById('navbar-content');
    let move1 = await moveURL1(pokemon);
    let move2 = await moveURL2(pokemon);
    let move3 = await moveURL3(pokemon);
    let move4 = await moveURL4(pokemon);
    let move5 = await moveURL5(pokemon);
    let move6 = await moveURL6(pokemon);
    navbarContainer.innerHTML = '';
    navbarContainer.innerHTML += `
    <div class="mainContainerMoves">
        <div>
            <span class="titles3">Name</span>
            <div class="specs">
                <span>${pokemon['moves'][0]['move']['name']}</span>
                <span>${pokemon['moves'][1]['move']['name']}</span>
                <span>${pokemon['moves'][2]['move']['name']}</span>
                <span>${pokemon['moves'][3]['move']['name']}</span>
                <span>${pokemon['moves'][4]['move']['name']}</span>
                <span>${pokemon['moves'][5]['move']['name']}</span>
            </div>
        </div>

        <div class="typesCenter">
            <span class="titles3 spanZero">Type</span>
            <div class="specs">
                <span id="type1" class="spanTypes"></span>
                <span id="type2" class="spanTypes"></span>
                <span id="type3" class="spanTypes"></span>
                <span id="type4" class="spanTypes"></span>
                <span id="type5" class="spanTypes"></span>
                <span id="type6" class="spanTypes"></span>
            </div>
        </div>

        <div>
            <span class="titles3">Power</span>
            <div class="specs centerSpecs">
                <span>${move1['power']}</span>
                <span>${move2['power']}</span>
                <span>${move3['power']}</span>
                <span>${move4['power']}</span>
                <span>${move5['power']}</span>
                <span>${move6['power']}</span>
            </div>
        </div>

        <div>
            <span class="titles3">Acc.</span>
            <div class="specs centerSpecs">
                <span>${move1['accuracy']}</span>
                <span>${move2['accuracy']}</span>
                <span>${move3['accuracy']}</span>
                <span>${move4['accuracy']}</span>
                <span>${move5['accuracy']}</span>
                <span>${move6['accuracy']}</span>
            </div>
        </div>
    </div>`;
    addTypeBtn1(move1);
    addTypeBtn2(move2);
    addTypeBtn3(move3);
    addTypeBtn4(move4);
    addTypeBtn5(move5);
    addTypeBtn6(move6);
}
 

function addTypeBtn1(move1) {
    let poketypes = move1['type']['name'];
    document.getElementById(`type1`).innerHTML += `<button class="typeBtn ${getPokemonBackground(poketypes)}" id="pokemonType()">${poketypes}</button>`;
}

function addTypeBtn2(move2) {
    let poketypes = move2['type']['name'];
    document.getElementById(`type2`).innerHTML += `<button class="typeBtn ${getPokemonBackground(poketypes)}" id="pokemonType()">${poketypes}</button>`;
}

function addTypeBtn3(move3) {
    let poketypes = move3['type']['name'];
    document.getElementById(`type3`).innerHTML += `<button class="typeBtn ${getPokemonBackground(poketypes)}" id="pokemonType()">${poketypes}</button>`;
}

function addTypeBtn4(move4) {
    let poketypes = move4['type']['name'];
    document.getElementById(`type4`).innerHTML += `<button class="typeBtn ${getPokemonBackground(poketypes)}" id="pokemonType()">${poketypes}</button>`;
}

function addTypeBtn5(move5) {
    let poketypes = move5['type']['name'];
    document.getElementById(`type5`).innerHTML += `<button class="typeBtn ${getPokemonBackground(poketypes)}" id="pokemonType()">${poketypes}</button>`;
}

function addTypeBtn6(move6) {
    let poketypes = move6['type']['name'];
    document.getElementById(`type6`).innerHTML += `<button class="typeBtn ${getPokemonBackground(poketypes)}" id="pokemonType()">${poketypes}</button>`;
}

async function moveURL1(pokemon) {
    let url1 = `${pokemon['moves'][0]['move']['url']}`;
    let response1 = await fetch(url1);
    let move1 = await response1.json();
    return move1;
}

async function moveURL2(pokemon) {
    let url2 = `${pokemon['moves'][1]['move']['url']}`;
    let response2 = await fetch(url2);
    let move2 = await response2.json();
    return move2;
}

async function moveURL3(pokemon) {
    let url3 = `${pokemon['moves'][2]['move']['url']}`;
    let response3 = await fetch(url3);
    let move3 = await response3.json();
    return move3;
}

async function moveURL4(pokemon) {
    let url4 = `${pokemon['moves'][3]['move']['url']}`;
    let response4 = await fetch(url4);
    let move4 = await response4.json();
    return move4;
}

async function moveURL5(pokemon) {
    let url5 = `${pokemon['moves'][4]['move']['url']}`;
    let response5 = await fetch(url5);
    let move5 = await response5.json();
    return move5;
}

async function moveURL6(pokemon) {
    let url6 = `${pokemon['moves'][5]['move']['url']}`;
    let response6 = await fetch(url6);
    let move6 = await response6.json();
    return move6;
}
