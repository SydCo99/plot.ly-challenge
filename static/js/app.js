function chartbuild(individual) {
    //read and sort sample data 
    d3.json("samples.json").then((sample_data) => {

        var parsed_data = sample_data.samples;
        console.log("parsed data:")
        console.log(parsed_data);

        var sample_dict = parsed_data.filter(item => item.id == individual)[0];
        console.log("sample_dict:")
        console.log(sample_dict);


        var sample_values = sample_dict.sample_values; 
        var bar_chart_values = sample_values.slice(0, 10).reverse();
        console.log("sample_values")
        console.log(bar_chart_values);

        //create list of labels 
        var id_values = sample_dict.otu_ids;
        var bar_chart_labels = id_values.slice(0, 10).reverse();
        console.log("otu_ids");
        console.log(bar_chart_labels);

        var reformatted_labels = [];
        bar_chart_labels.forEach((label) => {
            reformatted_labels.push("OTU " + label);
        });

        console.log("reformatted labels:");
        console.log(reformatted_labels);

        //make otu hovertext labels 
        var hovertext = sample_dict.otu_labels;
        var bar_chart_hovertext = hovertext.slice(0, 10).reverse();
        console.log("otu_labels");
        console.log(bar_chart_hovertext);


        var bar_chart_trace = {
            type: "bar",
            y: reformatted_labels,
            x: bar_chart_values,
            text: bar_chart_hovertext,
            orientation: 'h'
        };

        var bar_chart_data = [bar_chart_trace];

        Plotly.newPlot("bar", bar_chart_data);

        //make bubble chart using the data from above 
        var bubble_chart_trace = {
            x: id_values,
            y: sample_values,
            text: hovertext,
            mode: "markers",
            marker: {
                color: id_values,
                size: sample_values
            }
        };

        var bubble_chart_data = [bubble_chart_trace];

        var layout = {
            showlegend: false,
            height: 600,
            width: 1000,
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", bubble_chart_data, layout);
    });
}


function meta_data(indiviual) {

    // Read the json data
    d3.json("samples.json").then((sample_data) => {

        console.log(sample_data);

        // Parse and filter the data to get the individual's metadata
        var parsed_data = sample_data.metadata;
        console.log("parsed data for metadata:")
        console.log(parsed_data);

        var sample = parsed_data.filter(item => item.id == indiviual);
        console.log("sample[0]:");
        console.log(sample[0]);

        // update metadata 
        var metadata = d3.select("#sample-metadata").html("");

        Object.entries(sample[0]).forEach(([key, value]) => {
            metadata.append("p").text(`${key}: ${value}`);
        });

        console.log("next again");
        console.log(metadata);
    });
}

// Page load function (runs as page loads)
function init() {

    // Read data
    d3.json("samples.json").then((sample_data) => {

        // get sample names
        var parsed_data = sample_data.names;
        console.log("parsed data inside init function")
        console.log(parsed_data);

        // Add dropdown 
        var drop_down_menu = d3.select("#selDataset");

        parsed_data.forEach((name) => {
            drop_down_menu.append("option").property("value", name).text(name);
        })

        // Use initial sample to build the plots that get displayed on load
        meta_data(parsed_data[0]);

        chartbuild(parsed_data[0]);

    });
}

//function for when new individual is selected 
function next_individual(new_individual) {

    // Update metadata with newly selected individual
    meta_data(new_individual); 
    // Update charts with newly selected individual 
    chartbuild(new_individual);
}

// run page load function  
init();