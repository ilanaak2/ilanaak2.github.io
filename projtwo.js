async function init() {
    const data = await d3.csv('https://raw.githubusercontent.com/ilanaak2/ilanaak2.github.io/main/Sleep_health_and_lifestyle_dataset.csv');

    //http://learnjsdata.com/group_data.html  for grouping and aggregation
    var averageSleepDuration = d3.nest()
        .key(function(d) { return d.Age; })
        .rollup(function(v) { return d3.mean(v, function(d) { return +d['Sleep Duration']; }); })
        .entries(data);
        //https://stackoverflow.com/questions/22849622/how-to-access-key-values-in-an-object-using-d3-js map function to get key values as domain
        var x = d3.scaleBand().domain(averageSleepDuration.map(function(d){return d.key})).range([0,680]).padding(0.1);
        var y = d3.scaleLinear().domain([0,10]).range([250,0]);
        var wh = 200;
        var t = 50;
        var u = 400;
        var s = d3.select("svg")
           .attr("width", 800)
           .attr("height", 400)
           .append("g")
              .attr("transform", "translate("+90+","+t+")");
        var maxAverage = d3.max(averageSleepDuration, function(d) { return d.value; }); 
        var minAverage = d3.min(averageSleepDuration, function(d) { return d.value; }); 
              
        s.append("g")
        .call(d3.axisLeft(y));

        //https://stackoverflow.com/questions/11189284/d3-axis-labeling axis labels
        s.append("text")
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("x", -60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Sleep Duration Average");

       
 
        s.append("g")
        .attr("transform", "translate("+0+","+250+")")
        .call(d3.axisBottom(x))
        //https://stackoverflow.com/questions/11252753/rotate-x-axis-text-in-d3  want to adjust position on text since it's too long
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("transform", "rotate(-35)");
       
        s.append("text")
        .attr("text-anchor", "end")
        .attr('transform', 'translate(' + 300 + ', ' + 300 + ')')
        .text("Age");
          
        
        var tooltip = d3.select(".tooltip");
        
        s.selectAll(".bar")
              .data(averageSleepDuration)
              .enter().append("rect")
              .attr("class", "bar")
                 .attr("x", function(d) { return x(d.key); })
                 .attr("y", function(d) { return y(d.value); })
                 .attr("width", x.bandwidth())
                 .attr("height", function(d) { return 250 - y(d.value);})
                 .attr("stroke", function(d) {
                    if (d.value == maxAverage) {
                        return "orange";
                    }
                    if (d.value == minAverage){
                        return "blue";
                    }
                })
                .attr("stroke-width", function(d) {
                    if (d.value == maxAverage || d.value == minAverage) {
                        return 3;
                    }
                })
                 .on("mouseover", function(d) {
                    tooltip
                          .style("opacity", 1)
                          .style("left", (d3.event.pageX + 5) + "px")
                          .style("top", (d3.event.pageY - 30) + "px")
                          .html("Age: " + d.key  + ", Sleep Duration: " + d.value) 
                
               })
               .on("mouseout", function() {tooltip.style("opacity", 0)})
       
}

init();

