import { getSession } from 'next-auth/client'
import Metadata from '../../../lib/Metadata'
import Permissions from '../../../lib/Permissions'

const metadata = new Metadata()
const permissions = new Permissions()

export default async function handler(req,res){
  try{
    const session = await getSession({ req })
    const { id: objectId} = req.query
    const { user } = session
    const userToken = session.token.accessToken
  
    if(!permissions.userHasPermission(
      user.login, 
      objectId, 
      'write')) {
      res.status(401).send('Unauthorized User')
    }
  
    if(req.method === 'POST'){
     
      const { metadata: data, description }= req.body
  
      metadata
        .createMetadata(objectId, user, data, description, userToken)
        .then(data => res.send(data))
        .catch(error => res
          .status(400)
          .send(`Error on create metadata: ${error.message}`)
        )
    }
    if(req.method === 'PUT'){
      const { metadata: data, readMe}  = req.body
  
      metadata
        .updateMetadata(objectId, user, data, readMe, userToken)
        .then(data => res.send(data))
        .catch(error => res
          .status(400)
          .send(`Error on create metadata: ${error.message}`)
        )
    }
    else{
      res.status(404).send('Method not allowed')
    }
  }
  catch(error){
    res.status(400).json({ error: 'Bad Request', message: error.message})
  }

}