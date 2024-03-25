import mongodb,{ Collection, MongoClient } from "mongodb";
import dbConfig from "../config/dbConfig.js";

const client = new MongoClient(dbConfig.dburl)




const createMentor = async(req,res)=>{
    await client.connect()

    try{
        const db = client.db(dbConfig.dbName)
        //checking whether mentor already exist using email as unique field
        const mentorexist = await db.collection('mentors').findOne({email:req.body.email})

        if(mentorexist)
        {
            res.status(400).send({
                message:"Mentor with same mail id exists"
            })
        }
        else{
            //inserting mentor to db
            await db.collection('mentors').insertOne(req.body)

            res.status(200).send({
                message:"Mentor Created Successfully"
            })
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
    finally{
        client.close()
    }
}



const createStudent = async(req,res)=>{
    await client.connect()
    try
    {
        const db = client.db(dbConfig.dbName)
         //checking whether student already exist using email as unique field
        const studentexist = await db.collection('students').findOne({email:req.body.email})
        if(studentexist)
        {
            res.status(400).send({
                message:"Student with same mail id exists"
            })
        }
        else
        {
            //inserting student to db
            await db.collection('students').insertOne(req.body)

            res.status(200).send({
                message:"Student Created Successfully"
            })
        }
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
    finally{
        client.close()
    }
}




const assignStudent = async(req,res)=>{
    await client.connect()
    try{
        const db = await client.db(dbConfig.dbName)
        const student = await db.collection('students').findOne({_id: new mongodb.ObjectId(req.params.id)})
        const findMentor = await db.collection('mentors').findOne({name:req.body.mentor})
        
        //Checking whether the mentor exists
        if(!findMentor)
        {
            res.status(200).send({
                message:"Requested Mentor not found"
            })
        }
        else{
            //assigning the mentor requested from body to student obtained from studentID through Params
            await db.collection('students').updateOne({_id:new mongodb.ObjectId(req.params.id)},{$set:{mentor:findMentor.name}})

            //adding the student to students field of mentors document in mentor collection
            await db.collection('mentors').updateOne({name:findMentor.name},{$addToSet:{students:student.name}})
            res.status(200).send({
                message:"Student assigned to Mentor Successfully",
            })
        }
        
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
    finally{
        client.close()
    }
}



const changeMentor = async(req,res)=>{
    await client.connect()
    try{
        const db = await client.db(dbConfig.dbName)

        //getting students with params id
        const student = await db.collection('students').findOne({_id: new mongodb.ObjectId(req.params.id)})
    
        //if the student is not assigned to a mentor then prompting first assign to change
        if(student.mentor === "unassigned")
        {
            res.status(400).send({
                message:"First assign a mentor to change mentor"
            })
        }
        else{

            //checking whether mentor(requested to change) name available in db
            const findMentor = await db.collection('mentors').findOne({name:req.body.mentor})

            if(findMentor)
            {
                //setting the current mentor to previous mentor
                await db.collection('students').updateOne({_id:new mongodb.ObjectId(req.params.id)},{$set:{previousmentor:student.mentor}})

                //setting the new mentor
                await db.collection('students').updateOne({_id:new mongodb.ObjectId(req.params.id)},{$set:{mentor:findMentor.name}})

                //pulling out the students from student field in mentor database document
                await db.collection('mentors').updateOne({name:findMentor.name},{$pull:{students:student.name}})
    
                res.status(200).send({
                    message:"Mentor changed Successfully"
                })
            }
            else{
                res.status(400).send({
                    message:"Requested Mentor doesnt exist"
                })
            }
        }
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
}




const showStudentsofMentor = async(req,res)=>{
    await client.connect()

    try{
        const db = client.db(dbConfig.dbName)

        //getting the mentor name from request body
        const mentor = req.body.mentor

        //getting the students who are having the above mentor using find filter
        const studentsOfMentor = await db.collection('students').find({mentor:{$eq:mentor}}).toArray()
    
        //if students with mentor above is available then prompting fetch success
        if(studentsOfMentor.length>0)
        {
            res.status(200).send({
                message:"Mentor's Students fetched successfully",
                studentsOfMentor
            })
        }
        else
        {
            res.status(200).send({
                message:"Mentor has no students"
            })
        }

    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
}


const previousMentor = async(req,res)=>{
    await client.connect()
    try{
        const db = await client.db(dbConfig.dbName) 

        //finding the student with params id
        const student = await db.collection('students').findOne({_id: new mongodb.ObjectId(req.params.id)})

        //if previous mentor field in students document is not none then fetching the previous mentor
        if(student.previousmentor !== "none")
        {
            const prevmentor = await db.collection('mentors').findOne({name:student.previousmentor})
            res.status(200).send({
                message:"Previous mentor details fetched successfully",
                prevmentor
            })
        }
        else{
            res.status(400).send({
                message:"No previous mentors assigned"
            })
        }

    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            message:"Internal Server Error"
        })
    }
}



export default{
    createMentor,
    createStudent,
    assignStudent,
    changeMentor,
    showStudentsofMentor,
    previousMentor
}




