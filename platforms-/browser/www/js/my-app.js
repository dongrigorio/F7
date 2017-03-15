// Initialize app
var myApp = new Framework7();
console.log("go!"); 

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var prakticId = "";
var piecePraktic = [];
var pieceDate =[];
var i = j = 0;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

function alertObj(obj) {
    var str = "";
    for (k in obj) {
        str += k + ": " + obj[k] + "\r\n";
    } 
    alert(str); 
} 

myApp.onPageInit('*', function (page) {
  console.log(page.name + ' initialized'); 
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    indexPage.trigger();
    
});
   
//gmg
var indexPage = myApp.onPageInit('index', function (page) {
    
     var key;
    //gmg- формируем первую страницу
    for (key in localStorage) { 

        //читаем данные из хранилища чтобы показать на 1 странице
        // на каждую практику в локалсторадже заводится ОДНА строка
    
        var prakticData=JSON.parse(localStorage.getItem(key));
        
        var cBlock = document.createElement("div");
        cBlock.className = "content-block";  
    
        var cBlock1 = document.createElement("div");
        cBlock1.className = "card";
       
        var cBlock2 = document.createElement("div");
        cBlock2.className = "card-header";
        cBlock2.innerHTML = prakticData.prakticName;
    
        var cBlock3 = document.createElement("div");
        cBlock3.className = "card-content";
         
        var cBlock4 = document.createElement("div");
        cBlock4.className = "card-content-inner";
          
        cBlock4.innerHTML = "<p>Цель = <b>" + prakticData.prakticLength + "</b></p>"
            + "<p>Выполнено = <b>" + prakticData.prakticSum + "</b></p>"
            //+ "<p>% выполнения = <b>" + (prakticData.prakticSum/prakticData.prakticLength * 100 ^ 0) + "</b></p>"
            + "<p><a href=\"praktic.html\" class=\"button button-big go-praktic\" type=\""
            + key
            + "\">Go!</a></p>";
        
        //alert(cBlock4.innerHTML);
        
        var cBlock6 = document.createElement("a");
        cBlock6.setAttribute("href", "praktic.html");
        cBlock6.setAttribute("class", "go-praktic-2");
        cBlock6.setAttribute("type", key);
        
        
        var cBlock5 = document.createElement("div");
        cBlock5.className = "ct-chart ct-double-octave";
        cBlock5.innerHTML = "<style type=\"text/css\">"
                        +   ".ct-series-a .ct-bar, .ct-series-a .ct-line, .ct-series-a .ct-point, .ct-series-a .ct-slice-donut {stroke: #39E639;}"
                        +   ".ct-series-b .ct-bar, .ct-series-b .ct-line, .ct-series-b .ct-point, .ct-series-b .ct-slice-donut {stroke: #FF4040;}"
                        +   "</style>";

        //сделано в %
        var piecesDone = +prakticData.prakticSum/+prakticData.prakticLength * 100 ^ 0;
        
        // осталось сделать в %
        var picesDo;
        
        if (piecesDone >100) {
            piecesDone =100;
        }
        // осталось в %
        (+piecesDone >0) ? (piecesDo = 100 - +piecesDone):( piecesDo = 100);
        /*
        new Chartist.Pie(cBlock5, {
          labels: ['Сделано', ''],
          series: [+piecesDone, +piecesDo]
        }, {
            donut: true,
            donutWidth: 30,
            startAngle: 270,
            total: 0,
            showLabel: false,
            horizontalBars: true,
            color: "green",

            chartPadding: 30,
            //labelOffset: -100,
            //labelDirection: 'explode'
        });
        
        
        */
        new Chartist.Bar(cBlock5, {
          labels: ['', ''],
          series: [ [+piecesDone], [+piecesDo]]
        }, {
          stackBars: true,
          horizontalBars: true,
          chartPadding: 15,
            seriesBarDistance: 100,
            axisY: {
                offset:10,
                padding: 100,
                position: 200
            },
            axisY: {
               offset:10,
                padding: 100,
                position: 200
            }
        });
        
        
        //cBlock6.appendChild(cBlock5);
        cBlock4.appendChild(cBlock5); 
        cBlock3.appendChild(cBlock4);    
        cBlock1.appendChild(cBlock2);
        cBlock1.appendChild(cBlock3);
        cBlock.appendChild(cBlock1);       
        
        var my_div = document.getElementById("page-content");  
        my_div.appendChild(cBlock);
        
    }
    
    //в параметер type лежит ключ к данным в ЛокалСторейдже
    $$('.go-praktic').on('click', function () {
        prakticId = event.target.getAttribute("type"); // type;
       
    });  

});




