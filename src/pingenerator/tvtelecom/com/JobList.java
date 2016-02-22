package pingenerator.tvtelecom.com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
//import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

@WebServlet("/JobList")
public class JobList extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public JobList() {
        super();
    }

	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Logger LOG = Logger.getLogger(JobList.class.getName());
        request.setCharacterEncoding(Utils.CharacterEncoding);
		//HttpSession session = request.getSession(true);
		//String userId = (String)session.getAttribute("userId");
        String jobId = request.getParameter("jobId");
LOG.log(Level.INFO,"JobList jobId:{0}",new Object[]{jobId});  

		Connection con = null;
		Statement st1 = null;
		String sql1 = "select * from job order by jobid desc";
		if (jobId != null) {sql1 ="select * from job where jobid = " + jobId + " order by jobid desc";}
		ResultSet rs1 = null;

		String result="failed";
        JSONObject json;
        JSONArray jsonA = new JSONArray();
        SimpleDateFormat dFormat = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/PinGen");
			con = ds.getConnection();
			st1 = con.createStatement();
			rs1 = st1.executeQuery(sql1);
			while (rs1.next()) {
                json = new JSONObject();
                json.put("JOBID",rs1.getString("JOBID"));
                json.put("TYPE",rs1.getString("TYPE"));
                json.put("DIGIT",rs1.getInt("DIGIT"));
                json.put("AMOUNT",rs1.getLong("AMOUNT"));
                json.put("STATUS",rs1.getString("STATUS"));
                json.put("UPDATEDBY",rs1.getInt("UPDATEDBY"));
                json.put("UPDATEDDATE",dFormat.format(new java.util.Date(rs1.getTimestamp("UPDATEDDATE").getTime())));
                jsonA.add(json);
			}
			result = "succeed";
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"JobList","result: "+result});
		} catch(NamingException | SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			result = "failed";
		} finally {
		    try {
		        if (rs1 != null) {rs1.close();}if (st1 != null) {st1.close();}
		        if (con != null) {con.close();}
		    } catch (SQLException ex) {
		    	LOG.log(Level.WARNING, ex.getMessage(), ex);
		    }
		}
		JSONObject res = new JSONObject();
		res.put("result", result);
		res.put("joblist", jsonA);
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"JobList","jsonZ: "+res.toJSONString()});		
		response.setContentType("application/json");
		response.setCharacterEncoding(Utils.CharacterEncoding);
		PrintWriter out = response.getWriter();
		res.writeJSONString(out);
		out.flush();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
