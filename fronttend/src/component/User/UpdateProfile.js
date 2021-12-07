import React, {Fragment, useState, useEffect} from 'react'
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import {useDispatch, useSelector} from "react-redux"
import './UpdateProfile.css'
import { clearErrors, loadUSer, updateProfile} from '../../actions/userAction';
import {useAlert} from "react-alert"
import Loader from '../layout/Loader/Loader';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
 

const UpdateProfile = ({history}) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    //usestate for avatar
    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState("/logo192.png")
     //useDispatch
     const dispatch = useDispatch()
      //useSelector
      const {user} = useSelector(state => state.user)
      const {error, loading, isUpdated} = useSelector(state => state.profileReducer)
      //alert for errors
     const alert = useAlert()
      //useEffect for error
    useEffect(() => {
        if(user){
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar.url)
        }
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }
        if(isUpdated){
            alert.success("Profile Updated Successfully")
            dispatch(loadUSer())
            history.push("/account")
            dispatch({type: UPDATE_PROFILE_RESET})
        }
    }, [dispatch, error, alert, history, isUpdated, user])
    //onchange for regsiter
    const updateProfileDataChange = (e) => {
        if(e.target.name === "avatar"){
            const reader = new FileReader()
            reader.onload = () => {
                if(reader.readyState === 2){
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])
        } 
    }
     //onsubmit for rgister
    const updateProfileSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()
        myForm.set("name", name)
        myForm.set("email", email)
        myForm.set("avatar", avatar)
        dispatch(updateProfile(myForm))
    }
    return (
       <Fragment>
           {
               loading ?  <Loader/> :  <Fragment>
        <MetaData title="Update Profile"/>
        <div className="updateProfileContainer">
            <div className="updateProfileBox">
            <h2 className="updateProfileHeading">Update Profile</h2>
            <form  
                className="updateProfileForm" 
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
                >
                    <div className="updateProfileName">
                        <FaceIcon/>
                        <input 
                        type="text" 
                        placeholder="Name..."
                        required
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                        />
                    </div>
                    <div className="updateProfileEmail">
                        <MailOutlineIcon/>
                        <input 
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                         />
                    </div>
                     

                    <div id="updateProfileImage">
                        <img src={avatarPreview} alt="Avatar Preview"/>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={updateProfileDataChange}

                        />
                        
                    </div>
                    <input
                        type="submit"
                        value="Update"
                        className="updateProfileBtn"
                        //disabled={loading ? true : false}
                    />
                </form>
        </div>
    </div>

        </Fragment>
           }
       </Fragment>
    )
}

export default UpdateProfile
