const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        experimentalSessionAndOrigin: true,
        chromeWebSecurity: false,
        viewportWidth: 1280,
        viewportHeight: 800,
        setupNodeEvents(on, config) {
            on("task", {
                setResetPasswordUrl: (val) => {
                    return (rpurl = val);
                },

                getResetPasswordUrl: () => {
                    return rpurl;
                },
                setNewPassword: (val) => {
                    return (np = val);
                },
                getNewPassword: () => {
                    return np
                },
            })
        },
    },
});
