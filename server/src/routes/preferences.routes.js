import express from 'express'
import userAuth from '../middelware/userAuth.js'
import { getLanguage  , updateLanguage} from '../controller/preferences.controller.js'
const PreferencesRouter = express()


PreferencesRouter.get("/language",userAuth , getLanguage)

PreferencesRouter.put("/language" ,userAuth, updateLanguage)

export default PreferencesRouter;