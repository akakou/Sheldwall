function show_access_count(){
  var day = new Date();
  MONTHS = [];

  for(count = 0; count <= 30; count++) {
    if(day.getDate() === 1 || count === 0){
      day_string = day.getMonth() + '/' + day.getDate();
    }else{
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
        label: "My First dataset",
        backgroundColor: window.chartColors.red,
        borderColor: window.chartColors.red,
        data: [
          0,
          50,
          100,
          50,
          0,
          50,
          0,
          50,
          100,
          50,
          0,
          50,
          0,
          50,
          100,
          50,
          0,
          50,
          100,
          0,
          50,
          100,
          50,
          0,
          50,
          0,
          50,
          100,
          50,
          100,
          50
        ],
        fill: false,
    }, {
        label: "My Second dataset",
        fill: false,
        backgroundColor: window.chartColors.blue,
        borderColor: window.chartColors.blue,
        data: [
          10,
          5,
          10,
          5,
          10,
          10,
          5,
          10,
          5,
          10,
          10,
          5,
          10,
          5,
          10,
          10,
          5,
          10,
          5,
          10,
          10,
          5,
          10,
          5,
          10,
          10,
          5,
          10,
          5,
          10,
          5
        ],
      }]
    },
    options: {
      responsive: true,
      title:{
        display:true,
        text:''
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
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      }
    }
  };

  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.name = 'chart';
  window.myLine = new Chart(ctx, config);
  location.href = '#canvas';
}
