const Todo = require('../models/Todo');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models/User');
const { SubUser } = require('../models/User');

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        const passKey =  uuidv4();
        try{
            let todoItems = await Todo.find({adminId:req.user.adminId})
            todoItems = todoItems.sort((a, b) => a.completed - b.completed)
            const itemsLeft = await Todo.countDocuments({assignedToId:req.user.id,completed: false})
            const teamUsers = await SubUser.find({adminId: req.user.adminId})
            const adminUser = await User.findById(req.user.adminId)
            const allUsers = [adminUser, ...teamUsers]
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user, adminId: req.user.adminId, teamUsers: allUsers, passKey: passKey})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id, completedByUserId: req.user.id, adminId: req.user.adminId})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },
    getUsersByAdminId: async (req, res)=>{
        try{
            const userTeam = await SubUser.find({adminId: req.user.adminId})
            res.json(userTeam)
        }catch(err){
            console.error(err)
            res.status(500).send('Server Error')
        }
    },
    assignTodo: async (req, res)=>{
        try{
            await Todo.findByIdAndUpdate(req.params.todoId, {assignedToId: req.params.userId})
            res.json({status: 'OK'})
        }catch(err){
            console.error(err)
            res.status(500).send('Server Error')
        }
    }
}    