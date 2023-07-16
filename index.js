let educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData;
let countyData;
let dataStates;
let states;

let svg = d3.select("#root");
let tooltip = d3.select("#tooltip");

function drawMap() {
  let county;
  svg
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("class", "county states")
    .attr("d", d3.geoPath())
    .attr("fill", (d) => {
      county = educationData.find((item) => item.fips === d.id);
      if (county.bachelorsOrHigher < 15) return "#ecf7fa";
      else if (county.bachelorsOrHigher < 30) return "#b1e1e1";
      else if (county.bachelorsOrHigher < 45) return "#68c0a2";
      else if (county.bachelorsOrHigher < 58) return "#35a060";
      else return "#136c31";
    })
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      county = educationData.find((item) => item.fips === d.id);
      return county.bachelorsOrHigher;
    })
    .on("mouseover", (d) => {
      let county = educationData.find((item) => item.fips === d.id);
      tooltip
        .attr("data-education", county.bachelorsOrHigher)
        .style("left", d3.event.pageX + 15 + "px")
        .style("top", d3.event.pageY - 15 + "px")
        .style("visibility", "visible")
        .text(
          `${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%`
        );
    })
    .on("mouseout", (d) => tooltip.style("visibility", "hidden"));

  svg
    .append("path")
    .datum(dataStates)
    .attr("class", "federalStates")
    .attr("d", d3.geoPath());
}

fetch(countyURL)
  .then((response) => response.json())
  .then((data) => {
    countyData = topojson.feature(data, data.objects.counties).features;
    dataStates = topojson.mesh(data, data.objects.states, (a, b) => a !== b);
    console.log(countyData);
    fetch(educationURL)
      .then((response) => response.json())
      .then((data) => {
        educationData = data;
        console.log(educationData);
        drawMap();
      });
  })
  .catch((error) => {
    console.log(error);
  });