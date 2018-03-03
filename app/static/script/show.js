var ctx = null;

function show_all_access_count(){
  var access_count = get_data_list('access-count');
  var all_count = 0;

  for(var access of access_count){
    all_count = all_count + access.count;
  }

  var all_access_counter = document.getElementById('all_access_count');
  all_access_counter.innerHTML = all_count;
}

function show_all_block_count(){
  var access_count = get_data_list('block-count');
  var all_count = 0;

  for(var access of access_count){
    all_count = all_count + access.count;
  }

  var all_access_counter = document.getElementById('all_block_count');
  all_access_counter.innerHTML = all_count;
}

function show_most_accessed_destination(){
  var access_count = get_data_list('access-destionation');

  var most_accessed = {
    data: '', count:0
  }
  console.log(access_count)
  for(var access of access_count){
    if(access.count >= most_accessed.count){
      most_accessed = access  
    }
  }


  var most_accessed_destination = document.getElementById('most_accessed_destination');
  most_accessed_destination.innerHTML = most_accessed.data;
}

function show_most_blocked_destination(){
  var access_count = get_data_list('block-destination');

  var most_blocked = {
    data: '', count:0
  }
  console.log(access_count)
  for(var access of access_count){
    if(access.count >= most_blocked.count){
      most_blocked = access;
    }
  }


  var most_blocked_destination = document.getElementById('most_blocked_destination');
  most_blocked_destination.innerHTML = most_blocked.data;
}

function show_access_count() {
  var remove = document.getElementById('charts');
  remove.innerHTML = "<canvas id=\"canvas\" name=\"canvas\"></canvas>"

  var day = new Date();
  MONTHS = [];
  var a_day = 86400000;
  var thirty_days = a_day * 30;

  day = new Date(day.getTime() - thirty_days)
  var data = [];

  for (var count = 0; count <= 30; count++) {
    if (day.getDate() === 1 || count === 0) {
      day_string = day.getMonth() + '/' + day.getDate();
    } else {
      day_string = day.getDate();
    }
    data.push({date:day.getDate(), month:day.getMonth(), is_unchanged:true});

    MONTHS.push(day_string);
    day = new Date(day.getTime() + a_day);
    console.log(day)
  }
  


  var access_count = get_data_list('access-count');

  for(var access of access_count){
    var access_date = new Date(access.data);

    var change_index = data.findIndex(function(element, index, array){
      console.log(element.date + ':' + access_date.getDate())
      console.log(element.month + ':' + access_date.getMonth())
      return element.date == access_date.getDate() && element.month == (access_date.getMonth());
    });
    console.log(change_index)
    data[change_index] = {data:access.count, is_unchanged:false};
  }


  var all_access_data = 0;

  for(var index in data) {
    if(data[index].is_unchanged){
      data[index] = 0;
    }else{
      data[index] = data[index].data;
      all_access_data = all_access_data + data[index];
    }
  }



  var config = {

    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: 'Access Count / Month',
        backgroundColor: 'rgb(81,146,81)',
        borderColor: 'rgb(81,146,81)',
        data: data,
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
  var a_day = 86400000;
  var thirty_days = a_day * 30;

  day = new Date(day.getTime() - thirty_days)
  var data = [];

  for (var count = 0; count <= 30; count++) {
    if (day.getDate() === 1 || count === 0) {
      day_string = day.getMonth() + '/' + day.getDate();
    } else {
      day_string = day.getDate();
    }
    data.push({date:day.getDate(), month:day.getMonth(), is_unchanged:true});

    MONTHS.push(day_string);
    day = new Date(day.getTime() + a_day);
  }
  


  var access_count = get_data_list('block-count');

  for(var access of access_count){
    var access_date = new Date(access.data);

    var change_index = data.findIndex(function(element, index, array){
      console.log(element.date + ':' + access_date.getDate())
      console.log(element.month + ':' + access_date.getMonth())
      return element.date == access_date.getDate() && element.month == (access_date.getMonth());
    });
    console.log(change_index)
    data[change_index] = {data:access.count, is_unchanged:false};
  }


  for(var index in data) {
    if(data[index].is_unchanged){
      data[index] = 0;
    }else{
      data[index] = data[index].data;
    }
  }



  var config = {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{
        label: "Block Count / Month",
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: data,
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


function show_access_destination() {
  var remove = document.getElementById('charts');
  remove.innerHTML = "<canvas id=\"canvas\" name=\"canvas\"></canvas>"
  
  var destination_data = get_data_list('access-destionation')
  var host_name_list = [];
  var data = [];

  for(var access of destination_data){
    host_name_list.push(access.data);
    data.push(access.count);
  }
  

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var color = Chart.helpers.color;
  var barChartData = {
    labels: host_name_list,
    datasets: [{
      label: 'Destination Host',
      backgroundColor: color('rgb(44,73,133)').alpha(0.5).rgbString(),
      borderColor: 'rgb(44,73,133)',
      borderWidth: 1,
      data: data
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
            labelString: 'Host Name'
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


function show_block_destination() {
  var remove = document.getElementById('charts');
  remove.innerHTML = "<canvas id=\"canvas\" name=\"canvas\"></canvas>"

  var destination_data = get_data_list('block-destination')
  var host_name_list = [];
  var data = [];

  for(var access of destination_data){
    host_name_list.push(access.data);
    data.push(access.count);
  }
  
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var color = Chart.helpers.color;
  var barChartData = {
    labels: host_name_list,
    datasets: [{
      label: 'Destination Host',
      backgroundColor: color(window.chartColors.black).alpha(0.5).rgbString(),
      borderColor: window.chartColors.black,
      borderWidth: 1,
      data: data
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
            labelString: 'Host Name'
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
      var split_tag = tag.value.split(',');
      split_tag[1] = Number(split_tag[1]);
      result.push({data:split_tag[0], count:split_tag[1]});
      count ++;
    }
  }

  return result;
}
