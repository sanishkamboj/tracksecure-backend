/* eslint-disable no-useless-escape */
module.exports = {
  validateString: (string) => {
    if (string === null || string === undefined) {
      return false
    }
    const stringRegex = /^[^\s]+(\s+[^\s]+)*$/gm
    return stringRegex.test(string)
  },
  validateEmail: (email) => {
    if (email === null || email === undefined) {
      return false
    }
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm
    return emailRegex.test(email)
  },
  validateNumber: (number) => {
    const numberRegex = /^(?<=^| )\d+(\.\d+)?(?=$| )$/gm
    if (number === null || number === undefined) {
      return false
    }
    return numberRegex.test(number)
  }
}
