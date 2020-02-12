// set the dimensions and margins of the graph

var svg = d3.select("div#container")
  .append("svg")
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("viewBox", "0 0 650 450")
  .classed("svg-content", true);

var height = svg.attr('viewBox').split(' ')[3];
var width = svg.attr('viewBox').split(' ')[2];

//color scheme
var h = d3.schemeCategory20b;
//node color map
var myCol = d3.scaleOrdinal()
    .domain(function(d) { return d.data.name; })
    .range(h);

///////////auxiliary functions/////////////////////////
function nestedJSON(table) {
  var hirData = {"name": "root", "children":{}}

  table.forEach(function (d) {
    if (typeof hirData.children[d.topic] !== 'undefined' && typeof (hirData.children[d.topic].children || {})[d.story] !== 'undefined') {
      hirData.children[d.topic].children[d.story].children.push(d)
    }
    else if (typeof hirData.children[d.topic] !== 'undefined' && typeof (hirData.children.children || {})[d.story] === 'undefined'){
      hirData.children[d.topic].children[d.story] = {"name": d.story, "children": [d]}
    }
    else {
      hirData.children[d.topic] = {"name": d.topic, "children": {}};
      hirData.children[d.topic].children[d.story] = {"name": d.story, children:[d]}
    }
  });

  Object.keys(hirData.children).map(function (key) {
    hirData.children[key].children = Object.keys(hirData.children[key].children).map(function(subkey) {
    return hirData.children[key].children[subkey]
    })
  });

  hirData.children = Object.keys(hirData.children).map(function (key) {
        return hirData.children[key]
    });

  return hirData
}

function removeLeaves(node) {
      for (var i = 0 ; i < node.children.length; i++) {
        var obj = node.children[i];
        if (!obj.children) {
          node["value"]=1;
          delete node.children;
          return true;
        }
        else {
          removeLeaves(obj);
        }
      }
      return node
  }

function filterTree(root, value) {
  for (var i = 0 ; i < root.children.length; i++) {
    if (root.children[i].data.name === value) {
        return root.children[i];
    }
  }
}

//////////////////////////////////////////////////////
//read in data from tabular ;-separated csv (read csv  ist async) and initialize display with data
d3.text("data/themes.csv", function(error, data) {
  if (error) throw error;
  //turn text into json structure
  var psv = d3.dsvFormat(";");
  var table = psv.parse(data);
  //console.log(JSON.stringify(table));
  //build nested json structure with several levels of hierarchy (nestedJSON)
  //and remove leaves (removeChildren)
  var hirData = removeLeaves(nestedJSON(table));
  root = d3.hierarchy(hirData).sum(function(d) {return d.value;});
  radTopic = Math.sqrt(height*width)/(Math.sqrt(root.children.length)*Math.PI);
  //Calculate radius for topic circles
  root.children.map(function(d) { d['value'] = radTopic});
  //calculate radius story circles, save to radLeavers
  var numLeaves = 0
  for (i=0; i<root.data.children.length; i++) {
    for (j=0; j<root.data.children[i].children.length; j++) {
     //console.log(root.data.children[i].children[j])}
      numLeaves++
    }
  }
  radLeaf = (Math.sqrt(height*width)*1.27)/(Math.sqrt(numLeaves)*Math.PI);
  var hirData_1 = removeLeaves(hirData);
  root_1 = d3.hierarchy(hirData_1).sum(function(d) {return d.value;});
  root_1.children.map(function(d) { d['value'] = Math.sqrt(height*width)/(Math.sqrt(root.children.length)*Math.PI)});
  nodeArray = root_1.children;

  initializeDisplay();
});

