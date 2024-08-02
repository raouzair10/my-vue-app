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
                    actions: 'sendResponse',
                    target: "signup"
                },
                LOGIN: {
                    actions: [
                        'getData',
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
                        'sendResponse',
                        () => {
                            console.log('ACTION: LOGGING IN')
                        }
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
                    actions: 'sendResponse',
                    target: "login"
                },
                SIGNUP: {
                    actions: [
                        'getData',
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
                        'sendResponse',
                        () => {
                            console.log('ACTION: SIGINING UP')
                        }
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
                    actions: [
                        'sendResponse',
                        () => {
                            console.log('ACTION: LOGGING OUT')
                        }
                    ]
                },
                FETCH_TODOS: {
                    actions: [
                        'getData',
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
                        },
                        () => {
                            console.log('ACTION: FETCHING TODOS')
                        }
                    ]
                },
                ADD_TODO: {
                    actions: [
                        'getData',
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/todos`,
                                'post',
                                context.data.newTodo,
                                'SUCCESS',
                                'FAILURE'
                            )
                        },
                        () => {
                            console.log('ACTION: ADDING TODO')
                        }
                    ]
                },
                UPDATE_TODO: {
                    actions: [
                        'getData',
                        ({context}) => {
                            console.log(context.data.todo._id)
                        },
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/todos/${context.data.todo._id}`,
                                'put',
                                context.data.todo,
                                'SUCCESS',
                                'FAILURE'
                            )
                        },
                        () => {
                            console.log('ACTION: UPDATING TODO')
                        }
                    ]
                },
                DELETE_TODO: {
                    actions: [
                        'getData',
                        'spawnFetchMachine',
                        async ({context}) => {
                            trigger(
                                context,
                                `${dbUrl}/todos/${context.data.todoId}`,
                                'delete',
                                {},
                                'SUCCESS',
                                'FAILURE'
                            )
                        },
                        () => {
                            console.log('ACTION: DELETING TODO')
                        }
                    ]
                },
                SUCCESS: {
                    actions: [
                        assign({
                            response: ({event}) => event.context.response
                        }),
                        'sendResponse',
                        () => {
                            console.log('TODO SUCCESS')
                        }
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
        getData: assign({
            data: ({event}) => event.value
        }),
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