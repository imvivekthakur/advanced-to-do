const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("../db/connection");
const User = require("../model/userSchema");
const Todo = require("../model/todoSchema");
const authenticate = require('../middleware/Authenticate');
const  ObjectID = require('mongodb').ObjectId;

async function addInitialCategories(userId) {
    try {
      const userData = await User.findOne({ _id: userId });
    //   console.log("user data in add initial function", userData);
      if (userData) {
        // Check if the "Quick" category already exists
        const quickCategoryExists = userData.categories.some(category => category.category === 'Quick Add');
  
        if (!quickCategoryExists) {
          // Add the "Quick" category to the user's categories array
          userData.categories.push({ category: 'Quick Add'});
          await userData.save();
          console.log('Default category "Quick Add" added to the user');
        } else {
          console.log('Default category "Quick Add" already exists for the user');
        }
      }
    } catch (error) {
      console.error('Error adding initial categories:', error);
    }
}
  
  // Example usage within a route handler
router.post("/initializeuser", authenticate, async (req, res) => {
    try {
        console.log("initialize user called");
        const userId = req.userId;
        // console.log("request in initialize user", req);
        // console.log("userId in initialize user", req.userId);

        // Call the addInitialCategories function to add initial categories to the user
        await addInitialCategories(userId);

        return res.status(200).json({ message: 'User initialized successfully' });
    } catch (error) {
        console.error('Error initializing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
  

router.get("/", (req, res) => {
    console.log("Hello world from Router.js");
    res.send("<h1>hello world</h1>");
});

// using async await
router.post("/signup", async (req, res) => {
    const { name, email, phone, password, cpassword } = req.body;
    if(!name || !email || !phone || !password || !cpassword) {
        return res.status(422).json({error : "Please fill all the required fields"});
    }

    // adding data to the database
    try {
        const userExists = await User.findOne({email:email});
        if(userExists) {
            return res.status(422).json({message: "User already exists"});
        }
        const user = new User({name, email, phone, password, cpassword});
        const userRegistered = await user.save();
        res.status(201).json({message: "User registered succesfully"});
    } catch (error) {
        console.log(error);
    }
});

// sign in route
router.post("/signin", async (req, res) => {
    // authenticating user
    // console.log(req);
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).send({error: "Please fill all the required fields"});
        }
        const userData = await User.findOne({email: email});
        if(!userData) {
            return res.status(422).send({error: "Invalid Credentials"});
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);

        const token = await userData.generateAuthToken();
        // console.log(token);

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });

        if(!passwordMatch) {
            res.status(400).json({message: "Invalid Credentials"});
        } else {
            res.status(200).json({message: "User signed in successfully"});
        }
    } catch (error) {
        console.log(error);
    }
});


router.get("/about", authenticate, (req, res) => {
    res.send(req.userData);
});

router.get("/getData", authenticate, (req, res) => {
    res.send(req.userData);
});

router.post("/contact", authenticate, async (req, res) => {
    try {
        const {name, email, message} = req.body.userData;
        console.log("request in contact", req);
        console.log("request body in contact", req.body);

        if(!name || !email || !message) {
            console.log("fill all the required fields");
            return res.status(400).json({error: "fill all the required fields"});
        }

        const userContact = await User.findOne({_id: req.userId});
        if(userContact) {
            const userMessage = await userContact.addMessage(name, email, message);
            await userContact.save();
            return res.status(201).json({message: "message saved successfully!!"});
        }
    } catch (error) {
        console.log(error);
    }
});

router.post("/addcategory", authenticate, async(req, res) => {
    try {
        const category = req.body.input;
        console.log("request body", req.body);
        console.log("request body user data", category);
        if(!category) {
            console.log("fill any category");
            return res.status(400).json({error : "fill any category"});
        }

        const userData = await User.findOne({_id : req.userId});
        console.log("user categories", userData);
        
        if(userData) {
            const categoryExist = userData.categories.some(cat => cat.category === category);
            if(categoryExist) {
                return res.status(500).json({message : "category already exists!!"});
            }
            const userCategory = await userData.addCategory(category);
            console.log("new category added", userCategory);
            await userData.save();
            return res.status(201).json({message : "category added successfully!!", categories : userData.categories});
        }
    } catch(error) {
        console.log(error);
    }
})

