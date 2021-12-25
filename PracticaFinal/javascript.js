//Funcion que realiza una peticion al servidor PHP para obtener los datos
function peticionPHP() {
  $.ajax({
    url: 'server.php', // your php file
    type: 'GET', // type of the HTTP request
    success: function (data) {
      var obj = jQuery.parseJSON(data);
      cargarGraficoStock(obj.stock); //.stock -> apple_stock
      cargarGraficoStore(obj.appstore, obj.playstore); //.appstore -> app_store // .playstore -> play_store
      cargarGraficoReviews(obj.reviews); //.reviews -> apple_iphone_reviews
      cargarGraficoMapa(obj.mapa); //.mapa -> iphone_mapa
    }
  });
}

//Funcion que dibuja el grafico de stock (bolsa)
function cargarGraficoStock(obj) {
  var maximosPorAnos = [[], [], [], [], [], [], [], [], [], [], []]; //0 a 10 = 2010 a 2020
  var minimosPorAnos = [[], [], [], [], [], [], [], [], [], [], []]; //0 a 10 = 2010 a 2020
  for (i = 0; i < obj.length; i++) {
    var year = parseInt(obj[i][0][8] + obj[i][0][9]); //año actual
    var idx = year - 10;
    maximosPorAnos[idx].push(obj[i][4]);
    minimosPorAnos[idx].push(obj[i][5]);
  }

  //Calcular maximo/minimo de cada año
  var maximos = []; //array con el maximo de cada año
  var minimos = []; //arrray con el minimo de cada año
  for (i = 0; i < maximosPorAnos.length; i++) {
    maximos[i] = Math.max(...maximosPorAnos[i]);
    minimos[i] = Math.min(...minimosPorAnos[i]);
  }

  //Dibujar grafico
  Highcharts.chart('grafico1', {
    title: {
      text: 'Precio de las acciones de Apple (AAPL)'
    },
    subtitle: {
      text: '2010-2020'
    },
    colors: ['green', 'red'],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}€</b>'
    },
    yAxis: {
      title: {
        text: 'Dinero'
      },
      labels: {
        formatter: function () {
          return this.value + '€';
        }
      }
    },
    xAxis: {
      title: {
        text: 'Años'
      }
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 2010
      }
    },
    series: [{
      name: 'Máximo precio anual',
      data: maximos
    }, {
      name: 'Mínimo precio anual',
      data: minimos
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
      }]
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      x: 0,
      y: 0
    },
    credits: {
      enabled: false
    }
  });
}

//Funcion que dibuja el grafico de app store vs play store
function cargarGraficoStore(objA, objP) {
  //precios app store
  var precioA = [0, 0, 0, 0];
  for (i = 0; i < objA.length; i++) {
    if (objA[i] == 0) precioA[0] = precioA[0] + 1;
    else if (objA[i] <= 2) precioA[1] = precioA[1] + 1;
    else if (objA[i] <= 5) precioA[2] = precioA[2] + 1;
    else precioA[3] = precioA[3] + 1;
  }

  //precios play store
  var precioP = [0, 0, 0, 0];
  for (i = 0; i < objP.length; i++) {
    var p = parseFloat(objP[i].toString().replace("$", ""));
    if (p == 0) precioP[0] = precioP[0] + 1;
    else if (p <= 2) precioP[1] = precioP[1] + 1;
    else if (p <= 5) precioP[2] = precioP[2] + 1;
    else precioP[3] = precioP[3] + 1;
  }

  //Dibujar grafico
  Highcharts.chart('grafico2', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Precios de aplicaciones'
    },
    subtitle: {
      text: 'App Store vs Play Store'
    },
    colors: ['#3397b8', '#b062f4'],
    xAxis: {
      title: {
        text: 'Rango de precios'
      },
      categories: [
        'Gratis',
        '0.01€ - 2€',
        '2.01€ - 5€',
        'Más de 5€'
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Número de aplicaciones'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} apps</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: 'App Store',
      data: precioA

    }, {
      name: 'Play Store',
      data: precioP

    }],
    credits: {
      enabled: false
    }
  });
}

//Funcion que dibuja el grafico de las reviews
function cargarGraficoReviews(obj) {
  //Contabilizar el número de reviews de cada tipo
  var estrellas = [0, 0, 0, 0, 0, 0]; //reviews de 0 a 5
  for (i = 0; i < obj.length; i++) {
    var num = parseInt(obj[i]);
    estrellas[num] = estrellas[num] + 1; //incrementar numero de reviews;
  }
  var tot = estrellas[1] + estrellas[2] + estrellas[3] + estrellas[4] + estrellas[5];
  porcentajes = [0, (estrellas[1] / tot * 100), (estrellas[2] / tot * 100), (estrellas[3] / tot * 100),
    (estrellas[4] / tot * 100), (estrellas[5] / tot * 100)];

  //Dibujar grafico
  Highcharts.chart('grafico3', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Reviews del iPhone SE en 2021'
    },
    subtitle: {
      text: 'Según la web Flipkart'
    },
    colors: ['green', 'blue', 'yellow', 'orange', 'red'],
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'Reviews',
      colorByPoint: true,
      data: [{
        name: '5 estrellas',
        y: porcentajes[5],
        selected: true
      }, {
        name: '4 estrellas',
        y: porcentajes[4]
      }, {
        name: '3 estrellas',
        y: porcentajes[3]
      }, {
        name: '2 estrellas',
        y: porcentajes[2]
      }, {
        name: '1 estrella',
        y: porcentajes[1]
      }]
    }],
    credits: {
      enabled: false
    }
  });
}

//Funcion que dibuja el mapa del precio del iphone 11
function cargarGraficoMapa(obj) {
  var paises = [
    ["jp"], ["kr"], ["us"], ["ae"], ["sg"], ["th"], ["mx"], ["hk"], ["ru"], ["my"],
    ["au"], ["uk"], ["ch"], ["tw"], ["de"], ["at"], ["lu"], ["ie"], ["hu"], ["es"],
    ["cz"], ["ca"], ["fr"], ["be"], ["pt"], ["nl"], ["fi"], ["it"], ["no"], ["pl"],
    ["dk"], ["nz"], ["se"], ["ph"], ["tr"], ["br"], ["in"]
  ];

  //cargar datos de cada pais
  for (i = 0; i < paises.length; i++) {
    paises[i].push(obj[i]);
  }

  //Dibujar mapa
  Highcharts.mapChart('grafico4', {
    chart: {
      map: 'custom/world'
    },
    title: {
      text: 'Precio iPhone 11 por países'
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    tooltip: {
      pointFormat: '{point.name}: <b>{point.value}€</b>'
    },
    colorAxis: {
      min: 400,
      max: 800,
      minColor: '#ffc0c0',
      maxColor: '#710202'
    },
    series: [{
      data: paises,
      name: 'Precio',
      states: {
        hover: {
          color: '#ffd689'
        }
      }
    }],
    credits: {
      enabled: false
    }
  });
}