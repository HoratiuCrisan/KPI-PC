const express = require('express');
const path = require('path');
const next = require('next');
const knex = require('knex');
require("dotenv").config()

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const db = knex({
  client: 'pg',
  connection: {
    host: String(process.env.DB_HOST),
    user: String(process.env.DB_USER),
    port: Number(process.env.DB_PORT),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE)
  },
  useNullAsDefault: true
})


nextApp.prepare().then(() => {
  const app = express();

  let initialPath = path.join(__dirname, "app");

  app.use(express.json());
  app.use(express.static(initialPath));

  app.get('/register', (req, res) => {
    return nextApp.render(req, res, '/register');
  });

  app.get('/teams', (req, res) => {
    return nextApp.render(req, res, '/teams');
  });

  app.get('/users', (req, res) => {
    return nextApp.render(req, res, '/users');
  });

  app.get('/projects', (req, res) => {
    return nextApp.render(req, res, '/projects');
  });

  app.get('/dashboard', (req, res) => {
    return nextApp.render(req, res, '/dashboard');
  });

  app.get('/teamsForm', (req, res) => {
    return nextApp.render(req, res, '/teamsForm');
  });

  app.get('/projectsForm', (req, res) => {
    return nextApp.render(req, res, '/projectsForm');
  });

  app.get('/usersForm', (req, res) => {
    return nextApp.render(req, res, '/usersForm');
  })


  app.get('/components-linechart', async (req, res) => {
    try {
      // Get the current year
      const currentYear = new Date().getFullYear();
  
      // Retrieve the monthly hire data from the database
      const hireData = await db
        .select(db.raw('EXTRACT(MONTH FROM "DATE") AS month, COUNT(*) AS count'))
        .from('EMPLOYEES')
        .where(db.raw(`EXTRACT(YEAR FROM "DATE") = ${currentYear}`))
        .groupBy(db.raw('EXTRACT(MONTH FROM "DATE")'));
  
      // Create an array to hold the monthly hire data
      const monthlyHires = Array.from({ length: 12 }, (_, index) => {
        const monthData = hireData.find(hire => hire.month === String(index + 1));
        return monthData ? monthData.count : 0;
      });
  
      // Return the monthlyHires array as the response data
      res.json({ success: true, data: monthlyHires });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  

  app.post('/statistics-statcards', async (req, res) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Add 1 to get the current month (1-based index)
      const currentYear = currentDate.getFullYear();
  
      const userCount = await db('EMPLOYEES')
        .count('*')
        .whereRaw(`EXTRACT(MONTH FROM "DATE") = ? AND EXTRACT(YEAR FROM "DATE") = ?`, [currentMonth, currentYear])
        .first();
  
      const teamCount = await db('TEAMS').count('*').first();
  
      const tasksCount = await db('TASKS')
        .count('*')
        .where('T_STATUS', 'FINISHED')
        .andWhereRaw(`EXTRACT(MONTH FROM "FINISH_DATE") = ?`, [currentMonth])
        .andWhereRaw(`EXTRACT(YEAR FROM "FINISH_DATE") = ?`, [currentYear]).first();
  
      res.json({ userCount: userCount.count, teamCount: teamCount.count, tasksCount: tasksCount.count });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/register-user', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      // Check if user already exists
      const userExists = await db('EMPLOYEES').where({ EMAIL: email }).first();
      if (userExists) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Insert new user into database
      const newUser = await db('EMPLOYEES').insert({
        EMAIL: email,
        PASSWORD: password,
        FIRST_NAME: firstName,
        LAST_NAME: lastName
      }).returning(["EMAIL", "FIRST_NAME", "LAST_NAME"]);

      res.status(201).json({ message: 'User created successfully', user: newUser[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/users', async (req, res) => {
    try {
      const users = await db.select('FIRST_NAME', 'LAST_NAME', 'POSITION', 'DATE')
        .from('EMPLOYEES');
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // API to get count of all employees and employees by position
  app.get('/setcards', async (req, res) => {
    try {
      const [employeeCount, positionCount] = await Promise.all([
        db('employees').count(),
        db('employees').select('position').count().groupBy('position')
      ]);
      res.status(200).json({ employeeCount: employeeCount[0].count, positionCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/teams', (req, res) => {
    const { teamName, ids } = req.body;
  
    db.transaction((trx) => {
      // Insert the new team into the database
      db('TEAMS')
        .insert({ TEAM_NAME: teamName, TEAM_MANAGER: ids[0] })
        .returning('ID_TEAM')
        .then(([teamId]) => {
          const managerId = ids[0];
          
          // Update the team name and position for the manager
          const updateManager = db('EMPLOYEES')
            .where({ ID_EMPLOYEE: managerId })
            .update({ TEAM_N: teamName, POSITION: 2 });
  
          // Execute the manager update query
          updateManager
            .then(() => {
              trx.commit();
              res.status(200).json({ success: true, teamId });
            })
            .catch((error) => {
              trx.rollback();
              console.error(error);
              res.status(500).json({ success: false, error: 'Failed to update the manager.' });
            });
        })
        .catch((error) => {
          trx.rollback();
          console.error(error);
          res.status(500).json({ success: false, error: 'Failed to save the team.' });
        });
    });
  });

  app.post('/components-linechart', async (req, res) => {
    try {
        // Get the current year
        const currentYear = new Date().getFullYear();
    
        // Create an array to hold the monthly hire data
        const monthlyHires = new Array(12).fill(0);
    
        // Retrieve the monthly hire data from the database
        const hireData = await db
        .select('MONTH(DATE) AS month, COUNT(*) AS count')
        .from('EMPLOYEES')
        .where(`YEAR(DATE) = ${currentYear}`)
        .groupBy('MONTH(DATE)');

        console.log(hireData)
    
        // Update the monthlyHires array with the data from the database
        hireData.forEach((hire) => {
          monthlyHires[hire.month - 1] = hire.count;
        });
    
        // Return the monthlyHires array as the response data
        res.json({ success: true, data: monthlyHires });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
  });

// getting all users and managers from from the database that are not members of a team
app.post('/users-managers', async (req, res) => {
  try {
    const employees = await db.select('ID_EMPLOYEE', 'FIRST_NAME', 'LAST_NAME')
    .from('EMPLOYEES').where('POSITION', 1).whereNull('TEAM_N')

    const managers = await db.select('ID_EMPLOYEE', 'FIRST_NAME', 'LAST_NAME')
    .from('EMPLOYEES').where('POSITION', 2).whereNull('TEAM_N')

    // getting all team names from db to check if the team name is available
    const teams = await db.select('ID_TEAM', 'TEAM_NAME').from('TEAMS')

    res.json({ employees: employees, managers: managers, teams: teams});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/create-team', async (req, res) => {
  try {
    const { team } = req.body;
    await db('TEAMS').insert({TEAM_NAME: team.team_name, TEAM_MANAGER: team.team_manager.value}) 
    res.status(200).json({message: 'Team created successfully'})

    

  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
})

app.post('/update-user-team', async (req, res) => {
  try {
    const { team } = req.body
    await Promise.all(team.team_members.map((member) =>
    db('EMPLOYEES')
      .where({ID_EMPLOYEE: member.value})
      .update({TEAM_N: team.team_name})
    ))
    res.status(200).json({message: 'Users updated successfully'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Internal Server Error'});
  }
})

app.post('/update-manager-team', async (req, res) => {
  try {
    const { team } = req.body
    await db('EMPLOYEES')
      .where({ID_EMPLOYEE: team.team_manager.value})
      .update({TEAM_N: team.team_name})
   res.status(200).json({message: 'Manager updated successfully'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Internal Server Error'});
  }
})

// getting all the teams, managers and employees from the database, for team cards
app.post('/get-team-details', async (req, res) => {
  try {
    const teams = await db.select('ID_TEAM', 'TEAM_NAME').from('TEAMS').orderBy('TEAM_NAME')

    const managers = await db.select('FIRST_NAME', 'LAST_NAME', 'TEAM_N')
      .from('EMPLOYEES').where('POSITION', 2).whereNotNull('TEAM_N')

    const users = await db.select('FIRST_NAME', 'LAST_NAME', 'TEAM_N')
      .from('EMPLOYEES').where('POSITION', 1).whereNotNull('TEAM_N')

    res.json({teams: teams, managers: managers, users: users})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Internal Server Error'});
  }
})

// function to remove all members from the team
app.put('/remove-user-team', async (req, res) => {
  try {
    const team_name = req.body.teamName
    //Find all members, including the manager that are a part of the team
    //update the team name to null for all members of the team
    await db('EMPLOYEES')
      .where('TEAM_N', team_name)
      .update({TEAM_N: null})
    res.json({message: 'Users removed successfully from the team'})

  }  catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to remove users from the team'})
  }
})

//function that deletes a team
app.delete('/remove-team', async (req, res) => {
  try {
    const team_name = req.body.teamName

    await db('PROJECTS')
      .where('TEAM', team_name)
      .del()
    
    await db('TEAMS')
      .where('TEAM_NAME', team_name)
      .del()

    
    console.log('Team deleted successfully')
    res.json({message: 'Team deleted successfully'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to delete team form database'})
  }
})


app.post('/get-project-form-data', async (req, res) => {
  try {
    const projects = await db.select('PROJECT_NAME').from('PROJECTS').orderBy('PROJECT_NAME')

    //get all teams for the dropdown menu
    const teams = await db.select('ID_TEAM','TEAM_NAME').from('TEAMS').orderBy('TEAM_NAME')

    res.json({projects, teams })
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to fetch data for projectForm'})
  }
})

//create a new project function
app.post('/create-project', async (req, res) => {
  try {
    const projects = req.body.project

    await db('PROJECTS').insert({
      PROJECT_NAME: projects.Name, 
      TEAM: projects.Team,
      TERM_START: projects.StartDate,
      TERM_END: projects.EndDate,
      DESCRIPTION: projects.Description
    })

    res.json({message: 'Project created successfully'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to create the project'})
  }
})

// send all projects to the front-end
app.post('/get-project-details', async (req, res) => {
  try {
    const projects = await db.select(
          'ID_PROJECT', 
          'PROJECT_NAME', 
          'TEAM', 
          'PROJECT_STATUS',
          'DESCRIPTION',
          'TERM_START',
          'TERM_END'
        ).from('PROJECTS')
    const users = await db.select(
        'ID_EMPLOYEE', 
        'FIRST_NAME', 
        'LAST_NAME', 
        'TEAM_N'
        ).from('EMPLOYEES').where('POSITION', 1).whereNotNull('TEAM_N')
    
    const managers = await db.select(
      'ID_EMPLOYEE', 
        'FIRST_NAME', 
        'LAST_NAME', 
        'TEAM_N'
    ).from('EMPLOYEES').where('POSITION', 2).whereNotNull('TEAM_N')

    res.json({projects, users, managers})
    
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to get the project details'})
  }
})

//getting project details for specific team
app.get('/get-project-details:id', async (req, res) => {
  const id = req.params.id
  try {
      const project = await 
        db.select('p.*', 'e.ID_EMPLOYEE', 'e.FIRST_NAME', 'e.LAST_NAME', 'e.POSITION', 'e.EMAIL')
        .from('PROJECTS as p')
        .leftJoin('EMPLOYEES as e', 'p.TEAM', 'e.TEAM_N')
        .where('p.ID_PROJECT', id)


      res.json({project})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Server error'})
  }
})


app.delete('/remove-project', async (req, res) => {
  try {
    const project_name = req.body.projectName

    await db('PROJECTS')
      .where('PROJECT_NAME', project_name)
      .del()
  
    res.json({message: 'Project deleted successfully'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to delete project form database'})
  }
})

app.put('/open-project', async (req, res) => {
  const data = await req.body.params
  try {
    await db('PROJECTS')
    .update({PROJECT_STATUS: 'NOT FINISHED'})
    .where('ID_PROJECT', data.ID_PROJECT)
    res.status(200).json({message: 'Project status updated successfully!'})
  } catch (error) {
    console.error(error)
  }
})

app.put('/close-project', async (req, res) => {
  const data = await req.body.params
  try {
    await db('PROJECTS')
    .update({PROJECT_STATUS: 'FINISHED'})
    .where('ID_PROJECT', data.ID_PROJECT)
    res.status(200).json({message: 'Project status updated successfully!'})
  } catch (error) {
    console.error(error)
  }
})

app.post('/create-task', async (req, res) => {
  try {
    const task = req.body.task

    await db('TASKS').insert({
      TEAM_A: task.TEAM_A,
      T_PROJECT: task.T_PROJECT,
      T_STATUS: task.T_STATUS,
      FINISH_DATE: task.FINISH_DATE,
      T_NAME: task.T_NAME,
      E_ID: task.E_ID
    })

    res.status(200).json({message: 'Task created successfully'})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to create the task'})
  }
})

app.get('/get-tasks/:pName', async (req, res) => {
  const name = req.params.pName
  try {
    const tasks = await db.select(
        'ID_TASK',
        'T_STATUS', 
        'T_NAME', 
        'FINISH_DATE', 
        'E_ID'
      ).from('TASKS').where('T_PROJECT', name).orderBy('T_NAME')
    
      res.json({tasks})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Failed to fetch tasks'})
  }
})

//update task data
app.put('/update-task-data', async (req, res) => {
  try {
    const response = await req.body.params
    const updateData = {
      T_NAME: response.T_NAME,
      FINISH_DATE: response.FINISH_DATE,
      E_ID: response.E_ID,
    }
    await db('TASKS')
      .where('ID_TASK', response.ID_TASK)
      .update(updateData)
      .then(() => 
        console.log("Task data updated successfully!")
      )
  } catch (error) {
    console.error(error)
  }
})

app.delete('/delete-task', async (req, res) => {
  try {
    const response = await req.body.params
    await db('TASKS')
      .where('ID_TASK', response.ID_TASK)
      .del('')
      .then(() => {
        console.log("Task deleted successfully!")
      })
  } catch (error) {
    console.error("Failed to delete task", error)
  }
})

app.get('/get-status-tasks', async (req, res) => {
  try {
    const total_tasks_data = await db('TASKS').count('ID_TASK as COUNT').first()
    const total_tasks = total_tasks_data.COUNT
    
    const finished_status_data = await db('TASKS')
      .count('ID_TASK as COUNT')
      .where('T_STATUS', 'FINISHED').first()
    const finished_tasks = finished_status_data.COUNT

    res.json({total_tasks, finished_tasks})
  } catch (error) {
    console.error(error)
  }
})

app.post('/statistics-users_u', async (req, res) => {
  try {
    const users = await db.select('ID_EMPLOYEE','FIRST_NAME', 'LAST_NAME', 'POSITION', 'DATE', 'TEAM_N')
      .from('EMPLOYEES').where('ACTIVE', 1);

    const employeeCount = await db('EMPLOYEES').count('*').first();

    const managerCount = await db('EMPLOYEES').count('*').where('POSITION', 2).first();

    const adminCount = await db('EMPLOYEES').count('*').where('POSITION', 3).first();

    const usersCount = await db('EMPLOYEES').count('*').where('POSITION', 1).first();

    res.json({
      users: users,
      totalUsers: usersCount.count,
      totalAdmins: adminCount.count,
      totalEmployees: employeeCount.count,
      totalManagers: managerCount.count
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  app.post('/statistics-users', async (req, res) => {
    try {
      const users = await db.select('FIRST_NAME', 'LAST_NAME', 'POSITION', 'DATE')
        .from('EMPLOYEES');
  
  
      res.json(users);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add the login route handler
  app.post('/login-user', async (req, res) => {
    const { email, password } = req.body;
  
    const user = await db
      .select('EMAIL', 'PASSWORD', 'POSITION', 'TEAM_N')
      .from('EMPLOYEES')
      .where({
        EMAIL: email,
      })
      .first();
  
    if (user && user.PASSWORD === password) {
      res.json({
        success: true,
        email: email,
        position: user.POSITION,
        team: user.TEAM_N,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });

  // Delete user API
  app.delete('/delete-user/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const position = parseInt(req.query.position);
    const teamN = req.query.teamN; // Retrieve teamN from req.query
    const replacementManager = req.query.replacementManager ? parseInt(req.query.replacementManager) : null; // Retrieve replacementManager from req.query

    if (position === 2) {
      try {
        await db.transaction(async (trx) => {
          // Update employees of the team
          await trx('EMPLOYEES')
            .where('ID_EMPLOYEE', id)
            .update({ TEAM_N: null, SALARY: 0, ACTIVE: 0 });

          // If a replacement manager is selected, update the team's manager
          if (replacementManager) {
            await trx('EMPLOYEES')
              .where('POSITION', 2)
              .andWhere('ID_EMPLOYEE', replacementManager)
              .update({ TEAM_N: teamN });

            await trx('TEAMS')
              .where('TEAM_NAME', teamN)
              .update({
                TEAM_MANAGER: trx('EMPLOYEES')
                  .select('ID_EMPLOYEE')
                  .where('ID_EMPLOYEE', replacementManager)
                  .limit(1) // Limit the subquery to retrieve a single value
              });
          }

        });

        res.sendStatus(200);
      } catch (error) {
        console.error('Failed to delete user:', error);
        res.sendStatus(500);
      }
    } else {
      try {
        await db('EMPLOYEES').where('ID_EMPLOYEE', id).andWhere('POSITION', position).update({ TEAM_N: null, SALARY: 0, ACTIVE: 0 });
        res.sendStatus(200);
      } catch (error) {
        console.error('Failed to delete user:', error);
        res.sendStatus(500);
      }
    }
  });

  app.get('/getteams', async (req, res) => {
    try {
      const teams = await db.select('TEAM_NAME', 'TEAM_MANAGER').from('TEAMS');
      res.status(200).json({ teams });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.post('/add-user', async (req, res) => {
    const { email, password, firstName, lastName, sal, pos, team } = req.body;
  
    try {
      // Check if user already exists
      const userExists = await db('EMPLOYEES').where({ EMAIL: email }).first();
      if (userExists) {
        return res.status(409).json({ message: 'Email already exists!' });
      }
  
      let newPosition = 1;
      if (pos === 2 || pos === 'manager') {
        newPosition = 2;
      } else if (pos === 3 || pos === 'admin') {
        newPosition = 3;
      }
  
      // Prepare the user object to be inserted
      const newUser = {
        EMAIL: email,
        PASSWORD: password,
        FIRST_NAME: firstName,
        LAST_NAME: lastName,
        SALARY: sal,
        POSITION: newPosition,
      };
  
      // Check if team is provided
      if (team) {
        const teamExists = await db('TEAMS').where('TEAM_NAME', team).first();
        if (!teamExists) {
          return res.status(400).json({ message: 'Invalid team provided' });
        }
        newUser.TEAM_N = teamExists.TEAM_NAME;
        newUser.ACTIVE =1;
      }
  
      if (pos === 2 || pos === 'manager') {
        const [createdUserId] = await db('EMPLOYEES').insert(newUser).returning('ID_EMPLOYEE');
        const teamManagerId = await db('EMPLOYEES').select('ID_EMPLOYEE').where('EMAIL', email).first();
        await db('TEAMS').where('TEAM_NAME', newUser.TEAM_N).update('TEAM_MANAGER', teamManagerId.ID_EMPLOYEE);
        res.status(201).json({ message: 'User created successfully', userId: createdUserId });
      } else {
        const [createdUserId] = await db('EMPLOYEES').insert(newUser).returning('ID_EMPLOYEE');
        res.status(201).json({ message: 'User created successfully', userId: createdUserId });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/getroles', async (req, res) => {
    try {
      const positions = await db.select('POS_NAME').from('POSITIONS');
      const posNames = positions.map((pos) => pos.POS_NAME);
      res.status(200).json({ posNames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
}).catch((error) => {
  console.error('An error occurred while starting the server:', error);
});



