/* global variable */
var g_hospital_list = [];
var g_hospital_start_index = 0;
/* end of global variable */

window.onload = init;

function init() {
	//		handleRefresh();
	updateURL(1, 100); //주소 업데이트
}

// [about map]
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
mapOption = {
	center : new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
	level : 3
// 지도의 확대 레벨
};

var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// [end of map]

// [about animal hospital api]
function updateURL(start, end) {
	var url = "http://openapi.seoul.go.kr:8088/4b4b67704d6462663132306c47655155/json/SeoulAnimalHospital/"
			+ start + "/" + end + "/";
	/*
	$.getJSON(url, function(json){
		alert("success-getAnimalHospital")
	});
	 */

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
			alert('Error - ' + errorMessage);
		}
	});

}

function nextPageList() {
	//alert("next! :"+ g_hospital_start_index);

	if (g_hospital_start_index >= g_hospital_list.length) {
		alert("마지막 페이지 입니다.");
		return;
	}

	$("#sc_animal_content").empty();
	$("#sc_animal_content").append("<div class='animal_hospital_row'>");

	while (true) {
		// innerHTML
		$("#sc_animal_content").append(
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
			$("#sc_animal_content").append(
					"</div><div class='animal_hospital_row'>");
			$("#sc_animal_content").append("<br/>");
		}

		if (g_hospital_start_index % 8 == 0) {
			$("#sc_animal_content").append("</div>");
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