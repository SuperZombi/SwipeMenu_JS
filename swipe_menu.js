function swipeMenu(menuArea){
	let back_button = menuArea.querySelector(".back_button")
	menuArea.querySelectorAll(".submenu").forEach(el=>{
		let back = document.createElement("li")
		back.classList.add("back_button")
		back.onclick = _=>{
			el.style.left = ""
			el.dispatchEvent(new Event('submenu_close'));
		}
		back.innerHTML = back_button.innerHTML;
		if (el.querySelector(".menu_title")){
			el.querySelector(".menu_title").after(back);
		}
		else{
			el.prepend(back)
		}
	})
	menuArea.querySelectorAll(".menu, .submenu").forEach(menu=>{
		menu.querySelectorAll("li[submenu]").forEach(sub=>{
			let target = menuArea.querySelector(`.submenu[name=${sub.getAttribute("submenu")}]`)
			sub.onclick = _=>{
				menu.style.filter = "brightness(0.25)"
				target.style.left = 0
				menu.style.minHeight = target.scrollHeight + "px"
				menuArea.style.minHeight = target.scrollHeight + "px"
			}
			target.addEventListener('submenu_close', _=> {
				menu.style.filter = ""
				target.style.left = ""
				menu.style.minHeight = ""
				menuArea.style.minHeight = ""
			});
		})
		menu.querySelectorAll("li[href]").forEach(li=>{
			if (li.getAttribute("target")){
				li.onclick = _=> window.open(li.getAttribute("href"), li.getAttribute("target"))
			} else{
				li.onclick = _=> window.open(li.getAttribute("href"),"_self")
			}
			li.addEventListener("mousedown", e=>{
				if (e.which == 2) {
					window.open(li.getAttribute("href"), "_blank")
				}
			})
		})
	})
	menuArea.exitAllSubMenus = _=>{
		menuArea.querySelectorAll(".menu, .submenu").forEach(menu=>{
			menu.dispatchEvent(new Event('submenu_close'));
		})
	}
	menuArea.init = (name, value, change_handler = _=>{}) => {
		let main_el = menuArea.querySelector(`.menu li[submenu='${name}']`)
		if (!main_el){
			main_el = menuArea.querySelector(`.menu li[name='${name}']`)
			main_el.innerHTML += `: <span class='helper'>${value}</span>`
			return
		}
		let submenu = menuArea.querySelector(`.submenu[name='${name}']`)
		let selected = submenu.querySelector(`li[value="${value}"]`)
		selected.classList.add("selected")
		main_el.innerHTML += `: <span class='helper'>${selected.textContent}</span>`
		submenu.addEventListener("click", e=>{
			if (e.target.tagName.toLowerCase() == "li" &&
				!e.target.classList.contains('selected') && 
				!e.target.classList.contains('back_button')
			){
				let old_selected = submenu.querySelector("li.selected")
				old_selected.classList.remove("selected")
				e.target.classList.add("selected")
				main_el.querySelector(".helper").innerHTML = e.target.textContent
				change_handler(e.target, old_selected)
			}
		})
	}
	menuArea.update = (name, value) => {
		let main_el = menuArea.querySelector(`.menu li[submenu='${name}']`)
		if (!main_el){
			main_el = menuArea.querySelector(`.menu li[name='${name}']`)
			main_el.querySelector(".helper").innerHTML = value
			return
		}
		let submenu = menuArea.querySelector(`.submenu[name='${name}']`)
		let selected_old = submenu.querySelector('li.selected')
		selected_old.classList.remove('selected')
		let selected = submenu.querySelector(`li[value="${value}"]`)
		main_el.querySelector(".helper").innerHTML = selected.textContent
		selected.classList.add("selected")
	}
	return menuArea
}
