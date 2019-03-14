// ==UserScript==
// @name          RZD input data form
// @description   Enter passengers data easily
// @author        Mikhail Dvorkin, mikhail.dvorkin@gmail.com
// @namespace     http://dvorkin.me/
// @website       http://dvorkin.me/
// @version       1.1.0
// @include       *://pass.rzd.ru/*
// @include       *://www.pass.rzd.ru/*
// ==/UserScript==

/*
В появившуются область надо вставить данные в формате:
номер_документа фамилия имя отчество_или_дефис дата_рождения что_угодно

4010567890	Пушкин Александр Сергеевич	06.06.1999	Москва	9009990999999
4010567891	Гончарова Наталья Николаевна	08.09.2002	// жена
I-АК 123456	Пушкин Григорий Александрович	2015-05-24 9009990999998
12 3456789	dAnthes Georges-Charles - 5.2.2002
*/

console.log("RZD input data form, v1.1.0");
var area = document.createElement("textarea");
area.cols = 100;
area.rows = 5;
var input = document.createElement("input");
input.type = "button";
input.value = "Применить";
input.onclick = useData;
var testButton = document.createElement("input");
testButton.type = "button";
testButton.value = "Пример";
testButton.onclick = doTest;
var parent = document.getElementsByClassName("crumbs-and-nav-row")[0];
parent.appendChild(area);
parent.appendChild(document.createElement("br"));
parent.appendChild(input);
parent.appendChild(testButton);

function useData() {
	var lines = area.value.split("\n");
	for (i = 0; i < 4; i++) {
		var s = lines[i];
		if (!/(\S+\s+){3,3}/.test(s)) {continue;}
		var re = /^\s*(\S.+\S)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\d\d?[-./]\d\d?[-./]\d\d\d\d|\d\d\d\d[-./]\d\d?[-./]\d\d?)\s*(|\S.*)$/;
		var ss = re.exec(s);
		var dn = ss[1];
		var dt;
		if (/^(\d\s*){10,10}$/.test(dn)) {dt = 1;} else if (/^(\d\s*){9,9}$/.test(dn)) {dt = 3;} else {dt = 6;}
		var mid = ss[4];
		var gen;
		if (/[вч]на$/.test(mid)) {gen = "1";} else if (/ич$/.test(mid)) {gen = "2";} else {gen = "";}
		var bd = /(\d\d?)[-./](\d\d?)[-./](\d\d\d\d)/.exec(ss[5]);
		if (bd != null) {
			if (bd[1].length < 2) bd[1] = "0" + bd[1];
			if (bd[2].length < 2) bd[2] = "0" + bd[2];
			bd = bd[1] + "." + bd[2] + "." + bd[3];
		} else {
			var bd = /(\d\d\d\d)[-./](\d\d?)[-./](\d\d?)/.exec(ss[5]);
			if (bd[3].length < 2) bd[3] = "0" + bd[3];
			if (bd[2].length < 2) bd[2] = "0" + bd[2];
			bd = bd[3] + "." + bd[2] + "." + bd[1];
		}
		bonus = /\b\d{13}\b/.exec(ss[6])
		if (bonus) {
			bonus = bonus[0];
		}
		if (!document.getElementsByName("lastName")[i]) {
			document.querySelector("button[testid=passAdd] span span").click();
		}
		if (!document.getElementsByName("lastName")[i]) {
			alert("Пришлось добавить пассажира. Нажмите ещё раз.");
			return;
		}
		rzdSet(document.getElementsByName("lastName")[i], ss[2]);
		rzdSet(document.getElementsByName("firstName")[i], ss[3]);
		rzdSet(document.getElementsByName("midName")[i], mid);
		rzdSet(document.getElementsByName("docNumber")[i], dn);
		rzdSet(document.querySelectorAll("select[testid=gender]")[i], gen);
		rzdSet(document.querySelectorAll("input[testid=birthdate]")[i], bd);
		rzdSet(document.querySelectorAll("select[testid=docType]")[i], dt);
		rzdSet(document.querySelectorAll("input[testid=ns-chbox]")[i], false);
		rzdSet(document.querySelectorAll("input[testid=dms-chbox]")[i], false);
		bonusCheckbox = document.querySelectorAll("input[testid=bonuscard]")[i];
		if (!bonus) {
			rzdSet(bonusCheckbox, false);
		} else {
			rzdSet(bonusCheckbox, true);
			bonusField = bonusCheckbox.parentNode.parentNode.querySelector("input[name=cardRZDBonus]");
			rzdSet(bonusField, bonus);
		}
	}
	rzdSet(document.querySelector("input[testid=gdpr3]"), true);
}

function rzdSet(elem, newValue) {
	if (elem.type == "text") {
		elem.style.background = "orange";
		elem.onclick = function() {
			elem.value = newValue + '$';
			elem.style.background = "";
		};
	} else if (elem.type == "checkbox") {
		elem.checked = !newValue;
		elem.click();
	} else if (elem.type == "select-one") {
		op = elem.querySelector("option[value='" + newValue + "']");
		elem.style.background = "orange";
		op.style.fontSize = "36px";
		elem.onclick = function() {
			elem.style.background = "";
		};
	}
}

function doTest() {
	s = "4007456789	Иванов Иван Иванович	18.09.1999\n";
	area.value = s + s;
	useData();
}

