const {Schema, model} = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
 

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [20, "Name cannot exceed 20 characters"],
        minlength: [3, "Name Should have 3 Characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique:true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "Password Should be greater than 8 Characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    roles: {
        type: String,
        default: "user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date

})
//bcrypt
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})
//jwt
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,  { expiresIn: process.env.EXPIRE_DATE } )
}
//compare password
userSchema.methods.comparePassword = async function(enterPassword){
        return await bcrypt.compare(enterPassword, this.password)
}
//generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hashing and adding to resetPasswordToken userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken;

}

module.exports = model("User", userSchema)