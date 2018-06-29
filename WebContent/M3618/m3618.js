/* [global variable] */
var g_hospital_list = [];
var g_hospital_start_index = 0;

var is_abandon_load = false;
var g_abandon_list = [];

var is_selling_load = false;
var g_selling_pet_list = [];
var g_selling_start_index = 0;

var g_walking_route_list = [];
var g_walking_start_index = 0;
/* [end of global variable] */

window.onload = init;

function init() {
	//		handleRefresh();
	initHandler();
	loadMap(33.450701, 126.570667);
	updateHospitalApi(1, 100);
	updateAbandonPetApi();
	updateSellingPetApi();
	updateWalkingRouteApi();
}

// [about map]
function loadMap(lat, lng){
	
	// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new daum.maps.LatLng(lat, lng), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

	var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

	// 마커가 표시될 위치입니다 
	var markerPosition  = new daum.maps.LatLng(lat, lng); 

	// 마커를 생성합니다
	var marker = new daum.maps.Marker({
		position: markerPosition
	});

	 daum.maps.event.addListener(marker, 'click', function(){
		 window.open("https://www.google.com/maps/@"+lat+","+lng+",17z");
	 });
    
	 var moveLatLon = new daum.maps.LatLng(lat, lng);
	   map.setCenter(moveLatLon);
	
	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);

	var circle = new daum.maps.Circle({
	    center : new daum.maps.LatLng(lat, lng),  // 원의 중심좌표 입니다 
	    radius: 150, // 미터 단위의 원의 반지름입니다 
	    strokeWeight: 5, // 선의 두께입니다 
	    strokeColor: '#75B8FA', // 선의 색깔입니다
	    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
	    strokeStyle: 'dashed', // 선의 스타일 입니다
	    fillColor: '#CFE7FF', // 채우기 색깔입니다
	    fillOpacity: 0.7  // 채우기 불투명도 입니다   
	}); 

	// 지도에 원을 표시합니다 
	circle.setMap(map); 

}



// [end of map]

// [about animal hospital api]
function updateHospitalApi(start, end) {
	var url = "http://openapi.seoul.go.kr:8088/4b4b67704d6462663132306c47655155/json/animalPharmacyInfo/1/100";

	$.ajax({
		type : "GET",
		async : true,
		url : url,
		dataType : "json",
		success : function(response, status, result) {
		
			var response = JSON.parse(JSON.stringify(response));
			var SeoulAnimalHospital = JSON.parse(JSON
					.stringify(response.animalPharmacyInfo));
			var hospital_list = JSON.parse(JSON
					.stringify(SeoulAnimalHospital.row));
			var count = 0;
			for (var i = 0; i < hospital_list.length; i++) {

				if (hospital_list[i].STATE == "운영중" && hospital_list[i].NM != "" && hospital_list[i].ADDR_OLD != "" && hospital_list[i].TEL != "") {
					g_hospital_list[count] = hospital_list[i];
					count++;
					//전화번호 : hospital_list[i].SITE_TEL
					//건물 면적 : hospital_list[i].SITE_AREA
				}
			}
			
			nextPageList();
		},
		error : function(xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
//			alert('Error - ' + errorMessage);
		}
	});

}



function nextPageList() {
	//alert("next! :"+ g_hospital_start_index);

	if (g_hospital_start_index >= g_hospital_list.length) {
		alert("마지막 페이지 입니다.");
		return;
	}

	$("#sc_hospital_list").empty();
	$("#sc_hospital_list").append("<div class='animal_hospital_row'>");

	while (true) {
		// innerHTML
		$("#sc_hospital_list").append(
				"<div class='animal_hospital_item' onclick='hospitalDetail(\""+ g_hospital_list[g_hospital_start_index].NM+"\", \""+g_hospital_list[g_hospital_start_index].ADDR_OLD+"\", \""+ g_hospital_list[g_hospital_start_index].TEL+"\");'><h1>"
						+ g_hospital_list[g_hospital_start_index].NM
						+ "</h1>"
						+ "<div class='animal_hospital_item_content'>" + "<h4>"
						+ g_hospital_list[g_hospital_start_index].ADDR_OLD
						+ "</h4><h4>"
						+ g_hospital_list[g_hospital_start_index].TEL
						+ "</h4>" + "</div></div>");
		g_hospital_start_index++;

		if (g_hospital_start_index == g_hospital_list.length) {
			break;
		}

		if (g_hospital_start_index % 4 == 0) {
			$("#sc_hospital_list").append(
					"</div><div class='animal_hospital_row'>");
			$("#sc_hospital_list").append("<br/>");
		}

		if (g_hospital_start_index % 8 == 0) {
			$("#sc_hospital_list").append("</div>");
			break;
		}

	}

}

