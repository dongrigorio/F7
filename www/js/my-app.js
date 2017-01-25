// Initialize app
var myApp = new Framework7();
console.log("go!"); 

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var prakticId = "";
var piecePraktic = [];
var pieceDate = [];
var i, j = 0;
var settings ={};

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

function alertObj(obj) {
    var str = "";
    var k;
    for (k in obj) {
        str += k + ": " + obj[k] + "\r\n";
    } 
    alert(str); 
} 
// database test!!!!!!!!!!!!!!
function populateDB(tx) {
     tx.executeSql('DROP TABLE IF EXISTS DEMO');
     tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
     tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
     tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');

}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    //alert("success!");
    return;
}

function testDB() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);
    
    db.transaction(function (tx) {
        tx.executeSql('SELECT id,DATA FROM DEMO WHERE id =1', [], function (tx, results) {
        var len = results.rows.length, i;
        console.log( "Found rows: " + len );
          for (i = 0; i < len; i++){
             console.log(results.rows.item(i) );
              //console.log(results.rows.item(i).data );
          }
        }, null);
    });    
    return 1;
}
// database test!!!!!!!!!!!!!!

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}


myApp.onPageInit('*', function (page) {
    console.log(page.name + ' initialized'); 
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
    //alertObj(navigator);
    // database test!!!!!!!!!!!!!!
    console.log("testDB = " + testDB() + " =");
    indexPage.trigger();
    
});
   
var indexPage = myApp.onPageInit('index', function (page) {
    //читаем переменную с настройками, и если нужно - создаем ее заново в локалсторейдже

    if (localStorage.getItem("settings") == null) { 
        settings = {email:"", pin:"", registered:"0",checkBackup:""};
        localStorage.setItem("settings", JSON.stringify(settings));
        myApp.alert("Добро пожаловать","");
    } else {
        settings = JSON.parse(localStorage.getItem("settings"));
    }
    
    var key;
    //формируем первую страницу

    for (key in localStorage) { 

        //читаем данные из хранилища чтобы показать на 1 странице
        // на каждую практику в локалсторадже заводится ОДНА строка
        if (key != "settings") {
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
                + "<p><a href=\"praktic.html\" class=\"button button-big go-praktic\" id=\"go-praktic\" type=\""
                + key
                + "\">Go!</a></p>";

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
                piecesDone = 100;
            }
            // осталось в %
            (+piecesDone >0) ? (piecesDo = 100 - +piecesDone):( piecesDo = 100);

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

            cBlock4.appendChild(cBlock5); 
            cBlock3.appendChild(cBlock4);    
            cBlock1.appendChild(cBlock2);
            cBlock1.appendChild(cBlock3);
            cBlock.appendChild(cBlock1);       

            var my_div = document.getElementById("page-content");  
            my_div.appendChild(cBlock);
        }
    }
    
    //в параметре type лежит ключ к данным в ЛокалСторейдже
    $$('.go-praktic').on('click', function () {        
        var target = event ? event.target : window.event.srcElement;
        prakticId = target.type;
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
        localStorage.setItem(prakticId, JSON.stringify(formData));
        myApp.alert('Данные сохранены',"addPraktic");

        location.href="index.html";
    });
});

