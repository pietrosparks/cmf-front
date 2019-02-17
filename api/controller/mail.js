const axios = require('axios')
const moment = require('moment')
const { response, responseError } = require('../utils')
const { FETCH_MAIL_URL } = require('../dbconfig/secrets')

const taxiServiceFetcher = taxiService => {
  let receiptProvider =
    taxiService === 'uber'
      ? 'uber.nigeria@uber.com'
      : 'receipts-nigeria@taxify.eu'

  if (!receiptProvider) return new Error('No taxi service provided')
}

const datePeriodFetcher = date => {
  let specifiedDate
  if (date === 'past-week') {
    specifiedDate = moment()
      .startOf('week')
      .format('YYYY/MM/DD')
  } else if (date === 'past-month') {
    specifiedDate = moment()
      .startOf('month')
      .format('YYYY/MM/DD')
  } else if (date === 'past-year') {
    specifiedDate = moment()
      .startOf('year')
      .format('YYYY/MM/DD')
  } else return new Error('No date specified')

  return specifiedDate
}

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
    const { taxiService, datePeriod } = req.query

    let receiptProvider = taxiServiceFetcher(taxiService)
    let date = datePeriodFetcher(datePeriod)

    const positive = 0
    const negative = 0
    const options = {
      headers: {
        Authorization: `Bearer ${req.accessToken}`
      }
    }

    try {
      const listedMessages = (await axios.get(`${FETCH_MAIL_URL}`, {
        ...options,
        params: {
          q: `from: ${receiptProvider} after: ${date}`
        }
      })).data.messages
      console.log(listedMessages, 'listed messages')
      if (listedMessages) {
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
      } else {
        return response(
          200,
          'Success',
          res,
          'No Fares found in this time period',
          { positive: 0, negative: 0 }
        )
      }
    } catch (err) {
      console.log(err, 'error')
      return responseError(err, res, 'Error while crunching your fares')
    }
  }
}

module.exports = new mailController()
