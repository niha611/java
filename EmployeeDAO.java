package RestOfAPI;
import org.springframework.stereotype.Repository;


public class EmployeeDAO {
	
	
	private static Employees employees = new Employees();

    static {
        // Initialize with sample employees
        employees.getEmployeeList()
          .add(new Employee(1, "Prem", "Tiwari", "prem@gmail.com"));
        employees.getEmployeeList()
          .add(new Employee(2, "Vikash", "Kumar", "vikash@gmail.com"));
        employees.getEmployeeList()
          .add(new Employee(3, "Ritesh", "Ojha", "ritesh@gmail.com"));
    }

    // Retrieve all employees
    public Employees getAllEmployees() {
        return employees;
    }

    // Add an employee
    public void addEmployee(Employee employee) {
        employees.getEmployeeList().add(employee);
    }

}
