$(document).ready(function () {

    let w = window.innerWidth * 0.7 * 0.98;
    let h = Math.ceil(w * 1.5);
    let oR = 0;
    let nTop = 0;

    let attr = ['topics', 'scenarios', 'tools'];

    let svgContainer = d3.select("#mainBubble")
        .style("height", h + "px");

    let svg = d3.select("#mainBubble").append("svg")
        .attr("class", "mainBubbleSVG")
        .attr("width", '1500')
        .attr("height", '600')

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

//  let colVals = d3.scaleOrdinal(d3.schemeCategory10);

        bubbleObj.append("rect")
            .attr("class", "topBubble")
            .attr("id", function (d, i) {
                return "topBubble" + i;
            })
            .attr("r", function (d) {
                return oR;
            })
            // .attr("cy", (h + oR) / 3)
            // .attr("cx", function (d, i) {
            //     return oR * (3 * (1 + i) - 1);
            // })
            .style("fill", function (d, i) {
                return d.color;
            }) // #1f77b4
            .style("opacity", 0.3)
            .style("display", "none")
            .on("mouseover", function (d, i) {
                return activateBubble(d, i);
            });

        bubbleObj.append("text")
            .attr("class", "topBubbleText")
            // .attr("x", function (d, i) {
            //     return oR * (3 * (1 + i) - 1);
            // })
            // .attr("y", (h + oR) / 3)
            .style("fill", function (d, i) {
                return d.color;
            }) // #1f77b4
            .attr("font-size", 60)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .attr("cursor", "pointer")
            .style("display", "none")
            .text(function (d) {
                return d.details
            })
            .on("mouseover", function (d, i) {
                return activateBubble(d, i);
            });

        for (let iB = 0; iB < 1; iB++) {

//let nSubBubble = Math.floor(root.children[iB].children.length/2.0);

            var groups = svg.selectAll(".groups")
                .data(root[iB].children)
                .enter()
                .append("g")
                .attr("class", "gbar");

            groups.append('rect')
                .attr("x", 400)
                .attr("y", 300)
                .attr("rx",15)
                .attr("ry",15)
                .attr("width", 100)
                .attr("height", 100)
                .attr("cursor", "pointer")
                // .style("opacity", 0.5)
                .style("fill", function (d, i) {
                    return root[iB].color;
                })

            groups.append('text')
                .attr("class", "childBubbleText childBubbleText" + iB)
                .attr("x", 350)
                .attr("y", 360)
                //  .style("display", 'none')
                .attr("text-anchor", "left")
                .style("fill", '#000000') // #1f77b4
                .attr("font-size", 25)
                .attr("cursor", "pointer")
                .text(function (d) {
                    return d.title
                }).call(wrapLabel, 200, 0)
            /*.on("mouseover", function (d, i) {
                d3.selectAll('.childBubbleText').style("font-weight", '300');
                d3.select(this).style("font-weight", '700');
            })*/
                .on("click", function(d) { window.open(d.url); });
            /*MAIN END*/

            /*CHILDREN BEGIN*/
            var groupsChild = svg.selectAll(".childBubble" + iB)
                .data(root[iB].children)
                .enter()
                .append("g")
                .attr("class", "gbarChild");
            groupsChild.append('rect')
                .attr("class", "childBubble123" + iB + " childBubble")
                .attr("id", function (d, i) {
                    return "childBubble_" + iB + "sub_" + i;
                });
            groupsChild.each(function (d, isB) {
                for (let j = 0; j < attr.length; j++) {
                    if ((root[iB].children[isB].attr[0][attr[j]] == null)||(root[iB].children[isB].attr[0][attr[j]] == 'undefined'))
                    {
                        // console.log(root[iB].children[isB].attr[0][attr[i]] );
                    }
                    else{
                        d3.select(this).selectAll(".childBubble" + iB)
                            .data(root[iB].children[isB].attr[0][attr[j]])
                            .enter()

                            .append("rect")
                            // .attr("r", function (d) {
                            //     return oR / 5.0;
                            // })
                            .attr("width", 60)
                            .attr("height", 60)
                            .attr("rx",10)
                            .attr("ry",10)
                            .attr("class", "subchildBubble subchildBubble"+root[iB].children[isB].id)
                            .attr("x", function (d) {
                                let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("x");
                                return parentXValue;
                            })
                            .attr("y", function (d) {
                                let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("y");
                                return parentYValue;
                            })

                            // .attr("transform", translate)
                            .attr("cursor", "pointer")
                            //  .style("display", 'none')
                            .style('fill', function (d) {
                                let color;
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        color = root[j].color;
                                    }
                                });
                                return color;
                            }).on("click", function(d) {
                            let url;
                            $.grep(root[j].children, function (e) {
                                if (d === e.id) {
                                    url = e.url;
                                    window.open(url);
                                }
                            });
                        });
                    }
                }

                let angle;
                let num = d3.selectAll('.subchildBubble'+root[iB].children[isB].id).size();

                d3.selectAll('.subchildBubble'+root[iB].children[isB].id).each(function (d, i) {
                    let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("cx");
                    let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("cy");
                    angle = (i / (num/2)) * Math.PI;
                    let x = ((oR+400  * Math.cos(angle)))+Math.round(parentXValue)+290; // Calculate the x position of the element.
                    let y = ((oR+250  * Math.sin(angle)))+Math.round(parentYValue)+200; // Calculate the y position of the element.
                    d3.select(this).attr("x", x);
                    d3.select(this).attr("y", y);
                }).on("mouseover", function (d, i) {
                    let elem = d3.select(this.parentNode).selectAll(".subchildBubble");
                    elem.style('opacity', '1.0');
                })
            })
            let textvisible=false;
            groupsChild.each(function (d, isB) {
                for (let j = 0; j < attr.length; j++) {
                    if ((root[iB].children[isB].attr[0][attr[j]] == null) || (root[iB].children[isB].attr[0][attr[j]] == 'undefined')) {
                        //  console.log(root[iB].children[isB].attr[0][attr[i]] );
                    } else {
                        d3.select(this).selectAll('.text')
                            .data(root[iB].children[isB].attr[0][attr[j]])
                            .enter()
                            .append("text")
                            .attr("class", "subchildBubbleText text" + root[iB].children[isB].id)
                            .attr("id", function (data, i) {
                                return "subchildBubble_" + iB + "sub_" + i + root[iB].children[isB].id;
                            })
                            .attr("cursor", "pointer")
                            //  .style("display", 'none')
                            .style("fill", '#000000') // #1f77b4
                            .attr("font-size", 20)
                            .attr("text-anchor", "left")
                            .attr("dominant-baseline", "middle")
                            .attr("alignment-baseline", "middle")
                            .text(function (d) {
                                let title;
                                console.log(root[j]);
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        title = e.title;
                                    }
                                });
                                return title;
                            }).call(wrapLabel, 200, 0)
                            .on("click", function(d) {
                                let url;

                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        url = e.url;
                                        window.open(url);
                                    }
                                });
                            }).on("click", function(d) {

                            let TitleValueID = d3.select(this).attr('id');
                            d3.selectAll(".description").style('opacity', '0');
                            d3.selectAll("#"+TitleValueID).style('opacity', '1.0');
                            textvisible = true;

                        });

                        d3.select(this).selectAll('.description')
                            .data(root[iB].children[isB].attr[0][attr[j]])
                            .enter()
                            .append("text")
                            .attr("class", "description subchildBubbleText description" + root[iB].children[isB].id)
                            .attr("id", function (data, i) {
                                return "subchildBubble_" + iB + "sub_" + i + root[iB].children[isB].id;
                            })
                            .attr("cursor", "pointer")
                            // .style("opacity", '0')
                            .style("fill", '#000000') // #1f77b4
                            //.style("display", 'none')
                            .attr("font-size", 14)
                            .attr("text-anchor", "left")
                            .style("opacity", '0')
                            .text(function (d, i) {
                                let title;
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        title = e.description;
                                    }
                                });

                                return title;
                            }).call(wrapLabel, 200, 0).on("click", function(d) {
                            let url;
                            $.grep(root[j].children, function (e) {
                                if (d === e.id) {
                                    url = e.url;
                                    window.open(url);
                                }
                            });
                        });
                    }
                }
                /*CHILDREN END*/

                let angle;
                let num = d3.selectAll('.text'+root[iB].children[isB].id).size();
                d3.selectAll('.text'+root[iB].children[isB].id).each(function (d, i) {
                    let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("cx");
                    let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("cy");
                    angle = (i / (num/2)) * Math.PI;
                    let cx = ((oR+400  * Math.cos(angle)))+Math.round(parentXValue)+380; // Calculate the x position of the element.
                    let cy = ((oR+260  * Math.sin(angle)))+Math.round(parentYValue)+220; // Calculate the y position of the element.
                    d3.select(this).selectAll('tspan').attr("x", cx);
                    d3.select(this).selectAll('tspan').attr("y", cy);
                })
                let num1 = d3.selectAll('.description'+root[iB].children[isB].id).size();
                d3.selectAll('.description'+root[iB].children[isB].id).each(function (d, i) {
                    let parentValueID = d3.select(this).attr('id');

                    //let parentXValue = d3.select('#'+parentValueID).select(this.childNodes).attr("x");
                    //let parentYValue = d3.select('#'+parentValueID).select(this.childNodes).attr("y");
                    let parentXValue = $('#'+parentValueID).find('tspan').attr('x');
                    let parentYValue = $('#'+parentValueID).find('tspan').attr('y');
                    // let parentYValue = d3.select('#'+parentValueID).select(this.childNodes).attr("y");
                    //let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("cx");
                    //let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("cy");
                    //angle = (i / (num1/2)) * Math.PI;
                    //let cx = ((oR+300 * Math.cos(angle)))+Math.round(parentXValue)+200; // Calculate the x position of the element.
                    //let cy = ((oR+250  * Math.sin(angle)))+Math.round(parentYValue)+300; // Calculate the y position of the element.
                    d3.select(this).selectAll('tspan').attr("x", parentXValue);
                    d3.select(this).selectAll('tspan').attr("y", parseInt(parentYValue)+50);
                })
            })

        }


    });

    resetBubbles = function () {
        d3.selectAll('.description').style('opacity', '0.0');
//         oR = w / (1 + 3 * nTop);
//
//         h = Math.ceil(w / nTop * 2);
//
//         mainNote.attr("y", h - 15);
//
//         let t = svg.transition()
//             .duration(650);
//
//         t.selectAll(".topBubble")
//             .attr("r", function (d) {
//                 return oR;
//             })
//             .attr("cx", function (d, i) {
//                 return oR * (3 * (1 + i) - 1);
//             })
//             .attr("cy", (h + oR) / 3);
//
//         t.selectAll(".topBubbleText")
//             .attr("font-size", 30)
//             .attr("x", function (d, i) {
//                 return oR * (3 * (1 + i) - 1);
//             })
//             .attr("y", (h + oR) / 3);
//
//         for (let k = 0; k < nTop; k++) {
//             t.selectAll(".childBubbleText" + k)
//                 .attr("x", function (d, i) {
//                     return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
//                 })
//                 .attr("y", function (d, i) {
//                     return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
//                 })
//                 .attr("font-size", 60)
// // .style("display", 'none');
//
//             t.selectAll(".childBubble" + k)
//                 .attr("r", function (d) {
//                     return oR / 3.0;
//                 })
//                 .style("display", 'block')
//                 .style("opacity", 0.5)
//                 .attr("cx", function (d, i) {
//                     return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
//                 })
//                 .attr("cy", function (d, i) {
//                     return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
//                 });
//             t.selectAll(".subchildBubble")
// // .style("display", 'none');
//             t.selectAll(".subchildBubbleText")
// //.style("display", 'none');
//         }
    }


    function activateBubble(d, i) {
        d3.event.stopPropagation();
        d3.selectAll(".subchildBubble").style('display', 'none');
        d3.selectAll(".subchildBubbleText").style('display', 'none');
        d3.selectAll(".subchildBubbleText").style('font-weight', 'normal');
// increase this bubble and decrease others
        let t = svg.transition().duration(d3.event.altKey ? 7500 : 350);
        t.selectAll(".topBubble")
        // .attr("cx", function (d, ii) {
        //     if (i == ii) {
        //         // Nothing to change
        //         return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
        //     } else {
        //         // Push away a little bit
        //         if (ii < i) {
        //             // left side
        //             return oR * 0.6 * (3 * (1 + ii) - 1);
        //         } else {
        //             // right side
        //             return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
        //         }
        //     }
        // })
            .attr("r", function (d, ii) {
                if (i == ii)
                    return oR * 1.8;
                else
                    return oR * 0.8;
            });

        t.selectAll(".topBubbleText")
        // .attr("x", function (d, ii) {
        //     if (i == ii) {
        //         // Nothing to change
        //         return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
        //     } else {
        //         // Push away a little bit
        //         if (ii < i) {
        //             // left side
        //             return oR * 0.6 * (3 * (1 + ii) - 1);
        //         } else {
        //             // right side
        //             return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
        //         }
        //     }
        // })
            .attr("font-size", function (d, ii) {
                if (i == ii)
                    return 30 * 1.5;
                else
                    return 30 * 0.6;
            })
        ;

        let signSide = -1;
        for (let k = 0; k < nTop; k++) {
            signSide = 1;
            if (k < nTop / 2) signSide = 1;
            t.selectAll(".childBubbleDescription" + k)
            // .attr("x", function (d, i) {
            //     return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
            // })
            // .attr("y", function (d, i) {
            //     return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
            // })
                .attr("font-size", function () {
                    return (k == i) ? 12 : 10;
                })
                .style("display", function () {
                    return (k == i) ? 'block' : 'none';
                });

            t.selectAll(".childBubble" + k)
            // .attr("cx", function (d, i) {
            //     return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
            // })
            // .attr("cy", function (d, i) {
            //     return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
            // })
                .attr("r", function () {
                    return (k == i) ? (oR * 0.55) : (oR / 3.0);
                })
            /*.style("display", function () {
                return (k == i) ? 'block' : 'none';
            }).style("opacity", function () {
            return (k == i) ? '1' : '0';
            });*/
        }
    }
    function activateSubBubble(d, i) {
// increase this bubble and decrease others
        let t = svg.transition()
            .duration(d3.event.altKey ? 7500 : 350);
        t.select(".childBubble")
// .attr("cx", function (d, ii) {
//     if (i == ii) {
//         // Nothing to change
//         return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
//     } else {
//         // Push away a little bit
//         if (ii < i) {
//             // left side
//             return oR * 0.6 * (3 * (1 + ii) - 1);
//         } else {
//             // right side
//             return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
//         }
//     }
// })
// .attr("r", function (d, ii) {
//     if (i == ii)
//         return oR/1.5 ;
//     else
//         return oR/2.2;
// });
// t.select(".childBubble").selectAll(".subchildBubble").style('opacity', '1.0');
//t.select(".childBubble").selectAll(".subchildBubbleText").style('opacity', '1.0');


// t.selectAll(".topBubbleText")
//     .attr("x", function (d, ii) {
//         if (i == ii) {
//             // Nothing to change
//             return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
//         } else {
//             // Push away a little bit
//             if (ii < i) {
//                 // left side
//                 return oR * 0.6 * (3 * (1 + ii) - 1);
//             } else {
//                 // right side
//                 return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
//             }
//         }
//     })
//     .attr("font-size", function (d, ii) {
//         if (i == ii)
//             return 30 * 1.5;
//         else
//             return 30 * 0.6;
//     })
// ;
//
// let signSide = -1;
// for (let k = 0; k < nTop; k++) {
//     signSide = 1;
//     if (k < nTop / 2) signSide = 1;
//     t.selectAll(".childBubbleText" + k)
//         .attr("x", function (d, i) {
//             return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
//         })
//         .attr("y", function (d, i) {
//             return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
//         })
//         .attr("font-size", function () {
//             return (k == i) ? 12 : 6;
//         })
//         .style("opacity", '1.0');
//     // .style("opacity", function () {
//     //     return (k == i) ? 1 : 0;
//     // });
//
//     t.selectAll(".childBubble" + k)
//         .attr("cx", function (d, i) {
//             return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
//         })
//         .attr("cy", function (d, i) {
//             return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
//         })
//         .attr("r", function () {
//             return (k == i) ? (oR * 0.55) : (oR / 3.0);
//         })
//         .style("opacity", function () {
//             return (k == i) ? 1 : 0;
//   });
// }
    }
    window.onresize = resetBubbles;

    function wrapLabel(text, width, lineheight) {
        text.each(function () {
            let textElement = d3.select(this); // d3 text element
            const text = textElement.text(); // actual text
            let words = text.split(/\s+/);// text with words in an array
            let word; // current word to get handled
            let line = []; // current text line to get handled
            let lineNumber = 0; // current line number
            let tspan = textElement.text(null)
            // first tspan element (first line)
                .append("tspan")

            //.attr("dy", lineNumber + "em");
            // let domID = textElement.attr('id').slice(-1); // get dom id of text element
            // let transform = textElement.attr("transform"); // get transformation of text element
            // transform = transform.substring(10, transform.length - 1).split(' '); // get transformation x/y as array

            while (word = words.shift()) { // get first element and remove it from array
                line.push(word);
                tspan.text(line.join(" ")); // set new text to tspan
                if (tspan.node().getComputedTextLength() > width) { // check if tspan is wider than allowed
                    // remove last word
                    line.pop();
                    tspan.text(line.join(" "));
                    // removed word is start of next line
                    line = [word];
                    // append new tspan element and add word in case its the last word of the text
                    tspan = textElement.append("tspan")
                    // .attr("x", 0)
                    //.attr("y", 0)
                        .attr("dy", ++lineNumber + lineheight +"em")
                        .text(word);
                }
            }

            //  d3.select('#storyName').attr('transform', `translate(5,19)`)

            // get text element height
            //let textElementHeight = parseInt(document.getElementById(`nodeLabel${domID}`).getBBox().height / 25);

            // place element depending on text anchor
            /*if (textAnchor[domID] === 'top') {
                $(`#nodeLabel${domID}`).attr('transform', `translate(${parseInt(transform[0])+5} ${parseInt(transform[1])+5})`);
            } else if (textAnchor[domID] === 'middle') {
                $(`#nodeLabel${domID}`).attr('transform', `translate(${parseInt(transform[0])+7} ${-5 - textElementHeight/2 + parseInt(transform[1])})`);
            } else if (textAnchor[domID] === 'topRight') {
                let nodeLabelWidth = parseInt(document.getElementById(`nodeLabel${domID}`).getBBox().width);
                $(`#nodeLabel${domID}`).attr('transform', `translate(${parseInt(transform[0])-10-nodeLabelWidth} ${parseInt(transform[1])-10})`);
            } else {
                $(`#nodeLabel${domID}`).attr('transform', `translate(${parseInt(transform[0])+5} ${-9 - textElementHeight + parseInt(transform[1])})`);
            }*/
        });
    }
});
