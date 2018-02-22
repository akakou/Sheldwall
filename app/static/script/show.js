var ctx = null;
function show_access_count() {
  var remove = document.getElementById('charts');
  remove.innerHTML = "<canvas id=\"canvas\" name=\"canvas\"></canvas>"

  var day = new Date();
  MONTHS = [];

  for (count = 0; count <= 30; count++) {
    if (day.getDate() === 1 || count === 0) {
      day_string = day.getMonth() + '/' + day.getDate();
    } else {
      day_string = day.getDate();
    }

    MONTHS.push(day_string);
    day.setDate(day.getDate() + 1);
  }



  var config = {

    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'Access Count / Month',
        backgroundColor: 'rgb(81,146,81)',
        borderColor: 'rgb(81,146,81)',
        data: get_data_list('access'),
        fill: false,
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: ''
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            stepSize: 1
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Count'
          }
        }]
      }
    }
  };

  ctx = document.getElementById("canvas").getContext("2d");
  ctx.name = 'chart';
  window.myLine = new Chart(ctx, config);
  location.href = '#canvas';
}

function show_access_block() {
  var remove = document.getElementById('charts');
  remove.innerHTML = "<canvas id=\"canvas\" name=\"canvas\"></canvas>"

  var day = new Date();
  MONTHS = [];

  for (count = 0; count <= 30; count++) {
    if (day.getDate() === 1 || count === 0) {
      day_string = day.getMonth() + '/' + day.getDate();
    } else {
      day_string = day.getDate();
    }

    MONTHS.push(day_string);
    day.setDate(day.getDate() + 1);
  }



  var config = {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: "Block Count / Month",
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: get_data_list('block'),
        fill: false,
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: ''
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            stepSize: 1
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Count'
          }
        }]
      }
    }
  };

  ctx = document.getElementById("canvas").getContext("2d");
  ctx.name = 'chart';
  window.myLine = new Chart(ctx, config);
  location.href = '#canvas';
}


function show_access_source() {
  var remove = document.getElementById('charts');
  remove.innerHTML = "<canvas id=\"canvas\" name=\"canvas\"></canvas>"

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var color = Chart.helpers.color;
  var barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: 'Source IP',
      backgroundColor: color('rgb(44,73,133)').alpha(0.5).rgbString(),
      borderColor: 'rgb(44,73,133)',
      borderWidth: 1,
      data: get_data_list('source')
    }]

  };

  ctx = document.getElementById("canvas").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            stepSize: 1
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Count'
          }
        }]
      },
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: ''
      }
    }
  });

  ctx.name = 'chart';
  location.href = '#canvas';
}


function show_access_destination() {
  var remove = document.getElementById('charts');
  remove.innerHTML = "<canvas id=\"canvas\" name=\"canvas\"></canvas>"

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var color = Chart.helpers.color;
  var barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: 'Destination IP',
      backgroundColor: color(window.chartColors.black).alpha(0.5).rgbString(),
      borderColor: window.chartColors.black,
      borderWidth: 1,
      data: get_data_list('source')
    }]

  };

  ctx = document.getElementById("canvas").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: ''
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            stepSize: 1
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Count'
          }
        }]
      }
    }
  });


  ctx.name = 'chart';
  location.href = '#canvas';
}

function get_data_list(type){
  var result = [];
  var count = 0;

  while (true){
    var tag = document.getElementById(type + '-' + count);
    
    if (!tag){
      break;  
    
    }else{
      tag = Number(tag.value);
      result.push(tag);
      count ++;
    }
  }

  return result;
}
