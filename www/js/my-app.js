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
        cBlock3.className = "card-content-inner";
          
        cBlock3.innerHTML = "<p>Цель = <b>" + prakticData.prakticLength + "</b></p>"
            + "<p>Выполнено = <b>" + prakticData.prakticSum + "</b></p>"
            + "<p>% выполнения = <b>" + (prakticData.prakticSum/prakticData.prakticLength * 100 ^ 0) + "</b></p>"
            + "<p><a href=\"praktic.html\" class=\"button button-big go-praktic\" type=\""
            + key
            + "\">Go!</a></p>";
        
        cBlock3.appendChild(cBlock4);    
        cBlock1.appendChild(cBlock2);
        cBlock1.appendChild(cBlock3);
         cBlock.appendChild(cBlock1);       
    
        var my_div = document.getElementById("page-content");  
        my_div.appendChild(cBlock);
    
    }
    
    //в параметер type лежит ключ к данным в ЛокалСторейдже
    $$('.go-praktic').on('click', function () {
         prakticId = event.target.type;
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
    console.log(prakticId + " prakticId");
    var prakticData = JSON.parse(localStorage.getItem(prakticId));
    var date = new Date();
    var my_div = document.getElementById("content-block-title");  
        my_div.innerHTML = prakticData["prakticName"];     
    
    var options = {
     // era: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'long',
      //timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      //second: 'numeric'
    };
    piecePraktic=[]; 
    pieceDate=[];
    var str = "<p>Установлена длина одного круга <b>" + prakticData["prakticCircleLength"] + "</b> </p>"
                + "<p>Предыдущие сессии:  "; 
    
    if (prakticData.prakticPieces.length >0){
    
        var arr = prakticData.prakticPieces.split("=");

        for (i=arr.length-1; i>=0; i--){
            var dataKey = arr[i].indexOf(":",0); //определили позицию разделителя
                piecePraktic[i] = arr[i].substring(0,dataKey); //выделили кол-во повторений
                pieceDate[i] = arr[i].substring(dataKey+1,arr[i].length); //выделили дату-время
                date.setTime(pieceDate[i]);
                str += "<br>" + date.toLocaleString("ru", options) +  " : " + piecePraktic[i] +" ";
        }
    }   
     
    str += " </p>";
 
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
