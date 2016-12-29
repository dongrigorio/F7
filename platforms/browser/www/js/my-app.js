// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var prakticId = "";
var piecePraktic = [];
var pieceDate =[];
var sumPraktic = 0;

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

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");

    //gmg- формируем первую страницу
    for (var key in localStorage) { 

        //читаем данные из хранилища чтобы показать на 1 странице
        // на каждую практику в локалсторадже заводится ОДНА строка
    
        var prakticData=JSON.parse(localStorage.getItem(key));

        //разбираем prakticData.dataPrakticPieces. Формат +количество:дата    
        if (typeof prakticData["dataPrakticPieces"] !== "undefined") { //если переменная имеется
            
            // ищем первое вхождение
            var firstPos = lastPos = foundPos =  prakticData.dataPrakticPieces.indexOf("+", 0);
            var pos = foundPos +1;
            var i=0;
            // если имеется первое вхождение - ищем остальные 
            while (foundPos >0) {
            
                firstPos = foundPos;
                
                foundPos = prakticData.dataPrakticPieces.indexOf("+", pos);
                
                (foundPos == -1) ? (lastPos = prakticData.dataPrakticPieces.length) : (lastPos = foundPos);

                var dataStr = prakticData.dataPrakticPieces.substring(firstPos+1, lastPos);
                
                var dataKey = dataStr.indexOf(":",0); //определили позицию разделителя
                piecePraktic[i] = dataStr.substring(0,dataKey); //выделили кол-во повторений
                pieceDate[i] = dataStr.substring(dataKey+1,dataStr.length) ; //выделили дату-время
                
                sumPraktic += +piecePraktic[i];

                pos = foundPos + 1; // продолжить поиск со следующей
                i++;
            }
        } 
        
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
       
        cBlock3.innerHTML = "<p>Цель = <b>" 
            + prakticData.prakticLength 
            + "</b></p>"
            + "<p>Выполнено = <b>" + +sumPraktic 
            + "</b></p><p>% выполнения = <b>" + sumPraktic/prakticData.prakticLength*100 + "</b></p>"
            + "<p><a href=\"praktic.html\" class=\"button button-big go-praktic\" type=\""
            + key
            + "\">Go!</a></p>";
        
        cBlock3.appendChild(cBlock4);    
        cBlock1.appendChild(cBlock2);
        cBlock1.appendChild(cBlock3);
         cBlock.appendChild(cBlock1);       
    
        var my_div = document.getElementById("page-content");  
        my_div.insertBefore(cBlock,my_div.lastChild);  
    
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //разобраться нужно ли 
    $$('.go-praktic').on('click', function () {
         prakticId = event.target.type;
    });
    
});
   
//gmg
myApp.onPageInit('addPraktic', function (page) {
    // Do something here for "addpraktic" page

    //практикИд = колчество записей в локалсторейдж
    prakticId = +new Date;
    
    $$('.cancel-data').on('click', function () {
        location.href="index.html";
    });
    
    $$('.save-data').on('click', function () {
        var formData = myApp.formToJSON('#addPraktic');
        localStorage.setItem(prakticId, JSON.stringify(formData));
        alert('Данные сохранены');
        location.href="index.html";
    });
});

myApp.onPageInit('praktic', function (page) {
    var prakticData=JSON.parse(localStorage.getItem(prakticId));

    
    
    var my_div = document.getElementById("content-block-title");  
    my_div.innerHTML = prakticData["prakticName"];  
    
    my_div = document.getElementById("circle-length"); 
    my_div.innerHTML = "<p>Установлена длина одного круга <b>" + prakticData["prakticCircleLength"] + "</b> </p>"; 
    
    
    $$('.cancel-data').on('click', function () {
        location.href="index.html";
    });
    
    $$('.save-data').on('click', function () {
        var formData = myApp.formToJSON('#dataPraktic');
        if ((+formData.dataPrakticPieces >0) || (+formData.dataPrakticCircles >0)) {
           
            prakticData.dataPrakticPieces += "+" + (+formData.dataPrakticPieces + (+formData.dataPrakticCircles * +prakticData["prakticCircleLength"]))
            + ":"
            + +new Date;
            
            /*
            prakticData.dataPrakticPieces += "+" + (+formData.dataPrakticPieces + (+formData.dataPrakticCircles * +prakticData["prakticCircleLength"]));
            
             prakticData.dataPrakticDate += "+" + +new Date;           
            */
            //alertObj(prakticData);
            localStorage.setItem(prakticId, JSON.stringify(prakticData));
            alert("Данные сохранены");
            location.href="index.html";
        }
    });
});

myApp.onPageInit('editpraktic', function (page) {
    var prakticData=JSON.parse(localStorage.getItem(prakticId));

    
    
    var my_div = document.getElementById("content-block-title");  
    my_div.innerHTML = prakticData["prakticName"];  
    
    my_div = document.getElementById("circle-length"); 
    my_div.innerHTML = "<p>Установлена длина одного круга <b>" + prakticData["prakticCircleLength"] + "</b> </p>"; 
    
    
    $$('.cancel-data').on('click', function () {
        location.href="index.html";
    });
    
    $$('.save-data').on('click', function () {
        var formData = myApp.formToJSON('#dataPraktic');
        if ((+formData.dataPrakticPieces >0) || (+formData.dataPrakticCircles >0)) {
           
            prakticData.dataPrakticPieces += "+" + (+formData.dataPrakticPieces + (+formData.dataPrakticCircles * +prakticData["prakticCircleLength"]))
            + ":"
            + +new Date;
            
            /*
            prakticData.dataPrakticPieces += "+" + (+formData.dataPrakticPieces + (+formData.dataPrakticCircles * +prakticData["prakticCircleLength"]));
            
             prakticData.dataPrakticDate += "+" + +new Date;           
            */
            //alertObj(prakticData);
            //localStorage.setItem(prakticId, JSON.stringify(prakticData));
            alert("Данные сохранены");
            //location.href="index.html";
        }
    });
});

//gmg
/**
// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
});
**/