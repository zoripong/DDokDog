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
	loadMap();
	updateHospitalApi(1, 100);
	updateAbandonPetApi();
	updateSellingPetApi();
	updateWalkingRouteApi();
}

// [about map]
function loadMap(){
	
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
	mapOption = {
		center : new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
		level : 3
	// 지도의 확대 레벨
	};
	
	var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
}

// [end of map]

// [about animal hospital api]
function updateHospitalApi(start, end) {
	var url = "http://openapi.seoul.go.kr:8088/4b4b67704d6462663132306c47655155/json/SeoulAnimalHospital/"
			+ start + "/" + end + "/";

	$.ajax({
		type : "GET",
		async : true,
		url : url,
		dataType : "json",
		success : function(response, status, result) {
			var response = JSON.parse(JSON.stringify(response));
			var SeoulAnimalHospital = JSON.parse(JSON
					.stringify(response.SeoulAnimalHospital));
			var hospital_list = JSON.parse(JSON
					.stringify(SeoulAnimalHospital.row));
			var count = 0;
			for (var i = 0; i < hospital_list.length; i++) {

				if (hospital_list[i].TRD_STATE_GBN == "0000") {
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
				"<div class='animal_hospital_item'><h1>"
						+ g_hospital_list[g_hospital_start_index].WRKP_NM
						+ "</h1>"
						+ "<div class='animal_hospital_item_content'>" + "<h4>"
						+ g_hospital_list[g_hospital_start_index].SITE_TEL
						+ "</h4><h4>"
						+ g_hospital_list[g_hospital_start_index].SITE_AREA
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
			
		},
		error : function(xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
//			alert('Error - ' + errorMessage);
		}
	});
}

function setSellingView(district){
	//TODO:
	
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
	
	
//	$("#sc_selling_list").append("<div class='animal_hospital_row'>");

	/*
	 		<section class="sc_selling_row">
				<div class="store_name">하하호호 동물병원</div>
				<div class="store_address">서울특별시 중구 봉래동2가 122번지</div>
				<div class="store_address">서울특별시 중구 봉래동2가 122번지</div>
			</section>
	 */
//	sc_selling_list
}
// [end of selling Pet]

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
		},
		error : function(xhr, status, error) {
			var errorMessage = xhr.status + ': ' + xhr.statusText
//			alert('Error - ' + errorMessage);
		}
	});
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
		  if(is_selling_load)
			  setSellingView($( "#selling_district" ).val());
	});
}

