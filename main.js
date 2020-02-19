$(document).ready(function () {

    let w = window.innerWidth * 0.68 * 0.95;
    let h = Math.ceil(w * 0.7);
    let oR = 0;
    let nTop = 0;
    let nTopChildren = 0;
    let attr = ['topics', 'scenarios', 'tools'];

    let svgContainer = d3.select("#mainBubble")
        .style("height", h + "px");

    let svg = d3.select("#mainBubble").append("svg")
        .attr("class", "mainBubbleSVG")
        .attr("width", w)
        .attr("height", h)
    // .on("mouseleave", function () {
    //     return resetBubbles();
    // });

    let mainNote = svg.append("text")
        .attr("id", "bubbleItemNote")
        .attr("x", 10)
        .attr("y", w / 2 - 15)
        .attr("font-size", 12)
        .attr("dominant-baseline", "middle")
        .attr("alignment-baseline", "middle")
        .style("fill", "#888888")
        .text(function (d) {
            return "";
        });


    d3.json("bubbles.json", function (error, root) {
        //  console.log(error);

        let bubbleObj = svg.selectAll(".topBubble")
            .data(root)
            .enter().append("g")
            .attr("id", function (d, i) {
                return "topBubbleAndText_" + i
            });

        //  console.log(root);
        nTop = root.length;

        oR = w / (1 + 3 * nTop);

        h = Math.ceil(w / nTop * 2);
        svgContainer.style("height", h + "px");

        let colVals = d3.scaleOrdinal(d3.schemeCategory10);

        bubbleObj.append("circle")
            .attr("class", "topBubble")
            .attr("id", function (d, i) {
                return "topBubble" + i;
            })
            .attr("r", function (d) {
                return oR;
            })
            .attr("cx", function (d, i) {
                return oR * (3 * (1 + i) - 1);
            })
            .attr("cy", (h + oR) / 3)
            .style("fill", function (d, i) {
                return colVals(i);
            }) // #1f77b4
            .style("opacity", 0.3)
        // .on("mouseover", function (d, i) {
        //     return activateBubble(d, i);
        // });


        bubbleObj.append("text")
            .attr("class", "topBubbleText")
            .attr("x", function (d, i) {
                return oR * (3 * (1 + i) - 1);
            })
            .attr("y", (h + oR) / 3)
            .style("fill", function (d, i) {
                return colVals(i);
            }) // #1f77b4
            .attr("font-size", 30)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .text(function (d) {
                return d.name
            })
        // .on("mouseover", function (d, i) {
        //     return activateBubble(d, i);
        // });


        for (let iB = 0; iB < nTop; iB++) {

            let childBubbles = svg.selectAll(".childBubble" + iB)
                .data(root[iB].children)
                .enter().append("g");

            //let nSubBubble = Math.floor(root.children[iB].children.length/2.0);


            childBubbles.append("circle")
                .attr("class", "childBubble" + iB + " childBubble")
                .attr("id", function (d, i) {
                    return "childBubble_" + iB + "sub_" + i;
                })
                .attr("r", function (d) {
                    return oR / 3.0;
                })
                .attr("cx", function (d, i) {
                    return (oR * (3 * (iB + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("cy", function (d, i) {
                    return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("cursor", "pointer")
                .style("opacity", 0.5)
                .style("fill", "#eee")
            // .on("mouseover", function (d, i) {
            //     let noteText = "";
            //     if (d.note == null || d.note == "") {
            //         noteText = d.address;
            //     } else {
            //         noteText = d.note;
            //     }
            //     d3.select("#bubbleItemNote").text(noteText);
            // })
            childBubbles.append("text")
                .attr("class", "childBubbleText" + iB)
                .attr("x", function (d, i) {
                    return (oR * (3 * (iB + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("y", function (d, i) {
                    return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .style("opacity", 0.5)
                .attr("text-anchor", "middle")
                .style("fill", function (d, i) {
                    return colVals(iB);
                }) // #1f77b4
                .attr("font-size", 6)
                .attr("cursor", "pointer")
                .attr("dominant-baseline", "middle")
                .attr("alignment-baseline", "middle")
                .text(function (d) {
                    return d.title
                })
            // .append("svg:title")
            // .text(function (d) {
            //     return d.address;
            // });

            childBubbles.each(function (d, isB) {

                for (let i = 0; i < attr.length; i++) {
                    if ((root[iB].children[isB].attr[0][attr[i]] == null)||(root[iB].children[isB].attr[0][attr[i]] == 'undefined'))
                    {

                      //  console.log(root[iB].children[isB].attr[0][attr[i]] );
                    }
                    else{
                        d3.select(this).selectAll('.subchildBubble')
                            .data(root[iB].children[isB].attr[0][attr[i]])
                            .enter()
                            .append("circle")
                            .attr("class", "subchildBubble" + isB)
                            .attr("id", function (data, i) {
                                return "subchildBubble_" + iB + "sub_" + i;
                            })
                            .attr("r", function (d) {
                                return oR / 5.0;
                            })
                            .attr("cx", function (d) {
                                let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("cx");
                                return parentXValue;
                            })
                            .attr("cy", function (d) {
                                let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("cy");
                                return parentYValue;
                            })
                            .attr("cursor", "pointer")
                            .style("opacity", 0.5)
                            .style("fill", "#eee")
                    }

                }

            })

            childBubbles.each(function (d, isB) {

                for (let j = 0; j < attr.length; j++) {
                    console.log(root[iB].children[isB].attr[0][attr[j]]);
                    if ((root[iB].children[isB].attr[0][attr[j]] == null) || (root[iB].children[isB].attr[0][attr[j]] == 'undefined')) {
                        //  console.log(root[iB].children[isB].attr[0][attr[i]] );
                    } else {
                        d3.select(this).selectAll('.test')
                            .data(root[iB].children[isB].attr[0][attr[j]])
                            .enter()
                            .append("text")
                            .attr("class", "test" + isB)
                            .attr("id", function (data, i) {
                                return "subchildBubble_" + iB + "sub_" + i;
                            })

                            .attr("cursor", "pointer")
                            .style("opacity", 0.5)
                            .style("fill", "#eee")

                            .attr("x", function (d, i) {
                                let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("cx");
                                return parentXValue;
                            })
                            .attr("y", function (d, i) {
                                    let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("cy");
                                    return parentYValue;
                                }
                            )
                            .style("fill", function (d, i) {
                                return colVals(i);
                            }) // #1f77b4
                            .attr("font-size", 30)
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "middle")
                            .attr("alignment-baseline", "middle")
                        .text(function (d) {
                            let title;
                            $.grep(root[j].children, function (e) {
                                if (d === e.id) {
                                    title = e.title;

                                }
                            });
                            return title;
                        })
                        .on("mouseover", function (d, i) {
                            return activateBubble(d, i);
                        });


                    }
                }
            })


        }


    });


    resetBubbles = function () {
        w = window.innerWidth * 0.68 * 0.95;
        oR = w / (1 + 3 * nTop);

        h = Math.ceil(w / nTop * 2);
        svgContainer.style("height", h + "px");

        mainNote.attr("y", h - 15);

        svg.attr("width", w);
        svg.attr("height", h);

        d3.select("#bubbleItemNote").text("");

        let t = svg.transition()
            .duration(650);

        t.selectAll(".topBubble")
            .attr("r", function (d) {
                return oR;
            })
            .attr("cx", function (d, i) {
                return oR * (3 * (1 + i) - 1);
            })
            .attr("cy", (h + oR) / 3);

        t.selectAll(".topBubbleText")
            .attr("font-size", 30)
            .attr("x", function (d, i) {
                return oR * (3 * (1 + i) - 1);
            })
            .attr("y", (h + oR) / 3);

        for (let k = 0; k < nTop; k++) {
            t.selectAll(".childBubbleText" + k)
                .attr("x", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("y", function (d, i) {
                    return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("font-size", 6)
                .style("opacity", 0.5);

            t.selectAll(".childBubble" + k)
                .attr("r", function (d) {
                    return oR / 3.0;
                })
                .style("opacity", 0.5)
                .attr("cx", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("cy", function (d, i) {
                    return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                });

        }
    }


    function activateBubble(d, i) {
        // increase this bubble and decrease others
        let t = svg.transition()
            .duration(d3.event.altKey ? 7500 : 350);

        t.selectAll(".topBubble")
            .attr("cx", function (d, ii) {
                if (i == ii) {
                    // Nothing to change
                    return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
                } else {
                    // Push away a little bit
                    if (ii < i) {
                        // left side
                        return oR * 0.6 * (3 * (1 + ii) - 1);
                    } else {
                        // right side
                        return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
                    }
                }
            })
            .attr("r", function (d, ii) {
                if (i == ii)
                    return oR * 1.8;
                else
                    return oR * 0.8;
            });

        t.selectAll(".topBubbleText")
            .attr("x", function (d, ii) {
                if (i == ii) {
                    // Nothing to change
                    return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
                } else {
                    // Push away a little bit
                    if (ii < i) {
                        // left side
                        return oR * 0.6 * (3 * (1 + ii) - 1);
                    } else {
                        // right side
                        return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
                    }
                }
            })
            .attr("font-size", function (d, ii) {
                if (i == ii)
                    return 30 * 1.5;
                else
                    return 30 * 0.6;
            });

        let signSide = -1;
        for (let k = 0; k < nTop; k++) {
            signSide = 1;
            if (k < nTop / 2) signSide = 1;
            t.selectAll(".childBubbleText" + k)
                .attr("x", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("y", function (d, i) {
                    return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("font-size", function () {
                    return (k == i) ? 12 : 6;
                })
                .style("opacity", function () {
                    return (k == i) ? 1 : 0;
                });

            t.selectAll(".childBubble" + k)
                .attr("cx", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("cy", function (d, i) {
                    return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("r", function () {
                    return (k == i) ? (oR * 0.55) : (oR / 3.0);
                })
                .style("opacity", function () {
                    return (k == i) ? 1 : 0;
                });
        }
    }

    window.onresize = resetBubbles;
});