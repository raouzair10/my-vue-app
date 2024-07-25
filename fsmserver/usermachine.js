const { createMachine, assign, sendParent, setup, fromPromise } = require("xstate");
const axios = require("axios");

const userMachine = setup({    
    actions: {
        receiveValues: assign({
            url: ({event}) => event.value.url,
            request: ({event}) => event.value.request,
            username: ({event}) => event.value.username,
            password: ({event}) => event.value.password,
            success: ({event}) => event.value.success,
            failure: ({event}) => event.value.failure
        })
    },
    actors: {
        sendRequest: fromPromise(async (context) => {
            // console.log("User Machine Context = ", context.input)
            try {
                const res = await axios({
                    method: context.input.request,
                    url: context.input.url,
                    data: { username: context.input.username, password: context.input.password }
                })
                return res.data
            } catch (error) {
                // console.error("Error in sendRequest:", error)
                throw error;
            }
        })
      }
  }).createMachine({
    id: "usermachine",
    initial: "idle",
    context: {},
    states: {
        idle: {
            on: {
                SEND_REQ: {
                    actions: 'receiveValues',
                    target: 'handlingRequest',
                }
            }
        },
        handlingRequest: {
            invoke: {
                id: 'userRequest',
                src: 'sendRequest',
                input: ({ context }) => context,
                onDone: {
                    target: 'final',
                    actions: [
                        assign({
                            response: ({event}) => event.output
                        }),
                        sendParent(({context}) => ({
                            type: context.success,
                            context
                        }))
                    ]
                },
                onError: {
                    target: 'final',
                    actions: [
                        assign({
                            response: ({event}) => event.output
                        }),
                        sendParent(({context}) => ({
                            type: context.failure,
                            context
                        }))
                    ]
                }
            }
        },
        final: {
            type: "final",
        }
    }
}
);

module.exports = userMachine;