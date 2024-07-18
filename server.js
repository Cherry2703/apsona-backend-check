const express=require("express")
const app=express()

const {open}=require("sqlite")
const sqlite3=require("sqlite3")
const path=require("path")

const dbPath=path.join(__dirname,"database.db")


let db=null

const initializeDBAndServer=async ()=>{
    try {
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3006,()=>console.log('server is running... at http://localhost:3006'))
    } catch (error) {
        console.log(`DB ERROR : ${error.message}`)
        process.exit(1)
    }
}

initializeDBAndServer()


app.get("/",async(request,response)=>{
    const allNotesData=`SELECT * FROM notes order by note_id;`;
    const res=await db.all(allNotesData)
    response.send(res)
})

app.get("/notes/:noteID",async(request,response)=>{
    const noteID=request.params.noteID
    const getNoteQuery=`SELECT * FROM notes WHERE note_id=${noteID};`;
    const res=await db.get(getNoteQuery)
    response.send(res)
})

app.post("/",async(request,response)=>{
    const noteTitle=request.body.noteTitle
    const noteDescription=request.body.noteDescription
    const q=`select * from notes;`;
    const res=await db.all(q)
    const noteID=res.length+1001
    const insertNoteQuery=`INSERT INTO notes(note_id,note_title,note_content) values(${noteID},${noteTitle},${noteDescription});`;
    await db.run(insertNoteQuery)
    response.send('note added successfully..')
})

app.delete("/:id",async(req,res)=>{
    const id=req.params.id
    const deleteNoteQuery=`DELETE FROM notes WHERE note_id=${id};`;
    await db.run(deleteNoteQuery)
    res.send('note deleted successfully...')
})

app.get("/archive",async(req,res)=>{
    const getArchieveQuery=`select * from archive order by note_id;`;
    const result=await db.all(getArchieveQuery)
    res.send(result)
})

app.get("/trash",async(req,res)=>{
    const getTrashQuery=`select * from trash order by note_id;`;
    const result=await db.all(getTrashQuery)
    res.send(result)
})