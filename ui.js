import storage from './storage.js'
import weatherData from './weatherData.js'

const UI = {
    loadSelectors() {
      const cityElm = document.querySelector('#city')
      const cityInfoElm = document.querySelector('#w-city')
      const iconElm = document.querySelector('#w-icon')
      const temperatureElm = document.querySelector('#w-temp')
      const pressureElm = document.querySelector('#w-pressure')
      const humidityElm = document.querySelector('#w-humidity')
      const feelElm = document.querySelector('#w-feel')
      const formElm = document.querySelector('#form')
      const countryElm = document.querySelector('#country')
      const messageElm = document.querySelector('#messageWrapper')
      return {
        cityInfoElm,
        cityElm,
        countryElm,
        iconElm,
        temperatureElm,
        pressureElm,
        feelElm,
        humidityElm,
        formElm,
        messageElm,
      }
    },
    hideMessage() {
      const messageElm = document.querySelector('#message')
      setTimeout(() => {
        messageElm.remove()
      }, 2000)
    },
    showMessage(msg) {
      const { messageElm } = this.loadSelectors()
      const elm = `<div class='alert alert-danger' id='message'>${msg}</div>`
      messageElm.insertAdjacentHTML('afterbegin', elm)
      this.hideMessage()
    },
    validateInput(country, city) {
      //validation check
      if (country === '' || city === '') {
        this.showMessage('please provide necessary information')
        return true
      } else {
        return false
      }
    },
    getInputValues() {
      const { countryElm, cityElm } = this.loadSelectors()
      //get the result
      //if result is false (not right) you should stop here
      const isInValid = this.validateInput(countryElm.value, cityElm.value)
      if (isInValid) return
      return {
        country: countryElm.value,
        city: cityElm.value,
      }
    },
    resetInputs() {
      const { cityElm, countryElm } = this.loadSelectors()
      cityElm.value = ''
      countryElm.value = ''
    },
    async handleRemoteData() {
      const data = await weatherData.getWeather()
      return data
    },
    getIcon(iconCode) {
      return `https://openweathermap.org/img/w/${iconCode}.png`
    },
    populateUI(data) {
      const {
        cityInfoElm,
        temperatureElm,
        pressureElm,
        humidityElm,
        feelElm,
        iconElm,
      } = this.loadSelectors()
  
      const {
        name,
        main: { temp, pressure, humidity },
        weather,
      } = data
  
      cityInfoElm.textContent = name
      temperatureElm.textContent = `Temperature: ${temp}°C`
      pressureElm.textContent = `Pressure: ${pressure}Kpa`
      humidityElm.textContent = `Humidity ${humidity}`
      feelElm.textContent = weather[0].description
      iconElm.setAttribute('src', this.getIcon(weather[0].icon))
    },
    setDataToStorage(city, country) {
      storage.city = city
      storage.country = country
    },
    init() {
      const { formElm } = this.loadSelectors()
      formElm.addEventListener('submit', async (evt) => {
        evt.preventDefault()
        //get input values
        const { country, city } = this.getInputValues()
        //setting data to temp data layer
        weatherData.city = city
        weatherData.country = country
        //setting data into localStorage object
        this.setDataToStorage(city, country)
        //saving to storage
        storage.saveItem()
        //resetInput
        this.resetInputs()
        //send data to API server
        const data = await this.handleRemoteData()
        //populate UI
        this.populateUI(data)
      })
  
      window.addEventListener('DOMContentLoaded', async () => {
        let { city, country } = storage.getItem()
        if (!city || !country) {
          city = 'Gazipur'
          country = 'BD'
        }
        weatherData.city = city
        weatherData.country = country
        //send data to API server
        const data = await this.handleRemoteData()
        //populate UI
        this.populateUI(data)
      })
    },
  }
  
 export default UI;