// ==UserScript==
// @name          RZD input data form
// @description   Enter passengers data easily
// @author        Mikhail Dvorkin, mikhail.dvorkin@gmail.com
// @namespace     http://dvorkin.me/
// @website       http://dvorkin.me/
// @version       1.1.2
// @include       *://pass.rzd.ru/*
// @include       *://www.pass.rzd.ru/*
// ==/UserScript==

manual = "В эту область надо вставить данные в формате:\n" +
"\tНомер_документа Фамилия Имя Отчество_или_дефис Дата_рождения [Ржд_бонус]\n" +
"Нажмите «Применить», кликните мышкой на каждое оранжевое поле,\n" +
"если оно текстовое — удалите бекспейсом символ «$»,\n" +
"иначе выберите вариант, подсказанный крупным шрифтом.";
sample =
"4010567890	Пушкин Александр Сергеевич	06.06.1999	Москва	9009990999999\n" +
"4010567891	Гончарова Наталья Николаевна	08.09.2002	// жена\n" +
"I-АК 123456	Пушкин Григорий Александрович	2015-05-24 9009990999998\n" +
"12 3456789	dAnthes Georges-Charles - 5.2.2002";

console.log("RZD input data form, v1.1.2");
var parent = document.querySelector("form.passData");
var panel = document.createElement("div");
parent.prepend(panel);
var area = document.createElement("textarea");
area.cols = 100;
area.rows = 5;
var input = document.createElement("input");
input.type = "button";
input.value = "Применить";
input.onclick = useData;
var sampleButton = document.createElement("input");
sampleButton.type = "button";
sampleButton.value = "Пример";
sampleButton.onclick = function() { area.value = sample; };
var manualButton = document.createElement("input");
manualButton.type = "button";
manualButton.value = "Инструкция";
manualButton.onclick = function() { area.value = manual; };
panel.appendChild(area);
panel.appendChild(document.createElement("br"));
panel.appendChild(input);
panel.appendChild(sampleButton);
panel.appendChild(manualButton);

function useData() {
	var lines = area.value.split("\n");
	var toAdd = 0;
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
			toAdd++;
			continue;
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
	if (toAdd > 0) {
		while (toAdd-- > 0) {
			document.querySelector("button[testid=passAdd] span span").click();
		}
		setTimeout(useData, 300);
		return;
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

