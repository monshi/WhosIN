package models;


import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.TreeSet;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.FileRequestEntity;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * Created by IntelliJ IDEA. User: glau Date: 4/20/12 Time: 1:50 PM
 * -------
 * Usage:
 * You can either
 * 1) call static method run with html string to return a JSONObject,
 * or
 * 2) call main with html string as the only arg to print JSONObject String
 */
public class Calais
{
  private static final String CALAIS_URL = "http://api.opencalais.com/tag/rs/enrich";

  private File input;
  private File output;
  private HttpClient client;
  private Comparator<? super JSONObject> myComparator;

  // This is the method to execute the call to Calais API with a HTML as String
  // It will return a JSONObject with only person and company name in result.
  public static JSONObject run(String htmlBody)
      throws IOException, ParseException
  {
    Calais httpClientPost = new Calais();
    return httpClientPost.postFile(htmlBody, httpClientPost.createPostMethod());
  }

  // test() provides an easy example to test the functionality of Calais
  public static void test()
      throws IOException, ParseException
  {
    // Simpler test with two people and two companies
    // String html = "<html> <body> Mark Zuckerberg, Steve Jobs, Twitter and Apple Inc  </body> </html>";

    // Full test with real html
    String html = "";
    BufferedReader reader = new BufferedReader(new FileReader("input/techcrunch.html"));
    while (reader.ready()) {
      html += reader.readLine();
    }
    reader.close();
    System.out.println("html = " + html);
    JSONObject result = run(html);
    System.out.println("result = " + result);

    //httpClientPost.parseJSON("output/techcrunch.html.xml");
  }

  private PostMethod createPostMethod() {

    PostMethod method = new PostMethod(CALAIS_URL);

    // Set mandatory parameters
    method.setRequestHeader("x-calais-licenseID", "vznmu4gx2njt3hutk6s5typ3");

    // Set input content type
    //method.setRequestHeader("Content-Type", "text/xml; charset=UTF-8");
    method.setRequestHeader("Content-Type", "text/html; charset=UTF-8");
    //method.setRequestHeader("Content-Type", "text/raw; charset=UTF-8");

    // Set response/output format
    //method.setRequestHeader("Accept", "xml/rdf");
    //method.setRequestHeader("Accept", "text/simple");
    method.setRequestHeader("Accept", "application/json");

    method.setRequestHeader("calculateRelevanceScore", "true");

    // Enable Social Tags processing
    method.setRequestHeader("enableMetadataType", "SocialTags");

    return method;
  }

