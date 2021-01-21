
async function drawLineChart() {
  const dataset = await d3.json("./my_weather_data.json");
//   console.log(dataset);
  const yAccessor = d => d.temperatureMax;
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = d => dateParser(d.date);
//   console.log(yAccessor(dataset[8]));
//   console.log(xAccessor(dataset[8]));

  const dimensions = {
    width: 800, 
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  
  const wrapper = d3.select(".line")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .attr("viewBox", `0 0 800 400`)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${
    dimensions.margin.left}px, ${ 
    dimensions.margin.top}px)`);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures = bounds.append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "cornflowerblue")
    .attr('fill-opacity', 0.2)

 const lineGenerator = d3.line()
   .x(d => xScale(xAccessor(d)))
   .y(d => yScale(yAccessor(d)))
 const line = bounds.append("path")
   .attr("d", lineGenerator(dataset))
   .attr("fill", "none")
   .attr("stroke", "gold")
   .attr("stroke-width", 2)

 const yAxisGenerator = d3.axisLeft()
   .scale(yScale)

 const yAxis = bounds.append("g")
   .call(yAxisGenerator)

const yAxisLabel = yAxis.append("text")
   .attr("x", -dimensions.boundedHeight / 2)
   .attr("y", -dimensions.margin.left + 10)
   .attr("fill", "white")
   .style("font-size", "1.4em")
   .text("Daily Max Temp")
   .style("transform", "rotate(-90deg)")
   .style("text-anchor", "middle")

 const xAxisGenerator = d3.axisBottom()
   .scale(xScale)

 const xAxis = bounds.append("g")
   .call(xAxisGenerator)
   .style("transform", `translateY(${ 
   dimensions.boundedHeight
   }px)`)

}

async function drawScatter() {
    const dataset = await d3.json("./my_weather_data.json");
    // console.table(dataset[0])
    const xAccessor = d => d.dewPoint;
    const yAccessor = d => d.humidity;
    const colorAccessor = d => d.cloudCover;

    const dimensions = {
        width: 800, 
        height: 400,
        margin: {
          top: 10,
          right: 10,
          bottom: 50,
          left: 50,
        },
      };
    
    dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

    const wrapper = d3.select(".scatter")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .attr("viewBox", `0 0 800 400`)
    
    const bounds = wrapper.append("g") .style("transform", `translate(${
        dimensions.margin.left}px, 
        ${dimensions.margin.top}px)`)
    
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0])
        .nice()

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(dataset, colorAccessor))
        .range(["skyblue", "darkslategrey"])
        
    // bounds.append("circle")
        // .attr("cx", dimensions.boundedWidth / 2)
        // .attr("cy", dimensions.boundedHeight / 2)    //This was a test dot
        // .attr("r", 5)
   
    // dataset.forEach(d => {
    //     bounds
    //         .append("circle")
    //         .attr("cx", xScale(xAccessor(d)))     // Loops are bad they cause problems
    //         .attr("cy", yScale(yAccessor(d)))
    //         .attr("r", 5)
    //     })

    const dots = bounds.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 5)
        .attr("fill", d => colorScale(colorAccessor(d)))

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "white")
        .style("font-size", "1.4em")
        .html("Dew point (&deg;F)")

    const yAxisGenerator = d3.axisLeft() .scale(yScale)
        .ticks(4)
    
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
        .attr("x", -dimensions.boundedHeight / 2)
        .attr("y", -dimensions.margin.left + 10)
        .attr("fill", "white")
        .style("font-size", "1.4em")
        .text("Relative humidity")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")
          


}


async function drawHistogram() {
    const dataset = await d3.json("./my_weather_data.json");
    const metricAccessor = d => d.humidity;

    const dimensions = {
        width: 800, 
        height: 400,
        margin: {
          top: 30,
          right: 10,
          bottom: 50,
          left: 10,
        },
      };
    
    dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom


    const wrapper = d3.select(".hist") 
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)


    const bounds = wrapper.append("g") 
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${ dimensions.margin.top
        }px)`)
    
    const xScale = d3.scaleLinear() 
        .domain(d3.extent(dataset, metricAccessor))
        .range([0, dimensions.boundedWidth])
        .nice()


    const binsGenerator = d3.histogram()
        .domain(xScale.domain())
        .value(metricAccessor)
        .thresholds(12)

    const bins = binsGenerator(dataset)


    const yAccessor = d => d.length

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)]) 
        .range([dimensions.boundedHeight, 0])
        .nice()

    const binsGroup = bounds.append("g")

    const binGroups = binsGroup.selectAll("g")
        .data(bins)
        .enter().append("g")
    
    const barPadding = 2

    const barRects = binGroups.append("rect")
        .attr("x", d => xScale(d.x0) + barPadding / 2)
        .attr("y", d => yScale(yAccessor(d))) .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr("fill", "cornflowerblue")
    
    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
        .attr("y", d => yScale(yAccessor(d)) - 5)
        .text(yAccessor)
        .attr("fill", "white")
        .style("text-anchor", "middle")

    const mean = d3.mean(dataset, metricAccessor)

    const meanLine = bounds.append("line")
        .attr("x1", xScale(mean))
        .attr("x2", xScale(mean))
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke", "red")
        .attr("stroke-dasharray", "5px 4px")

    const meanLabel = bounds.append("text")
        .attr("x", xScale(mean))
        .attr("y", -20)
        .text("Mean")
        .attr("fill", "red")
        .style("font-size", "12px")
        .style("text-anchor", "middle")

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
        const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "white")
        .style("font-size", "1.4em")
        .text("Humidity")

        


}



drawLineChart();
drawScatter();
drawHistogram();