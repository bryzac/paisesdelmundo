// countryInput.addEventListener('input', async e => {

//     countryResult.innerHTML = '<span class="loader"></span>';

//     const input = countryInput.value;

//     const data = await (await fetch( `https://restcountries.com/v3.1/name/${input}`)).json();


//     // Filtro para 10 matches
//     const moreThan = data.length;
//     if (moreThan > 10) {
//         countrySpan.classList.remove('country-span');
//         countrySpan.classList.add('country-span-visible');


//     } else if (moreThan > 1 && moreThan < 11) {
//         // Para limpiar búsqueda
//         countrySpan.classList.remove('country-span-visible');
//         countrySpan.classList.add('country-span');
//         countryResult.innerHTML = '';

//         // Para cada pais
//         data.forEach(pais => {
//             const countryName = pais.name.common;
//             const countryFlag = pais.flags.svg;
            
//             const country = document.createElement('div');
//             country.classList.add('country');
//             const mapamundi = document.createElement('div');

//             country.innerHTML =
//                 `
//                 <p class="countries">${countryName}</p>
//                 <img src="${countryFlag}" class="country-flag">
//             `;
//             countryResult.append(country);

//             // img del Mapamundi
//             mapamundi.innerHTML = `
//             <img src="paisesimg/${countryName}.svg" class="country-img">`
//             imgContainer.append(mapamundi);
//     });

//     } else if (moreThan === 1) {
//         // Para limpiar búsqueda
//         countrySpan.classList.remove('country-span-visible');
//         countrySpan.classList.add('country-span');
//         countryResult.innerHTML = '';
//         imgContainer.innerHTML = '';

//         const {name: name, flags: flags, capital: capital, population: population, region: region, latlng: latlng } = data[0];

//         console.log(latlng);
//         console.log(latlng[0]);
//         console.log(latlng[1]);

//         const countryWeather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&lang=es&APPID=e9222bc20cb788653791e5d8d64af49f`)).json();


//         const weather = [countryWeather][0];

//         const temp = weather.main.temp;
//         const weatherIcon = weather.weather[0].icon;
//         const weatherDescription = weather.weather[0].description;

        

//         countryResult.innerHTML = `
//                 <div class="country">
//                 <p class="countries country-name">${name.common}</p>
//                 <p class="countries">&#128204; ${capital}</p>
//                 <p class="countries">&#127760; ${region}</p>
//                 <p class="countries">&#128106; ${population}</p>
//                 <p class="countries">&#127777; ${temp} Cº</p>
//                 <div class="country-weather"><img src="http://openweathermap.org/img/wn/${weatherIcon}.png"><p class="countries"> ${weatherDescription}</p></div>
//                 <img src="${flags.svg}" class="country-flag">
//                 </div>`;

//         // img del Mapamundi
//         imgContainer.innerHTML = `
//         <img src="paisesimg/${name.common}.svg" class="country-img">`;

//     } 

//     // Alerta en caso de country no existente
//     const dataStatus = Number(data.status);
//     if (dataStatus === 404) {
//         countrySpan.classList.remove('country-span-visible');
//     countrySpan.classList.add('country-span');
//         countryDont.classList.remove('country-dont');
//         countryDont.classList.add('country-dont-visible');
//     } else {
//         countryDont.classList.remove('country-dont-visible');
//         countryDont.classList.add('country-dont');
//     }


// })