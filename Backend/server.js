const express = require('express');
const app = express()
const bodyParser = require("body-parser")
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const cors = require("cors")
app.use(bodyParser.json()); 

app.use(cors())
const db = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
}).promise();



const userSignup = async(req,res) =>{
    try {
       const {full_name,email,password} = req.body 

       if(!full_name || !email || !password) {
        res.status(400).json({
            message:"Missing required fileds"
        })
       }

        const hashedPassword = await bcrypt.hash(password, 10);

       const query = `INSERT INTO user (full_name, email, password) VALUES (?, ?, ?)`

       const data=  await db.query(query, [full_name, email, hashedPassword])

       res.status(201).json({
        message:"Sign up successfully",
       })

    } catch (error) {
      res.status(500).json({
        message:"Something went worng",
        error:error.message
      })  
    }
}

const userLogin = async(req,res) =>{
    try {
        const {email,password} = req.body;

        if(!email|| !password){
            return res.status(400).json({
                message:"Missing required field"
            })
        }

        const getUserDataQuery = `SELECT * FROM user WHERE email = ?`;
        const [users] = await db.query(getUserDataQuery,[email])

        if(!users.length === 0){
            return res.status(400).json({
                message:"Check your email address"
            })
        }

        const storedPassword = users[0].password
        const passwordMatch = await bcrypt.compare(password,storedPassword)

       if(!passwordMatch){
        return res.status(400).json({
            message:"Email or Password incorrect"
        })
       }

        res.status(200).json({
            message:"User login Successfull",
            values:users[0]
        })

    } catch (error) {
        res.status(500).json({
            message:"Something went wrong",
            error:error.message
        })
    }
}

const userList = async(req,res) =>{
    try {
        const query = `SELECT * FROM user;`
        const [data] = await db.query(query)

        res.status(200).json({
            message:"User login Successfull",
            values:data
        })

    } catch (error) {
        res.status(500).json({
            message:"Something went worng",
            error:error.message
          })   
    }
}

const deleteUser = async(req,res) =>{
    try {
        const id = req.params.id
        if(!id){
            return res.status(400).json({
                messsage:"Missing required field"
            })
        }

        const deleteQuery = `DELETE FROM user WHERE id = ?`;

        const [data] = await db.query(deleteQuery,[id])

        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message:"User deleted Successfull",
        })


    } catch (error) {
        res.status(500).json({
            message:"Something went worng",
            error:error.message
          })    
    }
}

app.post("/sign-up",userSignup)
app.post("/login",userLogin)
app.get("/user-list",userList)
app.delete("/user-delete/:id",deleteUser)

app.use("/",()=>{
    console.log("My api running")
    return
})

const checkConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log("DB Connected Successfully");
        connection.release();
    } catch (error) {
        console.error("Database Connection Failed:", error.message);
    }
};

app.listen(3001,async()=>{
console.log("server running")
await checkConnection()
});