myApp.onPageInit('addPraktic', function (page) {
    // Do something here for "addpraktic" page

    //практикИд = колчество записей в локалсторейдж
    prakticId = +new Date();
    
    $$('.cancel-data').on('click', function () {
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        //location.href="index.html";
    });
    
    $$('.save-data-addPraktic').on('click', function () {
        var formData = myApp.formToJSON('#addPraktic');
        formData["prakticSum"] = "";
        formData["prakticPieces"] = ""; 
                
        //alertObj(formData);
        localStorage.setItem(prakticId, JSON.stringify(formData));
        myApp.alert('Данные сохранены',"addPraktic");
        //indexPage.trigger();  
        //mainView.router.refresh.previusPage();
        //mainView.router.refreshPreviousPage();
        //mainView.router.back({
        //    pageName: "index"
        //});
        
        //mainView.router.refreshPage();
        location.href="index.html";
    });
});

var pageInitPraktic = myApp.onPageInit('praktic', function (page) {
    console.log("= "+prakticId + " = prakticId");
    var prakticData = JSON.parse(localStorage.getItem(prakticId));
    var date = new Date();
    var my_div = document.getElementById("content-block-title");  
        my_div.innerHTML = prakticData["prakticName"];     
    
    var options = {
     // era: 'long',
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      //weekday: 'long',
      //timezone: 'UTC',
      //hour: 'numeric',
      //minute: 'numeric',
      //second: 'numeric'
    };
    piecePraktic=[]; 
    pieceDate=[];
    var str = "<p>Установлена длина одного круга <b>" + prakticData["prakticCircleLength"] + "</b> </p>";
    

    if (prakticData.prakticPieces.length > 0){
        
        var arr = prakticData.prakticPieces.split("=");
        var labels1 = [], series1 = [];
        var k;
        k = 0;
        for (i=arr.length-1; i>=0; i--){
            var dataKey = arr[i].indexOf(":",0); //определили позицию разделителя
                piecePraktic[i] = arr[i].substring(0,dataKey); //выделили кол-во повторений
                pieceDate[i] = arr[i].substring(dataKey+1,arr[i].length); //выделили дату-время
                date.setTime(pieceDate[i]);
               // str += "<br>" + date.toLocaleString("ru-RU", options) +  " : " + piecePraktic[i] +" ";
                labels1[i] = date.toLocaleString('en-GB', options);
                series1[i] = +piecePraktic[i];
                k += +piecePraktic[i];
        }
        str += "<p>Среднее количеcтво повторений за одну сессию:  " + ((+k/(arr.length-1))^0);
        str += "<p>Для достижения цели потребуется приблизительно " + ( (+prakticData.prakticLength - +prakticData.prakticSum)/(+k/(arr.length-1))^0  ) + " сессий.";
        str += " </p>";        
        
        date.setTime(+pieceDate[arr.length-1]- +pieceDate[0] + 5*1000*60*60*24);
        var periodDate = (date/ 24 / 60 / 60 / 1000 )^0;
        
        //for (i=periodDate; i>=0; i--){
            
           //if !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        
    }   
     
    
    
    
    
    new Chartist.Bar('.ct-chart-day', {
      labels: labels1,
      series: [series1]
    }, {
      //seriesBarDistance: 10,
      reverseData: true,
      Width: 60,
      horizontalBars: true,
      axisY: {
        offset: 70
      }
        
    });
    
    
 
    my_div = document.getElementById("circle-length"); 
    my_div.innerHTML = str;
    /* 
    $$('.cancel-data').on('click', function () {

        mainView.router.refreshPreviousPage();
    });
    */
    
    $$('.save-data-praktic').on('click', function () {
        var formData = myApp.formToJSON('#dataPraktic');
        if ((+formData.dataPrakticPieces >0) || (+formData.dataPrakticCircles >0)) {

            var sumSession = (+formData.dataPrakticPieces + (+formData.dataPrakticCircles * +prakticData["prakticCircleLength"]));
                        
            prakticData.prakticSum = +prakticData.prakticSum + +sumSession;
            //сохраняем последние 20 значений
            //если записано больше 19 значений то запишем все кроме первого, если меньше то все
            
            (piecePraktic.length >19) ? (j=1):(j=0);  
            
            prakticData.prakticPieces = "";
            
            for (j; j<piecePraktic.length; j++) {
                prakticData.prakticPieces += piecePraktic[j]
                + ":"
                + pieceDate[j]
                + "=";       
            }
            
            //записываем последнее введенное значение
            prakticData.prakticPieces += sumSession
            + ":"
            + +new Date();

            localStorage.setItem(prakticId, JSON.stringify(prakticData));
            //myApp.alert("Данные сохранены", "praktic");
            mainView.router.refreshPage();
        }
    });
    
    $$('.delete-last-data').on('click', function () {
        if (piecePraktic.length>0) {
            myApp.confirm("Удалить ?","", function () {
            
                prakticData.prakticSum = +prakticData.prakticSum - +piecePraktic[piecePraktic.length-1];

                console.log("1:  piecePraktic.length =" + piecePraktic.length); 

                piecePraktic.splice(piecePraktic.length-1, 1);
                pieceDate.splice(pieceDate.length-1, 1);  

                console.log("2:  DEL piecePraktic.length =" + piecePraktic.length); 

                prakticData.prakticPieces = "";

                if ((piecePraktic.length)>0){
                    for (j=0; j<piecePraktic.length; j++) {
                        prakticData.prakticPieces += piecePraktic[j]
                        + ":"
                        + pieceDate[j]
                        + "=";       
                    }
                }
                //отрезаем последнее равно
                prakticData.prakticPieces = prakticData.prakticPieces.substring(0,  prakticData.prakticPieces.length-1);
                console.log("prakticData.prakticPieces =" + prakticData.prakticPieces);

                localStorage.setItem(prakticId, JSON.stringify(prakticData));
                //myApp.alert("Последняя сессия удалена", "");

                mainView.router.refreshPage();
            });
        } else {
            myApp.alert("Нет данных для удаления", "");
            mainView.router.refreshPage();
        }
    });
    
});


