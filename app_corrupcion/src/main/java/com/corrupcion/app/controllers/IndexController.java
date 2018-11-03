package com.corrupcion.app.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {
	
	@RequestMapping("/")
	public String index() {
		return "index";
	}
	
	@RequestMapping("/alcaldias")
	public String alcaldias() {
		return "index3";
	}
	
	@RequestMapping("experimental")
	public String index2() {
		return "index2";
	}
}
