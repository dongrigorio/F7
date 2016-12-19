// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

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

    //gmg
    
    
    var my_div = document.getElementById("page-content");  
    
    for (var i = 0; i < localStorage.length; i++) {
    
    var cBlock = document.createElement("div");
    cBlock.className = "content-block";
        
        cBlock.innerHTML  = "<div class=\"card\">";
        cBlock.innerHTML += "  <div class=\"card-header\">";
        cBlock.innerHTML += "     lalalalala ";
        cBlock.innerHTML += "  </div>";
        cBlock.innerHTML += "  <div class=\"card-content\">";
        cBlock.innerHTML += "    <div class=\"card-content-inner\">";
        cBlock.innerHTML += "      Цель = 111.111";
        cBlock.innerHTML += "      Выполнено = 9.000";
        cBlock.innerHTML += "      Дата предыдущего подхода = 10.12.2011";
        cBlock.innerHTML += "      <a href=\"#\" class=\"button button-big button-green\">Go!</a>";
        cBlock.innerHTML += "     </div>";
        cBlock.innerHTML += "  </div>";
        cBlock.innerHTML += "</div>";
        
        my_div.insertBefore(cBlock,my_div.lastChild); 
    }
});

// Now we need to run the code that will be executed only for About page.
/**

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

});
**/
//gmg
// Option 1. Using page callback for page (for "addpraktic" page in this case) (recommended way):
myApp.onPageInit('addPraktic', function (page) {
    // Do something here for "addpraktic" page
    /**
    $$('.get-storage-data').on('click', function () {
        var storedData = myApp.formGetData('addPraktic');
        if (storedData) {
            alert(JSON.stringify(storedData));
        }
        else {
            alert('There is no stored data for this form yet. Try to change any field');
        }
    });
    **/
    //практикИд = колчество записей в локалсторейдж
    var prakticId = localStorage.length;
        
    $$('.cancel-data').on('click', function () {
        var storedData = myApp.formDeleteData('addPraktic');
        alert('Отмена');
        document.forms.addPraktic.elements.prakticName.value = localStorage.getItem(prakticId);
    });
    
    $$('.save-data').on('click', function () {
        var formData = myApp.formToJSON('#addPraktic');
        localStorage.setItem(prakticId, JSON.stringify(formData));
        //document.forms.addPraktic.elements.prakticName.value
        //alert('Данные сохранены');
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