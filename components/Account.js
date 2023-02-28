import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import Avatar from './Avatar'


export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [name,setName]=useState(null)
  const [vorname,setVorname]=useState(null)
  const [adress,setAdress]=useState(null)
  const [hausnummer,setHausNummer]=useState(null)
  const [postleitzahl,setPostleitzahl]=useState(null)
  const [telFest,setFest]=useState(null)
  const [mobil,setMobil]=useState(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setVorname(data.vorname)
        setName(data.name)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username,vorname,name, website, avatar_url }) {
    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <Avatar
      uid={user.id}
      url={avatar_url}
      size={150}
      onUpload={(url) => {
        setAvatarUrl(url)
        updateProfile({ username,vorname,name, website, avatar_url: url })
      }}
    />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="vorname">Vorname</label>
        <input
          id="vorname"
          type="text"
          value={name || ''}
          onChange={(e) => setVorname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="name">name</label>
        <input
          id="name"
          type="text"
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      
      
      <div class="dropdown">
    <button onclick="myFunction()" class="dropbtn">Dropdown</button>
    <div id="myDropdown" class="dropdown-content">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a>
    </div>
    </div>
  <input type="text" id="item_price" value=""></input>
      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username,vorname,name, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}