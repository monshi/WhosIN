
package views.html

import play.templates._
import play.templates.TemplateMagic._

import play.api.templates._
import play.api.templates.PlayMagic._
import models._
import controllers._
import java.lang._
import java.util._
import scala.collection.JavaConversions._
import scala.collection.JavaConverters._
import play.api.i18n._
import play.api.templates.PlayMagicForJava._
import play.mvc._
import play.data._
import play.api.data.Field
import com.avaje.ebean._
import play.mvc.Http.Context.Implicit._
import views.html._
/**/
object main extends BaseScalaTemplate[play.api.templates.Html,Format[play.api.templates.Html]](play.api.templates.HtmlFormat) with play.api.templates.Template2[String,Html,play.api.templates.Html] {

    /**/
    def apply/*1.2*/(title: String)(content: Html):play.api.templates.Html = {
        _display_ {

Seq(format.raw/*1.32*/("""

<!DOCTYPE html>
<html>
  <head>
    <title>"""),_display_(Seq(/*6.13*/title)),format.raw/*6.18*/("""</title>
    <link rel="stylesheet" media="screen" href="/css/main.css"></link>
  </head>
  <body>
  	"""),_display_(Seq(/*10.5*/content)),format.raw/*10.12*/("""
  	<script type="text/javascript" src="/js/main.js"></script>  
  </body>
</html>"""))}
    }
    
    def render(title:String,content:Html) = apply(title)(content)
    
    def f:((String) => (Html) => play.api.templates.Html) = (title) => (content) => apply(title)(content)
    
    def ref = this

}
                /*
                    -- GENERATED --
                    DATE: Fri Apr 20 14:53:28 PDT 2012
                    SOURCE: /home/omonshiz/Projects/WhosIN/app/views/main.scala.html
                    HASH: 0145a39357258ec7ed6b971f74734eb8b16e8797
                    MATRIX: 759->1|861->31|937->77|963->82|1096->185|1125->192
                    LINES: 27->1|30->1|35->6|35->6|39->10|39->10
                    -- GENERATED --
                */
            