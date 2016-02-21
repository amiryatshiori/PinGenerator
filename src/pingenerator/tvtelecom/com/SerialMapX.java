package pingenerator.tvtelecom.com;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
		
		PreparedStatement st2 = null;
		String sql2 = "insert into pin (PIN,STATUS,JOBID,UPDATEDBY,UPDATEDDATE) values (?,'A','"+jobId+"',"+userId+",CURRENT_TIMESTAMP)";
		
		Statement st22 = null;
		String sql22 = "update pin set serial = '?' where pin = '?'";
		
		Statement st3 = null;
		String sql3 = "update job set status = '_status', dupcount = _ratio where jobid = '" + jobId + "'";
		String sql3r = "";















	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
