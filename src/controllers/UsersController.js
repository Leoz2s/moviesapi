const AppError = require("../utils/AppError.js");

const sqliteConnection = require("../database/sqlite");

const {hash, compare} = require('bcryptjs');

class UsersController {
  async create(request, response) {
    const {name, email, password} = request.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get(
      "SELECT name FROM users WHERE email = (?)", [email]);
    if(checkUserExists) {
      throw new AppError("This e-mail is already in use.")
    };

    if(!name){
      throw new AppError("Name is obligatory.");
    };

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    response.status(201).json({name, email, password});
  };

  async update(request, response) {
    const {name, email, old_password, password} = request.body;
    const user_id = request.user.id;
    let changesMessage = [];

    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
    if(!user) {
      throw new AppError("User not found.");
    };

    if(name) {
      if(user.name !== name) {
        user.name = name ?? user.name;
        changesMessage = [...changesMessage, `Name changed.`];
      };
    };

    if(email){
      const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
      
      if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError("This e-mail is already in use.");

      }else if(!userWithUpdatedEmail) {
        user.email = email ?? user.email;
        changesMessage = [...changesMessage, `E-mail changed.`];
      };
    };

    if(!old_password && password) {
        throw new AppError("You need to insert the current password to change to a new one.");
      }else if(old_password === password && password && old_password) {
        throw new AppError("Your new password need to be different from the current password.");
      }else if(old_password && password) {
        const checkOldPassword = await compare(old_password, user.password);

        if(!checkOldPassword){
          throw new AppError("Actual password is wrong.");
        }else {
          user.password = await hash(password, 8);
          changesMessage = [...changesMessage, `Password changed.`];
        };
      };

    await database.run(`
      UPDATE users SET
      name = (?), email = (?), password = (?), 
      updated_at = DATETIME('now')
      WHERE id = (?)`, 
      [user.name, user.email, user.password,
      user.id]);
    
    return response.status(200).json({changesMessage, user});
  };
};

module.exports = UsersController;