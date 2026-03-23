// src/js/chart.js
// D3 charting for Gradebook Explorer

function gradeToLetter(grade) {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

function getLetterFrequencies(nums) {
  const freq = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  if (!nums || nums.length === 0) {
    return freq;
  }

  for (let i = 0; i < nums.length; i++) {
    const letter = gradeToLetter(nums[i]);
    freq[letter]++;
  }

  const total = nums.length;

  for (let key in freq) {
    freq[key] = freq[key] / total;
  }

  return freq;
}

function updateChart(nums) {
  const svg = d3.select("#grade-chart");
  if (svg.empty()) return;

  svg.selectAll("*").remove();

  const freq = getLetterFrequencies(nums);

  const data = [
    { grade: "A", value: freq.A },
    { grade: "B", value: freq.B },
    { grade: "C", value: freq.C },
    { grade: "D", value: freq.D },
    { grade: "F", value: freq.F }
  ];

  const width = 800;
  const height = 420;

 
  const innerWidth = width - 90;
  const innerHeight = height -80;

  svg.attr("width", width).attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${70},${30})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.grade))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0]);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.grade))
    .attr("y", d => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.value))
    .attr("fill", "black");

  g.selectAll(".bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => xScale(d.grade) + xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.value) - 8)



  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));

  g.append("g")
    .call(d3.axisLeft(yScale));

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 45)
    .text("Grade");

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -45)

    .text("Frequency");
}