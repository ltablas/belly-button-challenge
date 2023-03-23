// provide URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Use the D3 library to read in samples.json from the URL
d3.json(url).then(function(data) {
    console.log(data);
});

// create a function to initialize the dashboard
function dashboard() {

    d3.json(url).then(function(data) {
        //set up a variable for the dropdown menu
        var choices = d3.select("#selDataset");

        //cycle through each selection to populate the dropdown
        Object.entries(data.names).forEach(([k,v])=>{
            choices.append("option").attr("value", v).text(v);
            //console.log(v);
        });
        
        //load default data for first id
        let first = (data.names[0]);
        //console.log(first);

        create_bar(first);
        create_bubble(first);
        display_metadata(first);

    });

}

// create function to build the bar chart
function create_bar(x){

    // call data using d3
    d3.json(url).then(function(data) {

        // filter sample results for each sample id
        let sample = data.samples.filter(y => y.id == x);

        // get results for first id
        let result = sample[0];
        //console.log(result);

        // only retrieve the top 10 sample value results, and reverse the array to accomodate Plotly's defaults
        let sampleValues = result.sample_values.slice(0, 10).reverse();

        // retrieve otu_ids from the top 10 results
        let otuIDs = result.otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();

        // retrieve otu_labels from the top 10 results
        let otuLabels = result.otu_labels.slice(0,10).reverse();

        // Trace for the bar chart
        let trace = {
            x: sampleValues,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };
        
        // Data array
        let barData = [trace];
        
        // Apply a title to the bar chart that changes per selected test subject
        let layout = {
            title: `Top 10 Cultures Found in Test Subject ${x}`,
        };
        
        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", barData, layout);
    });
}

// create function to build the bubble chart using similar fuction as bar chart, but removing top 10 filter
function create_bubble(x){

    d3.json(url).then(function(data) {

        // filter sample results for each sample id
        let sample = data.samples.filter(y => y.id == x);

        // get results for first id
        let result = sample[0];
        //console.log(result);

        // retrieve sample values
        let sampleValues = result.sample_values;

        // retrieve otu_ids 
        let otuIDs = result.otu_ids;

        // retrieve otu_labels 
        let otuLabels = result.otu_labels;

        // Trace for the bubble chart
        let trace = {
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Picnic"
            }
        };
        
        // Data array
        let bubbleData = [trace];
        
        // Apply a title to the bubble chart that changes per selected test subject
        let layout = {
            title: `All Bacteria Cultures Found in Test Subject ${x}`,
            xaxis: {title: "OTU ID"},
        };
        
        // Render the plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubbleData, layout);
    });
}

// create function to display metadata, mimicking dashboard dropdown
function display_metadata(x){

    d3.json(url).then(function(data) {

        //set up a variable to select the demographics panel
        var panel = d3.select("#sample-metadata");

        // filter sample results for each sample id
        let sample = data.metadata.filter(y => y.id == x);

        // get results for first id
        let result = sample[0];
        //console.log(result);

        // clear existing metadata
        panel.html("");

        // load metadata using key-value pair
        Object.entries(result).forEach(([k,v])=>{
            panel.append("h5").text(`${k}: ${v}`);
        });
        
    });
}

//create function to update dashboard based on dropdown selection
function optionChanged(selection) { 

    // Log the new selection
    console.log(selection); 

    // Call all functions 
    create_bar(selection);
    create_bubble(selection);
    display_metadata(selection);

}

// call the dashboard function
dashboard();