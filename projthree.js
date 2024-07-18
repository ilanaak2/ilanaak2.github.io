async function init() {
    const data = await d3.csv('https://raw.githubusercontent.com/ilanaak2/ilanaak2.github.io/main/Sleep_health_and_lifestyle_dataset.csv');
    function checkFunction() {
        
    
    //http://learnjsdata.com/group_data.html  for grouping and aggregation
    var averageActivity = d3.nest()
        .key(function(d) { return d.Occupation; })
        .rollup(function(v) { return d3.mean(v, function(d) { return +d['Physical Activity Level']; }); })
        //https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6 filter on entries for data
        .entries(data.filter(function(d) {
            //https://stackoverflow.com/questions/69047712/is-there-a-way-to-filter-an-array-of-objects-based-on-multiple-checkbox-values-o filter based on check box
            if(d.Gender == "Male" && document.getElementById("maleYes").checked) {
                return true;
            }
            if(d.Gender == "Female" && document.getElementById("femaleYes").checked) {
                return true;
            }
            else {
                return false;
            }
        }));
    
        //https://stackoverflow.com/questions/22849622/how-to-access-key-values-in-an-object-using-d3-js map function to get key values as domain
        var x = d3.scaleBand().domain(averageActivity.map(function(d){return d.key})).range([0,680]).padding(0.1);
        var y = d3.scaleLinear().domain([0,100]).range([250,0]);
        
        var s = d3.select("svg")
           .attr("width", 800)
           .attr("height", 400);

        //https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content remove svg from screen
        s.selectAll("*").remove();
        var wh = 200;
        var t = 50;
        var u = 400;
        var s = s.append("g")
        .attr("transform", "translate("+90+","+t+")");
        //https://stackoverflow.com/questions/42587999/find-the-max-value-in-a-column-in-d3-js max value
        var maxAverage = d3.max(averageActivity, function(d) { return d.value; }); 
              
        s.append("g")
        .call(d3.axisLeft(y));

        //https://stackoverflow.com/questions/11189284/d3-axis-labeling axis labels
        s.append("text")
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("x", -20)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Physical Activity Minutes Average");

       
 
        s.append("g")
        .attr("transform", "translate("+0+","+250+")")
        .call(d3.axisBottom(x))
        //https://stackoverflow.com/questions/11252753/rotate-x-axis-text-in-d3  want to adjust position on text since it's too long
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("transform", "rotate(-35)");
       
        s.append("text")
        .attr("text-anchor", "end")
        .attr("y", 315)
        .attr("x", 380)
        .attr("dy", "1em")
        .text("Occupation");
           
        var tooltip = d3.select(".tooltip");
        s.selectAll(".bar")
              .data(averageActivity)
              .enter().append("rect")
              .attr("class", "bar")
                 .attr("x", function(d) { return x(d.key); })
                 .attr("y", function(d) { return y(d.value); })
                 .attr("width", x.bandwidth())
                 .attr("height", function(d) { return 250 - y(d.value);})
                //https://stackoverflow.com/questions/25936593/d3-js-dynamically-setting-stroke-width-on-a-path  setting strokes
                .attr("stroke", function(d) {
                    if (d.value == maxAverage) {
                        return "orange";
                    }
                })
                .attr("stroke-width", function(d) {
                    if (d.value == maxAverage) {
                        return 3;
                    }
                })
                .on("mouseover", function(d) {
                    tooltip
                          .style("opacity", 1)
                          .style("left", (d3.event.pageX + 5) + "px")
                          .style("top", (d3.event.pageY - 30) + "px")
                          .html("Occupation: " + d.key  + ", Physical Activity: " + d.value) 
                
               })
               .on("mouseout", function() {tooltip.style("opacity", 0)});
            
            }
        //https://www.w3schools.com/jsref/event_onchange.asp  change event handler
        document.getElementById("maleYes").addEventListener("change", checkFunction);
        document.getElementById("femaleYes").addEventListener("change", checkFunction);
        checkFunction();
    
}

init();

