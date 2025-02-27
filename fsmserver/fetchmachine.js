const { assign, sendParent, setup, fromPromise } = require("xstate");
const axios = require("axios");

const fetchMachine = setup({    
    actions: {
        receiveValues: assign({
            url: ({event}) => event.value.url,
            request: ({event}) => event.value.request,
            data: ({event}) => event.value.data,
            success: ({event}) => event.value.success,
            failure: ({event}) => event.value.failure
        })
    },
    actors: {
        sendRequest: fromPromise(async (context) => {
            try {
                const res = await axios({
                    method: context.input.request,
                    url: context.input.url,
                    data: context.input.data
                })
                return res.data
            } catch (error) {
                throw error;
            }
        })
      }
  }).createMachine({
    id: "fetchmachine",
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
                id: 'fetchRequest',
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

module.exports = fetchMachine;