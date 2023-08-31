const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'dragon',
        database: 'employees_db'
    },
    console.log('Connected to the employees_db database')
);

db.connect(err => {
    if (err) throw err;
    console.log('conneced to ' + db.host);
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
}

function init() {
    inquirer.prompt({
        name: "dbFunction",
        type: "list",
        message: "What would you like to do?",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]

    }).then((answers) => {
        switch (answers.dbFunction) {
            case "view all departments":
                viewAllDepartments();
            break;
        }
    })
}

function viewAllDepartments () {
    console.log("Departments Go Here");
}
