var yearToRegionToData = null;

var svg = d3.select('#vis-container svg');
var svgWidth = $('#vis-container .vis svg').width();
var svgHeight = $('#vis-container .vis svg').height();

var margin = { top: 70, left: 120, bottom: 70, right: 120 };
var yScale = null;
var circleRadius = 5;

var leftCircleAndLabelGroup = null;
var rightCircleAndLabelGroup = null;
var lineGroup = null;


d3.csv('data/data.csv', dataProcessor).then(function(data) {

	yScale = getYScale(data);
	yearToRegionToData = nestData(data);

	initLeftCircleAndLabelGroup();
	initRightCircleAndLabelGroup();
	initLineGroup();

	drawLeftCirclesAndLabels();
	drawRightCirclesAndLabels();
	drawLines();
});

// 
// THE FIVE FUNCTIONS YOU NEED TO IMPLEMENT
// 

function getYScale(data) {
    /////////////////////////////////////////////////////////////////////
    //                        YOUR CODE HERE                           //
    /////////////////////////////////////////////////////////////////////
    
    yscale = d3.scaleLinear()
    		.domain(d3.extent(data, function(d){
    			return d.popularity;
    		}))
    		.range([svgHeight - margin.top - margin.bottom, 0]);

return yscale;
    /////////////////////////////////////////////////////////////////////
    //                        END OF YOUR CODE                         //
    /////////////////////////////////////////////////////////////////////
}

function nestData(data) {
    /////////////////////////////////////////////////////////////////////
    //                        YOUR CODE HERE                           //
    /////////////////////////////////////////////////////////////////////
    var nestedData = d3.nest()
	.key(function(d){
		return d.year;
	})
	.key(function(d){
		return d.region;
	})
	.object(data);
    
	return nestedData;
    /////////////////////////////////////////////////////////////////////
    //                        END OF YOUR CODE                         //
    /////////////////////////////////////////////////////////////////////
}

function drawLeftCirclesAndLabels() {
    /////////////////////////////////////////////////////////////////////
    //                        YOUR CODE HERE                           //
    /////////////////////////////////////////////////////////////////////
 
    var selectedYear = getSelectedLeftYear();
    var selectedRegion = getSelectedRegion();
    var selectedData = yearToRegionToData[selectedYear][selectedRegion];

    var leftCircles = leftCircleAndLabelGroup.selectAll('.leftCircle')
    	.data(selectedData, function(d) { return d.website; });

    // ENTER selection left circles
    var leftEnter = leftCircles.enter()
    	.append('g')
    	.attr('class','leftCircle');

    //UPDATE SECTION
    	leftCircles.merge(leftEnter)
        .transition()
        .duration(500)
        .attr('transform', function(d) {
            // Transform the group based on y property
            var ty = yScale(d.popularity);
            return 'translate('+[0, ty]+')';
        })
        .style('fill', function(d) { return getColor(d.website); })
        .style('stroke',function(d) { return getColor(d.website); });

    // Append a circle to the ENTER selection
    	leftEnter.append('circle')
    		.attr('r',circleRadius)
    		.style('fill-opacity',0.5);


    // Append a text to the ENTER selection
    	leftEnter.append('text')
    		.attr('x',-115)
    		.attr('y', 5)
    		.style('opacity',0.7)
    		.text(function(d){
    		return d.website;
    	})
    		.style('font-weight',10);

    
    
    //leftCircles.exit().remove();
    /////////////////////////////////////////////////////////////////////
    //                        END OF YOUR CODE                         //
    /////////////////////////////////////////////////////////////////////
}

function drawRightCirclesAndLabels() {
    /////////////////////////////////////////////////////////////////////
    //                        YOUR CODE HERE                           //
    /////////////////////////////////////////////////////////////////////
	var selectedYear = getSelectedRightYear();
    var selectedRegion = getSelectedRegion();
    var selectedData = yearToRegionToData[selectedYear][selectedRegion];

    var rightCircles = rightCircleAndLabelGroup.selectAll('.rightCircle')
    	.data(selectedData, function(d) { return d.website; });

    // ENTER selection left circles
    var rightEnter = rightCircles.enter()
    	.append('g')
    	.attr('class','rightCircle');

    //UPDATE SECTION
    	rightCircles.merge(rightEnter)
        .transition()
        .duration(500)
        .attr('transform', function(d) {
            // Transform the group based on y property
            var ty = yScale(d.popularity);
            return 'translate('+[0, ty]+')';
        })
        .style('fill', function(d) { return getColor(d.website); })
        .style('stroke',function(d) { return getColor(d.website); });
        

    // Append a circle to the ENTER selection
    	rightEnter.append('circle')
    		.attr('r',circleRadius)
    		.style('fill-opacity',0.5);
    		

    // Append a text to the ENTER selection
    	rightEnter.append('text')
    		.attr('x',20)
    		.attr('y', 5)
    		.style('opacity',0.7)
    		.text(function(d){
    		return d.website;
    	})
    		.style('font-weight',10);

    
     //rightCircles.exit().remove();
    /////////////////////////////////////////////////////////////////////
    //                        END OF YOUR CODE                         //
    /////////////////////////////////////////////////////////////////////
}

