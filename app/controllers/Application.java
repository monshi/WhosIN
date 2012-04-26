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
      ResponseData response = new ResponseData();
      response.setJson(Calais.run(whosinhtml).toJSONString());

      renderTemplate("Application/index.html", response);
    }

  public static void getData(){
    //renderHtml("<script type=\"text/javascript\"> var WhosINData = " + jsonData + ";console.log(WhosINData)</script><script type=\"text/javascript\" src=\"/js/main.js\"></script>");

//    renderTemplate("Application/index.html", response);
  }

  public static void bookmarklet(){
    render();
  }
}