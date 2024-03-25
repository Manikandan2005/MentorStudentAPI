//controller is where we write our endpoints logic
const homePage = (req,res)=>{
    res.status(200).send('<h1>Welcome to Student/Mentor Page</h1>')
}

export default{
    homePage
}