import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaPlus, FaUsers } from 'react-icons/fa'
import AddUser from './AddUser'
import { MdEmail } from 'react-icons/md'
import { useCart } from '../components/CartProvider'
const Users = () => {
    const {BASE_URL}=useCart()
    const [data, SetData] = useState([])
    const [update, IsUpdate] = useState({
        showAddForm: false
    })
    const token = localStorage.getItem('accessToken')
    useEffect(() => {
        axios.post(`${BASE_URL}/admin/users`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            SetData(res.data.filter((user)=>user.role!=='admin'))
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    const handleSearch = (e) => {
        e.preventDefault()
        axios.post(`${BASE_URL}/admin/product/search?searchfor=users&search=${e.target.value}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            SetData(res.data.users)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <>
            <h1 className='overviewHeading'><FaUsers/>&nbsp;Users</h1>
            {
                update.showAddForm ? <AddUser /> : <div className='userstable'>
                    <div className='btns'>
                        <button onClick={() => {
                            IsUpdate({ ...update, showAddForm: true })
                        }}><FaPlus />Add User</button>
                        <input type="search" onChange={(e) => handleSearch(e)} placeholder='search here' />
                    </div>
                    {
                        data.length > 0 ?
                            data && <table>
                                <thead>
                                    <tr>
                                        <th>FirstName</th>
                                        <th>LastName</th>
                                        <th><MdEmail/>&nbsp;Email</th>
                                        <th>FullName</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((user) => {
                                            return (
                                                <tr>
                                                    <td>{user.firstname}</td>
                                                    <td>{user.lastname}</td>
                                                    <td>{user.email}</td>
                                                    <td>{`${user.firstname} ${user.lastname}`}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table> : <div className='notfound' style={{ height: '70vh' }}>
                                <h1>No Users exists</h1>
                            </div>
                    }
                </div>
            }
        </>
    )
}

export default Users