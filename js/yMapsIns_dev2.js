//points page map initialization
function init2() {
  const abilityEnum = Object.freeze({"open":1, "close":0, "restricted":2})

  var myMap = new ymaps.Map('map2', {
    center: [60.01,30.67],
    zoom: 11,
    controls: ['zoomControl']
  }),
  objectManager = new ymaps.ObjectManager({
    // Чтобы метки начали кластеризоваться, выставляем опцию.
    //  clusterize: true,
    // ObjectManager принимает те же опции, что и кластеризатор.
    gridSize: 32,
    clusterDisableClickZoom: true
  });

  // Чтобы задать опции одиночным объектам и кластерам,
  // обратимся к дочерним коллекциям ObjectManager.
  objectManager.objects.options.set('preset', 'islands#greenDotIcon');
  objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
  myMap.geoObjects.add(objectManager);

  var pointStock = [];
  var adressNumbers = 0;

  function addPoint(address, notInstalled, comment, ability, coordinates){
    adressNumbers++;
    try{
      ymaps.geocode(coordinates).then(function (res) {
        if(res.geoObjects.getLength()==0){
          adressNumbers--;
          return;
        }

        let item = res.geoObjects.get(0);
        let isOkAdress = item.properties.get("metaDataProperty").GeocoderMetaData.kind=='house';

        let obj ={
          id:'undefined',
          "type": "Feature",
          "geometry":
          {"type": "Point",
          "coordinates":coordinates//item.geometry._coordinates
        },
        "properties":
        {
          balloonContentHeader:item.properties._data.balloonContentHeader,
          balloonContentBody:item.properties._data.balloonContentBody,
          name:item.properties._data.name,
          text:item.properties._data.text,
          clusterCaption:item.properties._data.name,
          isOk :isOkAdress,
          notInstalled: notInstalled,
          comment: comment ? comment : ""
        }
      };

      switch (ability) {
        case abilityEnum.close:
        obj.options = {"iconColor": "#4c516d"};
        obj.properties.balloonContentBody += "<span style='text-align:center;font-weight:700; color:#fd7e14'>Закрытая территория </span>";
        break;
        case abilityEnum.restricted:
        //obj.options = {"iconColor": "#3fe0d0"};
        break;
        case abilityEnum.open:
        //obj.options = {"iconColor": "#cccccc"};
        break;
        default:
      }


      if(!isOkAdress){
        obj.options = {"iconColor": "#ff0000"};
        obj.properties.balloonContentHeader = "";
        obj.properties.balloonContentBody = address;
      }
      if(notInstalled)
      {
        obj.options = {"iconColor": "#cccccc"};
        obj.properties.balloonContentBody += "<span style='text-align:center;font-weight:700; color:#fd7e14'>Ожидается установка</span>";
      }
      if(comment){
        obj.properties.balloonContentBody += "<span style='color:#999; font-zise:11px'>"+comment+"</span>";
      }
      pointStock.push(obj);
      adressNumbers--;
    },

    function (err) {

      console.log(["errors",adressNumbers]);
      // обработка ошибки
    }
  )}
  catch(exception){
    console.error("errorAAA:" + exception);
    adressNumbers--;
  }
}

let timerId = setInterval(function(){
  //console.log(adressNumbers);
  if(adressNumbers==0){
    //console.log(pointStock);
    clearInterval(timerId);
    let listNode = document.getElementById('point-list');
    let jsonData = "";
    let localStock = pointStock.sort(function(item1, item2 ){ return item1.properties.text.localeCompare(item2.properties.text);})

    localStock.forEach(element => {
      element.id = startIndex + localStock.indexOf(element);
      jsonData += JSON.stringify(element) +',\r\n';

      let trStyle ="style='";
      trStyle += !element.properties.isOk ? "border: 1px solid #f44a40;'" : "";
      trStyle += element.properties.notInstalled ? 'color:#ccc;':"";
      trStyle +="'"

      listNode.innerHTML += '<tr '+trStyle+'><td>'+(element.id+1)+'</td><td>'+(element.properties.notInstalled?'Ожидается':'Да')+'</td><td>'+element.geometry.coordinates+'</td><td>'+element.properties.comment.toString()+'</td><td>'+element.properties.text+'</td></tr>';

      objectManager.add(element);
    });

    console.log(jsonData);
  }

}, 1000);


startIndex = 0;
addPoint('Россия, Ленинградская область,	пр. Кима 6	',	 false	,'		',	abilityEnum.open,	[	59.950092,30.246154	]	);
addPoint('Россия, Ленинградская область,	 Синопская набережная, дом № 22 (Синоп БЦ)	',	 false	,'		',	abilityEnum.open,	[	59.929010,30.387841	]	);
addPoint('Россия, Ленинградская область,	Караваевская 5Б	',	 false	,'		',	abilityEnum.open,	[	59.837900,30.488302	]	);
addPoint('Россия, Ленинградская область,	г.Сестрорецк, ул. Грибная у дома 30/34  (Рай в шалаше) СТАРЫЙ ЭД	',	 false	,'		',	abilityEnum.open,	[	60.054212,30.007968	]	);
addPoint('Россия, Ленинградская область,	 г.Сестрорецк, ул. Грибная у дома 30/34 (Рай в шалаше) НОВЫЙ ЭД	',	 false	,'		',	abilityEnum.open,	[	60.054212,30.007968	]	);
addPoint('Россия, Ленинградская область,	 г.Сестрорецк, ул. Всеволода Боброва д.21  (Рай в шалаше) НОВЫЙ ЭД	',	 false	,'		',	abilityEnum.open,	[	60.052398,30.001763	]	);
addPoint('Россия, Ленинградская область,	г.Сестрорецк, ул. Всеволода Боброва д.21  (Рай в шалаше) СТАРЫЙ ЭД	',	 false	,'		',	abilityEnum.open,	[	60.054394,29.999384	]	);
addPoint('Россия, Ленинградская область,	 г.Сестрорецк, ул. Всеволода Боброва д.21 (Рай в шалаше) НОВЫЙ ЭД	',	 false	,'		',	abilityEnum.open,	[	60.054394,29.999384	]	);
addPoint('Россия, Ленинградская область,	г.Сестрорецк, ул. Всеволода Боброва д.21 (Рай в шалаше) СТАРЫЙ ЭД	',	 false	,'		',	abilityEnum.open,	[	60.054394,29.999384	]	);
addPoint('Россия, Ленинградская область,	Оборонная ул, дом № 22	',	 false	,'		',	abilityEnum.open,	[	59.892817,30.258553	]	);
addPoint('Россия, Ленинградская область,	 Солдата Корзуна ул, дом № 26 лит. А	',	 false	,'		',	abilityEnum.open,	[	59.836950,30.217292	]	);
addPoint('Россия, Ленинградская область,	ул.  Сикейроса, 21, корп.1.	',	 false	,'		',	abilityEnum.open,	[	60.034806,30.342123	]	);
addPoint('Россия, Ленинградская область,	Хасанская ул, дом № 8, корпус 1	',	 false	,'		',	abilityEnum.open,	[	59.938962,30.481277	]	);
addPoint('Россия, Ленинградская область,	Вяземский пер, дом № 6	',	 false	,'		',	abilityEnum.open,	[	59.972343,30.298953	]	);
addPoint('Россия, Ленинградская область,	ЛО, Выборгский р-н, Первомайское п, КП Золотая Роща	',	 false	,'		',	abilityEnum.open,	[	60.216725,29.912827	]	);
addPoint('Россия, Ленинградская область,	ЖК«Ясно-Янино», ул.Ясная,11, корп.5	',	 false	,'		',	abilityEnum.open,	[	59.958847,30.602390	]	);
addPoint('Россия, Ленинградская область,	ЖК«Ясно-Янино», ул.Ясная,11, корп.2	',	 false	,'		',	abilityEnum.open,	[	59.957729,30.599882	]	);
addPoint('Россия, Ленинградская область,	ЖК«Ясно-Янино», ул.Ясная,11, корп.2 	',	 false	,'		',	abilityEnum.open,	[	59.957729,30.599882	]	);
addPoint('Россия, Ленинградская область,	ЖК "Южные паруса" Ленинский проспект д. 75 корп. 1	',	 false	,'		',	abilityEnum.open,	[	50.393285,30.613974	]	);
addPoint('Россия, Ленинградская область,	Энергетиков пр-кт, дом № 9, корпус 3	',	 false	,'		',	abilityEnum.open,	[	59.936873,30.438677	]	);
addPoint('Россия, Ленинградская область,	жк. Янила Кантри, дер. Янино -1. ул. Оранжевая д. 5	',	 false	,'		',	abilityEnum.open,	[	59.948986,30.581856	]	);
addPoint('Россия, Ленинградская область,	Московский пр. 139 к2	',	 false	,'		',	abilityEnum.open,	[	59.880595,30.317628	]	);
addPoint('Россия, Ленинградская область,	Ириновский 32	',	 false	,'		',	abilityEnum.open,	[	59.960020,30.480602	]	);
addPoint('Россия, Ленинградская область,	Савушкина 118	',	 false	,'		',	abilityEnum.open,	[	59.986158,30.212700	]	);
addPoint('Россия, Ленинградская область,	Обводного Канала наб, дом № 86, строение 4-Н	',	 false	,'		',	abilityEnum.open,	[	59.908550,30.323950	]	);
addPoint('Россия, Ленинградская область,	коттеджный посёлок Малое Репино,Первомайское сельское поселение, Выборгский район	',	 false	,'		',	abilityEnum.open,	[	60.220390,29.890210	]	);
addPoint('Россия, Ленинградская область,	ЛО, 50-ый км Скандинавского шоссе, поворот на право 1 км	',	 false	,'		',	abilityEnum.open,	[	60.194589,29.922725	]	);
addPoint('Россия, Ленинградская область,	 КП Вартемяги Парк 2. Ватремяжский бульвар	',	 false	,'		',	abilityEnum.open,	[	60.188410,30.318285	]	);
addPoint('Россия, Ленинградская область,	КП Вартемяги Парк 1. территория улицы, между Приозерским шоссе и Касимовским проспектом	',	 false	,'		',	abilityEnum.open,	[	60.193541,30.313816	]	);
addPoint('Россия, Ленинградская область,	 Вартемяги Лайт, ул. Троицкая 1	',	 false	,'		',	abilityEnum.open,	[	60.153903,30.273331	]	);
addPoint('Россия, Ленинградская область,	 ДНТ Вартемяги 1	',	 false	,'		',	abilityEnum.open,	[	60.212584,30.259787	]	);
addPoint('Россия, Ленинградская область,	 Днп Вартемяги устанавлен у площадки ТБО, 	',	 false	,'		',	abilityEnum.open,	[	60.209135,30.252161	]	);
addPoint('Россия, Ленинградская область,	 Днп Вартемяги устанавлен у площадки ТБО,	',	 false	,'		',	abilityEnum.open,	[	60.209135,30.252161	]	);
addPoint('Россия, Ленинградская область,	 Вартемяги, КП Любовино, ул. Софийская 1 ( пл. ТБО)	',	 false	,'		',	abilityEnum.open,	[	60.180984,30.344314	]	);
addPoint('Россия, Ленинградская область,	 Вартемяги, ул. Софийская 1, КП Любовино ( пл. ТБО)	',	 false	,'		',	abilityEnum.open,	[	60.180984,30.344314	]	);
addPoint('Россия, Ленинградская область,	 Охтинская улица, КП Охта-Йоки	',	 false	,'		',	abilityEnum.open,	[	60.200683,30.292500	]	);
addPoint('Россия, Ленинградская область,	 Охтинская улица, КП Охта-Йоки, 	',	 false	,'		',	abilityEnum.open,	[	60.200683,30.292500	]	);
addPoint('Россия, Ленинградская область,	 Массив Касимово, КП Савоя	',	 false	,'		',	abilityEnum.open,	[	45.086104,8.365489	]	);
addPoint('Россия, Ленинградская область,	 СНТ Пальмира	',	 false	,'		',	abilityEnum.open,	[	60.215995,30.279201	]	);
addPoint('Россия, Ленинградская область,	 дер. Агалатово,  Приозерского шоссе д.21,ТЦ Леон	',	 false	,'		',	abilityEnum.open,	[	60.218130,30.295243	]	);
addPoint('Россия, Ленинградская область,	 д.Агалатово, д.152, детский сад	',	 false	,'		',	abilityEnum.open,	[	60.217565,30.305672	]	);
addPoint('Россия, Ленинградская область,	 д.Агалатово, д.152, детский сад второй корпус	',	 false	,'		',	abilityEnum.open,	[	60.217565,30.302812	]	);
addPoint('Россия, Ленинградская область,	 дер. Агалатово,  д.162, школа Агалатово	',	 false	,'		',	abilityEnum.open,	[	60.214860,30.303344	]	);
addPoint('Россия, Ленинградская область,	 СНТ Агалатово, 20км Приозерского шоссе.	',	 false	,'		',	abilityEnum.open,	[	60.239396,30.245244	]	);
addPoint('Россия, Ленинградская область,	Агалатовское СП, Днп Бриллиант пл. ТБО, ул. Центральная, д.1	',	 false	,'		',	abilityEnum.open,	[	60.250321,30.249340	]	);
addPoint('Россия, Ленинградская область,	 ДНП ГРАНИТ	',	 false	,'		',	abilityEnum.open,	[	60.250440,30.209637	]	);
addPoint('Россия, Ленинградская область,	 Мурино, Бульвар Менделеева 16	',	 false	,'		',	abilityEnum.open,	[	60.053869,30.429864	]	);
addPoint('Россия, Ленинградская область,	 п. Мурино,  б-р Менделеева, д.5, корп. 1	',	 false	,'		',	abilityEnum.open,	[	60.051515,30.432102	]	);
addPoint('Россия, Ленинградская область,	 Мурино, бул. Менделеева у д 9, к. 2 	',	 false	,'		',	abilityEnum.open,	[	60.051674,30.428250	]	);
addPoint('Россия, Ленинградская область,	 Мурино, бул. Менделеева у д 9, к. 2	',	 false	,'		',	abilityEnum.open,	[	60.051674,30.428250	]	);
addPoint('Россия, Ленинградская область,	 ЖК Энфилд	',	 false	,'		',	abilityEnum.open,	[	60.063215,30.402940	]	);
addPoint('Россия, Ленинградская область,	ЖК Шуваловский парк. дер. Вартемяки, Школьный переулок у д. 8 А на площадке ТБО	',	 false	,'		',	abilityEnum.open,	[	60.177681,30.327171	]	);
addPoint('Россия, Ленинградская область,	 Новое Девяткино ул. Оборонная д 2 к 3	',	 false	,'		',	abilityEnum.open,	[	60.046773,30.464117	]	);
addPoint('Россия, Ленинградская область,	 Новое Девяткино, ул Арсенальная 1, пароль от замка "АРСЕ" 	',	 false	,'		',	abilityEnum.open,	[	60.056322,30.464874	]	);
addPoint('Россия, Ленинградская область,	 Новое Девяткино, ул Арсенальная 1, пароль от замка "АРСЕ"	',	 false	,'		',	abilityEnum.open,	[	60.056322,30.464874	]	);
addPoint('Россия, Ленинградская область,	 "Новое Девяткино, ул Арсенальная 7, контейнерная площадка, пароль от замка ""АРСЕ""	',	 false	,'		',	abilityEnum.open,	[	60.059392,30.468661	]	);
addPoint('Россия, Ленинградская область,	 Новое Девяткино, ул Арсенальная 4	',	 false	,'		',	abilityEnum.open,	[	60.056618,30.469232	]	);
addPoint('Россия, Ленинградская область,	Новое Девяткино, ул Арсенальная 6	',	 false	,'		',	abilityEnum.open,	[	60.057974,30.471667	]	);
addPoint('Россия, Ленинградская область,	 Новое Девяткино, Флотская 7	',	 false	,'		',	abilityEnum.open,	[	60.060103,30.472081	]	);
addPoint('Россия, Ленинградская область,	 Новое девяткино ул. Главная 58	',	 false	,'		',	abilityEnum.open,	[	60.058078,30.481905	]	);
addPoint('Россия, Ленинградская область,	 Новое девяткино, Энергетиков 1	',	 false	,'		',	abilityEnum.open,	[	60.057214,30.481226	]	);
addPoint('Россия, Ленинградская область,	 Токсово, ул Дорожников 1, Школа	',	 false	,'		',	abilityEnum.open,	[	60.146352,30.513061	]	);
addPoint('Россия, Ленинградская область,	 Токсово, Ленинградское шоссе 61 А, у ресторана «Гости» на площадке ТБО.	',	 false	,'		',	abilityEnum.open,	[	60.151554,30.522198	]	);
addPoint('Россия, Ленинградская область,	 Токсово,Привокзальная 23, площадка ТБО	',	 false	,'		',	abilityEnum.open,	[	60.152222,30.511805	]	);
addPoint('Россия, Ленинградская область,	Токсово ул. Озерная угол ул. Гоголя	',	 false	,'		',	abilityEnum.open,	[	60.154934,30.530330	]	);
addPoint('Россия, Ленинградская область,	 Токсово, Привокзальная площадь, начало ул. Железнодорожная	',	 false	,'		',	abilityEnum.open,	[	60.150769,30.509949	]	);
addPoint('Россия, Ленинградская область,	 Рапполово,  ул. Овражная 21А (за КДЦ)	',	 false	,'		',	abilityEnum.open,	[	60.156323,30.443518	]	);
addPoint('Россия, Ленинградская область,	 Рапполово у детского садика	',	 false	,'		',	abilityEnum.open,	[	60.160891,30.431657	]	);
addPoint('Россия, Ленинградская область,	СНТ СПОРТ Токсово	',	 false	,'		',	abilityEnum.open,	[	60.151032,30.551828	]	);
addPoint('Россия, Ленинградская область,	Изумрудное Озеро (ПЭТ)	',	 false	,'		',	abilityEnum.open,	[	60.152134,30.473140	]	);
addPoint('Россия, Ленинградская область,	Токсово,  перед Советов 40 повернуть на Гоголя	',	 false	,'		',	abilityEnum.open,	[	60.162269,30.538530	]	);
addPoint('Россия, Ленинградская область,	деревня Юкки, пл. ТБО. Ул. Школьная 7А	',	 false	,'		',	abilityEnum.open,	[	60.108579,30.286321	]	);
addPoint('Россия, Ленинградская область,	ЖК Черничная Поляна, Деревня Юкки (1й)	',	 false	,'		',	abilityEnum.open,	[	60.121912,30.275490	]	);
addPoint('Россия, Ленинградская область,	 Скотное, ул. Южная у д.5. ДНП Парковое.	',	 false	,'		',	abilityEnum.open,	[	60.181451,30.367351	]	);
addPoint('Россия, Ленинградская область,	 Лупполово, ЖК Финские кварталы	',	 false	,'		',	abilityEnum.open,	[	60.149731,30.267860	]	);
addPoint('Россия, Ленинградская область,	 СНТ Лупполово	',	 false	,'		',	abilityEnum.open,	[	60.152518,30.258246	]	);
addPoint('Россия, Ленинградская область,	Лупполово, ул. Зеленая д.4 ( пл. ТБО 1)	',	 false	,'		',	abilityEnum.open,	[	60.153277,30.273252	]	);
addPoint('Россия, Ленинградская область,	 Лупполово, , ул. Зеленая д.4 ( пл. ТБО 1)	',	 false	,'		',	abilityEnum.open,	[	60.153277,30.273252	]	);
addPoint('Россия, Ленинградская область,	 Лупполово  между 6 и 7 домами ( пл. ТБО 2)	',	 false	,'		',	abilityEnum.open,	[	60.153313,30.268046	]	);
addPoint('Россия, Ленинградская область,	Лупполово между 6 и 7 домами ( пл. ТБО 2)	',	 false	,'		',	abilityEnum.open,	[	60.153313,30.268046	]	);
addPoint('Россия, Ленинградская область,	 Вартемяги Пионерская 2 (детский сад)	',	 false	,'		',	abilityEnum.open,	[	60.181984,30.326524	]	);
addPoint('Россия, Ленинградская область,	Вартемяги Парк 3	',	 false	,'		',	abilityEnum.open,	[	60.184192,30.318285	]	);
addPoint('Россия, Ленинградская область,	 КП Вартемяги Парк 2. Ватремяжский бульвар, 	',	 false	,'		',	abilityEnum.open,	[	60.188410,30.312499	]	);
addPoint('Россия, Ленинградская область,	Кудрово, Европейский 20 	',	 false	,'		',	abilityEnum.open,	[	59.909722,30.516795	]	);
addPoint('Россия, Ленинградская область,	Кудрово, Европейский 20	',	 false	,'		',	abilityEnum.open,	[	59.909722,30.516795	]	);
addPoint('Россия, Ленинградская область,	Сестрорецк,  Академика Вернова 1 (только ПЭТ)	',	 false	,'		',	abilityEnum.open,	[	60.058686,29.986455	]	);
addPoint('Россия, Ленинградская область,	Новосмоленская наб, дом № 2 (дом на курьих ножках)	',	 false	,'		',	abilityEnum.open,	[	59.947086,30.229217	]	);
addPoint('Россия, Ленинградская область,	Санкт-Петербург г, Пушкин г, ул. Глинки, дом № 17	',	 false	,'		',	abilityEnum.open,	[	59.714124,30.430152	]	);
addPoint('Россия, Ленинградская область,	ул Нахимова 11	',	 false	,'		',	abilityEnum.open,	[	59.942218,30.221178	]	);
addPoint('Россия, Ленинградская область,	СПб, Антонова-Овсеенко д.18	',	 false	,'		',	abilityEnum.open,	[	59.909795,30.470149	]	);
addPoint('Россия, Ленинградская область,	Пушкин, Петербургское шоссе  8 (1-й ЭД)	',	 false	,'		',	abilityEnum.open,	[	59.738695,30.388830	]	);
addPoint('Россия, Ленинградская область,	Пушкин, Петербургское шоссе  8 (2-й ЭД)	',	 false	,'		',	abilityEnum.open,	[	59.738161,30.388907	]	);
addPoint('Россия, Ленинградская область,	Спб, Приморский проспект, 169	',	 false	,'		',	abilityEnum.open,	[	59.988365,30.192123	]	);
addPoint('Россия, Ленинградская область,	Сестрорецк, ш. Дубковское, 38	',	 false	,'		',	abilityEnum.open,	[	60.091267,29.947391	]	);
addPoint('Россия, Ленинградская область,	1-й Рабфаковский пер.3	',	 false	,'		',	abilityEnum.open,	[	59.857563,30.470911	]	);
addPoint('Россия, Ленинградская область,	Шелгунова ул, дом № 7, корпус 2	',	 false	,'		',	abilityEnum.open,	[	59.867607,30.456744	]	);
addPoint('Россия, Ленинградская область,	Кушелевская дорога дом 7, корпус 6	',	 false	,'		',	abilityEnum.open,	[	59.987757,30.379519	]	);
addPoint('Россия, Ленинградская область,	Кушелевская дорога, дом 5, корпус 3	',	 false	,'		',	abilityEnum.open,	[	59.987815,30.373653	]	);
addPoint('Россия, Ленинградская область,	192174, Санкт-Петербург г, Шелгунова ул, дом № 9/1	',	 false	,'		',	abilityEnum.open,	[	59.867405,30.456372	]	);
addPoint('Россия, Ленинградская область,	192174, Санкт-Петербург г, Шелгунова ул, дом № 7/1	',	 false	,'		',	abilityEnum.open,	[	59.867206,30.460178	]	);
}
ymaps.ready(init2);
