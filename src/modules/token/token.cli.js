import { ApiKey } from "./token.service.js";
import env, {envFilePath} from "../../config/config.env.js";
const apikey = new ApiKey(envFilePath)

await apikey.writeToEnv("cool")
