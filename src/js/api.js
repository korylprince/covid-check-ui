/* global API_BASE */

const api = {
    async get_location(location_id) {
        const query = `
            query {
              location_by_pk(id: "${location_id}") {
                name
              }
            }
        `
        const response = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query}),
        })

        if (!response.ok) {
            throw response.json()
        }

        const body = await response.json()

        if (body.data != null) {
            return body.data.location_by_pk.name
        }

        throw body
    },

    async insert_checkin(location_id, user_id) {
        const query = `
        mutation {
          insert_checkin(objects: {location_id: "${location_id}", user_id: "${user_id}"}) {
            affected_rows
          }
        }
        `
        const response = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query}),
        })

        if (!response.ok) {
            throw response.json()
        }

        const body = await response.json()

        if (body.data != null) {
            return body.data.insert_checkin.affected_rows === 1
        }

        throw body
    },
}

export default api
