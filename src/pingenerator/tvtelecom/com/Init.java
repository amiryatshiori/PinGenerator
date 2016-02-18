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
        String clean = request.getParameter("clean");
        if (clean == null) {clean = "";}
LOG.log(Level.INFO,"{0} {1}",new Object[]{"Init","Start"});  

		Connection con = null;
		Statement st1 = null;
		ResultSet rs1 = null;
		
		String sql01 = "DROP TABLE USR";
		String sql02 = "DROP TABLE JOB";
		String sql03 = "DROP TABLE PIN";
		String sql032 = "DROP TABLE PINHIST";
		String sql04 = "DROP TABLE SERIAL";
		String sql05 = "DROP TABLE PATTERN";
		
		String sql11 = "SELECT * FROM USR";
		String sql12 = "SELECT * FROM JOB";
		String sql13 = "SELECT * FROM PIN";
		String sql132 = "SELECT * FROM PINHIST";
		String sql14 = "SELECT * FROM SERIAL";
		String sql15 = "SELECT * FROM PATTERN";
		
		String sql21 = "CREATE TABLE USR (USERID INT NOT NULL PRIMARY KEY, NAME VARCHAR(80), USERNAME VARCHAR(40), PASSWORD VARCHAR(40), CREATOR INT NOT NULL, CREATEDDATE TIMESTAMP NOT NULL)";
		String sql22 = "CREATE TABLE JOB (JOBID VARCHAR(12) NOT NULL PRIMARY KEY, TYPE VARCHAR(5), DIGIT INT, AMOUNT BIGINT, STATUS VARCHAR(5), DESC1 VARCHAR(200), DESC2 VARCHAR(200), CREATOR INT NOT NULL, CREATEDDATE TIMESTAMP NOT NULL)";
		String sql23 = "CREATE TABLE PIN (PIN VARCHAR(15) PRIMARY KEY, SERIAL VARCHAR(15), STATUS VARCHAR(5), JCID INT, JMID INT)";
		String sql232 = "CREATE TABLE PINHIST (PHID BIGINT PRIMARY KEY, PIN VARCHAR(15), SERIAL VARCHAR(15), STATUS VARCHAR(5), USERID INT NOT NULL, UPDATEDDATE TIMESTAMP NOT NULL)";
		String sql24 = "CREATE TABLE SERIAL (SERIAL VARCHAR(15) PRIMARY KEY, JOBID INT)";
		String sql25 = "CREATE TABLE PATTERN (PATTERNID INT, CHANNEL VARCHAR(10), DIGIT INT, CREATOR INT NOT NULL, CREATEDDATE TIMESTAMP NOT NULL)";


		String result = "Do nothing";
		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource)ctx.lookup("java:comp/env/jdbc/PinGen");
			con = ds.getConnection();
			st1 = con.createStatement();
			try {
				if (!clean.isEmpty()) {st1.executeUpdate(sql01);result = "Drop USR\n";}
				rs1 = st1.executeQuery(sql11);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Create USR\n";
				st1.executeUpdate(sql21);
			}
			try {
				if (!clean.isEmpty()) {st1.executeUpdate(sql02);result += "Drop JOB\n";}
				rs1 = st1.executeQuery(sql12);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Create JOB\n";
				st1.executeUpdate(sql22);
			}
			try {
				if (!clean.isEmpty()) {st1.executeUpdate(sql03);result += "Drop PIN\n";}
				rs1 = st1.executeQuery(sql13);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Create PIN\n";
				st1.executeUpdate(sql23);
			}
			try {
				if (!clean.isEmpty()) {st1.executeUpdate(sql04);result += "Drop SERIAL\n";}
				rs1 = st1.executeQuery(sql14);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Create SERIAL\n";
				st1.executeUpdate(sql24);
			}
			try {
				if (!clean.isEmpty()) {st1.executeUpdate(sql05);result += "Drop PATTERN\n";}
				rs1 = st1.executeQuery(sql15);if (rs1 != null) {rs1.close();}
			} catch (java.sql.SQLSyntaxErrorException e) {
				result += "Create PATTERN\n";
				st1.executeUpdate(sql25);
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
LOG.log(Level.INFO,"{0} {1}",new Object[]{"Init-result:\n",result});
		response.getWriter().append("result:\n" + result);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
