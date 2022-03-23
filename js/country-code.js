(function () {
    var input=document.querySelector("div.country-rates__input-container");
    createPreloader('.country-rates__country-list','country-rates__item country-list-preloader','Loading countries list');
    document.querySelector('.country-rates__input').className += " country-rates_list-preloader";
    input.onclick = function(){
        if (this.parentNode.querySelector('.country-rates_open')){
            input.className = input.className.replace(/\bcountry-rates_open\b/g, "");
        }else{
            this.className += " country-rates_open";
        }
    }

    var countryClickEvent=document.querySelector(".country-rates__country-list");
    var placeInsert = document.getElementsByTagName('script')[0];
    countryClickEvent.onclick = function(event) {
        var countryAttrId;
        if (this.classList){
            if (event.target.classList && event.target.getAttribute("countryId")) {
                for(var i = 0;i<event.target.parentNode.children.length;i++){
                    event.target.parentNode.children[i].classList.remove('country-rates_selected');
                }
                event.target.classList.add('country-rates_selected');
                input.children[0].placeholder=event.target.textContent;
                countryAttrId=event.target.getAttribute("countryId");
                createPreloader('.country-rates__table-body','country-rates__preloader','');
            }
        } else {                                                                                         //Часть для IE8
            event = event || window.event;
            var target = event.target || event.srcElement;
            var countryAttrId=target.countryId;
            createPreloader('.country-rates__table-body','country-rates__preloader_text','Download');
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "http://www.ringcentral.com/api/index.php?cmd=getInternationalRates&param" +
            "[internationalRatesRequest][brandId]=1210&param[internationalRatesRequest][countryId]="+countryAttrId+"" +
            "&param[internationalRatesRequest][tierId]=3311&typeResponse=json&callback=viewCountryRate";
        placeInsert.parentNode.insertBefore(script, placeInsert);
    }


    function createPreloader(insertTo,insertClass,content){
        var preloader=document.createElement('div');
        preloader.className = insertClass;
        preloader.innerText=content;
        document.querySelector(insertTo).appendChild(preloader);
    }


    if (document.addEventListener) {                                                                  //Отслеживаем клик за пределами элемента
        document.addEventListener("click", function(e){
            var target = e.target;
            if (!input.contains(target)) {
                input.classList.remove("country-rates_open");
            };
        },false);
    }else {
        document.attachEvent("onclick", function(event){                                        //Для IE8
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (input.className!=target.parentNode.className) {
                input.className = input.className.replace(/\bcountry-rates_open\b/g, "");
            };
        });
    }
})();

function createCountryList(){
    var arg=arguments[0]["result"];                                                         //callback запроса с названиями стран
    var countryList=document.querySelector(".country-rates__country-list");
    countryList.innerText="";
    var countryListTemplate='';
    var i=0;
    while (i<arguments[0]["result"].length){
        countryListTemplate+='<div class="country-rates__item" countryId="'+arg[i]["id"]+'">'+arg[i]["name"]+'</div>';
        i++;
    }
    countryList.insertAdjacentHTML('beforeend',countryListTemplate);
}

/**
 * function viewCountryRate()
 *
 * @var key, val - сокращение, что бы не использовать длинную структуру arguments[0]["rates"][0]...
 * @var object - общая перемення для arguments[0]["rates"][0]["value"] && arguments[0]["rates"][0]["value"][0] из за разности полученных данных
 * @var firstFlag - флаг первой строки в таблице
 * */

function viewCountryRate() {
    var tableBody = document.querySelector('.country-rates__table-body');
    if (arguments[0]["rates"].length!=undefined) {                                                 //callback запроса с тарифами по выбранной стране
        var row,cellCountry,cellType,cellCode,cellRate;
        tableBody.innerText="";
        var countryName = arguments[0]["rates"][0]["key"];
        var argRate=arguments[0]["rates"][0]["value"][0];
        var arrayRate=[];
        var object,phonePart,firstRowFlag=false;

        if (argRate.length==undefined){
            object=[];
            object=arguments[0]["rates"][0]["value"];
        }else{
            object=argRate;
        }
        for (var key in object){
            phonePart = "";
            if (object[key]["phonePart"]) {
                phonePart = object[key]["phonePart"];
            }
            if(!arrayRate[object[key]["type"]]){
                arrayRate[object[key]["type"]]=object[key]["type"];
                arrayRate[object[key]["type"]]=[];
                arrayRate[object[key]["type"]]["type"]=object[key]["type"];
                arrayRate[object[key]["type"]]["code"]=object[key]["areaCode"]+''+phonePart;
                arrayRate[object[key]["type"]]["rate"]='$'+object[key]["rate"];
            }
            else{
                arrayRate[object[key]["type"]]["code"]+=', '+object[key]["areaCode"]+''+phonePart;
            }
        }
        for (var prop in arrayRate){
            if (!firstRowFlag){
                row = tableBody.insertRow(-1);
                cellCountry=row.insertCell(0);
                cellCountry.className="country-rates__table-column country-rates__column-country";
                cellCountry.innerHTML=countryName["name"];
                cellTemplate(arrayRate[prop]);
                firstRowFlag = true;
                continue;
            }else{
                row = tableBody.insertRow(-1);
                cellCountry = row.insertCell(0);
                cellCountry.className = "country-rates__table-column country-rates__column-country";
                cellTemplate(arrayRate[prop]);
            }
        }
    }else{
        alert("Sorry, we haven't offers for this country. We are working on it")
        tableBody.innerText="";
    }

    function cellTemplate(arrayRate){
        cellType=row.insertCell(1);
        cellType.className="country-rates__table-column country-rates__column-type";
        cellType.innerHTML=arrayRate["type"];
        cellCode=row.insertCell(2);
        cellCode.className="country-rates__table-column country-rates__column-code";
        cellCode.innerHTML=arrayRate["code"];
        cellRate=row.insertCell(3);
        cellRate.className="country-rates__table-column country-rates__column-rate";
        cellRate.innerHTML=arrayRate["rate"];
    }
}