router.get("/signout", (req, res) => {
    // console.log("signout page");
    res.clearCookie('jwtoken', {path: "/"});
    res.status(200).send("User logged out");
});

router.get("/gettodo", authenticate, async (req, res) => {
    // console.log("request from gettodo", req);
    let userTodos = await Todo.findOne({user_id : req.userId});
    res.send(userTodos);
})

router.get("/getcategories", authenticate, async(req, res) => {
    let userData = await User.findOne({_id : req.userId});
    res.send(userData.categories);
})

router.post("/add", authenticate, async (req, res) => {
    try {
        const todo = req.body.input;
        const category = req.body.currentCategory;
        // console.log(req);
        // console.log("todo request " ,todo);
        // console.log("current category", category);
        if(!todo) {
            return res.send("Fill any todo");
        }
        let userTodos = await Todo.findOne({user_id : req.userId});
        // console.log("user todo found", userTodos);
        if(!userTodos) {
            userTodos = new Todo();
            userTodos.user_id = req.userId;
            userTodos.todos = [];
        }
        // console.log(typeof userTodos.user_id);
        // console.log("new user todo ", userTodos);
        const state = "active";
        userTodos.todos.push({todo:todo, state:state, category:category});
        // console.log("user todo after push" , userTodos);
        await userTodos.save();
        // console.log("todo saved successfully");
        return res.status(201).json({message: "todos saved successfully!!", todos: userTodos.todos});
    } catch (error) {
        console.log(error);
    }
});

router.post("/delete", authenticate, async (req, res) => {
    try {
        let deletedTodos = await Todo.updateOne(
            {user_id : req.userId},
            {$pull : { 'todos' : { _id : req.body.id}}}
        );

        let userTodos = await Todo.findOne({user_id : req.userId});

        // console.log("deleted Todos", await Todo.find({user_id : req.userId}));
        return res.status(201).json({message: "Todo deleted successfully" , todos : userTodos.todos});
    } catch(err) {
        console.log("error in delete", err);
    }
});

router.post("/update", authenticate, async (req, res) => {
    try {
        // const todoData = Todo.todos.filter()
        let userTodos = await Todo.findOne({user_id : req.userId});
        let todoData = userTodos.todos.filter((todo) => JSON.stringify(todo._id) === JSON.stringify(req.body.id));
        let deletedTodos = await Todo.updateOne(
            {user_id : req.userId},
            {$pull : { 'todos' : { _id : req.body.id}}}
        );

        userTodos = await Todo.findOne({user_id : req.userId});
        return res.status(201).json({message: "updated successfully", todos: userTodos.todos, todoData : todoData[0].todo});

    } catch (error) {
        console.log(error);
    }
});

router.post("/change", authenticate, async(req,res) => {
    try {
        // console.log(req.body);
        let userTodos = await Todo.findOne({user_id : req.userId});
        let filteredTodo = userTodos.todos.filter((todo) => JSON.stringify(todo._id) === JSON.stringify(req.body.id));
        // console.log("filtered Todo", filteredTodo);
        const currentState = filteredTodo[0].state;
        // console.log(currentState);
        let setState = "";
        if(currentState == 'active') {
            setState = "completed";
        } else {
            setState = "active";
        }

        const changedTodo = await Todo.updateOne(
            {user_id : req.userId, "todos._id" : req.body.id},
            {$set : {'todos.$.state' : setState}}
        );

        const updatedTodo = await Todo.find({user_id : req.userId});
        // console.log("updated todos", updatedTodo);
        res.status(201).json({message: "state changed", todos : updatedTodo[0].todos});
    } catch (error) {
        console.log(error);
    }
});




module.exports = router;
