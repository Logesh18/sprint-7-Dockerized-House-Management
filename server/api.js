const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const port=process.env.PORT || 8000;
const Sequelize = require("sequelize");
app.use(cors({ origin: "*" }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


const sequelize = new Sequelize(
    'node_project', 
    'sgroot', 
    '7&VhKXTLCZK4RNI5', 
    {
        host: 'SG-mysql1-5763-mysql-master.servers.mongodirector.com',
        dialect: 'mysql',
        port: 3306,
        operatorsAliases: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 4000,
            idle: 2000
        }
    }
)

sequelize.authenticate()
 .then(() => {
   console.log('Connection has been established successfully.');
 })
 .catch(err => {
   console.error('Unable to connect to the database:', err);
 });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const HouseManagement = sequelize.define("housemanagement", {
    houseId:{
        type: Sequelize.STRING,
        primaryKey: true
    },  
    houseNo: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING,
        primaryKey: true
    }
});

db.housemanagement = HouseManagement;

db.sequelize.sync({ force: false }).then(() => {
    console.log("Table created");
});

const housemanagement = db.housemanagement;

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

const showData=(req,res)=>{
    return housemanagement.findAll().then(result => {
         res.json(result);
    })
    .catch(err => {
         res.json({response: err});
    });
}

app.post('/saveHouse',(req,res)=>{
    if(req.body.houseId!=="" && req.body.type!==""){
        const houseDetail={
            houseId:req.body.houseId,
            houseNo:req.body.houseNo,
            status:req.body.status,
            type:req.body.type
        }
        housemanagement.create(houseDetail)
        .then(result => {
            showData(req,res);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "House Id and House Type should not be an empty field"});
    }  
})

// app.post('/editCar',(req,res)=>{
//     if(req.query.id!==""){
//         carmanagement.update(req.body, {
//             where: { carId: req.query.id }
//         })
//         .then(result => {
//             showData(req,res);
//         })
//         .catch(err => {
//             res.json({response: err});
//         });
//     }
//     else{
//         res.json({response: "Id should not be an empty field"});
//     }
// })

app.get('/deleteHouse',(req,res)=>{
    if(req.query.houseId!==""){
        housemanagement.destroy({
            where: { houseId: req.query.id }
        })
        .then(result => {
            showData(req,res);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "Id should not be an empty field"});
    }
})

app.get('/getAllHouse',(req,res)=>{
    housemanagement.findAll({})
    .then(data => {
        showData(req,res);
    })
    .catch(err => {
        res.json({response: err});
    });
})

app.get('/getHouse',(req,res)=>{
    if(typeof req.query.id != "undefined")
    {
        return housemanagement.findOne({where: { houseId: req.query.id } })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "Id should not be an empty field"});
    }
})

app.get('/getByType',(req,res)=>{
    if(typeof req.query.type != "undefined")
    {
        return housemanagement.findOne({where: { type: req.query.type } })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json({response: err});
        });
    }
    else{
        res.json({response: "Id should not be an empty field"});
    }
})

// try
// {
//     console.log("Database connected");
//     var q = "SHOW TABLES LIKE 'housemanagement'";
//     connection.query(q, function (error, result) {
//         if(result.length === 0)
//         {
//             var q = "CREATE TABLE housemanagement (houseId VARCHAR(50) NOT NULL, houseNo VARCHAR(50),  status VARCHAR(50),  type VARCHAR(50) NOT NULL,  PRIMARY KEY (houseId,type))";
//             connection.query(q, function (error, result) {
//                 console.log("Table is created successfully");
//             });
//         }
//         else{
//             console.log("Table is already created");
//         }
//     });
// }
// catch(error)
// {
//     console.log(error);
// }

// const showData=(req,res)=>{
//     var q = "SELECT * from housemanagement";
//     connection.query(q, function (error, result) {
//         if (error)
//         {
//             res.json({response: error});
//         }
//         else
//         {
//            res.json(result);
//         }
//     });
// }

// app.post('/saveHouse',(req,res)=>{
//     if(req.body.houseId!=="" && req.body.type!==""){
//         var q = "INSERT INTO housemanagement (houseId, houseNo, status, type) VALUES ("+"'"+ req.body.houseId+"'" +", "+"'"+req.body.houseNo+"'"+", "+"'"+req.body.status+"'"+", "+"'"+req.body.type+"'"+")";
//         connection.query(q, function (error, result) {
//             if (error)
//             {
//                 res.json({response: error});
//             }
//             else
//             {
//                 showData(req,res);
//             }
//         });
//     }
//     else{
//         res.json({response: "House Id and House Type should not be an empty field"});
//     }
// })

// app.get('/deleteHouse',(req,res)=>{
//     if(req.body.houseId!==""){
//         var q = "DELETE FROM housemanagement"+" WHERE houseId="+"'"+req.query.id+"'";
//         connection.query(q, function (error, result) {
//             if (error)
//             {
//                 res.json({response: error});
//             }
//             else
//             {
//                 showData(req,res);
//             }
//         });
//     }
//     else{
//         res.json({response: "Id should not be an empty field"});
//     }
// })

// app.get('/getAllHouse',(req,res)=>{
//     if(typeof req.query.id != "undefined")
//     {
//         var q = "SELECT * from housemanagement WHERE houseId="+"'"+req.query.id+"'";
//     }
//     else
//     {
//         var q = "SELECT * from housemanagement";
//     }
//     connection.query(q, function (error, result) {
//         if (error)
//         {
//             res.json({response: error});
//         }
//         else
//         {
//             res.json(result);
//         }
//     });
// })

// app.get('/getHouse',(req,res)=>{
//     var q = "SELECT * from housemanagement WHERE houseId="+"'"+req.query.id+"'";
//     connection.query(q, function (error, result) {
//         if (error)
//         {
//             res.json({response: error});
//         }
//         else
//         {
//             res.json(result);
//         }
//     });
// })

// app.get('/getByType',(req,res)=>{
//     var q = "SELECT * from housemanagement WHERE type="+"'"+req.query.type+"'";
//     connection.query(q, function (error, result) {
//         if (error)
//         {
//             res.json({response: error});
//         }
//         else
//         {
//             res.json(result);
//         }
//     });
// })

app.listen(port,()=>console.log(`server is listening in port ${port}`));