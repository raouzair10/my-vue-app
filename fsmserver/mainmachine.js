const { createMachine, assign } = require("xstate");
const fetchMachine = require('./fetchmachine');

const dbUrl = 'http://localhost:5000/api'

const mainMachine = createMachine({
    id: "main",
    initial: "login",
    context: {},
    states: {
        login: {
            on: {
                GO_TO_SIGNUP: {
                    target: "signup",
                },
                LOGIN: {
                    actions: [
                        assign({
                            data: ({event}) => event.value
                        }),
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/users/login`,
                                'post',
                                context.data,
                                'SUCCESS',
                                'FAILURE'
                            )
                        }
                    ]
                },
                SUCCESS: {
                    actions: [
                        assign({
                            response: ({event}) => event.context.response
                        }),
                        'sendResponse'
                    ],
                    target: 'dashboard'
                },
                FAILURE: {
                    target: 'login',
                    actions: [
                        () => {console.log('LOGIN ERROR')},
                        assign({
                            response: null
                        }),
                        'sendResponse'
                    ]
                }
            }
        },
        signup: {
            on: {
                GO_TO_LOGIN: {
                    target: "login",
                },
                SIGNUP: {
                    actions: [
                        assign({
                            data: ({event}) => event.value
                        }),
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/users/signup`,
                                'post',
                                context.data,
                                'SUCCESS',
                                'FAILURE'
                            )
                        }
                    ]
                },
                SUCCESS: {
                    actions: [
                        assign({
                            response: ({event}) => event.context.response
                        }),
                        'sendResponse'
                    ],
                    target: 'dashboard'
                },
                FAILURE: {
                    target: 'signup',
                    actions: [
                        () => {console.log('SIGNUP ERROR')},
                        assign({
                            response: null
                        }),
                        'sendResponse'
                    ]
                }
            }
        },
        dashboard: {
            on: {
                LOGOUT: {
                    target: 'login',
                    actions: 'sendResponse'
                },
                FETCH_TODOS: {
                    actions: [
                        assign({
                            data: ({event}) => event.value
                        }),
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/todos/${context.data.userId}`,
                                'get',
                                {},
                                'SUCCESS',
                                'FAILURE'
                            )
                        }
                    ]
                },
                ADD_TODO: {
                    actions: [
                        assign({
                            data: ({event}) => event.value.newTodo
                        }),
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/todos`,
                                'post',
                                context.data,
                                'SUCCESS',
                                'FAILURE'
                            )
                        }
                    ]
                },
                UPDATE_TODO: {
                    actions: [
                        assign({
                            data: ({event}) => event.value.todo
                        }),
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/todos/${context.data._id}`,
                                'put',
                                context.data,
                                'SUCCESS',
                                'FAILURE'
                            )
                        }
                    ]
                },
                SUCCESS: {
                    actions: [
                        assign({
                            response: ({event}) => event.context.response
                        }),
                        'sendResponse'
                    ],
                },
                FAILURE: {
                    actions: [
                        () => {console.log('TODO ERROR')},
                        assign({
                            response: null
                        }),
                        'sendResponse'
                    ]
                }
            }
        }
    }
}, {
    actions: {
        spawnFetchMachine: assign({
            fetchMachineRef: ({spawn}) => spawn(fetchMachine),
        })
    }
});

const trigger = (context, url, request, data, success, failure) => {
    context.fetchMachineRef.send({
        type: 'SEND_REQ',
        value: {url, request, data, success, failure}
    })
}

module.exports = mainMachine;