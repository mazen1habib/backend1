let responce = (res,statuscode,statusmsg,msgs,codee)=>{
   let st =  res.status(statuscode).json({status:statusmsg,data:msgs,code:codee})
   
}

module.exports=responce
