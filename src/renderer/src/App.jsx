import { use, useEffect, useState } from 'react'
import electronLogo from './assets/electron.svg'

function App() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    (async () => {
      const response = await window.api.getUsers()
      console.log(response)
      setUsers(response)
    })()
  }, [])

  

  return (
    <>
    <div className='table'>
        {users.map((user) => 
        <div className='user'>
          <div className='left'>
            <p>{user.ceo}</p>
            <p>количество лет</p>
            <p>{user.job}</p>
            <p>{user.type}</p>
            <p>{user.income}</p>
          </div>
          <div className='right'>
            <p>{user.status}</p>
          </div>
        </div>
        )}
      </div>
    </>
  )
}

export default App

