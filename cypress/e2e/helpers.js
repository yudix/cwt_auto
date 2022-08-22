const generator = require("generate-password");

export function validateErrorMessage(message, cssBy = '#newPass-help-block') {
    cy.get(cssBy)
        .should('be.visible')
        .and('have.css', 'color', 'rgb(255, 12, 62)')
        .and('contain.text', message)
}

export function insertANewPassword(password) {
    cy.task('getResetPasswordUrl').then((url) => {
        cy.visit(url)
    })
    cy.get('#newPassword')
        .type(password)
        .get('#submit-button')
        .click()
}

export function insertNonePolicyPassword(password, cssBy) {
    insertANewPassword(password);
    let message = 'Your password does not meet the password policy';
    if (cssBy)
        validateErrorMessage(message, cssBy);
    else
        validateErrorMessage(message);
}

export function forgotPassword() {
    const loginPage = 'https://travel.stage-mycwt.com/login'
    const username = 'plata8@yopmail.com'
    cy.visit(loginPage)
    cy.intercept('**/config.json').as('waitForConfig')
    cy.wait('@waitForConfig', {timeout: 15000})
        .get('#forgot-password-button')//click on forgot password
        .click()
        .get('#usernameField')
        .type(username) //insert the username
        .get('#submit-button')
        .click()
}

export function checkEmail() {
    const yopmail = 'https://yopmail.com/en/'
    const username = 'plata8@yopmail.com'
    cy.visit(yopmail)
    cy.get('.ycptinput')
        .type(username)
        .get('[title="Check Inbox @yopmail.com"]')
        .click()

    const iframe = cy.get('#ifmail')
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(cy.wrap)

    iframe.contains('RESET PASSWORD')
        .invoke('attr', 'href')
        .then((href) => {
            cy.task('setResetPasswordUrl', href)
        })
}


export function generatePasswordAccordingToPolicy() {
    let options = {
        length: 8,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true
    };
    let password = generator.generate(options)
    while (!/(?<chars>[A-Za-z]+)/gm.exec(password) ||
    !/(?<digits>[\d]+)/gm.exec(password) ||
    !/(?<symbols>[!@#$%^&*]+)/gm.exec(password)) {        // password = '^;uo..3^' nit passing some how - shorten the symbols to [!@#$%^&*]
        // !/(?<symbols>[!@#$%^&*()_+{}|}{\[\]\\.\":=,-~?><]+)/gm.exec(password)) {
        // console.log(`isMatchPolicy? ${password} does not match policy`)
        password = generator.generate(options)
    }
    // console.log(`isMatchPolicy? ${password} matches policy`)
    return password
}

export function writePassToConsole(password) {
    cy.writeFile(password_file_path, password)
    console.log(`++++++++++++++++++++++++++++++`)
    console.log(`The new valid password is ${password} [saved also under ${password_file_path} file]`)
    console.log(`++++++++++++++++++++++++++++++`)
}

export const password_file_path = 'currentPassword.txt';
export const backToLoginButton = '#login-url-continue';
export const passwordChanged = '#password-changed-title';
export const aboveThePasswordCss = 'p#serverError';
export const usernameInput = '#username-input';
export const passwordInput = '#password-input';
export const submitButton = '#submit-button';
export const loginPage = 'https://travel.stage-mycwt.com/login'
export const username = 'plata8@yopmail.com'
export const configPath = '**/config.json';
export const userPath = '**/active-users/api/v1/user';
export const errorMessage = 'Your password does not meet the password policy'