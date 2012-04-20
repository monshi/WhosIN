// @SOURCE:/home/omonshiz/Projects/WhosIN/conf/routes
// @HASH:e147484a998ce74d5aafad2170fc0692723d3b45
// @DATE:Fri Apr 20 15:27:02 PDT 2012

import play.core._
import play.core.Router._
import play.core.j._

import play.api.mvc._
import play.libs.F

import Router.queryString

object Routes extends Router.Routes {


// @LINE:6
val controllers_Application_index0 = Route("GET", PathPattern(List(StaticPart("/"))))
                    

// @LINE:11
val controllers_Assets_at1 = Route("GET", PathPattern(List(StaticPart("/js/"),DynamicPart("file", """.+"""))))
                    

// @LINE:12
val controllers_Assets_at2 = Route("GET", PathPattern(List(StaticPart("/css/"),DynamicPart("file", """.+"""))))
                    

// @LINE:13
val controllers_Assets_at3 = Route("GET", PathPattern(List(StaticPart("/img/"),DynamicPart("file", """.+"""))))
                    
def documentation = List(("""GET""","""/""","""controllers.Application.index()"""),("""GET""","""/js/$file<.+>""","""controllers.Assets.at(path:String = "/public/javascripts/", file:String)"""),("""GET""","""/css/$file<.+>""","""controllers.Assets.at(path:String = "/public/stylesheets/", file:String)"""),("""GET""","""/img/$file<.+>""","""controllers.Assets.at(path:String = "/public/images/", file:String)"""))
             
    
def routes:PartialFunction[RequestHeader,Handler] = {        

// @LINE:6
case controllers_Application_index0(params) => {
   call { 
        invokeHandler(_root_.controllers.Application.index(), HandlerDef(this, "controllers.Application", "index", Nil))
   }
}
                    

// @LINE:11
case controllers_Assets_at1(params) => {
   call(Param[String]("path", Right("/public/javascripts/")), params.fromPath[String]("file", None)) { (path, file) =>
        invokeHandler(_root_.controllers.Assets.at(path, file), HandlerDef(this, "controllers.Assets", "at", Seq(classOf[String], classOf[String])))
   }
}
                    

// @LINE:12
case controllers_Assets_at2(params) => {
   call(Param[String]("path", Right("/public/stylesheets/")), params.fromPath[String]("file", None)) { (path, file) =>
        invokeHandler(_root_.controllers.Assets.at(path, file), HandlerDef(this, "controllers.Assets", "at", Seq(classOf[String], classOf[String])))
   }
}
                    

// @LINE:13
case controllers_Assets_at3(params) => {
   call(Param[String]("path", Right("/public/images/")), params.fromPath[String]("file", None)) { (path, file) =>
        invokeHandler(_root_.controllers.Assets.at(path, file), HandlerDef(this, "controllers.Assets", "at", Seq(classOf[String], classOf[String])))
   }
}
                    
}
    
}
                