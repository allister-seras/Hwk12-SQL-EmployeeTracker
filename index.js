const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "dragon",
    database: "employees_db",
  },
  console.log("Connected to the employees_db database")
);

db.connect((err) => {
  if (err) throw err;
  console.log("conneced to " + db.host);
  afterConnection();
});

afterConnection = () => {
  console.log("********************************************");
  console.log("*                                          *");
  console.log("*    Welcome to the Employee Database!     *");
  console.log("*       Where Employees Shine Bright!      *");
  console.log("*                                          *");
  console.log("********************************************");
  init();
};

async function quearyDepartments() {
    return new Promise((resolve, reject) =>
      db.query("select * from department", function (err, results) {
        if (err) return reject(err);
        resolve(results);
      })
    );
  }

async function quearyRoles() {
  return new Promise((resolve, reject) =>
    db.query("select * from role", function (err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  );
}

async function quearyEmployees() {
  return new Promise((resolve, reject) =>
    db.query("select * from employee", function (err, results) {
      if (err) return reject(err);
      resolve(results);
    })
  );
}

function init() {
  inquirer
    .prompt({
      name: "dbFunction",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "1. view all departments",
        "2. view all roles",
        "3. view all employees",
        "4. add a department",
        "5. add a role",
        "6. add an employee",
        "7. update an employee role",
        "8. EXIT",
      ],
    })
    .then((answers) => {
      switch (answers.dbFunction) {
        case "1. view all departments":
          viewAllDepartments();
          break;
        case "2. view all roles":
          viewAllRoles();
          break;
        case "3. view all employees":
          viewAllEmployees();
          break;
        case "4. add a department":
          addDepartment();
          break;
        case "5. add a role":
          addRole();
          break;
        case "6. add an employee":
          addEmployee();
          break;
        case "7. update an employee role":
          updateEmployeeRole();
          break;
        case "8. EXIT":
          db.end();
          break;
        default:
          break;
      }
    });
}

function viewAllDepartments() {
  db.query("select * from department", function (err, res) {
    console.log("All Departments");
    console.table(res);
    init();
  });
}

function viewAllRoles() {
  db.query("select * from role", function (err, res) {
    console.log("All Job Roles");
    console.table(res);
    init();
  });
}

function viewAllEmployees() {
  db.query("select * from employee", function (err, res) {
    console.log("All Employees");
    console.table(res);
    init();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "What is the department name?",
    })
    .then((answer) => {
      console.log(answer.deptName);
      db.query(
        "INSERT INTO department SET ?",
        { name: answer.deptName },
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
}

async function addRole() {
    const roles = await quearyRoles();
    const departmetns = await quearyDepartments();
  console.table(roles);
  inquirer.prompt([
    {
        name: "newTitle",
        type: "input",
        message: "What is the name of the new role?"
    },
    {
        name: "newSalary",
        type: "input",
        message: "What is the starting salary for this role?"
    },
    {
        name: "departmentID",
        type: "list",
        message: "What department does this role fall under?",
        choices: departmetns.map((department) => ({ name: department.name, value: department.id })),
    }
  ])   .then((answers) => {
    db.query(
      "INSERT INTO role SET ?",
      {
        title: answers.newTitle,
        salary: answers.newSalary,
        department_id: answers.departmentID
      },
      function (err) {
        if (err) throw err;
        init();
      }
    );
  });
}

async function addEmployee() {
  const roles = await quearyRoles();
  const employees = await quearyEmployees();
  console.table(roles);
  console.table(employees);
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the new employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the new employee's last name?",
      },
      {
        name: "roleID",
        type: "list",
        message: "What is their role?",
        choices: roles.map((role) => ({ name: role.title, value: role.id })),
      },
      {
        name: "managerID",
        type: "list",
        message: "Who is their manager?",
        choices: employees.map((employee) => ({
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        })),
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: answers.roleID,
          manager_id: answers.managerID,
        },
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
}

async function updateEmployeeRole() {
  const roles = await quearyRoles();
  const employees = await quearyEmployees();
  console.table(employees);
  inquirer
    .prompt([
      {
        name: "employeeUpdate",
        type: "list",
        message: "Whose role would you like to update?",
        choices: employees.map((employee) => ({
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        })),
      },
      {
        name: "roleUpdate",
        type: "list",
        message: "What is their new role?",
        choices: roles.map((role) => ({ name: role.title, value: role.id })),
      },
      {
        name: "managerUpdate",
        type: "list",
        message: "Who, if anyone, is their new manager?",
        choices: employees.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          })),
      }

    ])
    .then((answers) => {
      db.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: answers.roleUpdate,
          },
          {
            id: answers.employeeUpdate,
          },
          {
            manager_id: answers.managerUpdate
          }
        ],
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
}
