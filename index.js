// Input
const countryInput = document.querySelector('#country-input');
// Para que aparezcan los mapas
const imgContainer = document.querySelector('.country-img-container');
// Avisos sobre la búsqueda
const countrySpan = document.querySelector('.country-span');
const countryDont = document.querySelector('.country-dont');
// Zona de resultados
const countryResult = document.querySelector('#country-result');
// Botón de carga
const load = document.querySelector('.btn');
// Buscador invisible
const container = document.querySelector('.search-container');

// Inicia al clickear el botón de carga
load.addEventListener('click', async e => {
    e.preventDefault();

    // Botón de carga oculto y buscador visible
    load.style.display = 'none';
    container.style.display = 'flex';

    const dataJson = await (await fetch(`https://restcountries.com/v3.1/all`)).json();
    
    // Convertir json en un array con objetos: Deja un objeto dentro de un array dentro de otro array
    const dataMap = dataJson.map(pais => [
        {
            name: pais.translations.spa.common,  
            flag: pais.flags.svg, 
            capital: pais.capital, 
            population: pais.population, 
            region: pais.region, 
            latlng: pais.latlng
        }
    ]);
    

    // Sacar el array dentro del array para mejor uso: Solo queda el array y el objeto
    const dataFlat = dataMap.flat();

    // Input del buscador
    countryInput.addEventListener('input', async e =>{
        countryResult.innerHTML = '<span class="loader"></span>';
        
        // Input value
        const input = countryInput.value;


        // Filtrado de los países: 
        //   - El normalize("NFD") destaca los acentos, luego el replace(/[\u0300-\u036f]/g, '') los saca de la ecuación, por lo tanto, se puede hacer la búsqueda sin que importen los acentos. Se coloca en ambos lados para que la búsqueda coincida.
        //   - El toLowerCase()) convierte todo en minúsculas. Se coloca en ambos lados para que la búsqueda coincida.
        const dataFilter = dataFlat.filter((paises) => paises.name.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase().indexOf(`${input}`.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase()) >= 0);
        
        // Cantidad de arrays que tiene el data
        const dataLength = dataFilter.length;
       
        // img del Mapamundi limpia de búsquedas previas
        imgContainer.innerHTML = '';

        // Esta función es para filtrar un único país y ver sus detalles. En la función obtenemos los datos del país buscado, llamamos a la API del clima y sacamos los datos relevantes del clima; modificamos el HTML para que muestre el país que deseamos, y finalmente modificamos el Mapamundi
        const details = async (filtro) => {
            // Se sacan del array los datos relevantes para la búsqueda
            // "Filtro" será usado para determinar si será filtrado por name o por flag
            const {name: name, flag: flag, capital: capital, population: population, region, latlng: latlng} = filtro[0];

            // API del clima
            const countryWeather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&lang=es&APPID=e9222bc20cb788653791e5d8d64af49f`)).json();

            // Se saca el array relevante para el clima
            const weather = [countryWeather][0];

            const temp = weather.main.temp;
            const weatherIcon = weather.weather[0].icon;

            // La primera parte es para que la primera letra sea mayúscula, la segunda parte es para el resto de la información, en minúscula
            const weatherDescription = weather.weather[0].description.toUpperCase()[0] + weather.weather[0].description.slice(1);

            countryResult.innerHTML = `
                <div class="country">
                    <p class="countries country-name">${name}</p>
                    <p class="countries">&#128204; ${capital}</p>
                    <p class="countries">&#127760; ${region}</p>
                    <p class="countries">&#128106; ${population}</p>
                    <p class="countries">&#127777; ${temp}</p>
                    <div class="country-weather">
                        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png">
                        <p class="countries">${weatherDescription}</p>
                    </div>
                    <img src="${flag}" class="country-flag">
                </div>
            `;
            
            // img del Mapamundi
            imgContainer.innerHTML = `
            <img src="paisesimg/${name}.svg" class="country-img">
            `;
        };


        // Dependiendo de la cantidad de países, se deben mostrar ciertos datos
        if (dataLength > 10) {
            // Para limpiar la búsqueda. Indicará que debe ser más específico en su búsqueda
            countrySpan.style.display = 'flex';
            countryResult.innerHTML = '';
                    

        } else if (dataLength > 1 && dataLength <= 10) {
            // Para limpiar la búsqueda
            countrySpan.style.display = 'none';
            countryResult.innerHTML = '';

            // Para cada país
            dataFilter.forEach(pais => {
                const countryName = pais.name;
                const countryFlag = pais.flag;

                // Crear el país y mapa
                const country = document.createElement('div');
                country.classList.add('country');
                const mapamundi = document.createElement('div');

                country.innerHTML = `
                    <button class="btn-country">
                        <p class="click">${countryName}</p>
                        <img src="${countryFlag}" class="country-flag">
                    </button>
                `;
                countryResult.append(country);

                // img del Mapamundi
                mapamundi.innerHTML = `
                <img src="paisesimg/${countryName}.svg" class="country-img">
                `;
                imgContainer.append(mapamundi);
            });
            

        } else if (dataLength === 1) {
            // Para limpiar la búsqueda
            countrySpan.style.display = 'none';
            imgContainer.innerHTML = '';

            // Si hay un solo país que coincida, llamamos a la función details para ver los detalles del país seleccionado
            details(dataFilter);
        };

        
        // Alerta en caso de que country no existe
        if (Number(dataLength) === 0) {
            countrySpan.style.display = 'none';
            countryDont.style.display = 'flex';
            countryResult.innerHTML = '';
        } else {
            countryDont.style.display = 'none';
        };


        // Esto es para que puedas seleccionar cualquier país simplemente dándole click al país deseado. Funciona principalmente para países con nombres similares
        // Primero he creado una constante booleana para determinar si los resultados de búsqueda dan algún resultado
        const countryBoolean = countryResult.hasChildNodes();

        // En caso de dar resultado true, lo único que falta es determinar qué ocurre cuando sí hay hijos.
        if (countryBoolean === true) {
            
            // Si efectivamente tenía hijos, entonces se activa el listener del click.
            countryResult.addEventListener('click', async e => {

                // Creo una función asíncrona para dar inicio al buscador de banderas. Es similar al buscador por nombre, pero se evitan la duplicación de nombres
                const flagFunction = async (bandera) => {
                    
                    // Aquí buscarán las letras 21 y 22 del link de las banderas (más adelante podrá verse de dónde sale el link)
                    // El motivo de usar esas justas letras es que nos dan el código del país del que proviene dicha imagen
                    const countryFlag = bandera[20] + bandera[21];

                    // Se crea un nuevo filter usando el dataFlat y como variable las banderas
                    const dataFilterFlag = dataFlat.filter((banderas) => banderas.flag.indexOf(`${countryFlag}`) >= 2);

                    // Para limpiar la búsqueda
                    countryResult.innerHTML = '<span class="loader"></span>';
                    countrySpan.style.display = 'none';
                    imgContainer.innerHTML = '';

                    // Dentro la función flagFunction se coloca la función para ver los detalles del país buscado
                    details(dataFilterFlag);
                };

                if (e.target.classList.contains('btn-country')) {
                    // En el e.target revisamos si es del botón, en cuyo caso, buscamos su hijo, la imagen, y de ahí su fuente.
                    // La fuente es el link que nos proporciona la página, con ello obtenemos el código de país
                    const countryTarget = e.target.children[1].src;

                    // Con esta fuente llamamos a la función de filtrado
                    flagFunction(countryTarget);
                    
                } else if (e.target.classList.contains('country-flag')) {
                    // En esta ocasión, buscamos si toca directamente a la bandera y obtenemos su fuente
                    const countryTarget = e.target.src;
                    flagFunction(countryTarget);

                } else if (e.target.classList.contains('click')) {
                    // Si toca el name, nos subimos al padre y desde él buscamos la img
                    const countryTarget = e.target.parentElement.children[1].src;
                    flagFunction(countryTarget);
                };
            });
        };
    });
});
