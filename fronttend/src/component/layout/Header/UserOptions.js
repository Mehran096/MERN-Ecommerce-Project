import React, { Fragment, useState } from 'react'
import {SpeedDial, SpeedDialAction} from "@material-ui/lab"
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import {useHistory} from "react-router-dom"
import { useAlert } from 'react-alert';
import "./Header.css"
import { logout } from '../../../actions/userAction';
import {useDispatch} from "react-redux"
import { useSelector} from 'react-redux'
 
 
const UserOptions = ({user}) => {
    const [open, setOpen] = useState(false);
    //useSelector
    const {cartItems} = useSelector(state => state.cart)
    const options = [
        {icon: <ListAltIcon/>, name: "Orders", func: orders},
        {icon: <PersonIcon/>, name: "Profile", func: account},
        {icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : "unset"}}/>, name: `Cart{${cartItems.length}}`, func: cart},
        {icon: <ExitToAppIcon/>, name: "Logout", func: logoutUser},
    ]

    if(user.roles === "admin"){
        options.unshift({ icon: <DashboardIcon/>, name: "Dashboard", func: dashboard})
    }
    //useHistory
    const history = useHistory()
    //useAlert
    const alert = useAlert()
    //useDispatch
    const dispatch = useDispatch()
    //func
    function dashboard() {
        history.push("/admin/dashboard")
    }

    function orders(){
        history.push("/orders")
    }

    function account(){
        history.push("/account")
    }

    function logoutUser(){
        dispatch(logout())
         alert.success("Logout Successfully")
    }

    function cart(){
        history.push("/Cart")
    }
    return (
        <Fragment>
        <Backdrop open={open} style={{zIndex: "10"}}/>
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() =>  setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{zIndex: "11"}}
                open={open}
                direction="down"
                className="speedDial"
                icon={
                    <img
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "/logo192.png"}
                        alt="Profile"
                    />
                }
            >
           {
               options.map((item) => (
                <SpeedDialAction 
                key={item.name} 
                icon={item.icon} 
                tooltipTitle={item.name} 
                onClick={item.func}
                tooltipOpen= {window.innerWidth <= 600 ? true : false}
                />
               ))
           }

            </SpeedDial>
        </Fragment>
    )
}

export default UserOptions
