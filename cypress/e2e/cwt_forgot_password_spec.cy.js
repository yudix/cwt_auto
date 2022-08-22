const generator = require('generate-password');
const {
    forgotPassword,
    checkEmail,
    validateErrorMessage,
    insertNonePolicyPassword,
    insertANewPassword,
    generatePasswordAccordingToPolicy,
    writePassToConsole,
    aboveThePasswordCss,
    userPath,
    configPath,
    loginPage,
    usernameInput,
    username,
    passwordInput,
    submitButton,
    backToLoginButton,
    errorMessage,
    passwordChanged,
} = require("./helpers");

describe('cwt forgot password on login page test', () => {

    it('forgot password', () => {
        forgotPassword();
    })

    it('visit yopmail', () => {
        checkEmail();
    })

    context('create new password', () => {

        it('validate insert none', () => {
            cy.task('getResetPasswordUrl').then((url) => {
                cy.visit(url)
            })
            cy.get(submitButton)
                .click()
            validateErrorMessage(errorMessage);
        })

        it('validate less than 8 characters (with letters numbers and symbols)', () => {
            const password = generator.generate({
                length: 7,
                numbers: true,
                symbols: true,
                lowercase: true,
                uppercase: false
            })
            insertNonePolicyPassword(password);
        })

        it('validate only numbers', () => {
            const password = generator.generate({
                length: 8,
                numbers: true,
                symbols: false,
                lowercase: false,
                uppercase: false
            })
            insertNonePolicyPassword(password);
        })

        it('validate only characters', () => {
            const password = generator.generate({
                length: 8,
                numbers: false,
                symbols: false,
                lowercase: true,
                uppercase: false
            })
            insertNonePolicyPassword(password);
        })

        it('validate only Symbols', () => {
            const password = generator.generate({
                length: 8,
                numbers: false,
                symbols: true,
                lowercase: false,
                uppercase: false
            })
            insertNonePolicyPassword(password);
        })

        it('validate numbers and characters no symbols', () => {
            const password = generator.generate({
                length: 8,
                numbers: true,
                symbols: false,
                lowercase: true,
                uppercase: false
            })
            insertNonePolicyPassword(password);
        })

        it('validate characters and symbols no numbers', () => {
            const password = generator.generate({
                length: 8,
                numbers: false,
                symbols: true,
                lowercase: true,
                uppercase: false
            })
            insertNonePolicyPassword(password);
        })

        it('validate numbers and symbols no characters', () => {
            const password = generator.generate({
                length: 8,
                numbers: true,
                symbols: true,
                lowercase: false,
                uppercase: false
            })
            insertNonePolicyPassword(password);
        })

        it('validate current user username', () => {
            const password = 'plata8@yopmail.com'
            insertNonePolicyPassword(password, aboveThePasswordCss);
        })

        it('insert a valid password + print to the console (add it to local file?)', () => {
            const password = generatePasswordAccordingToPolicy()
            insertANewPassword(password)
            writePassToConsole(password);
            cy.task('setNewPassword', password)
            cy.get(passwordChanged)
                .should('have.text', 'Your password was successfully changed')
            cy.get(backToLoginButton).click()
        })

        it('login with the new password', () => {
            cy.intercept(configPath).as('waitForConfig')
            cy.intercept(userPath).as('user')
            cy.visit(loginPage)
            cy.wait('@waitForConfig', {timeout: 15000})
            cy.task('getNewPassword').then((password) => {
                cy.get(usernameInput)
                    .type(username) // insert username
                    .get(passwordInput)
                    .type(password)// insert password
                    .get(submitButton)
                    .click() // submit
                    .wait('@user', {timeout: 15000})
            })
        })
    })

    context('previews password', () => {

        it('forgot password', () => {
            forgotPassword();
        })

        it('visit yopmail', () => {
            checkEmail();
        })

        it('validate previews password', () => {
            cy.task('getNewPassword').then((password) => {
                insertNonePolicyPassword(password, aboveThePasswordCss);
            })
        })
    })
})