// ==UserScript==
// @name          RZD input data form
// @description   Enter passengers data easily
// @author        Mikhail Dvorkin, mikhail.dvorkin@gmail.com
// @namespace     http://dvorkin.me/
// @website       http://dvorkin.me/
// @version       1.0.7
// @include       http://pass.rzd.ru/*
// @include       http://www.pass.rzd.ru/*
// @include       https://pass.rzd.ru/*
// @include       https://www.pass.rzd.ru/*
// ==/UserScript==

/*
В появившуются область надо вставить данные в формате:
номер_документа фамилия имя отчество_или_дефис дата_рождения что_угодно

1234567890	Пушкин Александр Сергеевич	06.06.1799	Москва	9009990999999
1234567891	Гончарова Наталья Николаевна	08.09.1812	// жена
I-АК 123456	Пушкин Потомок Потомкович	1.1.2015
12 3456789	d'Anthès Georges-Charles - 5.2.1812
*/

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
//var parent = document.getElementById("TrainsList");
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
		//var re = /^(....[\d\s]+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\d\d?\.\d\d?\.\d\d\d\d)\s+([^\d\/]+)(\d*)(\s*|\s*\/\/.*)$/;
		var re = /^\s*(\S.+\S)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\d\d?[-./]\d\d?[-./]\d\d\d\d|\d\d\d\d[-./]\d\d?[-./]\d\d?)\s*(|\S.*)$/;
		var ss = re.exec(s);
		var dn = ss[1];
		var dt; if (/^(\d\s*){10,10}$/.test(dn)) {dt = 1;} else if (/^(\d\s*){9,9}$/.test(dn)) {dt = 3;} else {dt = 6;}
		var mid = ss[4];
		var gen;
		if (/[вч]на$/.test(mid)) {
			gen = "1";
		} else if (/ич$/.test(mid)) {
			gen = "2";
		} else {
			gen = "2";
			alert("Unusual middle name: " + mid + ". Set gender manually!");
		}
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
		document.getElementsByName("lastName")[i].value = ss[2];
		document.getElementsByName("firstName")[i].value = ss[3];
		document.getElementsByName("midName")[i].value = ss[4];
		document.getElementsByName("docType")[i].value = dt;
		document.getElementsByName("docNumber")[i].value = dn;
		document.getElementsByName("gender")[i].value = gen;
		document.getElementsByName("birthdate")[i].value = bd;
    }
}

function doTest() {
	s = "1234567891	Иванов Иван Иванович	08.09.1999\n";
	area.value = s + s + s + s;
	useData();
}