function hospitalDetail(name, address, tel){
	var geocoder = new daum.maps.services.Geocoder();
	geocoder.addressSearch(address, function(result, status) {
		
	    // 정상적으로 검색이 완료됐으면 
	     if (status === daum.maps.services.Status.OK) {
//	    	 alert(result[0].y+"/"+result[0].x);
	    	 
//    		 window.open("https://www.google.com/maps/@"+result[0].y+","+result[0].x+",17z");
    		 window.open("https://www.google.com/maps/search/"+name+"/@"+result[0].y+","+result[0].x+",11z");
	     } 
	});    
	

}
function prevPageList() {
	//alert("hi! :"+ g_hospital_start_index);
	if (g_hospital_start_index <= 8) {
		alert("첫번째 페이지 입니다.");
		return;
	} else {
		g_hospital_start_index -= 16;
		nextPageList();
	}
}

//[end of animal hospital api]

// [about Abandon Pet]
function updateAbandonPetApi(){
	var url = "http://openapi.seoul.go.kr:8088/4b4b67704d6462663132306c47655155/json/octastatapi369/1/100/";

	$.ajax({
		type : "GET",
		async : true,
		url : url,
		dataType : "json",
		success : function(response, status, result) {
			var response = JSON.parse(JSON.stringify(response));
			var octastatapi369 = JSON.parse(JSON.stringify(response.octastatapi369));
			var abandon_list = JSON.parse(JSON.stringify(octastatapi369.row));
			
			for(var i = 0; i<abandon_list.length; i++){

				var keys = Object.keys( abandon_list[i]);
				
				for(var j = 0; j<keys.length; j++){
					if((keys[j] != "JACHIGU")&& (abandon_list[i][keys[j]] == "-"))
						abandon_list[i][keys[j]] = "0";
				}
				
				
				g_abandon_list[abandon_list[i].JACHIGU] = abandon_list[i];
			}
			//alert(g_abandon_list["종로구"].GIGAN);
			is_abandon_load = true;
			setAbandonView($( "#abandon_district" ).val());
		},
		error : function(xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
//			alert('Error - ' + errorMessage);
		}
	});
}

function setAbandonView(district){
	$( "#td_district" ).text(district);
	
	//td_adoption_value
	$( "#td_adoption_value" ).text(  parseInt(g_abandon_list[district].IBYANGBUNYANG_1) + parseInt(g_abandon_list[district].IBYANGBUNYANG_2) + parseInt(g_abandon_list[district].IBYANGBUNYANG_3) );

	//td_death_value
	$( "#td_death_value" ).text( parseInt(g_abandon_list[district].PYESAALLAKSA_1) + parseInt(g_abandon_list[district].PYESAALLAKSA_2) + parseInt(g_abandon_list[district].PYESAALLAKSA_3) );


	//td_gyeryugijeung_value
	$( "#td_gyeryugijeung_value" ).text( parseInt(g_abandon_list[district].GYERYUGIJEUNG_1) + parseInt(g_abandon_list[district].GYERYUGIJEUNG_2) + parseInt(g_abandon_list[district].GYERYUGIJEUNG_3) );
	
	//td_indojuin_value
	$( "#td_indojuin_value" ).text(  parseInt(g_abandon_list[district].INDOJUIN_1) + parseInt(g_abandon_list[district].INDOJUIN_2) + parseInt(g_abandon_list[district].INDOJUIN_3)  );
	
	$( "#td_total_value" ).text(  g_abandon_list[district].HAPGYE );
}
// [end of Abandon Pet]

// [about selling Pet]