var backupPage = myApp.onPageInit('backup', function (page) {
    
    //есть регистрация
    var resp1, resp2;
    var resp3 = [];
    
    if (settings.registered == "3"){
        
            var my_div = document.getElementById("registered-0");  
            my_div.hidden = true;
            var my_div = document.getElementById("registered-1");  
            my_div.hidden = true;        
        
            var my_div = document.getElementById("account");  
            my_div.innerHTML = "<i>" + settings.email + "</i>";
        
            var my_div = document.getElementById("backup-1"); 
            (settings.checkBackup == "1")? (document.backupForm1.checkBackup.checked = true): (document.backupForm1.checkBackup.checked = false);
            my_div.hidden = false; 
            console.log("settings.registered= " +settings.registered);
    }
    
    /* не используем этот экран
    //нет регистрации  пинкод неверен, запрашиваем повторно
    if (settings.registered == "2"){
            var my_div = document.getElementById("registered-1");  
            my_div.hidden = true;  
            var my_div = document.getElementById("registered-2");  
            my_div.hidden = false;
            console.log("settings.registered= " +settings.registered);
    }
    */
    
    //регистрация пошла, запрашиваем пинкод
    if (settings.registered == "1"){
            var my_div = document.getElementById("registered-0");  
            my_div.hidden = true;     
            
            document.registeredForm1.pin.value = "";
            document.registeredForm1.mailTo.value = settings.email;
        
            var my_div = document.getElementById("registered-1");  
            my_div.hidden = false;
            console.log("settings.registered= " +settings.registered);
    }
    
    //нет регистрации. запрашиваем имейл
    if (settings.registered == "0"){
            var my_div = document.getElementById("registered-0");  
            my_div.hidden = false;   
            console.log("settings.registered= " +settings.registered);
    }

    $$('.registered-0').on('click', function () {

        //settings.registered = "1";
        backupPage.trigger();
        
        var backupForm = myApp.formToJSON('#registered-0');
        
        if (backupForm["mailTo"] > "") {
            settings.email =  backupForm["mailTo"];
            localStorage.setItem("settings", JSON.stringify(settings));
            
            var webUri = "http://geo-format.ru/mp.html";
            var request = "a="  + encodeURIComponent(backupForm["mailTo"]) 
                        + "&oper=" + encodeURIComponent(settings.registered) 
                        + "&rnd=" + encodeURIComponent(Math.random());
            
            console.log("webUri= " + webUri);
            console.log("request= " + request);
            
            // open WEB      
            var x = new XMLHttpRequest();
            x.open("POST", webUri, true);
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            x.send(request);
            x.onload = function (){
                console.log(x.responseText);
                resp1 = x.responseText.indexOf("<response>",0);
                resp2 = x.responseText.indexOf("</response>",resp1+1);
                
                resp3 = x.responseText.substr(resp1+10,resp2-resp1-10).split(",")
                console.log("resp3-0=" + resp3[0]);
                console.log("resp3-1=" + resp3[1]);
                console.log("resp3-2=" + resp3[2]);
                
                /*
                    здесь проверить ответ и действовать соответсвенно
                    resp3:
                    0 "oper=0"
                    1 "a=dongrigorio@yandex.ru"
                    2 "status=msgsend"
                */
                if( (resp3[0] == "oper=0") && (resp3[1] == "a=" + settings.email) ) {
                    if ((resp3[2] == "status=msgsend") ) {
                        settings.registered = "1"; //открываем экран подтверждения ПИН
                        localStorage.setItem("settings", JSON.stringify(settings));
                        console.log("Переход к экрану подтверждения ПИН"); 
                        //backupPage.trigger();  
                        mainView.router.refreshPage();
                    };
                    if ((resp3[2] == "status=emailexist") ) {
                        myApp.alert("Email уже зарегистрирован!","Backup");
                        settings.registered = "1"; //открываем экран подтверждения ПИН
                        localStorage.setItem("settings", JSON.stringify(settings));
                        console.log("email существует в базе, письмо не отправлено"); 
                        mainView.router.refreshPage();
                    };                
                }
            }
        }
      
    });
    
    $$('.registered-1').on('click', function () {

        var backupForm = myApp.formToJSON('#registeredForm1');
        
        if ((backupForm["mailTo"] > "") && (backupForm["pin"] > "")){
           
            var webUri = "http://geo-format.ru/mp.html";
            var request = "a="  + encodeURIComponent(backupForm["mailTo"]) 
                        + "&oper=" + encodeURIComponent(settings.registered) 
                        + "&pin=" + encodeURIComponent(backupForm["pin"])
                        + "&rnd=" + encodeURIComponent(Math.random());

            console.log("webUri= " + webUri);
            console.log("request= " + request);
            
            // open WEB      
            var x = new XMLHttpRequest();
            x.open("POST", webUri, true);
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            x.send(request);
            x.onload = function (){
                console.log(x.responseText);
                var resp1 = x.responseText.indexOf("<response>",0);
                var resp2 = x.responseText.indexOf("</response>",resp1+1);
                
                var resp3 = x.responseText.substr(resp1+10,resp2-resp1-10).split(",")
                console.log(resp3);
                /*
                    0:"oper=1"
                    1:"a=dongrigorio@yandex.ru"
                    2:"status=regok"
                */

                if( (resp3[0] == "oper=1") && (resp3[1] == "a=" + settings.email) && (resp3[2] == "status=regok") ) {
                    settings.registered = "3"; 
                    settings.pin = backupForm["pin"];
                    localStorage.setItem("settings", JSON.stringify(settings));
                    mainView.router.refreshPage();
                    myApp.alert("Вы зарегистрированы!","Backup");
                    console.log("Переход к экрану активации бэкапа"); 
                } else {
                                        
                    console.log("Ответ сервера не верен, переход к экрану повтроного ввода ПИН");
                    
                    myApp.confirm("Ошибка при регистрации! Повторить ввод пин-кода?","Backup", function () {
                        settings.registered = "1";
                        localStorage.setItem("settings", JSON.stringify(settings));
                        resp3 = [];
                        document.registeredForm1.pin.value = "";
                        document.registeredForm1.mailTo.value = settings.email;
                    },function () {
                        location.href="index.html";
                    });
                }                
            }
        }
    });
    
 
    $$('.registered-0-1').on('click', function () {
        settings.registered = "1"; 
        //settings.pin = ""; 
        localStorage.setItem("settings", JSON.stringify(settings));
        mainView.router.refreshPage();
    });    
    
    $$('.registered-1-back').on('click', function () {
        settings.registered = "0";
        //settings.pin = "";
        localStorage.setItem("settings", JSON.stringify(settings));
        mainView.router.refreshPage();
    });
    
    $$('.backup-1-ok').on('click', function () {
        (document.backupForm1.checkBackup.checked )?  (settings.checkBackup="1") : (settings.checkBackup="0");
        localStorage.setItem("settings", JSON.stringify(settings));
        
        console.log("checkBackup = " + settings.checkBackup); 
       
    });

    $$('.backup-2-ok').on('click', function () {
        
         myApp.confirm("Изменить аккаунт?","Backup", function () {
            settings.registered = "0";
            localStorage.setItem("settings", JSON.stringify(settings));
            resp3 = [];
            document.registeredForm1.pin.value = "";
            document.registeredForm1.mailTo.value = settings.email;
            mainView.router.refreshPage();
        },function () {
            mainView.router.refreshPage();
        });       
    });
    
 /*
    $$('.backup-2-ok').on('click', function () {
        
         myApp.confirm("Зарегистрировать новый аккаунт?","Backup", function () {
            settings.registered = "0";
            localStorage.setItem("settings", JSON.stringify(settings));
            resp3 = [];
            document.registeredForm1.pin.value = "";
            document.registeredForm1.mailTo.value = "";
            mainView.router.refreshPage();
        },function () {
            settings.registered = "1";
            localStorage.setItem("settings", JSON.stringify(settings));
            resp3 = [];
            document.registeredForm1.pin.value = "";
            document.registeredForm1.mailTo.value = settings.email;
            mainView.router.refreshPage();
        });       
    });    
 */   
    
});







