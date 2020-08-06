<template>
    <v-app>
        <v-app-bar color="primary" dark dense app>
            <v-toolbar-title>COVID-19 Check-in</v-toolbar-title>
        </v-app-bar>

        <v-main :class="{success: status==='success', error: status==='error'}">
            <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
                <v-layout justify-center>
                    <v-card width="100%" max-width="480px">
                        <v-card-title primary-title>
                            <div class="headline">Scan your Badge...</div>
                        </v-card-title>

                        <form novalidate @submit.prevent="submit(user_id)">
                            <v-card-text>
                                <v-text-field
                                    ref="input"
                                    label="Employee ID"
                                    v-model="user_id"
                                    >
                                </v-text-field>
                            </v-card-text>
                        </form>
                    </v-card>
                </v-layout>
            </v-container>
        </v-main>


        <v-snackbar v-model="feedback_active">
            {{ feedback }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="white"
                    text
                    v-bind="attrs"
                    @click="feedback_active = false"
                    >Close</v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import api from "../js/api.js"
export default {
    name: "my-app",
    data() {
        return {
            user_id: "",
            feedback_active: false,
            feedback: "",
            status: "",
            timer: null,
        }
    },
    watch: {
        status(val) {
            if (val === "") {
                return
            }
            window.clearTimeout(this.timer)
            this.timer = window.setTimeout(() => {
                this.status = ""
            }, 2000)
        },
    },
    methods: {
        add_feedback(msg) {
            this.feedback = msg
            this.feedback_active = true
        },
        async submit(user_id) {
            const params = new URLSearchParams(window.location.search)
            const location_id = params.get("location_id")
            if (location_id == null) {
                this.add_feedback("Invalid location - please contact your system administrator")
                this.status = "error"
                this.user_id = ""
                this.$refs.input.focus()
                return
            }

            try {
                const status = await api.insert_checkin(location_id, user_id)
                if (!status) {
                    this.status = "error"
                    this.add_feedback("Unable to check in - please try again")
                    this.user_id = ""
                    this.$refs.input.focus()
                    return
                }

                this.status = "success"
                this.add_feedback("Check-in successful!")
                this.user_id = ""
                this.$refs.input.focus()
            } catch (err) {
                console.error("Error when submitting:", err)
                this.status = "error"
                this.add_feedback("Unable to check in - please try again")
                this.user_id = ""
                this.$refs.input.focus()
            }
        },
    },
    mounted() {
        this.$refs.input.focus()
    },
}
</script>

<style lang="sass" scoped>
.v-main
    display: flex
    align-items: center
    background-color: #efefef
    transition: background-color 0.5s ease
    &.error
        background-color: #e57373 !important
.toolbar-title
    color: inherit
    cursor: pointer
    text-decoration: none

    &:hover
        font-weight: bold
</style>
