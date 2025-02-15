package RestOfAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

public class EmployeeController {
	

	private EmployeeDAO employeeDao;

    // GET endpoint to fetch all employees
    @GetMapping("/")
    public Employees getEmployees() {
        return employeeDao.getAllEmployees();
    }

    // POST endpoint to add a new employee
    @GetMapping("/")
    public ResponseEntity 
      addEmployee(@RequestBody Employee employee) {
      
        // Generate ID for the new employee
        Integer id = employeeDao.getAllEmployees()
          .getEmployeeList().size() + 1;
        employee.setId(id);

        // Add employee to the list
        employeeDao.addEmployee(employee);

        // Build location URI for the new employee
        URI location = ((Object) ServletUriComponentsBuilder
          .fromCurrentRequest())
                .path("/{id}")
                .buildAndExpand(employee.getId())
                .toUri();

        return ((Object) ResponseEntity.created(location)).build();
    }

}