var pageInitPraktic = myApp.onPageInit('praktic', function (page) {
    console.log("= "+prakticId + " = prakticId");
    var prakticData = JSON.parse(localStorage[prakticId]);
    var date = new Date();
    var my_div;
    
    var my_div = document.getElementById("content-block-title");  
        my_div.innerHTML = prakticData["prakticName"];     
    
    var optionsDate = {
     // era: 'long',
      year: '2-digit',
      month: 'short',
      day: '2-digit'
      //weekday: 'long',
      //timezone: 'UTC',
      //hour: '2-digit',
      //minute: '2-digit',
      //second: '2-digit'
    };
    piecePraktic=[]; 
    pieceDate=[];
    var str = "<p>Установлена длина одного круга <b>" + prakticData["prakticCircleLength"] + "</b> </p>";
    
 
    if (prakticData.prakticPieces.length > 0){
        
        var arr = prakticData.prakticPieces.split("=");
        var labels1 = [], series1 = [];
        var k;
        k = 0;

        for (i=0; i<arr.length; i++){
            var dataKey = arr[i].indexOf(":",0); //определили позицию разделителя
                piecePraktic[i] = arr[i].substring(0,dataKey); //выделили кол-во повторений
                pieceDate[i] = arr[i].substring(dataKey+1,arr[i].length); //выделили дату-время
                date.setTime(pieceDate[i]);
                labels1[i] = date.toLocaleString('en-GB', optionsDate); //'en-GB'
                series1[i] = +piecePraktic[i];
                k += +piecePraktic[i];
        }
                
        str += "<p>Среднее количеcтво повторений за одну сессию:  " + ((+k/(arr.length-1))^0);
        str += "<p>Для достижения цели потребуется приблизительно " + ( (+prakticData.prakticLength - +prakticData.prakticSum)/(+k/(arr.length-1))^0  ) + " сессий.";
        str += " </p>";        
        
        date.setTime(+pieceDate[arr.length-1]- +pieceDate[0] + 5*1000*60*60*24);
        var periodDate = (date/ 24 / 60 / 60 / 1000 )^0;
    
    }   
    
    new Chartist.Bar('.ct-chart-day', {
      labels: labels1,
      series: [series1]
    }, {
        horizontalBars: true,
        axisY: {
           offset: 70
        }
        
    });

    my_div = document.getElementById("circle-length"); 
    my_div.innerHTML = str;

    
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
            prakticData.prakticPieces += sumSession + ":" + +new Date();

            localStorage.setItem(prakticId, JSON.stringify(prakticData));

            if (settings.checkBackup) {

                var webUri = "http://geo-format.ru/mp.html";
                var request = "a="  + encodeURIComponent(settings.email)
                            + "&pin=" + encodeURIComponent(settings.pin)            
                            + "&oper=" + encodeURIComponent("2") 
                            + "&id=" + encodeURIComponent(prakticId)
                            + "&data=" + encodeURIComponent( JSON.stringify(prakticData) )          
                            + "&rnd=" + encodeURIComponent( Math.random() );

                console.log("webUri= " + webUri);
                console.log("request= " + request);

                // open WEB      
                var x = new XMLHttpRequest();
                x.open("POST", webUri, true);
                x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                x.send(request);
                x.onload = function (){
                    console.log(x.responseText);
                    var resp1 = x.responseText.indexOf("<response>",0);
                    var resp2 = x.responseText.indexOf("</response>",resp1+1);

                    var resp3 = x.responseText.substr(resp1+10,resp2-resp1-10).split(",")
                    console.log(resp3);
                    /*
                        0:"oper=1"
                        1:"a=dongrigorio@yandex.ru"
                        2:"status=regok"
                    */

                    if( (resp3[0] == "oper=2") && (resp3[1] == "a=" + settings.email) && (resp3[2] == "status=datanosaved") ) {
                        myApp.alert("Данные не сохраенены","Backup");
                        console.log("Данные об изменении практики не сохранились"); 
                    } 
                }
            mainView.router.refreshPage();
            }
        }
    });
    
    $$('.delete-last-data').on('click', function () {
        
            if (piecePraktic.length > 0) {
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