myApp.onPageInit('editPraktic', function (page) {
    
    var prakticData=JSON.parse(localStorage.getItem(prakticId));

    document.editPraktic.prakticName.value = prakticData["prakticName"];
    document.editPraktic.prakticLength.value = prakticData["prakticLength"];
    document.editPraktic.prakticCircleLength.value = prakticData["prakticCircleLength"];
    
    
   // my_div = document.getElementById("circle-length"); 
   // my_div.innerHTML = "<p>Установлена длина одного круга <b>" + prakticData["prakticCircleLength"] + "</b> </p>"; 
    
    
    $$('.cancel-data').on('click', function () {
        mainView.router.back({
            pageName: "praktic"
        });
        
    });

    $$('.save-data-editPraktic').on('click', function () {
        prakticData["prakticName"] = document.editPraktic.prakticName.value;
        prakticData["prakticLength"] = document.editPraktic.prakticLength.value;
        prakticData["prakticCircleLength"] = document.editPraktic.prakticCircleLength.value;

        //alertObj(prakticData);
        localStorage.setItem(prakticId, JSON.stringify(prakticData));

        myApp.alert("Данные сохранены", "editPraktic");

        pageInitPraktic.trigger();
        mainView.router.back({
            pageName: "praktic"
        });

    });
    
    $$('.delete-praktic').on('click', function () {
             myApp.confirm("Удалить практику " + prakticData["prakticName"],"", function () {
                       
                 localStorage.removeItem(prakticId);
                 location.href="index.html";

            });
    });
    
    
    
});


/*
var data = {
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10','W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
  series: [
    [100, 200, 400, 800, 600, 20, 60, 55, 700, 2,100, 200, 400, 800, 600, 20, 60, 55, 700, 2]
  ]
};

var options = {
  //high: 10,
  //low: -10,

  axisX: {
    showGrid: false,
    labelInterpolationFnc: function(value, index) {
      return index % 2 === 0 ? value : null;
    }
  },
    width: "80%",
  // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
  height: "20%",
  // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
};

new Chartist.Bar('.ct-chart', data, options);



*/