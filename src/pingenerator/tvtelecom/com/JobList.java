package pingenerator.tvtelecom.com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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
import javax.servlet.http.HttpSession;
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
		HttpSession session = request.getSession(true);
		String userId = (String)session.getAttribute("userId");
        String jobId = request.getParameter("jobId");
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"JobList",jobId});  

		Connection con = null;
		Statement st1 = null;
		String sql1 ="select * from job";
		ResultSet rs1 = null;

		String result="failed";
        JSONObject json;
        JSONArray jsonA = new JSONArray();
		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/PinGen");
			con = ds.getConnection();
			st1 = con.createStatement();
			rs1 = st1.executeQuery(sql1);
			while (rs1.next()) {
				result="failed";
                json = new JSONObject();
                json.put("JOBID",rs1.getInt("JOBID"));
                json.put("PINDIGIT",rs1.getInt("PINDIGIT"));
                json.put("PINAMOUNT",rs1.getLong("PINAMOUNT"));
                json.put("STATUS",rs1.getString("STATUS"));
                json.put("CREATOR",rs1.getInt("CREATOR"));
                json.put("CREATEDDATE",rs1.getLong("CREATEDDATE"));
                
				result = "succeed";
			}
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"PinGenBatchCount","result: "+result});
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
		res.put("jobId", jobId);
		
		
		response.setContentType("application/json");
		response.setCharacterEncoding(Utils.CharacterEncoding);
		PrintWriter out = response.getWriter();
		out.print("{\"result\":\""+result+"\",\"jobId\":"+jobId+",\"count\":"+c+"}");
		out.flush();
		
		
		
		
		
		
		
		

        JSONArray jsonB = new JSONArray();
        JSONArray jsonC = new JSONArray();
        JSONArray jsonZ = new JSONArray();
        SimpleDateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Context initContext = new InitialContext();
            DataSource ds = (DataSource)initContext.lookup("java:/comp/env/jdbc/SingleWebHistory");
            conn = ds.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            errorCode = "HistoryRCaseOpen01";
            errorMessage = "No data";
            while (rs.next()) {
                json = new JSONObject();
                json.put("historyid",rs.getInt("historyid"));
                json.put("casetypename",rs.getString("casetypename"));
                json.put("casestatusname",rs.getString("casestatusname"));
                json.put("msisdn",rs.getString("msisdn"));
                json.put("mvnocode",rs.getString("mvnocode"));
                json.put("casename",rs.getString("casename"));
                json.put("casedesc",rs.getString("casedesc"));
                json.put("note",rs.getString("note"));
                json.put("orderid",rs.getString("ORDERID"));
                json.put("omorderid",rs.getString("OMORDERID"));
                json.put("createdtime",rs.getString("createdtime"));
                json.put("createdby",rs.getString("createdby"));
                json.put("updatedtime",rs.getString("updatedtime"));
                json.put("updatedby",rs.getString("updatedby"));
                if (!rs.getString("createdtime").substring(0, 10).equals(dFormat.format(new Date()))) {jsonC.add(json);} else {jsonB.add(json);}
            }
        } catch (NamingException e) {
            errorCode = "HistoryRCaseOpen99";
            errorMessage = e.toString();
        } catch (SQLException e) {
            errorCode = "HistoryRCaseOpen99";
            errorMessage = e.toString();
        } finally {
            if(rs!=null){try{rs.close();}catch(SQLException e){errorCode="HistoryRCaseOpen99";errorMessage=e.toString();}rs=null;}
            if(stmt!=null){try{stmt.close();}catch(SQLException e){errorCode="HistoryRCaseOpen99";errorMessage=e.toString();}stmt=null;}
            if(conn!=null){try{conn.close();}catch(SQLException e){errorCode="HistoryRCaseOpen99";errorMessage=e.toString();}conn=null;}
        }

        if(!jsonB.isEmpty() || !jsonC.isEmpty()){errorCode = "HistoryRCaseOpen00";errorMessage = "No error";}
        json = new JSONObject();
        json.put("error_code",errorCode);
        json.put("error_message",errorMessage);
        jsonA.add(json);
        jsonZ.add(jsonA);jsonZ.add(jsonB);jsonZ.add(jsonC);
        response.setContentType("application/json");
        response.setCharacterEncoding(Utils.CharacterEncoding);
        PrintWriter out = response.getWriter();
        jsonZ.writeJSONString(out);
LOG.log(Level.INFO,"jsonZ:{0}",new Object[]{jsonZ.toJSONString()});
LOG.log(Level.INFO,"{0}-errorCode: {1},errorMessage: {2}",new Object[]{"HistoryRCaseOpen",errorCode,errorMessage});
		
		
		
		
		
		
		
		
		
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
