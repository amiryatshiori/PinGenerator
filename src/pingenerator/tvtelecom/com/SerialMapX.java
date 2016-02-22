package pingenerator.tvtelecom.com;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Random;
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

@WebServlet("/SerialMapX")
public class SerialMapX extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public SerialMapX() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Logger LOG = Logger.getLogger(PinGenBatchX.class.getName());
        request.setCharacterEncoding(Utils.CharacterEncoding);    
        String jobId = request.getParameter("jobId");
        String userId = request.getParameter("userId");
		
LOG.log(Level.INFO,"{0} {1}",new Object[]{"SerialMapX-jobId: ",jobId});

		Connection con = null;
		Statement st1 = null;
		String sql1 ="select * from job where status = 'I' and jobid = '" + jobId + "'";
		ResultSet rs1 = null;
		
		Statement st11 = null;
		String sql11 = "select * from pattern where patternid = _patternid";
		ResultSet rs11 = null;
		
		String sql12 = "update job set status = 'P' where jobid = '" + jobId + "'";
		Statement st2 = null;
		String sql2 = "update job set status = '_status', dupcount = _ratio where jobid = '" + jobId + "'";
		String sql2r = "";
		
		PreparedStatement st3 = null;
		String sql3 = "insert into serial (SERIAL,PATTERNID,STATUS,JOBID,UPDATEDBY,UPDATEDDATE) values (?,_patternid,'A','"+jobId+"',"+userId+",CURRENT_TIMESTAMP)";
		
		
		
		
		//String sql3 = "insert into pin (PIN,STATUS,JOBID,UPDATEDBY,UPDATEDDATE) values (?,'A','"+jobId+"',"+userId+",CURRENT_TIMESTAMP)";
		
		Statement st4 = null;
		String sql4 = "update pin set serial = '?' where pin = '?'";
		

		long c = 0;
		String result="failed";
		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/PinGen");
			
			int patternId;
			long amount;
			
			String channel;
			int digit;
			int pinDigit;
			
			con = ds.getConnection();
			st1 = con.createStatement();
			rs1 = st1.executeQuery(sql1);
			if (rs1.next()) {
				result="failed";
				patternId = rs1.getInt("PATTERNID");
				amount = rs1.getLong("AMOUNT");
				sql11 = sql11.replaceAll("_patternid", Integer.toString(patternId));
LOG.log(Level.INFO,"{0} {1}",new Object[]{"SerialMapX","sql11: " + sql11});
				st11 = con.createStatement();
				rs11 = st11.executeQuery(sql11);
				if (rs1.next()) {
					channel = rs11.getString("CHANNEL");
					digit = rs11.getInt("DIGIT");
					pinDigit = rs11.getInt("PINDIGIT");
					
					st1.executeUpdate(sql12);
					
		            sql2r = sql2.replaceAll("_status", "P");
		            sql2r = sql2r.replaceAll("_ratio", Long.toString(0));
					st2 = con.createStatement();
					st2.executeUpdate(sql2r);

					sql3 = sql3.replaceAll("_patternid", Integer.toString(patternId));
LOG.log(Level.INFO,"{0} {1}",new Object[]{"SerialMapX","sql3: " + sql3});
					st3 = con.prepareStatement(sql3);
					boolean dup;
		            for (long i = 1; i <= amount; i++) {
		                do {
		                	dup = false;
		                	try {
		                		st3.setString(1, channel+randomNumber(digit));
		    					st3.executeUpdate();
		                	} catch (java.sql.SQLIntegrityConstraintViolationException e) {
LOG.log(Level.INFO,"{0} {1}",new Object[]{"SerialMapX","found duplicated serial while generating: " + Long.toString(++c)});
								dup = true;
		                	}
		                } while (dup);
		            }
		            sql2r = sql2.replaceAll("_status", "S");
		            sql2r = sql2r.replaceAll("_ratio", Long.toString(c));
					st2.executeUpdate(sql2r);
					result = "succeed";
				}
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"SerialMapX","Done!"});
			}
		} catch(NamingException | SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			result = "failed";
		} finally {
            try {
            	if (!result.equals("succeed")) {
    	            sql2r = sql2.replaceAll("_status", "F");
    	            sql2r = sql2r.replaceAll("_ratio", Long.toString(c));
    				st2.executeUpdate(sql2r);
            	}
                if (rs1 != null) {rs1.close();}if (rs11 != null) {rs11.close();}
                if (st1 != null) {st1.close();}if (st11 != null) {st11.close();}
                if (st2 != null) {st2.close();}
                if (st3 != null) {st3.close();}
                if (con != null) {con.close();}
            } catch (SQLException ex) {
            	LOG.log(Level.WARNING, ex.getMessage(), ex);
            }
		}

		response.setContentType("application/json");
		response.setCharacterEncoding(Utils.CharacterEncoding);
		PrintWriter out = response.getWriter();
		out.print("{\"result\":\""+result+"\",\"jobId\":"+jobId+"}");
		out.flush();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	private String randomNumber(int digit) {
		long l;
		String res;
	    Random randomGenerator = new Random();
	    l = randomGenerator.nextLong();
	    res = Long.toString(l);
	    return res.substring(res.length() - digit);
	}
}
