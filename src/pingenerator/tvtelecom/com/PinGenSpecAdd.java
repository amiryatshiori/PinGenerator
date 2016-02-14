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
import javax.sql.DataSource;

@WebServlet("/PinGenSpecAdd")
public class PinGenSpecAdd extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public PinGenSpecAdd() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Logger LOG = Logger.getLogger(PinGenSpecAdd.class.getName());
        request.setCharacterEncoding(Utils.CharacterEncoding);    
        String pin = request.getParameter("pin").trim();
		//HttpSession session = request.getSession(true);
		//String userId = (String)session.getAttribute("userId");
LOG.log(Level.INFO,"{0} {1}",new Object[]{"PinGenSpecAdd-pin: ",pin});
        //int pinDigit = pin.length(); 
		Connection con = null;
		Statement st1 = null;
		//String sql1 ="select max(jobid) maxid from job";
		ResultSet rs1 = null;
		
		//String sql2 = "insert into job (JOBID,PINDIGIT,PINAMOUNT,STATUS,CREATOR,CREATEDDATE) values (jobId," + pinDigit + ",1,'I',"+ userId + ",CURRENT_TIMESTAMP)";

		String sql3 = "insert into pin values (pinId,jobId)";
		
/*
		Statement st2 = null;
		String sql4 = "update job set status = '_status' where jobid = " + jobId;
		String sql4r = "";
*/
		
		String result="failed";
		int jobId = 1;
		boolean dup = false;
		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/PinGen");
			con = ds.getConnection();
			st1 = con.createStatement();
/*
			rs1 = st1.executeQuery(sql1);
			if (rs1.next()) {
				jobId = rs1.getInt("maxid");
				jobId++;
			}
            if (rs1 != null) {rs1.close();}
            sql2 = sql2.replaceAll("jobId", Integer.toString(jobId));
LOG.log(Level.INFO,"sql2:{0}",new Object[]{sql2});
			st1.executeUpdate(sql2);
*/
			
        	try {
        		sql3 = sql3.replaceAll("jobId", Integer.toString(jobId));
        		sql3 = sql3.replace("pinId", pin);

				st1.executeUpdate(sql3);
				result = "succeed";
	        } catch (java.sql.SQLIntegrityConstraintViolationException e) {
				dup = true;result="dup";
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"PinGenSpecAdd","found duplicated pin while adding "+dup});
        	}
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"PinGenSpecAdd","Done!"});
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

		response.setContentType("application/json");
		response.setCharacterEncoding(Utils.CharacterEncoding);
		PrintWriter out = response.getWriter();
		out.print("{\"pin\":\""+pin+"\",\"result\":\""+result+"\"}");
		out.flush();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