var dictLatLng = {
		'강남구 ' : { 
			'lat' : 37.4968488,
			'lng' : 127.0679394
		},

		'강동구' : { 
			'lat' : 37.5492994,
			'lng' : 127.1464275
		},
		'강북구': { 
			'lat' : 37.6482131,
			'lng' : 127.0164069
		},
		'강서구': { 
			'lat' : 37.552593,
			'lng' : 126.85051
		},
		'관악구': { 
			'lat' : 37.4654529,
			'lng' : 126.9442478
		},
		'광진구': { 
			'lat' : 37.5388,
			'lng' : 127.083445
		},
		'구로구': { 
			'lat' : 37.495765,
			'lng' : 126.8578697
		},
		'금천구': { 
			'lat' : 37.4599896,
			'lng' : 126.9012665
		},
		'노원구': { 
			'lat' : 37.6541956,
			'lng' : 127.0769692
		},
		'도봉구': { 
			'lat' : 37.6662325,
			'lng' : 127.0298724
		},
		'동대문구': { 
			'lat' : 37.5835755,
			'lng' : 127.0505528
		},
		'동작구': { 
			'lat' : 37.4971121,
			'lng' : 126.944378
		},
		'마포구': { 
			'lat' : 37.5615964,
			'lng' : 126.9086431
		},
		'서대문구': { 
			'lat' : 37.583312,
			'lng' : 126.9356601
		},
		'서초구': { 
			'lat' : 37.483574,
			'lng' : 127.032661
		},
		'성동구': { 
			'lat' : 37.5508768,
			'lng' : 127.0408952
		},
		'성북구': { 
			'lat' : 37.6023295,
			'lng' : 127.025236
		},
		'송파구' : { 
			'lat' : 37.504741,
			'lng' : 127.1144649
		},
		'양천구': {  
			'lat' : 37.527432,
			'lng' : 126.8558783
		},
		'영등포구': { 
			'lat' : 37.525423,
			'lng' : 126.896395
		},
		'용산구': { 
			'lat' : 37.5305208,
			'lng' : 126.9809672
		},
		'은평구': { 
			'lat' : 37.6175107,
			'lng' : 126.9249166
		},
		'종로구': { 
			'lat' : 37.6009106,
			'lng' : 126.9835817
		},
		'중구': { 
			'lat' : 37.5576747,
			'lng' : 126.9941653
		},
		'중랑구': { 
			'lat' : 37.5950497,
			'lng' : 127.0957062
		}
};


//selling map
var sellingMap = null;


function updateSellingPetApi(){
	var url = "http://openapi.seoul.go.kr:8088/4b4b67704d6462663132306c47655155/json/ListLocaldata131501P/1/500/";

	$.ajax({
		type : "GET",
		async : true,
		url : url,
		dataType : "json",
		success : function(response, status, result) {
			var response = JSON.parse(JSON.stringify(response));
			var ListLocaldata131501P = JSON.parse(JSON.stringify(response.ListLocaldata131501P));
			var selling_pet_list = JSON.parse(JSON.stringify(ListLocaldata131501P.row));
			
			var count = 0;
			for(var i = 0; i<selling_pet_list.length; i++){
				if(selling_pet_list[i].trdStateNm != "폐업 등"){
					g_selling_pet_list[count++] = selling_pet_list[i];
				}
			}
			setSellingView($( "#selling_district" ).val());
			setSellingMap($( "#selling_district" ).val()); // 자치구, 주소, 이름
			
		},
		error : function(xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
//			alert('Error - ' + errorMessage);
		}
	});
}


function setSellingView(district){

	$("#sc_selling_list").empty();
	
	for(var i = 0; i<g_selling_pet_list.length; i++){
		
		if(g_selling_pet_list[i].siteWhlAddr.includes(district) || g_selling_pet_list[i].rdnWhlAddr.includes(district)){
			
			$("#sc_selling_list").append("<section class='sc_selling_row'>");
			$("#sc_selling_list").append("<div class='store_name'>"+g_selling_pet_list[i].bplcNm+"</div>");
			$("#sc_selling_list").append("<div class='store_address'>"+g_selling_pet_list[i].siteWhlAddr+"</div>");
			$("#sc_selling_list").append("<div class='store_address'>"+g_selling_pet_list[i].rdnWhlAddr+"</div>");
			$("#sc_selling_list").append("</section>");
		}
	}
	
}

function searchSellingStore(keyword){
	for(var i = 0; i<g_selling_pet_list.length; i++){
		
		if(g_selling_pet_list[i].siteWhlAddr.includes(keyword) || g_selling_pet_list[i].rdnWhlAddr.includes(keyword)){
			
			alert("["+g_selling_pet_list[i].bplcNm+"]\n"+g_selling_pet_list[i].siteWhlAddr+"\n"+g_selling_pet_list[i].rdnWhlAddr);
			
		}	
		
	}
}

