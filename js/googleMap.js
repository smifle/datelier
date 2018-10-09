

// jQuery().ready(function()
// {
// 	//map
// 	map_initialize();
// });

$(window).on("load", function(){
	map_initialize();
});

//==========================================================================//
var directions; //ルートのインスタンス
var directionRenderer; //ルートレンダラ
var map_obj;	  //マップのインスタンス
var mapdiv = document.getElementById('mapCanvas');
var datelirLatlng = new google.maps.LatLng(35.6720982, 139.7133217); //datelier
var map_styles = [
	{
		"stylers": [
			{
				"saturation": -100
			}
		],
		"elementType": "all",
		"featureType": "all"
	}
];

function map_initialize(){
	// マップオプション設定
	var myOptions = {
		zoom: 18,
		center: datelirLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: true,
		mapTypeControl: true,
		scaleControl: false,
		scrollwheel: false,
		streetViewControl: true,
		overviewMapControl: false,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL
		}
	};
	var colorName = 'MyColor';

	map_obj = new google.maps.Map(mapdiv, myOptions);
	map_obj.mapTypes.set(colorName, new google.maps.StyledMapType(map_styles, { name: colorName }));
	map_obj.setMapTypeId(colorName);

	//右上の切り替えボタン
	var styledMapOptions = {
	    map: map_obj,
	    name: "datelier"
	}
	var jayzMapType =  new google.maps.StyledMapType(map_styles,styledMapOptions);
	map_obj.mapTypes.set('datelier', jayzMapType);
	map_obj.setMapTypeId('datelier');

	var tmp_icon = new google.maps.MarkerImage(
		'img/company_icon_pin.png',// url
		new google.maps.Size(46,42), // size
		new google.maps.Point(0,0),  // origin
		new google.maps.Point(2,42), // anchor
		new google.maps.Size(46,42) // anchor
	);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(35.6720982, 139.7133217),
		title:"HeadOffice",
		icon:tmp_icon
	});

	marker.setMap(map_obj);
}

