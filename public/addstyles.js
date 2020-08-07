function addStyles() {
    addTheme('default', {
        button: {
            default: {
                fill: 75,
                stroke: 45,
                text: 255,
                hover: {
                    fill: 100
                }
            },
            game: {
                fill: 75,
                stroke: 45,
                text: 255,
                hover: {
                    fill: 100
                }
            },
            yellow: {
                fill: [200, 200, 0, 150],
                stroke: [255, 255, 0],
                text: [255, 255, 0],
                hover: {
                    fill: [150, 150, 0, 150]
                }
            },
            blue: {
                fill: [0, 200, 200, 150],
                stroke: [0, 255, 255],
                text: [0, 255, 255],
                hover: {
                    fill: [0, 150, 150, 150]
                }
            },
            pink: {
                fill: [200, 0, 200, 150],
                stroke: [255, 0, 255],
                text: [255, 0, 255],
                hover: {
                    fill: [150, 0, 150, 150]
                }
            },
            green: {
                fill: [0, 200, 0, 150],
                stroke: [0, 255, 0],
                text: [0, 255, 0],
                hover: {
                    fill: [0, 150, 0, 150]
                }
            },
            orange: {
                fill: [200, 120, 0, 150],
                stroke: [255, 150, 0],
                text: [255, 150, 0],
                hover: {
                    fill: [150, 120, 0, 150]
                }
            },
            red: {
                fill: [200, 0, 0, 150],
                stroke: [255, 0, 0],
                text: [255, 0, 0],
                hover: {
                    fill: [150, 0, 0, 150]
                }
            }
        },
        chatbox: {
            chatbox: {
                // fill: -1,
                // stroke: -1,
                text: 175,
                bold: {
                    text: 255
                }
            },
            game: {
                fill: [0, 25],
                text: 175,
                bold: {
                    fill: [0, 75],
                    text: 255
                }
            }
        },
        checkbox: {
            default: {
                fill: 200,
                stroke: 20,
                hover: {
                    fill: 120,
                    stroke: 200
                },
                // checked: {
                //     fill: 255,
                //     stroke: 20
                // },
                // hoverchecked: {
                //     fill: 120,
                //     stroke: 200
                // }
            }
        },
        closebutton: {
            default: {
                fill: 75,
                cross: 200,
                stroke: 45,
                hover: {
                    fill: 200,
                    cross: 75
                }
            }
        },
        container: {
            default: {
                fill: [0, 25],
                stroke: [0, 50],
                header: [0, 75],
                text: 255
            },
            pause: {
                fill: 50,
                stroke: 75,
                header: 30,
                text: 255
            }
        },
        popup: {
            default: {
                fill: 150,
                stroke: 200,
                header: 50,
                text: 255,
                background: [0, 150]
            }
        },
        screen: {
            default: {
                background: [0, 0, 30],
                outer: [0, 0, 50],
                stroke: [0, 0, 100],
                tooltip: {
                    fill: 200,
                    stroke: 50,
                    text: 20
                }
            },
            game: {
                // background: [0, 0, 30],
                outer: [0, 0, 50],
                stroke: [0, 0, 100],
                tooltip: {
                    fill: 200,
                    stroke: 50,
                    text: 20
                }
            }
        },
        scrollbar: {
            default: {
                fill: 100,
                // stroke: -1,
                hover: {
                    fill: 80
                }
            },
            chatbox: {
                fill: 30,
                // stroke: -1,
                hover: {
                    fill: 20
                }
            }
        },
        slider: {
            default: {
                line: 75,
                circle: 100,
                text: 200,
                hover: {
                    line: 50,
                    circle: 75,
                    text: 255
                }
            }
            // default: {
            //     line: 150,
            //     circle: 200,
            //     text: 30,
            //     hover: {
            //         line: 110,
            //         circle: 240,
            //         text: 0
            //     }
            // }
        },
        table: {
            default: {
                fill: 200,
                stroke: 20,
                text: 20,
                header: {
                    fill: 100,
                    text: 255
                },
                hover: {
                    fill: 150,
                    text: 255
                },
                alternate: {
                    fill: 180
                }
            }
        },
        textbox: {
            default: {
                fill: 220,
                // stroke: -1,
                text: 0,
                selection: 150,
                default: 100
            },
            game: {
                fill: [0, 50],
                text: 255,
                // stroke: -1,
                selection: [200, 50],
                default: 100
            }
        }
    }, true);
}