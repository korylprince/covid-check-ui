<template>
    <v-app>
        <v-app-bar color="primary" dark dense app>
            <v-toolbar-title>COVID-19 Check-in</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>{{location}}</v-toolbar-title>
        </v-app-bar>

        <v-main :class="{success: status==='success', error: status==='error'}">
            <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
                <v-layout justify-center>
                    <v-card width="100%" max-width="600px">
                        <v-card-title primary-title>
                            <div class="headline">Scan your Badge...</div>
                        </v-card-title>

                        <v-card-text>
                            <v-container style="margin-bottom: 5px">
                                <p>By scanning my badge, I certify I have not been recently exposed to anyone lab-confirmed to be COVID-19 positive, and do not have any of the symptoms of COVID-19 listed below (which would otherwise be abnormal for me):</p>
                                <ul>
                                    <li>Temperature greater than 100 °F</li>
                                    <li>Loss of taste or smell</li>
                                    <li>Sore throat</li>
                                    <li>New uncontrolled cough that causes difficulty breathing</li>
                                    <li>Shortness of breath</li>
                                    <li>Fatigue</li>
                                    <li>Chills</li>
                                    <li>Congestion or runny nose</li>
                                    <li>Shaking or exaggerated shivering</li>
                                    <li>Significant muscle pain or ache</li>
                                    <li>Diarrhea, vomiting, or abdominal pain</li>
                                    <li>New onset of severe headache, especially with a fever</li>
                                </ul>
                            </v-container>

                            <v-divider></v-divider>

                            <form novalidate @submit.prevent="submit(location_id, user_id)" style="margin-top: 10px">
                                <v-text-field
                                    ref="input"
                                    label="Employee ID"
                                    v-model="user_id"
                                    >
                                </v-text-field>
                            </form>
                        </v-card-text>
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
            location: "",
            user_id: "",
            feedback_active: false,
            feedback: "",
            status: "",
            timer: null,
        }
    },
    computed: {
        location_id() {
            const params = new URLSearchParams(window.location.search)
            return params.get("location_id")
        },
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
        async submit(location_id, user_id) {
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
    async created() {
        try {
            this.location = await api.get_location(this.location_id)
        } catch (err) {
            this.location = "Unknown Location"
            console.error("Location error:", err)
        }
    },
    mounted() {
        window.setTimeout(() => {
            this.$refs.input.focus()
        }, 1000)
        window.setInterval(() => {
            this.$refs.input.focus()
        }, 10000)
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
