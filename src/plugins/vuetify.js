import "@mdi/font/css/materialdesignicons.css"
import Vue from "vue"
import Vuetify from "vuetify/lib"

Vue.use(Vuetify)

import colors from "vuetify/lib/util/colors"

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#003595",
                accent: "#cf102d",
                secondary: colors.blue.accent4,
            },
        },
    },
})
