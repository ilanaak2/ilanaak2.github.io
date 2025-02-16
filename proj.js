async function init() {
    const data = await d3.csv('https://raw.githubusercontent.com/ilanaak2/ilanaak2.github.io/main/Sleep_health_and_lifestyle_dataset.csv');

    //http://learnjsdata.com/group_data.html  for grouping and aggregation
    var averageStressPerJob = d3.nest()
        .key(function(d) { return d.Occupation; })
        .rollup(function(v) { return d3.mean(v, function(d) { return +d['Stress Level']; }); })
        .entries(data);
        //https://stackoverflow.com/questions/22849622/how-to-access-key-values-in-an-object-using-d3-js map function to get key values as domain
        var x = d3.scaleBand().domain(averageStressPerJob.map(function(d){return d.key})).range([0,680]).padding(0.1);
        var y = d3.scaleLinear().domain([0,10]).range([250,0]);
        var wh = 200;
        var t = 50;
        var u = 400;
        var s = d3.select("svg")
           .attr("width", 800)
           .attr("height", 400)
           .append("g")
              .attr("transform", "translate("+90+","+t+")");
        
        var maxAverage = d3.max(averageStressPerJob, function(d) { return d.value; });       
        s.append("g")
        .call(d3.axisLeft(y));

        //https://stackoverflow.com/questions/11189284/d3-axis-labeling axis labels
        s.append("text")
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("x", -60)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Stress Level Average");

       
 
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
        .text("Occupation");
           

        s.selectAll(".bar")
              .data(averageStressPerJob)
              .enter().append("rect")
              .attr("class", "bar")
                 .attr("x", function(d) { return x(d.key); })
                 .attr("y", function(d) { return y(d.value); })
                 .attr("width", x.bandwidth())
                 .attr("height", function(d) { return 250 - y(d.value);});
                
            //https://d3-annotation.susielu.com/ annotation reference
            const annotations = [{
            note: {
                label: "Max stress level : " + maxAverage,
            },
            x: 250,
            y: 100,
            dy: -20,
            dx: 20
            }]


            d3.select("svg")
            .append("g")
            .attr("class", "annotation-group")
            .call(d3.annotation().annotations(annotations))
}

init();

