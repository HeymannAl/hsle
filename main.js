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
        .attr("height", h)

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

    let currentNode;
    let currentId;
   //localStorage.clear();
    if (localStorage.getItem("currentNode") === null) {
        localStorage.setItem('currentNode', 'scenarios');
        localStorage.setItem('currentId', 'Aufzeichnungen-von-Vorlesungen');
        currentNode = 'scenarios';
        currentId = 'Aufzeichnungen-von-Vorlesungen';
    } else {
        currentNode = localStorage.getItem('currentNode');
        currentId = localStorage.getItem('currentId');
    }

    let dataTop;
    let datafirstChild;

    d3.json("bubbles.json", function (error, root) {
//  console.log(error);
        dataTop = root.filter(function (d) {
            return d.name == currentNode

        });
        console.log('cur', dataTop);
        let bubbleObj = svg.selectAll(".topBubble")
            .data(dataTop)
            .enter().append("g")
            .attr("id", function (d, i) {
                return "topBubbleAndText_" + i
            });

        nTop = 100;

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
            })
            .style("opacity", 0.3)
            .style("display", "none")


        bubbleObj.append("text")
            .attr("class", "topBubbleText")
            .style("fill", function (d, i) {
                return d.color;
            })
            .attr("font-size", 60)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .attr("cursor", "pointer")
            .style("display", "none")
            .text(function (d) {
                return d.details
            })

        for (let iB = 0; iB < 1; iB++) {

            datafirstChild = dataTop[0].children.filter(function (d) {
                return d.id == currentId
            });

            var groups = svg.selectAll(".groups")
                .data(datafirstChild)
                .enter()
                .append("g")
                .attr("class", "gbar");

            groups.append('rect')
                .attr("x", 400)
                .attr("y", 300)
                .attr("rx", 15)
                .attr("ry", 15)
                .attr("width", 100)
                .attr("height", 100)
                .attr("cursor", "pointer")
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
                })

            /*MAIN END*/


            /*CHILDREN BEGIN*/
            var groupsChild = svg.selectAll(".childBubble" + iB)
                .data(datafirstChild)
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
                    if ((datafirstChild[isB].attr[0][attr[j]] == null) || (datafirstChild[isB].attr[0][attr[j]] == 'undefined')) {
                        // console.log(root[iB].children[isB].attr[0][attr[i]] );
                    } else {
                        //console.log(root[iB].children[isB].attr[0][attr[j]]);
                        console.log(datafirstChild[isB].attr[0]);

                        d3.select(this).selectAll(".childBubble" + iB)
                            .data(datafirstChild[isB].attr[0][attr[j]])
                            .enter()
                            .append("rect")
                            .attr("width", 60)
                            .attr("height", 60)
                            .attr("rx", 10)
                            .attr("ry", 10)
                            .attr("class", "subchildBubble subchildBubble" + root[iB].children[isB].id)
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
                            }).on("click", function (d) {
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
                let num = d3.selectAll('.subchildBubble' + root[iB].children[isB].id).size();

                d3.selectAll('.subchildBubble' + root[iB].children[isB].id).each(function (d, i) {
                    let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("cx");
                    let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("cy");
                    angle = (i / (num / 2)) * Math.PI;
                    let x = ((oR + 350 * Math.cos(angle))) + Math.round(parentXValue) + 400; // Calculate the x position of the element.
                    let y = ((oR + 250 * Math.sin(angle))) + Math.round(parentYValue) + 200; // Calculate the y position of the element.
                    d3.select(this).attr("x", x);
                    d3.select(this).attr("y", y);
                }).on("mouseover", function (d, i) {
                    let elem = d3.select(this.parentNode).selectAll(".subchildBubble");
                    elem.style('opacity', '1.0');
                })
            })
            let textvisible = false;
            groupsChild.each(function (d, isB) {
                for (let j = 0; j < attr.length; j++) {
                    if ((datafirstChild[isB].attr[0][attr[j]] == null) || (datafirstChild[isB].attr[0][attr[j]] == 'undefined')) {
                        //  console.log(root[iB].children[isB].attr[0][attr[i]] );
                    } else {
                        d3.select(this).selectAll('.text')
                            .data(datafirstChild[isB].attr[0][attr[j]])
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
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        title = e.title;
                                    }
                                });
                                return title;
                            }).call(wrapLabel, 200, 0)
                            .on("click", function (d) {
                                let url;

                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        url = e.url;
                                        window.open(url);
                                    }
                                });
                            }).on("click", function (d) {

                            let TitleValueID = d3.select(this).attr('id');
                            d3.selectAll(".description").style('opacity', '0');
                            d3.selectAll("#" + TitleValueID).style('opacity', '1.0');
                            textvisible = true;

                        });

                        d3.select(this).selectAll('.description')
                            .data(datafirstChild[isB].attr[0][attr[j]])
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
                            }).call(wrapLabel, 200, 0);
                        d3.selectAll('.description')
                            .selectAll('.tspan').filter(function(d, i, j) {
                            return i >= 2; }).remove();

                        d3.selectAll('.description')
                            .data(datafirstChild[isB].attr[0][attr[j]])
                            .append('tspan')
                            .text('mehr Informationen')
                            .attr('class', 'tspanMore')
                            .attr('id', function (d, i) {
                                let id;
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        id = e.id;
                                    }
                                });

                                return id;
                            })
                            .attr('type', function (d, i) {
                                let id;
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        id = e.type;
                                    }
                                });

                                return id;
                            })
                            .attr('dy', 60)
                            .on("click", function(d) {
                                let url;

                                let currentNavId = d3.select(this).attr('id');
                                let currentNavNode = d3.select(this).attr('type');

                                localStorage.setItem('currentNode', currentNavNode);
                                localStorage.setItem('currentId', currentNavId);

                                url='/hsle'
                                window.open(url, '_blank');


                                $.grep(root[j].children, function (e) {
                                    /*for later usage
                                    if (d === e.id) {
                                        url = e.url;
                                        window.open(url);
                                    }
                                    */


                                });
                            });

                        // d3.selectAll('.tspanMore')
                        //     .insert('tspan', ':last-child')
                        //     .attr('dy', 60)
                        //     .attr('dx', 100)
                        //     .text('...');
                    }
                }
                /*CHILDREN END*/

                let angle;
                let num = d3.selectAll('.text' + root[iB].children[isB].id).size();
                d3.selectAll('.text' + root[iB].children[isB].id).each(function (d, i) {
                    let parentXValue = d3.select(this.parentNode).select('.childBubble').attr("cx");
                    let parentYValue = d3.select(this.parentNode).select('.childBubble').attr("cy");
                    angle = (i / (num / 2)) * Math.PI;
                    let cx = ((oR + 380 * Math.cos(angle))) + Math.round(parentXValue) + 380; // Calculate the x position of the element.
                    let cy = ((oR + 260 * Math.sin(angle))) + Math.round(parentYValue) + 220; // Calculate the y position of the element.
                    d3.select(this).selectAll('tspan').attr("x", cx);
                    d3.select(this).selectAll('tspan').attr("y", cy);
                })
                let num1 = d3.selectAll('.description' + root[iB].children[isB].id).size();
                d3.selectAll('.description' + root[iB].children[isB].id).each(function (d, i) {
                    let parentValueID = d3.select(this).attr('id');
                   let parentXValue = $('#' + parentValueID).find('tspan').attr('x');
                    let parentYValue = $('#' + parentValueID).find('tspan').attr('y');
                     d3.select(this).selectAll('tspan').attr("x", parentXValue);
                    d3.select(this).selectAll('tspan').attr("y", parseInt(parentYValue) + 50);
                })
            })

        }


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
                            .attr('class', 'tspan')
                            .attr("dy", ++lineNumber + lineheight + "em")
                            .text(word);
                    }
                }

            });
        }

    });
});