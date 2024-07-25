const express = require('express')
const cors = require('cors')
const mainMachine = require('./mainmachine')
const { createActor } = require('xstate')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const machineInstance = mainMachine.provide({
    actions: {
        sendResponse: ({ context }) => {
            if (context.response) {
                currentResponse.json(context.response);
            } else {
                currentResponse.json(context);
            }
        },
    },
})

const service = createActor(machineInstance).start()
service.subscribe((state) => {
    console.log("ON STATE: ", state.value)
})

let currentResponse = null

app.post('/', (req, res) => {
    const httpReq = req.body
    currentResponse = res

    service.send({ type: httpReq.transition, value: httpReq.data })
})

app.listen(port, () => console.log(`Server running on port ${port}`))
