$(function(){

var $window = $(window);
var window_w = $window.outerWidth();
var window_h = $window.outerHeight();

var mainVisual_w;
var mainVisual_h;
var originalMainVisual_w = 1280;
var originalMainVisual_h = 960;
var mainVisualAspectRatio = originalMainVisual_h / originalMainVisual_w;
var windowAspectRatio = window_h / window_w;
var mainVisualSweetPosition = .6; //メインビジュアルの一番表示したい位置を上からの0〜1の間で指定



/*==========================================*/
/* メインビジュアル */
/*==========================================*/
var $section_top = $("#section_top");
var $mainVisual = $(".mainVisual", $section_top);

/* メインビジュアル部分の高さセット */
function setMainVisualContainerSize() {
	$section_top.height(window_h - $section_top.css("borderBottomWidth").replace("px", ""));
}

/* メインビジュアルimgのサイズとポジションをセット */
function setMainVisualImgSize() {
	if(windowAspectRatio < mainVisualAspectRatio) {
		//メインビジュアル比率よりもウインドウ比率が小さい
		var imgElm = $("img", $section_top);
		var imgW = window_w;
		var imgH = window_w * mainVisualAspectRatio;

		imgElm
			.width(imgW)
			.height(imgH)
			.css("top", (imgH - window_h) * mainVisualSweetPosition * -1)
			.css("marginLeft", (window_w - imgW) / 2);
	}else{
		//ウインドウ比率よりもメインビジュアル比率が小さい
		var imgElm = $("img", $section_top);
		var imgW = window_h / mainVisualAspectRatio;
		var imgH = window_h;

		imgElm
			.width(imgW)
			.height(imgH)
			.css("top", (imgH - window_h) * mainVisualSweetPosition * -1)
			.css("marginLeft", (window_w - imgW) / 2);
	}
}

/* メインビジュアルにオーバーレイ */
function setOverlay() {
	var offset_top = 50;
	var _this = $(this);

	if(_this.scrollTop() >= offset_top){
		$mainVisual.addClass("overlay");
	}else{
		$mainVisual.removeClass("overlay");
	}
}

$window.on("scroll", function(){
	setOverlay();
});



/*==========================================*/
/* ページトップボタン出現 */
/*==========================================*/
var showScrolltopBtnPos = 250; //ボタン出現のスクロール位置
var $pagetop = $("#pagetop");

function showScrolltopBtn(){
	var scloll_y = $window.scrollTop();

	if(scloll_y > showScrolltopBtnPos){
		$pagetop.addClass("show");
	}else if(scloll_y < showScrolltopBtnPos){
		$pagetop.removeClass("show");
	}
}



/*==========================================*/
/* スムーススクロール */
/*==========================================*/
$('a[href^=#]').on("click", function() {
	var href= $(this).attr("href");

	if(!(href == "#")){
		var gapTop = 0; //上部オフセット
		var speed = 600;
		var target = $(href);
		var position = target.offset().top - gapTop;

		$('body,html').animate({scrollTop:position}, speed, 'easeOutQuint');
		return false;
	}
});



/*==========================================*/
/* ヘッダナビ */
/*==========================================*/
var $header = $("#header");
var $nav = $(".menu", $header);
var $btn_nav = $("a", $nav);
var $btn_menuDisp = $(".btn_menuDisp", $header);

$btn_nav.add($btn_menuDisp).on("click", function(){
	$header
		.toggleClass("open")
		.removeClass("no-animate");	//SP版メニューボタンの表示時にanimateさせないためのclass
});



/************************************************/
// ナビcurrent切り替え
/************************************************/
var marginTop = 1;		//0だとIEでなぜか前項についてしまうので
var navList = $('#globalNav .menu li');
var offset_about;
var offset_works;

var offset_profile;
var offset_info;
var offset_contact;

function getSectionOffset() {
	offset_about = $("#section_about").offset();		//section_aboutのオフセット
	offset_works = $("#section_works").offset();		//section_worksのオフセット
	offset_profile = $("#section_profile").offset();	//section_profileのオフセット
	offset_info = $("#section_info").offset();			//section_infoのオフセット
	offset_contact = $("#section_contact").offset();	//section_contactのオフセット
}

function setCurrentClass(className) {
	var currentClassName = "current";

	navList
		.removeClass(currentClassName)
		.filter(className)
		.addClass(currentClassName);
}

function setCurrentNav() {
	var _this = $(this);

	if(_this.scrollTop() >= offset_contact.top - marginTop ){
		setCurrentClass('.contact');
	}else if(_this.scrollTop() >= offset_info.top - marginTop ){
		setCurrentClass('.info');
	}else if(_this.scrollTop() >= offset_profile.top - marginTop ){
		setCurrentClass('.profile');
	}else if(_this.scrollTop() >= offset_works.top - marginTop ){
		setCurrentClass('.works');
	}else if(_this.scrollTop() >= offset_about.top - marginTop ){
		setCurrentClass('.about');
	}else{
		navList.removeClass('current');
	}
}



/*==========================================*/
/* 作品詳細 */
/*==========================================*/
var $header = $("#header");
var $wrapper = $("#wrapper");
var $worksModal = $("#worksModal");
var $worksList = $("#worksList");
var $worksBtn = $("a", $worksList);
var $worksCloseBtn = $worksModal.find(".btnClose, .btnBack");
var currentScrollTop;

$worksBtn.on("click", function(){
	currentScrollTop = $(document).scrollTop();
	$worksModal
		.children(".content")
		.empty()
		.append($(this).children(".name").clone())
		.append($(this).children(".detail").clone());

	//画像をsrc属性にセット
	$("img", $worksModal).each(function(){
		var imgElm = $(this);
		var imgSrc = imgElm.attr("data-original");

		//画像読み込み完了後にフェードイン
		imgElm
			.css({opacity: 0})
			.attr("src", imgSrc)
			.on("load", function(){
				$(this).animate({opacity: 1}, 200);
			});
	});

	$wrapper.fadeOut(200, function(){
		$(document).scrollTop(0);
		$worksModal.fadeIn(200);
		$header.addClass("no-animate");	//SP版メニューボタンの表示時にanimateさせないためのclass
	});

	return false;
});

$worksCloseBtn.on("click", function(){
	$worksModal.fadeOut(200, function(){
		$wrapper
			.show()
			.css({opacity: 0})

		$(document)
			.scrollTop(currentScrollTop)

		$wrapper
			.animate({opacity: 1}, 200);
	});

	return false;
});



/*==========================================*/
/* scrollDepth */
/*==========================================*/
$.scrollDepth({
	elements: ['#section_top', '#section_about', '#section_works', '#section_profile', '#section_info', '#section_contact', '#section_company', '#footer'],
	percentage: false,
	pixelDepth: false
});



/*==========================================*/
/* facebookフィード取得 */
/*==========================================*/
function formatDate(date) {
	var dateStr = date.replace(/-/g, "/").replace("T", " "); //graphApiのcreated_dateはハイフン区切りの日付を返すがsafari等で上手くパースされないためスラッシュ区切りに変換
	var d = new Date(dateStr);

	return (d.getFullYear() + '.' + ("0"+(d.getMonth()+1)).slice(-2)  + '.' + ("0"+d.getDate()).slice(-2));
};

function trimMessageText(message) {
	var cutFigure = 80;
	var textLength = message.length;
	var trimMessage = message.substr(0, cutFigure) + "...";

	if(cutFigure < textLength) {
		return trimMessage;
	} else if(cutFigure >= textLength) {
		return message;
	}
}

$.getJSON(
	'https://graph.facebook.com/v2.5/datelier.tokyo/feed?',
	{
		access_token: '736636169775113|WFasjgrVwJMVCbR7LEIkNiZ5S10',
		limit: 6
	},
	function (data) {
		var d = new Date(data.data[0].created_time);

		$.each(data.data, function(i, item){
			var postId = item.id.split("_");

			if(item.message != 0){
				$('#fbFeedCont').append('<li><a href="https://www.facebook.com/datelier.tokyo/posts/' + postId[1] + '" target="_blank" onclick="ga(\'send\', \'event\', \'button\', \'click\', \'fbFeed_' + postId[1] + '\')"><span class="text">' + trimMessageText(item.message) + '</span><span class="date">' + formatDate(item.created_time) + '</span></a></li>');
			}
		});
	}
);



/*==========================================*/
/* 問い合わせフォーム */
/*==========================================*/

/* placeholder IE用 */
$("[placeholder]").ahPlaceholder({
	placeholderColor: '#bbb',
	placeholderAttr: 'placeholder',
	likeApple: true
});

/* フォームチェック */
var $form = $("#section_contact form");
// mail.php側でやるため下記は不使用
// $form.on("submit", formCheck);

function formCheck() {
	var $this = $(this);
	var errMsg = "";

	$this.find(".email").each(function(){
		if($(this).val() && !$(this).val().match(/.+@.+\..+/g)) {
			errMsg += "メールアドレスの書式が正しくありません\n";
		}
	});

	$this.find(".required").each(function(){
		if($(this).val() == "") {
			errMsg += $(this).attr("name") + "は必須項目です\n";
		}
	});

	if(errMsg != "") {
		alert(errMsg);
		return false;
	}else{
		if(!confirm("この内容で送信します。よろしいですか？")) {
			return false;
		}
	}
}



/*==========================================*/
/* ローディング */
/*==========================================*/
function hideLoading(){
	$("#loading").fadeOut(200);
}



/*==========================================*/
/* 初期化 */
/*==========================================*/
function init() {
	setMainVisualContainerSize();
	setMainVisualImgSize();
	setOverlay();			//メインビジュアルのオーバーレイ
	getSectionOffset();		//各セクションのオフセット位置取得
	setCurrentNav();
	// $window.on("scroll", function(){
	// 	setMainVisualVisible();
	// });
}
init();

$window.on({
	"load": function(){
		getSectionOffset();		//各セクションのオフセット位置取得
		hideLoading();			//ローディング非表示
	},

	"scroll": function(){
		setCurrentNav();		//currentナビボタン判定
		showScrolltopBtn();		//Pagetopボタン出現判定
	},

	"resize": function(){
		window_w = $window.outerWidth();
		window_h = $window.outerHeight();
		windowAspectRatio = window_h / window_w;

		init();
	}
});



});
