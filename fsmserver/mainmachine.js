const { createMachine, assign } = require("xstate");
const userMachine = require('./usermachine');

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
                    target: "sendingRequest",
                    actions: [assign({
                        username: ({event}) => event.value.username,
                        password: ({event}) => event.value.password,
                        reqType: 'login'
                    })]
                }
            }
        },
        signup: {
            on: {
                GO_TO_LOGIN: {
                    target: "login",
                },
                SIGNUP: {
                    target: "sendingRequest",
                    actions: [assign({
                        username: ({event}) => event.value.username,
                        password: ({event}) => event.value.password,
                        reqType: 'signup'
                    })]
                }
            }
        },
        sendingRequest: {
            entry: [
                'spawnUserMachine',
                async ({context}) => {
                    context.userMachineRef.send({
                        type: 'SEND_REQ',
                        value: {
                            url: `${dbUrl}/users/${context.reqType}`,
                            request: 'post',
                            username: context.username,
                            password: context.password,
                            success: 'SUCCESS',
                            failure: 'FAILURE'
                        }
                    })
                }
            ],
            on: {
                SUCCESS: {
                    actions: [
                        assign({
                            response: ({event}) => event.context.response
                        }),
                        'sendResponse'
                    ],
                    target: 'dashboard'
                },
                FAILURE: [
                    {
                        guard: ({context}) => context.reqType === 'signup',
                        target: 'signup',
                        actions: [
                            () => {console.log('SIGNUP ERROR')},
                            assign({
                                response: null
                            }),
                            'sendResponse'
                        ]
                    },
                    {
                        guard: ({context}) => context.reqType === 'login',
                        target: 'login',
                        actions: [
                            () => {console.log("LOGIN ERROR")},
                            assign({
                                response: null
                            }),
                            'sendResponse'
                        ]  
                    }
                ]
            }              
        },
        dashboard: {
            type: 'final'
        }
    }
}, {
    actions: {
        spawnUserMachine: assign({
            userMachineRef: ({spawn}) => spawn(userMachine),
        })
    }
});


module.exports = mainMachine;