const axios = require('axios')
const moment = require('moment')
const { response, responseError } = require('../utils')
const { FETCH_MAIL_URL, GEO_USERNAME } = require('../dbconfig/secrets')

const taxiServiceFetcher = (taxiService, countryName = 'nigeria') => {
  let receiptProvider

  if (taxiService === 'uber') {
    receiptProvider = [`uber.${countryName.toLowerCase()}@uber.com`, '']
  } else if (taxiService === 'taxify') {
    receiptProvider = [
      `receipts-${countryName.toLowerCase()}@taxify.eu`,
      `receipts-${countryName.toLowerCase()}@bolt.eu`
    ]
  } else return new Error('No taxi service provided')

  return receiptProvider
}

const datePeriodFetcher = date => {
  let specifiedDate
  if (date === 'this-week') {
    specifiedDate = moment()
      .startOf('week')
      .format('YYYY/MM/DD')
  } else if (date === 'this-month') {
    specifiedDate = moment()
      .startOf('month')
      .format('YYYY/MM/DD')
  } else if (date === 'this-year') {
    specifiedDate = moment()
      .startOf('year')
      .format('YYYY/MM/DD')
  } else return new Error('No date specified')

  return specifiedDate
}

// To-do change the currency match to accomodate other currencies
const parseFunction = (messages, positive, negative, taxiService) => {
  if (taxiService === 'uber') {
    messages.forEach(m => {
      const expenseMatcher = /^Total:(\s*)₦([+-]?(\d*\.)?\d+)/i
      const refundMatcher = /^Refund:(\s*)₦([+-]?(\d*\.)?\d+)/i

      const expense = m.match(expenseMatcher)
      const refund = m.match(refundMatcher)

      if (expense) negative += Number(expense[2])
      if (refund) positive += Number(refund[2])
    })

    return {
      positive: parseInt(positive).format(2, 3, ',', '.'),
      negative: parseInt(negative).format(2, 3, ',', '.')
    }
  } else if (taxiService === 'taxify') {
    messages.forEach(m => {
      const cash = m.split(' ')[2].replace('₦', '')
      if (cash) negative += Number(cash)
    })

    return {
      positive: 0,
      negative: parseInt(negative).format(2, 3, ',', '.')
    }
  }
}

class mailController {
  async list(req, res) {
    const { taxiService, datePeriod, latitude, longitude } = req.query
    const positive = 0
    const negative = 0
    const options = {
      headers: {
        Authorization: `Bearer ${req.accessToken}`
      }
    }

    let storeCountryName
    let receiptProvider
    let date

    if (latitude && longitude) {
      try {
        const url = `http://api.geonames.org/countryCodeJSON?lat=${latitude}&lng=${longitude}&username=${GEO_USERNAME}`
        const { countryName } = (await axios.get(url)).data
        storeCountryName = countryName
      } catch (err) {
        console.log('an error occured >>>', err)
      }
    }

    receiptProvider = taxiServiceFetcher(taxiService, storeCountryName)
    date = datePeriodFetcher(datePeriod)

    try {
      const listedMessages = (await axios.get(`${FETCH_MAIL_URL}`, {
        ...options,
        params: {
          q: `from: (${receiptProvider[0]} OR ${
            receiptProvider[1]
          } ) after: ${date}`
        }
      })).data.messages

      if (!listedMessages) {
        const bill = { positive, negative: 0 }

        return response(
          200,
          'Success',
          res,
          'Taxi Fare Successfully Crunched',
          bill
        )
      }

      const openedMessages = await axios.all(
        listedMessages.map(m => {
          m.links = axios
            .get(`${FETCH_MAIL_URL}/${m.id}`, {
              ...options,
              params: {
                format: 'full'
              }
            })
            .then(resp => resp.data.snippet)
          return m.links
        })
      )

      const bill = parseFunction(
        openedMessages,
        positive,
        negative,
        taxiService
      )

      return response(
        200,
        'Success',
        res,
        'Taxi Fare Successfully Crunched',
        bill
      )
    } catch (err) {
      console.log(err, 'error')
      return responseError(err, res, 'Error while crunching your fares')
    }
  }
}

module.exports = new mailController()
