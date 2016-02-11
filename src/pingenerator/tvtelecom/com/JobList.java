package pingenerator.tvtelecom.com;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/JobList")
public class JobList extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public JobList() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Logger LOG = Logger.getLogger(JobList.class.getName());
        request.setCharacterEncoding(Utils.CharacterEncoding);    
        String jobId = request.getParameter("jobId");
LOG.log(Level.INFO,"{0}-{1}",new Object[]{"JobList",jobId});  
        
        
        
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
