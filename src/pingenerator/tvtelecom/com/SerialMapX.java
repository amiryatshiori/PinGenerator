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
		
LOG.log(Level.INFO,"SerialMapX jobId:{0}",new Object[]{jobId});

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
		
		Statement st3 = null;
		String sql3 = "select count(pin) c from pin where status = 'A' and serial is null";	
		String sql31 = "select * from pin where status = 'A' and serial is null FETCH FIRST _amount ROWS ONLY";	
		ResultSet rs3 = null;
		
		PreparedStatement st4 = null;
		String sql4 = "insert into serial (SERIAL,PATTERNID,STATUS,JOBID,UPDATEDBY,UPDATEDDATE) values (?,_patternid,'A','"+jobId+"',"+userId+",CURRENT_TIMESTAMP)";

		PreparedStatement st5 = null;
		String sql5 = "update pin set serial = ?, status = 'M', jobid = '" + jobId + "', updatedby = "+userId+", updateddate = CURRENT_TIMESTAMP where pin = ?";

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
LOG.log(Level.INFO,"SerialMapX sql11:{0}",new Object[]{sql11});
				st11 = con.createStatement();
				rs11 = st11.executeQuery(sql11);
				if (rs11.next()) {
					channel = rs11.getString("CHANNEL");
					digit = rs11.getInt("DIGIT");
					pinDigit = rs11.getInt("PINDIGIT");
LOG.log(Level.INFO,"SerialMapX channel:{0} digit:{1} pinDigit:{2}",new Object[]{channel,digit,pinDigit});
					st1.executeUpdate(sql12);
					
		            sql2r = sql2.replaceAll("_status", "P");
		            sql2r = sql2r.replaceAll("_ratio", Long.toString(0));
					st2 = con.createStatement();
					st2.executeUpdate(sql2r);

					st3 = con.createStatement();
					rs3 = st3.executeQuery(sql3);
					if (rs3.next()) {
						long cAvailablePin = rs3.getLong("c");
						if (cAvailablePin >= amount) {
							sql4 = sql4.replaceAll("_patternid", Integer.toString(patternId));
LOG.log(Level.INFO,"SerialMapX sql4:{0}",new Object[]{sql4});
							st4 = con.prepareStatement(sql4);
LOG.log(Level.INFO,"SerialMapX sql5:{0}",new Object[]{sql5});
							st5 = con.prepareStatement(sql5);
							boolean dup;
							String pin = "";
							String serial = "";					
				            sql31 = sql31.replaceAll("_amount", Long.toString(amount));
							rs3 = st3.executeQuery(sql31);
LOG.log(Level.INFO,"SerialMapX sql31:{0}",new Object[]{sql31});
							while (rs3.next()) {
								pin = rs3.getString("PIN");
				                do {
				                	dup = false;
				                	try {
				                		serial = channel+randomNumber(digit);
				                		st4.setString(1, serial);
				    					st4.executeUpdate();
				                	} catch (java.sql.SQLIntegrityConstraintViolationException e) {
LOG.log(Level.INFO,"SerialMapX {0}",new Object[]{"found duplicated serial while generating: " + Long.toString(++c)});
										dup = true;
				                	}
				                } while (dup);
								st5.setString(1, serial);
								st5.setString(2, pin);
								st5.executeUpdate();
							}
							
				            sql2r = sql2.replaceAll("_status", "S");
				            sql2r = sql2r.replaceAll("_ratio", Long.toString(c));
							st2.executeUpdate(sql2r);
							result = "succeed";
						} else {
				            sql2r = sql2.replaceAll("_status", "F");
				            sql2r = sql2r.replaceAll("_ratio", Long.toString(c));
							st2.executeUpdate(sql2r);
							result = "failed";
						}
					}
				}
LOG.log(Level.INFO,"SerialMapX Done!",new Object[]{});
			}
		} catch(NamingException | SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			result = "failed";
		} finally {
            try {
            	if (!result.equals("succeed")) {
    	            sql2r = sql2.replaceAll("_status", "F");
    	            sql2r = sql2r.replaceAll("_ratio", Long.toString(c));
    	            st2 = con.createStatement();
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
