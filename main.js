$(document).ready(function () {

    let w = window.innerWidth * 0.7 * 0.98;
    let h = Math.ceil(w * 1.5);
    let oR = 0;
    let nTop = 0;

    let attr = ['topics', 'scenarios', 'tools'];

    let svgContainer = d3.select("#mainWrapper")
        .style("height", h + "px");

    let svg = d3.select("#mainWrapper").append("svg")
        .attr("class", "mainWrapperSVG")
        .attr("width", '1500')
        .attr("height", h)

        
    appendGradients(svg);


    let currentNode;
    let currentId;
    localStorage.clear();
    if (localStorage.getItem("currentNode") === null) {
        localStorage.setItem('currentNode', 'topics');
        localStorage.setItem('currentId', 'Blended-Learning');
        currentNode = 'topics';
        currentId = 'Blended-Learning';
    } else {
        currentNode = localStorage.getItem('currentNode');
        currentId = localStorage.getItem('currentId');
    }

    let dataTop;
    let datafirstChild;

    d3.json("testdata.json", function (error, root) {

        dataTop = root.filter(function (d) {
            return d.name == currentNode

        });


        nTop = 100;

        oR = w / (1 + 3 * nTop);

        h = Math.ceil(w / nTop * 2);
        svgContainer.style("height", h + "px");


        for (let iB = 0; iB < 1; iB++) {

            datafirstChild = dataTop[0].children.filter(function (d) {
                return d.id == currentId
            });

            var groups = svg.selectAll(".groups")
                .data(datafirstChild)
                .enter()
                .append("g")
                .attr("class", "gbar");
            var groupsChild = svg.selectAll(".childRect" + iB)
                .data(datafirstChild)
                .enter()
                .append("g")
                .attr("class", "gbarChild");
            groupsChild.append('rect')
                .attr("x", 400)
                .attr("y", 300)
                .attr("rx", 30)
                .attr("ry", 20)
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "mainRect")
                .style("fill", 'url(#' + root[iB].name + ')')

            groupsChild.append('text')
                .attr("class", "childRectText childRectText" + iB)
                .attr("x", 520)
                .attr("y", 360)
                .text(function (d) {
                    return d.title
                }).call(wrapLabel, 200, true)


            groupsChild.append('rect')
                .attr("class", "childRect123" + iB + " childRect")
                .attr("id", function (d, i) {
                    return "childRect_" + iB + "sub_" + i;
                });
            groupsChild.each(function (d, isB) {
                for (let j = 0; j < attr.length; j++) {
                    if ((datafirstChild[isB].attr[0][attr[j]] == null) || (datafirstChild[isB].attr[0][attr[j]] == 'undefined')) {

                    } else {
                        d3.select(this).selectAll(".childRect" + iB)
                            .data(datafirstChild[isB].attr[0][attr[j]])
                            .enter()
                            .append("rect")
                            .attr("width", 60)
                            .attr("height", 60)
                            .attr("rx", 15)
                            .attr("ry", 10)
                            .attr("class", "subchildRect subchildRect" + root[iB].children[isB].id)
                            .attr("id", function (data, i) {

                                return "childRect_" + iB + "sub_" + data + root[iB].children[isB].id;
                            })
                            .attr("x", function (d) {
                                let parentXValue = d3.select(this.parentNode).select('.childRect').attr("x");
                                return parentXValue;
                            })
                            .attr("y", function (d) {
                                let parentYValue = d3.select(this.parentNode).select('.childRect').attr("y");
                                return parentYValue;
                            })
                            .attr('fill','url(#' + getCategoryName(j,d,root) +')')
                            .on("click", function (d) {
                            let TitleValueID = d3.select(this).attr('id');
                            d3.selectAll(".description").classed('fadeout', 'false');
                            d3.selectAll(".description").classed('fadeout', 'true');
                            d3.selectAll("." + TitleValueID).classed('fadeout', 'false');
                            d3.selectAll("." + TitleValueID).classed('fadein', 'true');
                        });
                    }
                }

                let angle;
                let num = d3.selectAll('.subchildRect' + root[iB].children[isB].id).size();

                d3.selectAll('.subchildRect' + root[iB].children[isB].id).each(function (d, i) {
                    let parentXValue = d3.select(this.parentNode).select('.childRect').attr("cx");
                    let parentYValue = d3.select(this.parentNode).select('.childRect').attr("cy");
                    angle = (i / (num / 2)) * Math.PI;
                    let x = ((oR + 350 * Math.cos(angle))) + Math.round(parentXValue) + 400; // Calculate the x position of the element.
                    let y = ((oR + 150 * Math.sin(angle))) + Math.round(parentYValue) + 300; // Calculate the y position of the element.
                    d3.select(this).attr("x", x);
                    d3.select(this).attr("y", y);
                })
            })

            groupsChild.each(function (d, isB) {
                for (let j = 0; j < attr.length; j++) {
                    if ((datafirstChild[isB].attr[0][attr[j]] == null) || (datafirstChild[isB].attr[0][attr[j]] == 'undefined')) {
                    } else {
                        d3.select(this).selectAll('.text')
                            .data(datafirstChild[isB].attr[0][attr[j]])
                            .enter()
                            .append("text")
                            .attr("class", "subchildRectText text" + root[iB].children[isB].id)
                            .attr("id", function (data, i) {
                                return "subchildRect_" + iB + "sub_" + data + root[iB].children[isB].id;

                            })
                            .text(function (d) {
                                let title;
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        title = e.title;
                                    }
                                });
                                return title;
                            })
                            .call(wrapLabel, 200, false)
                            .on("click", function (d) {
                                let url;

                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        url = e.url;
                                        window.open(url);
                                    }
                                });
                            }).on("click", function (d) {

                            let TitleValueID = d3.select(this).attr('id').substr(3);

                            d3.selectAll(".description").classed('fadeout', 'true');
                            d3.selectAll("." + TitleValueID).classed('fadeout', 'false');
                            d3.selectAll("." + TitleValueID).classed('fadein', 'true');


                        });

                        d3.select(this).selectAll('.description1')
                            .data(datafirstChild[isB].attr[0][attr[j]])
                            .enter()
                            .append("text")
                            .attr("class", function (data, i) {
                                return "description fadeout subchildRectsubText description" + root[iB].children[isB].id + " childRect_" + iB + "sub_" + data + root[iB].children[isB].id
                            })
                            .attr("id", function (data, i) {
                                return "subchildRect_" + iB + "sub_" + data + root[iB].children[isB].id;
                            })
                            .text(function (d, i) {
                                let title;
                                $.grep(root[j].children, function (e) {
                                    if (d === e.id) {
                                        title = e.description;
                                    }
                                });
                                return title;
                            }).call(wrapLabel, 200, false);
                        d3.selectAll('.description')
                            .selectAll('.tspan').filter(function (d, i, j) {
                            return i >= 2;
                        }).remove();

                        d3.selectAll('.description').append('tspan')
                            .data(datafirstChild[isB].attr[0][attr[j]])
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
                            .data(datafirstChild[isB].attr[0][attr[j]])
                            .on("click", function (d) {
                                let url;

                                let currentNavId = d3.select(this).attr('id');
                                let currentNavNode = d3.select(this).attr('type');

                                localStorage.setItem('currentNode', currentNavNode);
                                localStorage.setItem('currentId', currentNavId);

                                url = '/hsle'
                                window.open(url, '_blank');

                                $.grep(root[j].children, function (e) {
                                    /*for later usage
                                    if (d === e.id) {
                                        url = e.url;
                                        window.open(url);
                                    }
                                    */
                                });

                                //   const arr = new Array();
                                //       $.each(datafirstChild[isB].attr[0][attr[j]], function(key, value) {
                                //           if ((value == null) || (value == 'undefined') || datafirstChild[isB].attr[0][attr[j]] > 0) {
                                //           }
                                //           else {
                                //
                                //               arr.push(value);
                                //
                                //           }
                                //
                                //       });
                                //   console.log(arr);

                            });

                        // d3.selectAll('.tspanMore')
                        //     .insert('tspan', ':last-child')
                        //     .attr('dy', 60)
                        //     .attr('dx', 100)
                        //     .text('...');
                    }
                }

                let angle;
                let num = d3.selectAll('.text' + root[iB].children[isB].id).size();
                d3.selectAll('.text' + root[iB].children[isB].id).each(function (d, i) {
                    let parentXValue = d3.select(this.parentNode).select('.childRect').attr("cx");
                    let parentYValue = d3.select(this.parentNode).select('.childRect').attr("cy");
                    angle = (i / (num / 2)) * Math.PI;
                    let cx = ((oR + 350 * Math.cos(angle))) + Math.round(parentXValue) + 500; // Calculate the x position of the element.
                    let cy = ((oR + 150 * Math.sin(angle))) + Math.round(parentYValue) + 330; // Calculate the y position of the element.
                    d3.select(this).selectAll('tspan').attr("x", cx);
                    d3.select(this).selectAll('tspan').attr("y", cy);
                })
                d3.selectAll('.description' + root[iB].children[isB].id)
                    .each(function (d, i) {
                        let parentValueID = d3.select(this).attr('id');

                        let parentXValue = $('#' + parentValueID).find('tspan').attr('x');
                        let parentYValue = $('#' + parentValueID).find('tspan').attr('y');

                        d3.select(this).selectAll('tspan').attr("x", parentXValue);
                        d3.select(this).selectAll('tspan').attr("y", parseInt(parentYValue) + 50);
                    })
            })
        }

        function wrapLabel(text, width, top) {
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
                    .attr('dx', 0)


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
                            .attr('class', 'tspan')

                            .attr("dy", ++lineNumber + "em")
                            .text(word);
                        if (top==true)
                        {
                            d3.selectAll('.tspan').attr('dx', -165)
                        }
                    }
                }

            });
        }

    });

    function getCategoryName(j,d, root) {
       return root[j].name;
    }
    
    function getColor(j, d, root) {
        let color;
        $.grep(root[j].children, function (e) {
            if (d === e.id) {
                color = root[j].color;
            }
            return color;
        });
    }

    function appendGradients(svg) {
        let def = svg.append('defs');
        let gradients = def.append('linearGradient').attr('id',"topics").attr('x1','0%').attr('y1','0%').attr('x2','100%').attr('y2','0%');
        gradients.append('stop').attr('offset','0%').attr('class',"topics" + "_a")
        gradients.append('stop').attr('offset','50%').attr('class',"topics" + "_b");
        gradients.append('stop').attr('offset','100%').attr('class',"topics" + "_c");

        gradients = def.append('linearGradient').attr('id',"scenarios").attr('x1','0%').attr('y1','0%').attr('x2','100%').attr('y2','0%');
        gradients.append('stop').attr('offset','0%').attr('class',"scenarios" + "_a")
        gradients.append('stop').attr('offset','50%').attr('class',"scenarios" + "_b");
        gradients.append('stop').attr('offset','100%').attr('class',"scenarios" + "_c");

        gradients = def.append('linearGradient').attr('id',"tools").attr('x1','0%').attr('y1','0%').attr('x2','100%').attr('y2','0%');
        gradients.append('stop').attr('offset','0%').attr('class',"tools" + "_a")
        gradients.append('stop').attr('offset','50%').attr('class',"tools" + "_b");
        gradients.append('stop').attr('offset','100%').attr('class',"tools" + "_c");
    }
});