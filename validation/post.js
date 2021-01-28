const Validator = require('validator');
const isEmpty = require('./is-empaty');

module.exports = function validatePostInput(data) {
    let errors = {}
    data.text = !isEmpty(data.text) ? data.text : "";

    if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
        errors.text = 'Post must me contain 10 to 300 chatracter'
    }
    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text field is required'
    }
    return {
        error,
        isValid:isEmpty(errors)
    }
}