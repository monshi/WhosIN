package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

import java.util.HashMap;

public class Application extends Controller {

    public static void index() {
        render();
    }

    public static void process(String whosinhtml) {
    	HashMap peopleData = new HashMap();
    	peopleData.put("html", whosinhtml);
    	// redirect("/");
    	// renderJSON("{html: " + whosinhtml + "}");
    	index();
    }
}