function initializeDisplay() {
//to be called with a hierarchical object root (-> d3.hierarchy) but run on children arrays -> root.children or root.descendants()
    var rootNode = svg.append("g")
        .attr("class", "rootNode")
        .attr("transform", function(d) {return 'translate(' + [width/2, height/2] + ')'});

    rootNode.append("ellipse")
        .attr("fill", "indianred")
        .attr("opacity",0.3)
        .attr("stroke", "white")
        .attr("rx", height/2)
        .attr("ry", height/2)
        .on("mouseover", showTopics);

    rootNode.append('text')
      .text("AltersAtlas Themen")
      .style("font-size", "36px");



}
///////////////////////////MouseEvent1/////////////////////////////////////////
//First Layer Event
function showTopics(p, i) {
    d3.select(this)
      .remove();

    var packLayout = d3.pack()
      .size([width, height])
      .padding(0);

    packLayout(root_1);

    topicNodes = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(root_1.children)
      .enter().append("g")
      .attr("class", "topics")
      .attr('transform', function(d) {return 'translate(' + [d.x, d.y] + ')'})
      .attr("pointer-events", "none")
      .on("mouseover", showLeaves);


    topicNodes
        .transition().duration(2000).delay(2000)
        .attr("pointer-events", 'auto');

    var circles = topicNodes.append('circle')
      .style("fill", function(d) { return myCol(d.data.name); })
      .style("stroke", function(d) { return myCol(d.data.name); })
      .attr('r', function(d) { return d.value; });


    var labels = topicNodes.append('text')
      .selectAll("tspan")
      .data(function(d) {return d.data.name.split(' ');})
      .enter().append("tspan")
      .text(d => d)
      .style("font-size", "14px")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 1.0}em`);

    topicNodes.append("title")
      .text(function(d) {return d.data.name;});


    simulation = d3.forceSimulation()
      .force("x", d3.forceX().strength(0.1).x(width*0.5))
      // 0.1 ergäbe die perfekte Packung allerdings würde sie eine 90 grad Rotation der Koordinaten erfordern die man mit Translate ausführen muss
      .force("y", d3.forceY().strength(0.5).y(height*0.5))
      .force("charge", d3.forceManyBody().strength(0.2)) // Nodes attracted to one and other > 0
      .force("collide", d3.forceCollide().strength(0.06).radius(function(d){ return (d.value) }).iterations(4));// Force that avoids circle overlap


    initializeSimulation(root_1.children, topicNodes);
}

//////////////////////////MouseEvent2/////////////////////////////////////////
//Second Layer Event
function showLeaves(p,i) {
  d3.select(this).remove();
  var localX = this.__data__.x;
  var localY = this.__data__.y;
  var topic = this.children[2].innerHTML;
  var subroot = filterTree(root, topic);
  var dia = this.children[0].getAttribute("r")*2;

  delete subroot.parent;

  subroot.children.map(function(d) { d['value'] = radLeaf});

  var packLayout = d3.pack()
    .size([dia, dia])
    .padding(0);

  packLayout(subroot);

  for (var i = 0 ; i < subroot.children.length; i++) {
    subroot.children[i]["x"] = subroot.children[i]["x"]+localX-this.children[0].getAttribute("r")
    subroot.children[i]["y"] = subroot.children[i]["y"]+localY-this.children[0].getAttribute("r")
  }

  var oldNodes = svg.select(".nodes").selectAll("g");
  var oldNodesData = [];
  oldNodes.each(function(d) {oldNodesData.push(d); });
  var newNodesData = (oldNodesData).concat(subroot.children);

  updateNodes = svg.select(".nodes").selectAll("g").data(newNodesData)

  newNodes = updateNodes.enter().append("g")
    .attr("class", "stories")
    .attr('transform', function(d) {return 'translate(' + [d.x , d.y] + ')'});

  newNodes.append("circle")
    .style("fill", function(d) {return myCol(topic)})
    .attr('r', radLeaf);

  newNodes.append('text')
      .selectAll("tspan")
      .data(function(d) {return d.data.name.split(' ');})
      .enter().append("tspan")
      .text(function(d) { return d.substring(0, radLeaf/3); })
      .style("font-size", "10px")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 1.0}em`);

  newNodes.append("title")
    .text(function(d) {return d.data.name;});

  updateNodes.exit();

  simulation = d3.forceSimulation()
      .force("x", d3.forceX().strength(0.1).x(localX))
      // 0.1 ergäbe die perfekte Packung allerdings würde sie eine 90 grad Rotation der Koordinaten erfordern die man mit Translate ausführen muss
      .force("y", d3.forceY().strength(0.1).y(localY))
      .force("charge", d3.forceManyBody().strength(0.2)) // Nodes attracted to one and other > 0
      .force("collide", d3.forceCollide().strength(0.06).radius(function(d) {return d.value; }).iterations(4)); // Force that avoids circle overlap

  initializeSimulation(subroot.children, newNodes);

  var allNodes = d3.select(".nodes").selectAll("g");

  updateFunction(newNodesData, allNodes);

  var storyNodes = d3.select(".nodes").selectAll("g .stories").on("mouseover", zoomStory)
    .attr("pointer-events", "none")
    .on("mouseenter", zoomStory)
    .on("mouseleave", zoomOut)
    .on("onclick", goToStory)
    .transition().duration(1500).delay(1000)
      .attr("pointer-events", 'auto');

}
////////////////////////////ForceLayoutFunctions//////////////////////////////////////
function zoomStory(p,i) {
  var fac = 1.3
  d3.select(".nodes").selectAll("g circle")
    .style("opacity", function(d)
        {if ((((d.x+d.value) > (p.x-fac*radLeaf) && (d.x+d.value) < (p.x+fac*radLeaf)) ||
        ((d.x-d.value) < (p.x+fac*radLeaf) && (d.x-d.value) > (p.x-fac*radLeaf))) &&
        (((d.y+d.value) > (p.y-fac*radLeaf) && (d.y+d.value) < (p.y+fac*radLeaf)) ||
        ((d.y-d.value) < (p.y+fac*radLeaf) && (d.y-d.value) > (p.y-fac*radLeaf))))
         {return "0.5"; }});

  d3.select(this).select("g circle").attr('r', fac*radLeaf)
    .style("opacity", "0.7");
  d3.select(this).select("g text").selectAll("tspan")
    .text(function(d) { return d; })
    .style("font-size", "11px");
  }

