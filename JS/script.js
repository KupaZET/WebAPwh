const form = document.querySelector(".Header form");
const input = document.querySelector(".Header input");
const smthgwrong = document.querySelector(".Header .smthgwrong");
const cityWh = document.querySelector(".SectionFindCity .FoundCity");
const favCity = document.querySelector(".SectionFavCities .FAVcities");
const apiKey = "87ff325902fe3a9aad4031007681ba7a";
const listItems = favCity.querySelectorAll(".SectionFavCities.city");

writeFav = function () {
  favCity.textContent = "";
  if (localStorage.length > 0) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      const inputVal = localStorage.getItem(key);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&lang=cz`;
      fetch(url)
        .then(response => response.json()).then(data => {
          const { main, name, sys, weather } = data;
          const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]
            }@2x.png`;
          const li = document.createElement("li");
          li.classList.add("city");
          const markup = `
            <h2 class="city-name" data-name="${name},${sys.country}">
              <span>${name}</span>
              <sup>${sys.country}</sup>
              <span><i onclick="FavIcon(this, '${name}')" class="star_Rating fa fa-star"></i></span>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
              <img class="city-icon" src="${icon}" alt="${weather[0]["description"]
            }">
              <figcaption>${weather[0]["description"]}</figcaption>
            </figure>
          `;
          li.innerHTML = markup;
          favCity.appendChild(li);
        })
        .catch(() => {
          smthgwrong.textContent = "Při výpisu oblíbených měst se něco pokazilo";
        });

      smthgwrong.textContent = "";
      input.focus();
    }
  } else {
    favCity.textContent = "Zatím zde nic není.";
  }
}
writeFav();

//GET WH FROM INPUT
form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //Get Data
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric&lang=cz`;

  fetch(url)
    .then(response => response.json()).then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]
        }@2x.png`;

      var star = "star_Rating fa fa-star-o";
      if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const storageValue = localStorage.getItem(key);
          if (storageValue.localeCompare(name) == 0) {
            star = "star_Rating fa fa-star";
            break;
          }
        }
      }

      //Write data
      const markup = `
        <h2 class = "city-name" data-name = "${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
          <i onclick="FavIcon(this, '${name}')" class="${star}"></i>
        </h2>
        <div class = "city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0]["description"]
        }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      cityWh.innerHTML = markup;

    })

    //Catch if smthing wrong
    .catch(() => {
      smthgwrong.textContent = "Zadejte prosím existující město";
    });

  smthgwrong.textContent = "";
  form.reset();
  input.focus();
});

//ADD or Delete from FAVCities
function FavIcon(x, name) {

  if (x.classList.contains("fa-star-o")) {
    x.classList.remove("fa-star-o");
    x.classList.add("fa-star");

    if (localStorage.length > 0) {
      var i = Number(localStorage.length);
      if(localStorage.getItem(i) != null){
        while(localStorage.getItem(i) != null){
          i++;
        }
      }
      localStorage.setItem(i, name);
    }
    else {
      localStorage.setItem(0, name);
    }
    writeFav();
  }

  else {
    x.classList.remove("fa-star");
    x.classList.add("fa-star-o");

    for (let i = 0; i <= localStorage.length; i++) {
      const key = localStorage.key(i);
      var storageValue = localStorage.getItem(key);

      if (storageValue.localeCompare(name) == 0) {
        localStorage.removeItem(key);
        break;
      }
    }
    writeFav();
  }
}

//Get WH in ACTUAL Location
function LocationWh(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(writeLocation, showError);
  }else{
    smthgwrong.textContent = "Vyhledávání podle polohy není v tomto prohlížeči podporováno"
  }
}

function writeLocation(position){
  const lan = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lan}&lon=${lon}&appid=${apiKey}&units=metric&lang=cz`;

  fetch(url)
    .then(response => response.json()).then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]
        }@2x.png`;

      var star = "star_Rating fa fa-star-o";
      if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const storageValue = localStorage.getItem(key);
          if (storageValue.localeCompare(name) == 0) {
            star = "star_Rating fa fa-star";
            break;
          }
        }
      }
      //Write data
      const markup = `
        <h2 class = "city-name" data-name = "${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
          <i onclick="FavIcon(this, '${name}')" class="${star}"></i>
        </h2>
        <div class = "city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0]["description"]
        }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      cityWh.innerHTML = markup;
    })

    //Catch if smthing wrong
    .catch(() => {
      smthgwrong.textContent = "Při výpisu počasí v lokaci se něco pokazilo";
    });

  smthgwrong.textContent = "";
  form.reset();
  input.focus();
}

//IF smthing wrong with GET LOCATION
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      smthgwrong.textContent = "Pro zobrazení počasí v aktuální oblasti prosím povolte přítup k poloze."
      break;
    case error.POSITION_UNAVAILABLE:
      smthgwrong.textContent = "Nebylo možné identifikovat polohu."
      break;
    case error.TIMEOUT:
      smthgwrong.textContent = "Příkaz pro získaní polohy vypršel, zkuste to prosím znova."
      break;
    case error.UNKNOWN_ERROR:
      smthgwrong.textContent = "Během procesu došlo k neznámé chybě."
      break;
  }
}
