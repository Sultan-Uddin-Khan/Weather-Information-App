const storage = {
    city: '',
    country: '',
    saveItem() {
      localStorage.setItem('BD-city', this.city)
      localStorage.setItem('BD-country', this.country)
    },
    getItem() {
      const city = localStorage.getItem('BD-city')
      const country = localStorage.getItem('BD-country')
      return {
        city,
        country,
      }
    },
  }

  export default storage;
  