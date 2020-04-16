function init() {
    var sampleID = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        sampleID
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      buildChart1(sampleNames[0]);
      buildChart2(sampleNames[0]);
  })}
  
  init();
  
  function optionChanged(changeSample) {
    buildChart1(changeSample);
    buildChart2(changeSample);
    
  }
  
  function buildChart1(sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var filteredData = samples.filter(sampleData => sampleData.id == sample);
        var result = filteredData[0];
        var otuIds = result.otu_ids;
        var otuLabels = result.otu_labels;
        var sampleValues = result.sample_values;
        var filteredData = otuIds.slice(0, 10).map(barChart =>  `OTU ${barChart}`).reverse();
       
        
        //Bar Chart
        var trace = {
            x: sampleValues.slice(0, 10).reverse(),
            y: filteredData,
            text: otuLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: 'h',
            marker: {
              color: 'dark blue'
              }
        };
        var data = [trace];
        var layout = {
            title: "Top 10 Belly Button Bacterias",
            xaxis: { title: "OTU Bacteria Counts"}
                    };
        Plotly.newPlot("bar", data, layout);
        
        //Bubble Chart
        var bubbleFilteredData = otuIds.map(bubbleChart => bubbleChart);
        var trace2 = {
          x: bubbleFilteredData,
          y: sampleValues,
          text: otuLabels,
          mode: 'markers',
          marker: {
            size: sampleValues,
            color: otuIds
            }
        };
        var data2 = [trace2];
        
        var layout2 = {
          title: 'OTU Bacteria Counts',
          showlegend: false,
          xaxis: { title: "OTU ID"},
          yaxis: { title: "OTU Counts"}
        };
      Plotly.newPlot('bubble', data2, layout2);

      //Gauge Chart


    });
  } 

  function buildChart2(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var filteredData = metadata.filter(sampleID => sampleID.id == sample);
      var result = filteredData[0];
      var demo = d3.select("#sample-metadata");
      demo.html("");
      Object.entries(result).forEach(([demographic, dmgValue]) => {
        demo.append("h6").text(demographic.toUpperCase() + " : " + dmgValue);
      });
    });
  }