function zoomOut(p,i) {
  d3.select(".nodes").selectAll("g circle").style("opacity", "0.6");
  d3.select(this).select("g circle").attr('r', radLeaf);
  d3.select(this).select("g text").selectAll("tspan")
    .text(function(d) { return d.substring(0, radLeaf/3); })
    .style("font-size", "10px");
  }

function goToStory(p,i) {
  d3.select(this).select("g").attr("xlink:href", function(d) { return "http://localhost:3010/AA?story=" + d.id});
  }

////////////////////////////ForceLayoutFunctions//////////////////////////////////////
function initializeSimulation(data, nodes) {
      simulation.nodes(data);
      simulation.on("tick", function(d) {
        for (let i = 0; i < 1; i++) {
          simulation.tick();
          nodes
            .attr("transform", function(d) {return "translate(" + d.x +"," + d.y +")"; })
        }
      });
}

function updateFunction(data, nodes) {

    if (simulation.alpha() === 1); {

      simulation = d3.forceSimulation()

      .force("charge", d3.forceManyBody().strength(0.2)) // Nodes attracted to one and other > 0
      .force("collide", d3.forceCollide().strength(0.06).radius(function(d){ return (d.value) }).iterations(4));// Force that avoids circle overlap

       simRestart(data, nodes);
    }

   }

function simRestart(data, nodes) {
  simulation.nodes(data);
  simulation.alphaTarget(0.3);
  simulation.on("tick", function(d) {
        for (let i = 0; i < 1; i++) {
          simulation.tick();
          nodes
            .attr("transform", function(d) {return "translate(" + d.x +"," + d.y +")"; })
        }
      });
}
