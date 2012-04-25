package controllers;

import java.io.IOException;
import org.apache.commons.httpclient.methods.PostMethod;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

import java.util.HashMap;

public class Application extends Controller {

    public static void index() {
        render();
    }

    public static void process(String whosinhtml)
        throws IOException, ParseException
    {
      JSONObject jsonObj = Calais.run(whosinhtml);
      System.out.println(jsonObj);

      renderTemplate("Application/index.html", jsonObj.get("result"));
//      renderJSON(jsonObj);
    }

  public static void getData(String htmlBody){
    renderText(htmlBody);
  }
}