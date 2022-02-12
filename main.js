window.addEventListener("load", ()=>{

        //Defining variables

        const selector = document.querySelector("#locationInput");
        const locationLabel = document.querySelector("#loc")
        const temp = document.querySelector("#temp")
        const skyCondition = document.querySelector("#condition")
        const humidity = document.querySelector("#hum")
        const icon = document.querySelector("#icon")
        const wind = document.querySelector("#windKm")
        const locSelector = document.querySelector("#locationSelector")       
        let isYourLocationUsed = true;

        //Empty selector field when clicked
        selector.addEventListener('click', (e) => {
                e.target.value = ''
                isYourLocationUsed = false
        })
        
        let getJSON = function (url, callback) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'json';
                xhr.onload = function () {
                        let status = xhr.status;
                        if (status === 200) {
                                callback(null, xhr.response);
                        } else {
                                callback(status, xhr.response);
                        }
                };
                xhr.send();
        };
        //Background image API
        selector.addEventListener("change", () => {
                getJSON(`https://api.teleport.org/api/urban_areas/slug:${selector.value.toLowerCase()}/images/`,
                        function (err, data) {
                                if (err !== null) {
                                        console.log("Not there yet");
                                        document.querySelector('#resultsBox').style.backgroundImage = ``
                                } else {
                                        document.querySelector('#resultsBox').style.backgroundImage = `url(${data.photos[0].image.web})`
                                }
                        });
        });
        //Main Weather API
        const processData = async (location) => {
                const weatherData = await fetch(`http://api.weatherapi.com/v1/current.json?key=b8c735e118414f95ba2103607210612&q=${location}&aqi=no`);
                const result = await weatherData.json();
                selector.addEventListener("change", () => {
                        processData(selector.value)
                })
        
                if (isYourLocationUsed === true) {
                        locationLabel.innerHTML = result.location.name;
                } else {
                        locationLabel.innerHTML = selector.value
                }
                //Filling Card with Data
                temp.innerHTML = result.current.temp_c + " °C"
                skyCondition.innerHTML = result.current.condition.text
                icon.src = result.current.condition.icon
                wind.innerHTML = "Wind: " + result.current.wind_kph + " km/h"
                humidity.innerHTML = "Humidity: " + result.current.humidity + " %"
                //Changing card background depending on daytime
                if (result.current.is_day === 0) {
                        document.querySelector('#results').style.background = `rgb(190,221,227,0.7);`
                        document.querySelector('#results').style.backgroundImage = `linear-gradient(-90deg, rgba(190,221,227,0.5) 0%, rgba(129,163,215,0.5) 36%, rgba(133,137,143,1) 100%)`
                } else {
                        document.querySelector('#results').style.background = `rgba(255,254,158,0.7);`
                        document.querySelector('#results').style.backgroundImage = `linear-gradient(-90deg, rgba(0,130,170,0.3),rgba(255,170,110,1))`
                }
        }
        //Capitals API
        const getCapitals = async () => {
                const capitalApiUrl = "https://countriesnow.space/api/v0.1/countries/capital"
        
                const response = await fetch(capitalApiUrl)
                const data = await response.json();
                const capitals = data.data.map(x => x.capital).sort();
                capitals.push(capitals.splice(6, 1)[0])
                capitals.forEach(function (item) {
                        let option = document.createElement('option');
                        option.value = item.trim();
                        locSelector.appendChild(option);
                });
        }
        getCapitals()
        //Geolocation
        function getCoordinates() {
                function getLocation() {
                        if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(showPosition);
                        }
                }
        
                function showPosition(position) {
                        yourLocation = position.coords.latitude.toFixed(1) + "," + position.coords.longitude.toFixed(1);
                        processData(yourLocation)
                        isYourLocationUsed = true;
                        document.querySelector('#resultsBox').style.backgroundImage = ``
                        selector.value="Your location"
                }
                getLocation()
        }
        document.querySelector("button").addEventListener("click", getCoordinates)
        
        getCoordinates()
})

