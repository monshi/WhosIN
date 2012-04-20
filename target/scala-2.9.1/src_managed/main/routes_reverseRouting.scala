// @SOURCE:/home/omonshiz/Projects/WhosIN/conf/routes
// @HASH:e147484a998ce74d5aafad2170fc0692723d3b45
// @DATE:Fri Apr 20 15:27:02 PDT 2012

import play.core._
import play.core.Router._
import play.core.j._

import play.api.mvc._
import play.libs.F

import Router.queryString


// @LINE:13
// @LINE:12
// @LINE:11
// @LINE:6
package controllers {

// @LINE:6
class ReverseApplication {
    


 
// @LINE:6
def index() = {
   Call("GET", "/")
}
                                                        

                      
    
}
                            

// @LINE:13
// @LINE:12
// @LINE:11
class ReverseAssets {
    


 
// @LINE:13
// @LINE:12
// @LINE:11
def at(path:String, file:String) = {
   (path, file) match {
// @LINE:11
case (path, file) if path == "/public/javascripts/" => Call("GET", "/js/" + implicitly[PathBindable[String]].unbind("file", file))
                                                                
// @LINE:12
case (path, file) if path == "/public/stylesheets/" => Call("GET", "/css/" + implicitly[PathBindable[String]].unbind("file", file))
                                                                
// @LINE:13
case (path, file) if path == "/public/images/" => Call("GET", "/img/" + implicitly[PathBindable[String]].unbind("file", file))
                                                                    
   }
}
                                                        

                      
    
}
                            
}
                    


// @LINE:13
// @LINE:12
// @LINE:11
// @LINE:6
package controllers.javascript {

// @LINE:6
class ReverseApplication {
    


 
// @LINE:6
def index = JavascriptReverseRoute(
   "controllers.Application.index",
   """
      function() {
      return _wA({method:"GET", url:"/"})
      }
   """
)
                                                        

                      
    
}
                            

// @LINE:13
// @LINE:12
// @LINE:11
class ReverseAssets {
    


 
// @LINE:13
// @LINE:12
// @LINE:11
def at = JavascriptReverseRoute(
   "controllers.Assets.at",
   """
      function(path, file) {
      if (path == """ + implicitly[JavascriptLitteral[String]].to("/public/javascripts/") + """) {
      return _wA({method:"GET", url:"/js/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
      }
      if (path == """ + implicitly[JavascriptLitteral[String]].to("/public/stylesheets/") + """) {
      return _wA({method:"GET", url:"/css/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
      }
      if (path == """ + implicitly[JavascriptLitteral[String]].to("/public/images/") + """) {
      return _wA({method:"GET", url:"/img/" + (""" + implicitly[PathBindable[String]].javascriptUnbind + """)("file", file)})
      }
      }
   """
)
                                                        

                      
    
}
                            
}
                    


// @LINE:13
// @LINE:12
// @LINE:11
// @LINE:6
package controllers.ref {

// @LINE:6
class ReverseApplication {
    


 
// @LINE:6
def index() = new play.api.mvc.HandlerRef(
   controllers.Application.index(), HandlerDef(this, "controllers.Application", "index", Seq())
)
                              

                      
    
}
                            

// @LINE:13
// @LINE:12
// @LINE:11
class ReverseAssets {
    


 
// @LINE:11
def at(path:String, file:String) = new play.api.mvc.HandlerRef(
   controllers.Assets.at(path, file), HandlerDef(this, "controllers.Assets", "at", Seq(classOf[String], classOf[String]))
)
                              

                      
    
}
                            
}
                    
                