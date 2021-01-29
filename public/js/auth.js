function comment(el, cmt, cls) {
	$(el).next().html(cmt);
	$(el).removeClass('active danger');
	$(el).addClass(cls);
}

function onBlurId(el) {
	var userid = $(el).val().trim(); // Jquery = el.value
	if(userid.length < 8) {
		comment(el, '아이디는 8자 입니다.', 'danger');
	}
	else {
		$.get('/auth/userid', { userid: userid }, onResponse);
	}
}

function onBlurPw(el) {

}

function onBlurPw2(el) {

}

function onBlurEmail(el) {

}