  private void run() {
    try {
      if (input.isFile()) {
        postFile(input, createPostMethod());
      } else if (input.isDirectory()) {
        System.out.println("working on all files in " + input.getAbsolutePath());
        for (File file : input.listFiles()) {
          if (file.isFile())
            postFile(file, createPostMethod());
          else
            System.out.println("skipping "+file.getAbsolutePath());
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void doRequest(File file, PostMethod method) {
    try {
      int returnCode = client.executeMethod(method);
      if (returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
        System.err.println("The Post method is not implemented by this URI");
        // still consume the response body
        method.getResponseBodyAsString();
      } else if (returnCode == HttpStatus.SC_OK) {
        System.out.println("File post succeeded: " + file);
        saveResponse(file, method);
      } else {
        System.err.println("File post failed: " + file);
        System.err.println("Got code: " + returnCode);
        System.err.println("response: "+method.getResponseBodyAsString());
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      method.releaseConnection();
    }
  }

  private JSONObject doRequest(PostMethod method)
      throws IOException, ParseException
  {
    int returnCode = client.executeMethod(method);
    JSONObject result = null;
    if (returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
      System.err.println("The Post method is not implemented by this URI");
      // still consume the response body
      method.getResponseBodyAsString();
    } else if (returnCode == HttpStatus.SC_OK) {
      System.out.println("Post succeeded.");
      result = saveResponse(method);
    } else {
      System.err.println("Post failed.");
      System.err.println("Got code: " + returnCode);
      System.err.println("response: " + method.getResponseBodyAsString());
    }
    method.releaseConnection();
    return result;
  }

  private void saveResponse(File file, PostMethod method)
  {
    PrintWriter writer = null;
    try {
      BufferedReader reader = new BufferedReader(new InputStreamReader(
          method.getResponseBodyAsStream(), "UTF-8"));
      File out = new File(output, file.getName() + ".xml");
      writer = new PrintWriter(new BufferedWriter(new FileWriter(out)));
      String line;
      while ((line = reader.readLine()) != null) {
        writer.println(line);
      }

    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (writer != null) try {writer.close();} catch (Exception ignored) {}
    }
  }

  private JSONObject saveResponse(PostMethod method)
      throws IOException, ParseException
  {
    BufferedReader reader = new BufferedReader(new InputStreamReader(
        method.getResponseBodyAsStream(), "UTF-8"));
    return parseJSON(reader);
  }

  private JSONObject parseJSON(String filename)
      throws IOException, ParseException
  {
    return parseJSON(new FileReader(filename));
  }

  private JSONObject parseJSON(Reader reader)
      throws IOException, ParseException
  {
    myComparator = new Comparator<JSONObject>()
    {
      public int compare(JSONObject jsonObject, JSONObject jsonObject1)
      {
        double relevance = (Double) jsonObject.get("relevance");
        double relevance1 = (Double) jsonObject1.get("relevance");
        if (relevance < relevance1)
          return 1;
        return -1;
      }
    };

    JSONParser parser = new JSONParser();
    JSONObject jsonObject = (JSONObject)parser.parse(reader);
    JSONObject result = new JSONObject();
    TreeSet<JSONObject> people = new TreeSet<JSONObject>(myComparator);
    TreeSet<JSONObject> companies = new TreeSet<JSONObject>(myComparator);

    for (Object value : jsonObject.values())
    {
      JSONObject jsonValue = (JSONObject) value;
      String type = (String) jsonValue.get("_type");
      if (type != null && type.equalsIgnoreCase("Person")) {
        people.add(jsonValue);
      } else if (type != null && type.equalsIgnoreCase("Company")) {
        companies.add(jsonValue);
      }
    }

    List<String> peopleList = new ArrayList<String>();
    List<String> companyList = new ArrayList<String>();

    for (JSONObject person : people)
    {
      peopleList.add((String)person.get("name"));
    }
    for (JSONObject company : companies)
    {
      companyList.add((String)company.get("name"));
    }

    JSONObject resultValue = new JSONObject();
    resultValue.put("people", peopleList);
    resultValue.put("companies", companyList);
    result.put("result", resultValue);

    return result;
  }

  private void postFile(File file, PostMethod method) throws IOException {
    method.setRequestEntity(new FileRequestEntity(file, null));
    doRequest(file, method);
  }

  public JSONObject postFile(String content, PostMethod method)
      throws IOException, ParseException
  {
    method.setRequestEntity(new StringRequestEntity(content));
    return doRequest(method);
  }

  public Calais()
  {
    this.client = new HttpClient();
    this.client.getParams().setParameter("http.useragent", "Calais Rest Client");
  }

  /************************************************************
   - Simple Calais client to process file or files in a folder
   - Takes 2 arguments
   1. File or folder name to process
   2. Output folder name to store response from Calais
   **************************************************************/
  public static void main(String[] args)
      throws IOException, ParseException
  {
    System.out.println(run(args[0]));
    //test();
/*
    verifyArgs(args);
    Calais httpClientPost = new Calais();
    httpClientPost.input = new File(args[0]);
    httpClientPost.output = new File(args[1]);
    httpClientPost.client = new HttpClient();
    httpClientPost.client.getParams().setParameter("http.useragent", "Calais Rest Client");
    httpClientPost.run();
*/
  }

  private static void verifyArgs(String[] args) {
    if (args.length==0) {
      usageError("no params supplied");
    } else if (args.length < 2) {
      usageError("2 params are required");
    } else {
      if (!new File(args[0]).exists())
        usageError("file " + args[0] + " doesn't exist");
      File outdir = new File(args[1]);
      if (!outdir.exists() && !outdir.mkdirs())
        usageError("couldn't create output dir");
    }
  }

  private static void usageError(String s) {
    System.err.println(s);
    System.err.println("Usage: java " + (new Object() { }.getClass().getEnclosingClass()).getName() + " input_dir output_dir");
    System.exit(-1);
  }
}
