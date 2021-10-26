// ? пишем функцию и внутрь перемещаем участок кода из файла script.js
function calc() {
	const result = document.querySelector('.calculating__result span'); // внутри класса span

	let sex, height, weight, age, ratio;

	// ? если в localStorage есть инфа мы ее оттуда берем и помезщаем в переменные, а если инфы нет то задае ее по умолчанию
	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex');
	}	else {
		sex = 'female';
		localStorage.setItem('sex', 'female');
	}

	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio');
	}	else {
		ratio = 1.375;
		localStorage.setItem('ratio', 1.375);
	}

	// функция активности блоков. Инициализирует выбранные блоки
	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector);
		// * логика такая при загрузке страницы проверяется ratio и sex на значения заданные в localStorage
		elements.forEach(elem => {
			elem.classList.remove(activeClass); // удаляем класс активности
			if (elem.getAttribute('id') === localStorage.getItem('sex')) { // если элемент кот перебираем будет по значению атрибута id равен из локалстоража айтему sex
				elem.classList.add(activeClass);  // то назначаем класс активности
			}
			if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) { // аналогично только для значения атрибута data-ratio
				elem.classList.add(activeClass);
			}
		});
	}

	// !               div так как мы обращаемся к блокам этих селекторов
	initLocalSettings('#gender div', 'calculating__choose-item_active');
	initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

	// функция расчета
	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '____';
			return; // return сразу прекратит функцию если условие выше выполнится
		}

		if (sex === 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}

	// * эту функ вызываем неск раз так как при любых изменениях должен идти пересчет
	calcTotal();

	// функция показывающая переключение, активные блоки и т.д.
	function getStaticInformation(selector, activeClass) {
		// ? таким образом получает внутри parentSelector все divы
		const elements = document.querySelectorAll(selector);

		// ! перебираем, делигирование тут не прокатит будет между элементами при клике глюк
		elements.forEach(elem => {
			elem.addEventListener('click', (e) => {
				// тут пишем чтобы куда мы кликнем оттуда активность/пол
				if (e.target.getAttribute('data-ratio')) { // по дата атрибутам
					ratio = +e.target.getAttribute('data-ratio');
					// * localStorage записываем по атрибуту
					localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
				} else {
					sex = e.target.getAttribute('id'); // по полу
					localStorage.setItem('sex', e.target.getAttribute('id'));

				}
	
				// todo работаем с классами активности
				elements.forEach(elem => {
					elem.classList.remove(activeClass); // убираем класс активности кот передали в функцию
				});
	
				e.target.classList.add(activeClass); // доб класс активности тому элементу на кот кликнули			
	
				// * эту функ вызываем неск раз так как при любых изменениях должен идти пересчет
				calcTotal();
			});
		});
	}

	// !                  div так как мы обращаемся к блокам этих селекторов
	getStaticInformation('#gender div', 'calculating__choose-item_active');
	getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');


	// функция собирающая  данные из инпутов
	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', () => {

			// ! если юзер вводит буквы
			if (input.value.match(/\D/g)) {
				input.style.border = '1px solid red';
			} else {
				input.style.border = 'none';
			}
			
			// ? используем switch/case чтобы с разных инпутов можно было подобрать данные
			switch (input.getAttribute('id')) {
				case 'height':
					height = +input.value;
					break;
				case 'weight':
					weight = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			}

			// * эту функ вызываем неск раз так как при любых изменениях должен идти пересчет
			calcTotal();
		});
	}

	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');
}

// ! экспортируем используя ES6
export default calc;