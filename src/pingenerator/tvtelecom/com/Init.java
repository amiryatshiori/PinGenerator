package pingenerator.tvtelecom.com;

import java.io.IOException;
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

@WebServlet("/Init")
public class Init extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public Init() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Logger LOG = Logger.getLogger(JobList.class.getName());
        request.setCharacterEncoding(Utils.CharacterEncoding);
        //String jobId = request.getParameter("jobId");
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"Init","Start"});  

		Connection con = null;
		Statement st1 = null;
		ResultSet rs1 = null;
		
		String sql11 = "SELECT * FROM USR";
		String sql21 = "SELECT * FROM JOB";
		String sql31 = "SELECT * FROM PIN";
		
		String sql12 = "CREATE TABLE USR (USERID INT NOT NULL PRIMARY KEY, NAME VARCHAR(80), USERNAME VARCHAR(40), PASSWORD VARCHAR(40), CREATOR INT NOT NULL, CREATEDDATE TIMESTAMP NOT NULL)";
		String sql22 = "CREATE TABLE JOB (JOBID INTEGER NOT NULL PRIMARY KEY, PINDIGIT INT, PINAMOUNT BIGINT, STATUS VARCHAR(5), CREATOR INT NOT NULL, CREATEDDATE TIMESTAMP NOT NULL)";
		String sql32 = "CREATE TABLE PIN (PIN VARCHAR(15) PRIMARY KEY, JOBID INT)";

		String result = "";
		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/PinGen");
			con = ds.getConnection();
			st1 = con.createStatement();
			try {
				rs1 = st1.executeQuery(sql11);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Not found USR\n";
				st1.executeUpdate(sql12);
			}
			try {
				rs1 = st1.executeQuery(sql21);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Not found JOB\n";
				st1.executeUpdate(sql22);
			}
			try {
				rs1 = st1.executeQuery(sql31);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Not found PIN\n";
				st1.executeUpdate(sql32);
			}
		} catch(NamingException | SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
		} finally {
		    try {
		        if (rs1 != null) {rs1.close();}if (st1 != null) {st1.close();}
		        if (con != null) {con.close();}
		    } catch (SQLException ex) {
		    	LOG.log(Level.WARNING, ex.getMessage(), ex);
		    }
		}
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"Init-result:\n",result});
		response.getWriter().append("result:\n" + result);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
