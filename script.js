const userTab= document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");

const  userContainer=document.querySelector(".weather-conatiner");
const grantAccessContainer=document.querySelector(".grant-location-container");
const  searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container"); 



// initial variables

let oldTab = userTab;
const API_KEY = "1a470564b70b20795433867f37fbd880";
oldTab.classList.add("current-tab");
getfromSessionStorage();


//kuch pending hai



function  switchTab(newTab){
    
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab= newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){

            //kya search form wala container invisble ,if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehel search wale tab pr tha ab your weather tab visible karna hain
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //ab main your weather tab me aagyaa hu, toh weather bhi display karana padegha, so lets
            //check local storage first for coordinates, if we have saved them there
            getfromSessionStorage();
        }
    }

}

userTab.addEventListener('click', () => {
     
    switchTab(userTab);
});

searchTab.addEventListener( 'click', () => {

    switchTab(searchTab);
});

//check if cordinates are already present in sesssion storage
function getfromSessionStorage(){
      const localCoordinates = sessionStorage.getItem("user-coordinates");

      if(!localCoordinates){
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
      }
      else{
        const coordinates= JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
      }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;

    //make grantacessconatiner invisible and show loader gif visible  on display

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API CALL

    try{
       const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
       );

       const data= await response.json();

       //loader gif ko hata do

       loadingScreen.classList.remove("active");

       //user info ko visible karva do

       userInfoContainer.classList.add("active");

       //rendering weather info on UI

       renderWeatherInfo(data);
    }
    catch(err){
            loadingScreen.classList.remove("active");
            alert("enter proper API urll"); 
    }
}

function renderWeatherInfo(weatherInfo){
    //first we have to fetch elemnts from html file

    const cityName= document.querySelector("[data-cityName]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed= document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness= document.querySelector("[data-cloudiness]");

    //fectch values from weatherInfo
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText =  weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =  `${weatherInfo?.clouds?.all}%`;
}    

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        alert("Geolation facility is not available at your place sorryy...");
    }
}
function showPosition(position) {
    
     const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
     }

     sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton= document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);

//getting info of weather when clicked on search weather tab (search input field)

const searchInput =document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
       e.preventDefault();
       let cityName = searchInput.value;

       if(cityName === "")
         return;
       else
          fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
      const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data= await response.json();

      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    catch(error){
        alert("error 404");
    }
}

/////////////////////////////////////////////////////////////////////////////////////////