function setSellingMap(district){
	var sellingMapContainer = document.getElementById('sc_selling_map'), // 지도를 표시할 div 
    sellingMapOption = {
		center: new daum.maps.LatLng(37.5169381,127.0470308), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };  

	// 지도를 생성합니다    
	sellingMap = new daum.maps.Map(sellingMapContainer, sellingMapOption); 

	var position = [];
	
	for(var i = 0; i<g_selling_pet_list.length; i++){
		setSellingMarker(g_selling_pet_list[i].rdnWhlAddr);
	}
}

function setSellingMarker(address){
	var geocoder = new daum.maps.services.Geocoder();
	geocoder.addressSearch(address, function(result, status) {
		
	    // 정상적으로 검색이 완료됐으면 
	     if (status === daum.maps.services.Status.OK) {
	
	        var coords = new daum.maps.LatLng(result[0].y, result[0].x);
//	
//	        // 결과값으로 받은 위치를 마커로 표시합니다
	        var marker = new daum.maps.Marker({
	            map: sellingMap,
	            position: coords,
	            clickable: true
	        });
	
	        var iwRemoveable = true; 
	        
	        
	        // 마커에 표시할 인포윈도우를 생성합니다 
		    var infowindow = new daum.maps.InfoWindow({
		        content: '<div style="width:150px;text-align:center;padding:6px 0;">'+address+'</div>', // 인포윈도우에 표시할 내용
		        removable : iwRemoveable
		    });
		    
		    daum.maps.event.addListener(marker, 'click', makerClickListener(marker, infowindow));
		    
	    } 
	});    
}

function makerClickListener(marker, infowindow){
	return function() {
        infowindow.open(sellingMap, marker);
    };
}

function changeSellingCenter(district){
	
	var moveLatLon = new daum.maps.LatLng(dictLatLng[district].lat, dictLatLng[district].lng);
    
    // 지도 중심을 이동 시킵니다
	sellingMap.setCenter(moveLatLon);
	sellingMap.setLevel(5);
}
// [end of selling Pet]


// [about walking route]

// [about walking route]
function updateWalkingRouteApi(){
//	alert("updateWalkingRouteApi");
	var url = "http://openapi.seoul.go.kr:8088/4b4b67704d6462663132306c47655155/json/GeoInfoWalkwayWGS/1/100";

	$.ajax({
		type : "GET",
		async : true,
		url : url,
		dataType : "json",
		success : function(response, status, result) {
			var response = JSON.parse(JSON.stringify(response));
			var GeoInfoWalkwayWGS = JSON.parse(JSON.stringify(response.GeoInfoWalkwayWGS));
			var walk_route_list = JSON.parse(JSON.stringify(GeoInfoWalkwayWGS.row));
			
			for(var i = 0; i<walk_route_list.length; i++){
				g_walking_route_list[i] = walk_route_list[i];
			}
//			alert(g_walking_route_list[0].OBJECTID);
			is_selling_load = true;
			setMapMarker();
		},
		error : function(xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
//			alert('Error - ' + errorMessage);
		}
	});
}

function setMapMarker(){
	//alert(g_walking_route_list.length);
	var index = parseInt($("#walk_course_number").text())-1;
//	alert(g_walking_route_list[index].LNG+"/"+g_walking_route_list[index].LAT);
	loadMap(g_walking_route_list[index].LAT, g_walking_route_list[index].LNG)
}

function prevCourse(){
	$("#walk_course_number").text(parseInt($("#walk_course_number").text())-1);
	setMapMarker();
}

function nextCourse(){
	$("#walk_course_number").text(parseInt($("#walk_course_number").text())+1);
	setMapMarker();
}

// [end of walking route]

function initHandler(){
	$( "#abandon_district" ).change(function() {
		//alert($( "#abandon_district" ).val());
		  if(is_abandon_load)
			  setAbandonView($( "#abandon_district" ).val());
	});
	
	$( "#selling_district" ).change(function() {
		//alert($( "#abandon_district" ).val());
		  if(is_selling_load){
			  changeSellingCenter($( "#selling_district" ).val());
		  }
	});
	$("#river_list").change(function() {
		//alert($( "#abandon_district" ).val());
		  if(is_river_load)
			  setMapMarker($( "#river_list" ).val());
	});
	$("#search_button").click(function(){
//		searchSellingStore();
		var search = prompt("검색하고자 하는 위치를 적어보세요.");
		searchSellingStore(search);
//		search
	});

}