function drawLines() {
	var lineData = getLineData();
    /////////////////////////////////////////////////////////////////////
    //                        YOUR CODE HERE                           //
    /////////////////////////////////////////////////////////////////////

    var lineUpdate = lineGroup.selectAll('.line')
		.data(lineData, function(d) { return d.website; });

	var lineEnter = lineUpdate.enter()
		.append('g')
		.attr('class','line');

	// Append Line to ENTER  initial selection
	lineEnter.append('line')
		.attr('x1', function(d) { return d.x1; })
		.attr('y1', function(d) { return d.y1; })
		.attr('x2', function(d) { return d.x2; })
		.attr('y2', function(d) { return d.y2; });

// UPDATE Selection and re-assign the coordinates
	lineEnter.merge(lineUpdate)
		.transition()
		.duration(500)
		.select('line')
		.attr('x1', function(d) { return d.x1; })
		.attr('y1', function(d) { return d.y1; })
		.attr('x2', function(d) { return d.x2; })
		.attr('y2', function(d) { return d.y2; })
		.attr("stroke-width", 2)
        .style('stroke', function(d) { return getColor(d.website); });

    //lineUpdate.exit().remove();
    /////////////////////////////////////////////////////////////////////
    //                        END OF YOUR CODE                         //
    /////////////////////////////////////////////////////////////////////
}

// 
// HELPER FUNCTIONS
// 

function getSelectedRegion() {
	var selectedRegion = $('#title .region.selected').attr('region');

	return selectedRegion;
}

function getSelectedLeftYear() {
	var yearString = $('#vis-container .left .capsule.selected').attr('year');
	var year = parseInt(yearString);

	return year;
}

function getSelectedRightYear() {
	var yearString = $('#vis-container .right .capsule.selected').attr('year');
	var year = parseInt(yearString);

	return year;
}

function getLineData() {
	if (yScale == null) return [];
	var selectedLeftYear = getSelectedLeftYear();
	var selectedRightYear = getSelectedRightYear();
	var selectedRegion = getSelectedRegion();

	var dataForSelectedLeftYear = yearToRegionToData[selectedLeftYear][selectedRegion];
	var dataForSelectedRightYear = yearToRegionToData[selectedRightYear][selectedRegion];
	var circleMargin = 8;
	var lineData = [];

	for (let i = 0; i < dataForSelectedLeftYear.length; i++) {
		let currentWebsite = dataForSelectedLeftYear[i].website;
		let leftPopularity = dataForSelectedLeftYear[i].popularity;
		let rightPopularity = dataForSelectedRightYear.find(function(d) { return d.website == currentWebsite; }).popularity;

		let oldX1 = 0;
		let oldY1 = yScale(leftPopularity);
		let oldX2 = svgWidth - margin.right - margin.left;
		let oldY2 = yScale(rightPopularity);

		let newX1 = 0 + circleRadius + circleMargin;
		let newY1 = (oldY2 - oldY1) / (oldX2 - oldX1) * (newX1 - oldX1) + oldY1;
		let newX2 = svgWidth - margin.right - margin.left - circleRadius - circleMargin;
		let newY2 = (oldY2 - oldY1) / (oldX2 - oldX1) * (newX2 - oldX1) + oldY1;

		lineData.push({ 
			website: currentWebsite,
			x1: newX1, y1: newY1, x2: newX2, y2: newY2 
		});
	}

	return lineData;
}

function getColor(website) {
	var selectedLeftYear = getSelectedLeftYear();
	var selectedRightYear = getSelectedRightYear();
	var selectedRegion = getSelectedRegion();

	var dataForSelectedLeftYear = yearToRegionToData[selectedLeftYear][selectedRegion];
	var dataForSelectedRightYear = yearToRegionToData[selectedRightYear][selectedRegion];

	var leftValue = dataForSelectedLeftYear.find(function(d) { return d.website == website; }).popularity;
	var rightValue = dataForSelectedRightYear.find(function(d) { return d.website == website; }).popularity;
	
	if (rightValue - leftValue > 10) return '#3ac996';
	else if (rightValue - leftValue < -10) return '#e35669';
	else return '#d3d3d3';
}

// 
// OTHER FUNCTIONS
// 

function initLeftCircleAndLabelGroup() {
	var translateString = 'translate(' + margin.left + ',' + margin.top + ')';

	leftCircleAndLabelGroup = svg.append('g')
		.attr('class', 'left-group')
		.attr('transform', translateString);
}

function initRightCircleAndLabelGroup() {
	var translateString = 'translate(' + (svgWidth - margin.right) + ',' + margin.top + ')';

	rightCircleAndLabelGroup = svg.append('g')
		.attr('class', 'right-group')
		.attr('transform', translateString);
}

function initLineGroup() {
	var translateString = 'translate(' + margin.left + ',' + margin.top + ')';

	lineGroup = svg.append('g')
		.attr('class', 'lines')
		.attr('transform', translateString);
}

function dataProcessor(d) {
	return {
        region: d.region,
        website: d.website,
        year: +d.year,
        popularity: +d.popularity
    }
}